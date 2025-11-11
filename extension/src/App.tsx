import {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from 'react'
import { IconButton } from '@/components/IconButton'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Panel } from '@/components/Panel'
import { cn } from '@/utils/cn'
import { usePlayerStore, type PlayerMode } from '@/state/usePlayerStore'
import { useLocale } from '@/i18n/provider'
import { loadPreferences, savePreferences } from '@/utils/storage'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Camera,
  Clapperboard,
  Gauge,
  Headphones,
  History,
  Keyboard,
  Library,
  Moon,
  Music3,
  PictureInPicture,
  Play,
  Repeat,
  Repeat1,
  Repeat2,
  ScanLine,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Square,
  Star,
  StepBack,
  StepForward,
  UserRound,
  Video,
  Pause,
} from 'lucide-react'

const libraryNav = [
  { id: 'library', icon: Library, labelId: 'nav.library', fallback: 'Library' },
  { id: 'audio', icon: Headphones, labelId: 'nav.audio', fallback: 'Audio focus' },
  { id: 'video', icon: Clapperboard, labelId: 'nav.video', fallback: 'Video focus' },
  { id: 'favorites', icon: Star, labelId: 'nav.favorites', fallback: 'Favorites' },
  { id: 'recents', icon: History, labelId: 'nav.recents', fallback: 'Recents' },
]

const actionGrid: Array<{
  id: string
  icon: LucideIcon
  labelId: string
  fallback: string
  onClick?: () => void
}> = [
  { id: 'scan', icon: ScanLine, labelId: 'action.scan', fallback: 'Scan folders' },
  { id: 'pip', icon: PictureInPicture, labelId: 'action.pip', fallback: 'Picture in picture' },
  { id: 'snapshot', icon: Camera, labelId: 'action.snapshot', fallback: 'Snapshot' },
  { id: 'repeat-ab', icon: Repeat2, labelId: 'action.repeat', fallback: 'A-B repeat' },
  { id: 'eq', icon: SlidersHorizontal, labelId: 'action.eq', fallback: 'Equalizer presets' },
  { id: 'keymaps', icon: Keyboard, labelId: 'action.keymaps', fallback: 'Shortcut map' },
  { id: 'profile', icon: UserRound, labelId: 'action.profile', fallback: 'Profiles' },
]

const speedDeck = ['0.5×', '1×', '1.5×', '2×']

const modeIcons: Array<{
  id: PlayerMode
  icon: LucideIcon
  labelId: string
  fallback: string
}> = [
  { id: 'audio', icon: Headphones, labelId: 'player.mode.audio', fallback: 'Audio mode' },
  { id: 'video', icon: Video, labelId: 'player.mode.video', fallback: 'Video mode' },
  { id: 'hybrid', icon: Shuffle, labelId: 'player.mode.hybrid', fallback: 'Hybrid mode' },
]

const iconForKind: Record<'audio' | 'video', LucideIcon> = {
  audio: Music3,
  video: Video,
}

const queueModeMeta: Record<
  'loop' | 'shuffle' | 'single',
  { icon: LucideIcon; labelId: string; fallback: string }
> = {
  loop: { icon: Repeat, labelId: 'queue.loop', fallback: 'List loop' },
  shuffle: { icon: Shuffle, labelId: 'queue.shuffle', fallback: 'Shuffle play' },
  single: { icon: Repeat1, labelId: 'queue.single', fallback: 'Single loop' },
}

const speedSteps = [0.5, 1, 1.5, 2]

const formatSeconds = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return '--:--'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`
}

const formatSize = (bytes: number, unitLabel: string) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return `0 ${unitLabel}`
  return `${(bytes / 1024 / 1024).toFixed(1)} ${unitLabel}`
}

const accentFromName = (name: string) =>
  name.replace(/\.[^/.]+$/, '').slice(0, 2).toUpperCase() || '??'

const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-white/60">
    <span aria-hidden="true" className="text-3xl">
      📂
    </span>
    {children}
  </div>
)

function App() {
  const { t } = useLocale()
  const {
    library,
    nowPlayingId,
    loadFromDirectory,
    focusItem,
    togglePlay,
    playing,
    mode,
    setMode,
    loading,
    error,
    playNext,
    playPrevious,
    setPlaying,
    playbackRate,
    setPlaybackRate,
    queueMode,
    cycleQueueMode,
    hydratePreferences,
  } = usePlayerStore()

  const queue = library
  const nowPlaying = useMemo(
    () => queue.find((item) => item.id === nowPlayingId),
    [queue, nowPlayingId],
  )
  const unitLabel = t('player.unit.mb', 'MB')

  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasVideoFrame, setHasVideoFrame] = useState(false)
  const [pipActive, setPipActive] = useState(false)
  const [prefsLoaded, setPrefsLoaded] = useState(false)

  const queueMeta = queueModeMeta[queueMode]
  const speedIndex = speedSteps.findIndex((step) => Math.abs(step - playbackRate) < 0.01)
  const safeSpeedIndex = speedIndex >= 0 ? speedIndex : 1
  const nextSpeed = speedSteps[(safeSpeedIndex + 1) % speedSteps.length]
  const speedLabel = `${playbackRate.toFixed(2).replace(/\.00$/, '').replace(/\.50$/, '.5')}x`

  useEffect(() => {
    setProgress(0)
    setDuration(0)
    if (!nowPlaying) {
      setHasVideoFrame(false)
      setPipActive(false)
    }
  }, [nowPlaying])

  useEffect(() => {
    let mounted = true
    loadPreferences().then((prefs) => {
      if (!mounted) return
      hydratePreferences(prefs)
      setPrefsLoaded(true)
    })
    return () => {
      mounted = false
    }
  }, [hydratePreferences])

  useEffect(() => {
    if (!prefsLoaded) return
    void savePreferences({ playbackRate, queueMode })
  }, [prefsLoaded, playbackRate, queueMode])

  useEffect(() => {
    const player = videoRef.current
    if (!player) return

    if (nowPlaying?.url) {
      if (player.src !== nowPlaying.url) {
        player.src = nowPlaying.url
        player.load()
      }
    } else {
      player.removeAttribute('src')
      player.load()
    }
  }, [nowPlaying?.url])

  useEffect(() => {
    const player = videoRef.current
    if (!player) return
    if (!nowPlaying?.url) return

    if (playing) {
      player.play().catch(() => {
        setPlaying(false)
      })
    } else {
      player.pause()
    }
  }, [playing, setPlaying, nowPlaying?.url])

  useEffect(() => {
    const player = videoRef.current
    if (!player) return
    player.playbackRate = playbackRate
  }, [playbackRate])

  useEffect(() => {
    const player = videoRef.current
    if (!player) return

    const update = () => {
      if (player.duration) {
        setDuration(player.duration)
      }
      setProgress(player.currentTime)
    }

    const handleMetadata = () => {
      update()
      setHasVideoFrame((player.videoWidth ?? 0) > 0 && (player.videoHeight ?? 0) > 0)
    }

    const handleEnded = () => {
      if (queueMode === 'single') {
        player.currentTime = 0
        player.play().catch(() => setPlaying(false))
        return
      }
      setPlaying(false)
      playNext()
    }

    const handleEmptied = () => {
      setHasVideoFrame(false)
    }

    const handleLeavePiP = () => {
      setPipActive(false)
    }

    player.addEventListener('timeupdate', update)
    player.addEventListener('loadedmetadata', handleMetadata)
    player.addEventListener('emptied', handleEmptied)
    player.addEventListener('ended', handleEnded)
    document.addEventListener('leavepictureinpicture', handleLeavePiP)

    return () => {
      player.removeEventListener('timeupdate', update)
      player.removeEventListener('loadedmetadata', handleMetadata)
      player.removeEventListener('emptied', handleEmptied)
      player.removeEventListener('ended', handleEnded)
      document.removeEventListener('leavepictureinpicture', handleLeavePiP)
    }
  }, [playNext, queueMode, setPlaying])

  const progressPercent = duration ? Math.min((progress / duration) * 100, 100) : 0

  const handleScan = useCallback(async () => {
    if (!('showDirectoryPicker' in window)) {
      window.alert(t('errors.noFSA', 'Browser cannot open folders'))
      return
    }
    try {
      const dirHandle = await (
        window as typeof window & {
          showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>
        }
      ).showDirectoryPicker()
      await loadFromDirectory(dirHandle)
    } catch (scanError) {
      if ((scanError as DOMException).name === 'AbortError') return
      console.error(scanError)
    }
  }, [loadFromDirectory, t])

  const handleStop = () => {
    setPlaying(false)
    const player = videoRef.current
    if (player) {
      player.pause()
      player.currentTime = 0
    }
  }

  const togglePiP = useCallback(async () => {
    const player = videoRef.current
    if (!player || !hasVideoFrame) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setPipActive(false)
      } else {
        await player.requestPictureInPicture()
        setPipActive(true)
      }
    } catch (error) {
      console.warn('PiP toggle failed', error)
    }
  }, [hasVideoFrame])

  const handleSnapshot = useCallback(async () => {
    const player = videoRef.current
    if (!player || !hasVideoFrame) return
    const width = player.videoWidth || 1280
    const height = player.videoHeight || 720
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(player, 0, 0, width, height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      anchor.href = url
      anchor.download = `onlyplayer-frame-${stamp}.png`
      anchor.click()
      setTimeout(() => URL.revokeObjectURL(url), 500)
    }, 'image/png')
  }, [hasVideoFrame])

  const handleSpeedCycle = useCallback(() => {
    setPlaybackRate(nextSpeed)
  }, [nextSpeed, setPlaybackRate])


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
          <Panel icon={Library} label={t('nav.library', 'Library')} className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {libraryNav.map((item) => (
                <IconButton
                  key={item.id}
                  icon={item.icon}
                  label={t(item.labelId, item.fallback)}
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
              <IconButton
                icon={queueMeta.icon}
                label={t(queueMeta.labelId, queueMeta.fallback)}
                size="sm"
                onClick={cycleQueueMode}
                active
              />
              <IconButton
                icon={Gauge}
                label={t('player.speed.cycle', 'Speed') + ` ${speedLabel}`}
                size="sm"
                onClick={handleSpeedCycle}
              />
              {actionGrid.map((action) => {
                let onClick: (() => void) | undefined = action.onClick
                let disabled = false
                let activeState = false

                if (action.id === 'scan') {
                  onClick = handleScan
                  disabled = loading
                  activeState = loading
                } else if (action.id === 'pip') {
                  onClick = togglePiP
                  disabled = !hasVideoFrame || !nowPlaying
                  activeState = pipActive
                } else if (action.id === 'snapshot') {
                  onClick = handleSnapshot
                  disabled = !hasVideoFrame || !nowPlaying
                } else if (
                  action.id === 'repeat-ab' ||
                  action.id === 'eq' ||
                  action.id === 'keymaps' ||
                  action.id === 'profile'
                ) {
                  disabled = true
                }

                if (!onClick) {
                  disabled = true
                }

                return (
                  <IconButton
                    key={action.labelId}
                    icon={action.icon}
                    label={t(action.labelId, action.fallback)}
                    size="sm"
                    onClick={onClick}
                    disabled={disabled}
                    active={activeState}
                  />
                )
              })}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                <span aria-hidden="true">⚠️</span>
                <span>{t('library.error', 'Scan failed')}</span>
              </div>
            )}

            {queue.length === 0 && !loading && (
              <EmptyState>
                <span>{t('library.empty', 'Pick a folder to begin')}</span>
              </EmptyState>
            )}

            {loading && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/80">
                <span aria-hidden="true">⏳</span>
                <span>{t('library.scanning', 'Scanning media...')}</span>
              </div>
            )}
          </Panel>

          <Panel
            icon={SlidersHorizontal}
            label={t('player.controls', 'Transport')}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-white/10 bg-black/40 p-4 lg:p-6">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black to-slate-900">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    playsInline
                    controls={false}
                  />
                </div>
                <div className="flex flex-col justify-between gap-3 rounded-3xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                      {(() => {
                        const Icon = nowPlaying ? iconForKind[nowPlaying.kind] : Play
                        return (
                          <Icon size={22} strokeWidth={1.7} aria-hidden="true" className="text-white" />
                        )
                      })()}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                        {t('player.nowPlaying', 'Now playing')}
                      </p>
                      <p className="font-display text-xl">
                        {nowPlaying?.name ?? t('player.none', 'Idle')}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-white/60">
                    <div className="flex justify-between">
                      <span>{formatSeconds(progress)}</span>
                      <span>{formatSeconds(duration)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-plasma to-amber transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {nowPlaying && (
                      <div className="flex justify-between">
                        <span>{nowPlaying.ext.toUpperCase()}</span>
                        <span>{formatSize(nowPlaying.size, unitLabel)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <IconButton
                  icon={StepBack}
                  label={t('player.prev', 'Previous item')}
                  onClick={playPrevious}
                  disabled={!nowPlaying}
                />
                <IconButton
                  icon={playing ? Pause : Play}
                  label={t('player.toggle', 'Play or pause')}
                  active={playing}
                  onClick={() => {
                    if (!nowPlaying && queue[0]) {
                      focusItem(queue[0].id)
                      return
                    }
                    togglePlay()
                  }}
                  disabled={!nowPlaying && queue.length === 0}
                />
                <IconButton
                  icon={StepForward}
                  label={t('player.next', 'Next item')}
                  onClick={playNext}
                  disabled={!nowPlaying}
                />
                <IconButton
                  icon={Square}
                  label={t('player.stop', 'Stop playback')}
                  onClick={handleStop}
                  disabled={!nowPlaying}
                />
              </div>
              <div className="flex gap-2">
                {modeIcons.map((item) => (
                  <IconButton
                    key={item.id}
                    icon={item.icon}
                    label={t(item.labelId, item.fallback)}
                    active={mode === item.id}
                    onClick={() => setMode(item.id)}
                    size="sm"
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="sr-only">{t('player.queue', 'Up next')}</p>
                <ul className="flex max-h-72 flex-col gap-2 overflow-auto pr-2" role="list">
                  {queue.map((item) => (
                    <li key={item.id}>
                      <button
                        className={cn(
                          'flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 text-left transition hover:border-plasma/50',
                          nowPlaying?.id === item.id && 'border-plasma/60 bg-white/10',
                        )}
                        onClick={() => focusItem(item.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black/30 text-xl">
                            {(() => {
                              const KindIcon = iconForKind[item.kind]
                              return (
                                <KindIcon
                                  size={18}
                                  strokeWidth={1.6}
                                  aria-hidden="true"
                                  className="text-white/80"
                                />
                              )
                            })()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs text-white/50">
                              {accentFromName(item.name)} · {item.ext.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-white/60">
                          {formatSize(item.size, unitLabel)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                <p className="sr-only">{t('player.speed', 'Speed deck')}</p>
                <div className="grid grid-cols-4 gap-2">
                  {speedDeck.map((chip) => {
                    const rate = Number(chip.replace('×', ''))
                    const activeRate = Math.abs(playbackRate - rate) < 0.01
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={cn(
                          'flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm transition hover:border-white/30',
                          activeRate && 'border-plasma/60 text-plasma shadow-neon',
                        )}
                        onClick={() => setPlaybackRate(rate)}
                        aria-label={`${chip} speed`}
                      >
                        {chip}
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-2xl">
                    <Gauge
                      size={24}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className={cn(playing ? 'text-plasma' : 'text-white/50')}
                    />
                    <span className="sr-only">{t('status.cpu', 'GPU boost')}</span>
                  </div>
                  <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-2xl">
                    <Activity size={24} strokeWidth={1.6} aria-hidden="true" />
                    <span className="sr-only">{t('status.wave', 'Visualizer')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <Panel icon={Settings2} label={t('settings.header', 'Settings')} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <IconButton
                icon={Moon}
                label={t('settings.theme', 'Theme switch')}
                size="sm"
              />
              <IconButton
                icon={SlidersHorizontal}
                label={t('action.eq', 'Equalizer presets')}
                size="sm"
              />
              <IconButton
                icon={UserRound}
                label={t('settings.profile', 'Profile panel')}
                size="sm"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              <p className="mb-2 text-xs uppercase tracking-[0.4em]">
                {t('settings.locale', 'Language selector')}
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
