import type { LucideIcon } from 'lucide-react'
import { IconButton } from '@/components/IconButton'
import { cn } from '@/utils/cn'
import { Globe } from 'lucide-react'

export type TopBarControl = {
  icon?: LucideIcon
  glyph?: string
  label: string
  onClick: () => void
  disabled?: boolean
  active?: boolean
  badge?: string
}

type TopBarProps = {
  title: string
  subtitle: string
  onOpenFolder: () => void
  openFolderLabel: string
  openFolderBusy: boolean
  controls: TopBarControl[]
  onLocaleToggle: () => void
  localeLabel: string
}

export function TopBar({
  title,
  subtitle,
  onOpenFolder,
  openFolderLabel,
  openFolderBusy,
  controls,
  onLocaleToggle,
  localeLabel,
}: TopBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
      <div>
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">{title}</p>
        <h1 className="font-display text-3xl">{subtitle}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onOpenFolder}
          disabled={openFolderBusy}
          className={cn(
            'rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:border-plasma hover:text-plasma',
            openFolderBusy && 'cursor-wait opacity-60',
          )}
        >
          {openFolderLabel}
        </button>
        {controls.map((control) => (
          <IconButton
            key={control.label}
            icon={control.icon}
            glyph={control.glyph}
            label={control.label}
            onClick={control.onClick}
            disabled={control.disabled}
            active={control.active}
            size="sm"
            badge={control.badge}
          />
        ))}
        <IconButton icon={Globe} label={localeLabel} onClick={onLocaleToggle} size="sm" />
      </div>
    </header>
  )
}
