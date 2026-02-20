/**
 * FinMax - AI-Powered Smart Finance Management Platform
 * 
 * ⚠️  IMPORTANT: This is a STATIC SITE ONLY
 * - No Supabase backend
 * - No database connections
 * - All data stored in localStorage
 * - 100% client-side application
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
