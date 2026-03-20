import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from '@routes/index.route'
import AppProviders from '@configs/providers.config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <Router />
    </AppProviders>
  </StrictMode>
)
