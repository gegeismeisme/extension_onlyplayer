import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppI18nProvider } from './i18n/provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppI18nProvider>
      <App />
    </AppI18nProvider>
  </StrictMode>,
)
