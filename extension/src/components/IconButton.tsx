import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glyph?: string
  icon?: LucideIcon
  label: string
  active?: boolean
  muted?: boolean
  size?: 'sm' | 'md' | 'lg'
  badge?: string
}

const sizeMap: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

const iconSize: Record<NonNullable<IconButtonProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function IconButton({
  glyph,
  icon: Icon,
  label,
  active,
  muted,
  size = 'md',
  className,
  badge,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-display transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma disabled:cursor-not-allowed disabled:opacity-40',
        active && 'border-plasma/70 bg-white/10 shadow-neon text-plasma',
        muted && 'text-white/30',
        sizeMap[size],
        className,
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      {Icon ? (
        <Icon
          size={iconSize[size]}
          strokeWidth={1.75}
          aria-hidden="true"
          className="text-current"
        />
      ) : (
        <span aria-hidden="true" className="text-2xl">
          {glyph}
        </span>
      )}
      {badge && (
        <span className="absolute -right-1 -top-1 rounded-full bg-plasma px-1 text-[10px] font-bold text-black">
          {badge}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </button>
  )
}
