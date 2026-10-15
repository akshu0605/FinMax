/**
 * FinMax Statement Parser — PDF Parser
 *
 * Uses pdfjs-dist (Mozilla PDF.js) for client-side PDF text extraction.
 * Supports:
 *   - Text-based PDFs
 *   - Password-protected PDFs (via PasswordException detection)
 *   - Scanned PDF detection (reports clearly, no OCR)
 *
 * The PDF password is NEVER:
 *   - Stored in localStorage or sessionStorage
 *   - Sent to Supabase or any external service
 *   - Logged or included in error reports
 *
 * It is held only in caller React component state for the duration of the
 * unlock attempt, then released.
 */

import * as pdfjsLib from 'pdfjs-dist';
import type { ParseResult } from './types';
import { parsePdfTextLines } from './pdfTextExtractor';

// Point to the pdfjs worker bundled with pdfjs-dist
// Vite copies this to /assets/ during build
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

export type PdfParseStatus =
  | 'ok'
  | 'password_required'
  | 'wrong_password'
  | 'scanned'
  | 'corrupted'
  | 'unsupported_encryption'
  | 'no_transactions';

export interface PdfParseOutcome {
  status: PdfParseStatus;
  result?: ParseResult;
  message?: string;
}

/**
 * Attempt to load and parse a PDF file.
 *
 * @param file - The File object selected by the user
 * @param userId - Authenticated user ID for fingerprinting
 * @param existingFingerprints - Set of fingerprints from existing expenses
 * @param password - Optional: Only provided after user enters it in the password modal
 */
export async function parsePdfStatement(
  file: File,
  userId: string,
  existingFingerprints: Set<string>,
  password?: string,
): Promise<PdfParseOutcome> {
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  const loadingParams: Record<string, unknown> = { data: arrayBuffer };
  if (password !== undefined) {
    loadingParams.password = password;
  }

  let pdf: pdfjsLib.PDFDocumentProxy;

  try {
    const loadingTask = pdfjsLib.getDocument(loadingParams);

    // Handle password events
    loadingTask.onPassword = (_updateCallback: (password: string) => void, reason: number) => {
      // reason 1 = needs password, reason 2 = password was incorrect
      if (reason === 1) {
        // PDF.js calls this when a password is needed before we've provided one
        // We abort and signal password_required
        loadingTask.destroy();
      } else if (reason === 2) {
        loadingTask.destroy();
      }
    };

    pdf = await loadingTask.promise;
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; code?: number };

    // Detect PasswordException from pdfjs
    if (error.name === 'PasswordException') {
      if (error.code === 1) {
        // NEED_PASSWORD
        return { status: 'password_required', message: 'This PDF is password-protected.' };
      } else if (error.code === 2) {
        // INCORRECT_PASSWORD
        return {
          status: 'wrong_password',
          message: 'Incorrect PDF password. Please try again.',
        };
      }
      // Unknown password error
      return {
        status: 'unsupported_encryption',
        message:
          'Unable to unlock this PDF. Check the password or verify the file uses a supported encryption format.',
      };
    }

    if (error.name === 'InvalidPDFException') {
      return { status: 'corrupted', message: 'This PDF could not be read. It may be corrupted or invalid.' };
    }

    if (error.name === 'MissingPDFException') {
      return { status: 'corrupted', message: 'The PDF file is missing or unreadable.' };
    }

    return {
      status: 'corrupted',
      message: `PDF loading failed: ${error.message || 'Unknown error'}`,
    };
  }

  // Extract text from all pages
  const allLines: string[] = [];
  let totalCharCount = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        const textItem = item as { str?: string };
        return textItem.str || '';
      })
      .join(' ');
    totalCharCount += pageText.length;
    // Split page text into logical lines
    const lines = pageText.split(/\n|\r/).map(l => l.trim()).filter(l => l.length > 0);
    allLines.push(...lines);
  }

  await pdf.destroy();

  // Detect scanned PDF (very little extractable text)
  const avgCharsPerPage = totalCharCount / pdf.numPages;
  if (avgCharsPerPage < 50 && pdf.numPages > 0) {
    return {
      status: 'scanned',
      message:
        'This PDF appears to be a scanned image. Text extraction is not possible. ' +
        'OCR (optical character recognition) is not currently supported. ' +
        'Please export a text-based PDF from your bank or convert it manually.',
    };
  }

  if (allLines.length === 0) {
    return {
      status: 'no_transactions',
      message: 'No text could be extracted from this PDF.',
    };
  }

  // Pass lines to the text-based transaction extractor
  try {
    const result = await parsePdfTextLines(allLines, userId, existingFingerprints);
    if (result.rows.length === 0) {
      return {
        status: 'no_transactions',
        message:
          'No transactions could be extracted from this PDF. ' +
          'The statement format may not be supported by the current parser.',
      };
    }
    return { status: 'ok', result };
  } catch (extractError: unknown) {
    const e = extractError as { message?: string };
    return {
      status: 'no_transactions',
      message: `Transaction extraction failed: ${e.message || 'Unknown error'}`,
    };
  }
}
