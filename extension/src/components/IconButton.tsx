import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glyph: string
  label: string
  active?: boolean
  muted?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'h-9 w-9 text-xl',
  md: 'h-12 w-12 text-2xl',
  lg: 'h-16 w-16 text-3xl',
}

export function IconButton({
  glyph,
  label,
  active,
  muted,
  size = 'md',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-2xl border border-white/10 bg-white/5 font-display transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-plasma',
        active && 'border-plasma/70 bg-white/10 shadow-neon text-plasma',
        muted && 'text-white/30',
        sizeMap[size],
        className,
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      <span aria-hidden="true">{glyph}</span>
      <span className="sr-only">{label}</span>
    </button>
  )
}
