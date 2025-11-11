import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  catalogs,
  detectLocale,
  fallbackLocale,
  localeMeta,
  type LocaleKey,
} from './messages'

type LocaleContextValue = {
  locale: LocaleKey
  setLocale: (locale: LocaleKey) => void
  t: (id: string, fallback?: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function AppI18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<LocaleKey>(detectLocale())

  const value = useMemo<LocaleContextValue>(() => {
    const translate = (id: string, fallback?: string) => {
      const current = catalogs[locale] ?? catalogs[fallbackLocale]
      const fallbackTable = catalogs[fallbackLocale]
      return current[id] ?? fallback ?? fallbackTable[id] ?? id
    }
    return { locale, setLocale, t: translate }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within AppI18nProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export const supportedLocales = localeMeta
