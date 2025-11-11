import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

type PanelProps = {
  glyph: string
  label: string
  children: ReactNode
  className?: string
}

export function Panel({ glyph, label, children, className }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4 shadow-lg shadow-black/40 backdrop-blur-xl',
        className,
      )}
    >
      <header className="mb-3 flex items-center gap-3 text-white/60">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl">
          <span aria-hidden="true">{glyph}</span>
        </div>
        <span className="sr-only">{label}</span>
      </header>
      {children}
    </section>
  )
}
