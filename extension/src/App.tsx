import type { I18n } from '@lingui/core'
import { IconButton } from '@/components/IconButton'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Panel } from '@/components/Panel'
import { usePlayerStore, type PlayerMode } from '@/state/usePlayerStore'
import { cn } from '@/utils/cn'
import { useLingui } from '@lingui/react'

const libraryNav = [
  { id: 'library', glyph: '🗂️', labelId: 'nav.library', fallback: 'Library' },
  { id: 'audio', glyph: '🎧', labelId: 'nav.audio', fallback: 'Audio focus' },
  { id: 'video', glyph: '🎬', labelId: 'nav.video', fallback: 'Video focus' },
  { id: 'favorites', glyph: '⭐', labelId: 'nav.favorites', fallback: 'Favorites' },
  { id: 'recents', glyph: '🕑', labelId: 'nav.recents', fallback: 'Recents' },
]

const actionGrid = [
  { glyph: '🛰️', labelId: 'action.scan', fallback: 'Scan folders' },
  { glyph: '🔀', labelId: 'action.shuffle', fallback: 'Shuffle play' },
  { glyph: '🔁', labelId: 'action.loop', fallback: 'Loop queue' },
  { glyph: '🪟', labelId: 'action.pip', fallback: 'Picture in picture' },
  { glyph: '📸', labelId: 'action.snapshot', fallback: 'Snapshot' },
  { glyph: '➿', labelId: 'action.repeat', fallback: 'A-B repeat' },
  { glyph: '🎚️', labelId: 'action.eq', fallback: 'Equalizer presets' },
  { glyph: '⌨️', labelId: 'action.keymaps', fallback: 'Shortcut map' },
  { glyph: '👤', labelId: 'action.profile', fallback: 'Profiles' },
]

const transportIcons = ['⏮️', '⏯️', '⏭️', '⏹️']

const speedDeck = ['0.5×', '1×', '1.5×', '2×']

const statusTiles = [
  { glyph: '⚡', labelId: 'status.cpu', fallback: 'GPU boost' },
  { glyph: '🌊', labelId: 'status.wave', fallback: 'Visualizer' },
]

const modeIcons: Array<{ id: PlayerMode; glyph: string; labelId: string; fallback: string }> =
  [
    { id: 'audio', glyph: '🔊', labelId: 'player.mode.audio', fallback: 'Audio mode' },
    { id: 'video', glyph: '📺', labelId: 'player.mode.video', fallback: 'Video mode' },
    { id: 'hybrid', glyph: '🔁', labelId: 'player.mode.hybrid', fallback: 'Hybrid mode' },
  ]

const text = (i18n: I18n, id: string, message: string) => i18n._({ id, message })

function App() {
  const { i18n } = useLingui()
  const { queue, nowPlaying, togglePlay, playing, mode, setMode, focusItem } =
    usePlayerStore()

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink via-black to-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:py-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
              <span aria-hidden="true">🎛️</span>
            </div>
            <div className="text-xs uppercase tracking-[0.6em] text-white/70">
              <span aria-hidden="true">OnlyPlayer</span>
              <span className="sr-only">OnlyPlayer</span>
            </div>
          </div>
          <LocaleSwitcher />
        </header>

        <section className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          <Panel
            glyph="🗂️"
            label={text(i18n, 'nav.library', 'Library')}
            className="space-y-5"
          >
            <div className="flex flex-wrap gap-2">
              {libraryNav.map((item) => (
                <IconButton
                  key={item.id}
                  glyph={item.glyph}
                  label={text(i18n, item.labelId, item.fallback)}
                  size="md"
                  onClick={() => {
                    if (item.id === 'audio' || item.id === 'video') {
                      setMode(item.id as PlayerMode)
                    }
                  }}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2" role="list">
              {actionGrid.map((action) => (
                <IconButton
                  key={action.labelId}
                  glyph={action.glyph}
                  label={text(i18n, action.labelId, action.fallback)}
                  size="sm"
                />
              ))}
            </div>
          </Panel>

          <Panel
            glyph="🎚️"
            label={text(i18n, 'player.controls', 'Transport')}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                    <span aria-hidden="true">{nowPlaying?.glyph ?? '⏺️'}</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                      {text(i18n, 'player.nowPlaying', 'Now playing')}
                    </p>
                    <p className="font-display text-2xl">
                      <span aria-hidden="true">{nowPlaying?.accent ?? '—'}</span>
                      <span className="sr-only">
                        {nowPlaying ? `${nowPlaying.accent} ${nowPlaying.duration}` : 'idle'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-sm text-white/60">{nowPlaying?.duration}</div>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-plasma to-amber"></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {transportIcons.map((glyph) => (
                  <IconButton
                    key={glyph}
                    glyph={glyph}
                    label={text(i18n, 'player.controls', 'Transport')}
                    active={glyph === '⏯️' && playing}
                    onClick={glyph === '⏯️' ? togglePlay : undefined}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {modeIcons.map((item) => (
                  <IconButton
                    key={item.id}
                    glyph={item.glyph}
                    label={text(i18n, item.labelId, item.fallback)}
                    active={mode === item.id}
                    onClick={() => setMode(item.id)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="sr-only">{text(i18n, 'player.queue', 'Up next')}</p>
                <ul className="flex flex-col gap-2" role="list">
                  {queue.map((item) => (
                    <li key={item.id}>
                      <button
                        className={cn(
                          'flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 text-left',
                          nowPlaying?.id === item.id && 'border-plasma/60 bg-white/10',
                        )}
                        onClick={() => focusItem(item.id)}
                        aria-label={`${item.glyph} ${item.duration}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/30 text-xl">
                            <span aria-hidden="true">{item.glyph}</span>
                          </div>
                          <div>
                            <span className="font-display text-lg">{item.accent}</span>
                          </div>
                        </div>
                        <span className="text-sm text-white/60">{item.duration}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                <p className="sr-only">{text(i18n, 'player.speed', 'Speed deck')}</p>
                <div className="grid grid-cols-4 gap-2">
                  {speedDeck.map((chip) => (
                    <div
                      key={chip}
                      className={cn(
                        'flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm',
                        chip === '1×' && 'border-plasma/60 text-plasma shadow-neon',
                      )}
                      aria-hidden="true"
                    >
                      {chip}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {statusTiles.map((tile) => (
                    <div
                      key={tile.labelId}
                      className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-2xl"
                      title={text(i18n, tile.labelId, tile.fallback)}
                    >
                      <span aria-hidden="true">{tile.glyph}</span>
                      <span className="sr-only">{text(i18n, tile.labelId, tile.labelId)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel
            glyph="⚙️"
            label={text(i18n, 'settings.header', 'Settings')}
            className="space-y-4"
          >
            <div className="flex flex-wrap gap-2">
              <IconButton
                glyph="🌙"
                label={text(i18n, 'settings.theme', 'Theme switch')}
                size="sm"
              />
              <IconButton
                glyph="🎚️"
                label={text(i18n, 'action.eq', 'Equalizer presets')}
                size="sm"
              />
              <IconButton
                glyph="🧰"
                label={text(i18n, 'settings.profile', 'Profile panel')}
                size="sm"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              <p className="mb-2 text-xs uppercase tracking-[0.4em]">
                {text(i18n, 'settings.locale', 'Language selector')}
              </p>
              <LocaleSwitcher />
            </div>
          </Panel>
        </section>
      </div>
    </div>
  )
}

export default App
