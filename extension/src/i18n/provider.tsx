import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { catalogs, detectLocale, fallbackLocale, type LocaleKey } from './messages'

type LocaleContextValue = {
  locale: LocaleKey
  setLocale: (locale: LocaleKey) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function activate(locale: LocaleKey) {
  const catalog = catalogs[locale] ?? catalogs[fallbackLocale]
  i18n.load(locale, catalog)
  i18n.activate(locale)
}

export function AppI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleKey>(detectLocale())

  useEffect(() => {
    activate(locale)
  }, [locale])

  const value = useMemo(() => ({ locale, setLocale }), [locale])

  return (
    <LocaleContext.Provider value={value}>
      <I18nProvider i18n={i18n}>{children}</I18nProvider>
    </LocaleContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within AppI18nProvider')
  }
  return ctx
}
