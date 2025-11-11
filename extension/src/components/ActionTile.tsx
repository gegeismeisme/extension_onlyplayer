import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

type ActionTileProps = {
  icon: LucideIcon
  label: string
  description?: string
  onClick?: () => void
  disabled?: boolean
  busy?: boolean
}

export function ActionTile({
  icon: Icon,
  label,
  description,
  onClick,
  disabled,
  busy,
}: ActionTileProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:border-plasma/60 hover:bg-white/10',
        disabled && 'cursor-not-allowed opacity-50 hover:border-white/10 hover:bg-white/5',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/40">
        {busy ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
        ) : (
          <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        {description && <span className="text-xs text-white/60">{description}</span>}
      </div>
    </button>
  )
}
