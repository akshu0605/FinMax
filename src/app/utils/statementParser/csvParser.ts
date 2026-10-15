/**
 * FinMax Statement Parser — CSV Parser
 *
 * Supports:
 *   - Any column order
 *   - Common header variations (case-insensitive)
 *   - Separate debit/credit columns
 *   - Currency symbols and thousands separators
 *   - Multiple date formats
 *   - Manual column mapping fallback
 *   - Empty row skipping
 *   - BOM handling
 */

import { normalizeRow } from './normalizer';
import type { ParseResult, ColumnMapping, RawStatementRow } from './types';

// ── Known header aliases ───────────────────────────────────────────────────────
const DATE_ALIASES = [
  'date', 'transaction date', 'txn date', 'txn_date', 'posting date',
  'value date', 'trans date', 'valuedate', 'postingdate', 'transactiondate',
];
const DESC_ALIASES = [
  'description', 'narration', 'particulars', 'details', 'remarks',
  'merchant', 'merchant name', 'transaction description', 'trans description',
  'reference', 'note', 'memo',
];
const AMOUNT_ALIASES = [
  'amount', 'transaction amount', 'txn amount', 'trans amount',
];
const DEBIT_ALIASES = [
  'debit', 'withdrawal', 'dr', 'debit amount', 'withdrawal amount',
  'debit (inr)', 'debit(inr)', 'dr amount',
];
const CREDIT_ALIASES = [
  'credit', 'deposit', 'cr', 'credit amount', 'deposit amount',
  'credit (inr)', 'credit(inr)', 'cr amount',
];
const BALANCE_ALIASES = [
  'balance', 'running balance', 'closing balance', 'available balance',
  'bal', 'balance (inr)',
];

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ');
}

function findColumn(headers: string[], aliases: string[]): string | undefined {
  return headers.find(h => aliases.includes(normalize(h)));
}

function autoDetectColumns(headers: string[]): ColumnMapping {
  return {
    date: findColumn(headers, DATE_ALIASES),
    description: findColumn(headers, DESC_ALIASES),
    amount: findColumn(headers, AMOUNT_ALIASES),
    debit: findColumn(headers, DEBIT_ALIASES),
    credit: findColumn(headers, CREDIT_ALIASES),
    balance: findColumn(headers, BALANCE_ALIASES),
  };
}

function parseCsvContent(content: string): string[][] {
  // Remove BOM if present
  const cleaned = content.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const next = cleaned[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) { row.push(current); current = ''; continue; }
    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(current);
      current = '';
      if (row.some(cell => cell.trim() !== '')) rows.push(row);
      row = [];
      continue;
    }
    current += char;
  }

  row.push(current);
  if (row.some(cell => cell.trim() !== '')) rows.push(row);
  return rows;
}

/**
 * Parse a CSV bank statement file.
 */
export async function parseCsvStatement(
  content: string,
  userId: string,
  existingFingerprints: Set<string>,
  customColumnMap?: ColumnMapping,
): Promise<ParseResult> {
  const warnings: string[] = [];

  if (!content || content.trim() === '') {
    throw new Error('This CSV file is empty.');
  }

  const rawRows = parseCsvContent(content);
  if (rawRows.length < 2) {
    throw new Error('This CSV file has no data rows.');
  }

  const headers = rawRows[0].map(h => h.trim());
  const columnMap = customColumnMap ?? autoDetectColumns(headers);
  const autoMapped = !customColumnMap;

  // Validate that we have at least a date column and either amount or debit/credit
  const hasDate = !!columnMap.date;
  const hasDesc = !!columnMap.description;
  const hasAmount = !!columnMap.amount || (!!columnMap.debit && !!columnMap.credit);

  if (!hasDate && !hasDesc && !hasAmount) {
    throw new Error(
      'Could not recognise any standard columns in this CSV. ' +
      'Please use the column mapping tool to manually assign columns.',
    );
  }

  if (!hasDate) warnings.push('No date column detected — rows will use today as a fallback date.');
  if (!hasDesc) warnings.push('No description column detected — a placeholder title will be used.');

  const previewRows: ParseResult['rows'] = [];
  let skippedCount = 0;
  let sessionIndex = 0;

  for (let i = 1; i < rawRows.length; i++) {
    const cells = rawRows[i];
    const getCell = (col?: string) => {
      if (!col) return '';
      const idx = headers.indexOf(col);
      return idx >= 0 ? (cells[idx] ?? '').trim() : '';
    };

    const rawRow: RawStatementRow = {
      rawDate: columnMap.date ? getCell(columnMap.date) : '',
      rawAmount: getCell(columnMap.amount),
      rawDebit: columnMap.debit ? getCell(columnMap.debit) : undefined,
      rawCredit: columnMap.credit ? getCell(columnMap.credit) : undefined,
      description: getCell(columnMap.description) || `Transaction ${i}`,
      rawBalance: columnMap.balance ? getCell(columnMap.balance) : undefined,
      sourceRow: i + 1,
    };

    // Skip completely empty rows
    if (!rawRow.rawDate && !rawRow.rawAmount && !rawRow.rawDebit && !rawRow.rawCredit) {
      skippedCount++;
      continue;
    }

    try {
      const normalized = await normalizeRow(rawRow, userId, existingFingerprints, sessionIndex++);
      if (normalized) {
        previewRows.push(normalized);
      } else {
        skippedCount++;
      }
    } catch {
      skippedCount++;
    }
  }

  return { rows: previewRows, skippedCount, warnings, autoMapped, columnMap };
}
