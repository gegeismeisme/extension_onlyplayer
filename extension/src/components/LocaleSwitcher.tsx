import { localeMeta, type LocaleKey } from '@/i18n/messages'
import { useLocale } from '@/i18n/provider'
import { cn } from '@/utils/cn'

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
      {Object.entries(localeMeta).map(([code, meta]) => (
        <button
          key={code}
          type="button"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full text-xl transition',
            locale === code
              ? 'bg-white text-black shadow-neon'
              : 'text-white/70 hover:text-white',
          )}
          onClick={() => setLocale(code as LocaleKey)}
          aria-label={meta.label}
          title={meta.label}
        >
          <span aria-hidden="true">{meta.icon}</span>
          <span className="sr-only">{meta.label}</span>
        </button>
      ))}
    </div>
  )
}
