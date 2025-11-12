import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Gauge, PictureInPicture } from 'lucide-react'
import { useLocale } from '@/i18n/provider'
import { TopBar, type TopBarControl } from '@/components/TopBar'
import { Sidebar } from '@/components/Sidebar'
import { PlayerSurface } from '@/components/PlayerSurface'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { usePlayerStore } from '@/state/usePlayerStore'
import { loadPreferences, savePreferences } from '@/utils/storage'

const speedSteps = [0.5, 1, 1.5, 2]

const queueModeMeta = {
  loop: { labelId: 'queue.loop', fallback: 'Loop playlist', icon: Gauge },
  shuffle: { labelId: 'queue.shuffle', fallback: 'Shuffle play', icon: Gauge },
  single: { labelId: 'queue.single', fallback: 'Single loop', icon: Gauge },
}

function App() {
  const { t } = useLocale()
  const {
    library,
    nowPlayingId,
    loadFromDirectory,
    loadFromSavedFolder,
    focusItem,
    togglePlay,
    playing,
    playNext,
    playPrevious,
    setPlaying,
    playbackRate,
    setPlaybackRate,
    queueMode,
    cycleQueueMode,
    hydratePreferences,
    savedFolders,
    refreshSavedFolders,
    loading,
    error,
    currentTime,
    duration,
    setPlaybackMetrics,
    setVolume,
    volume,
    muted,
    toggleMute,
  } = usePlayerStore()

  const queueMeta = queueModeMeta[queueMode]
  const playingState = playing ? 'playing' : 'paused'
  const unitLabel = t('player.unit.mb', 'MB')
  const speedIndex = speedSteps.findIndex((step) => Math.abs(step - playbackRate) < 0.01)
  const safeSpeedIndex = speedIndex >= 0 ? speedIndex : 1
  const nextSpeed = speedSteps[(safeSpeedIndex + 1) % speedSteps.length]
  const speedLabel = `${playbackRate.toFixed(2).replace(/\.00$/, '').replace(/\.50$/, '.5')}x`

  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasVideoFrame, setHasVideoFrame] = useState(false)
  const [pipActive, setPipActive] = useState(false)
  const [prefsLoaded, setPrefsLoaded] = useState(false)
  const [autoTried, setAutoTried] = useState(false)

  const nowPlaying = useMemo(
    () => library.find((item) => item.id === nowPlayingId),
    [library, nowPlayingId],
  )

  const queue = library

  const openFullTab = useCallback(() => {
    if (window.location.search.includes('standalone=1')) return
    if (chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('index.html'), '_blank')
    }
  }, [])

  useEffect(() => {
    if (window.location.search.includes('standalone=1')) return
    if (window.innerWidth < 800) {
      openFullTab()
      window.close?.()
    }
  }, [openFullTab])

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
    void refreshSavedFolders()
  }, [refreshSavedFolders])

  useEffect(() => {
    if (autoTried || loading) return
    if (!library.length && savedFolders.length > 0) {
      setAutoTried(true)
      void loadFromSavedFolder(savedFolders[0].id)
    }
  }, [autoTried, library.length, savedFolders, loading, loadFromSavedFolder])

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
    player.playbackRate = playbackRate
    player.volume = volume
    player.muted = muted
  }, [playbackRate, volume, muted])

  useEffect(() => {
    const player = videoRef.current
    if (!player || !nowPlaying?.url) return
    if (playingState === 'playing') {
      player.play().catch(() => {
        setPlaying(false)
      })
    } else {
      player.pause()
    }
  }, [playingState, nowPlaying?.url, setPlaying])

  useEffect(() => {
    setPlaybackMetrics({ currentTime: 0, duration: 0 })
    if (!nowPlaying) {
      setHasVideoFrame(false)
      setPipActive(false)
    }
  }, [nowPlaying, setPlaybackMetrics])

  useEffect(() => {
    const player = videoRef.current
    if (!player) return

    const update = () => {
      setPlaybackMetrics({
        currentTime: player.currentTime,
        duration: player.duration || 0,
      })
    }

    const handleMetadata = () => {
      update()
      setHasVideoFrame((player.videoWidth ?? 0) > 0 && (player.videoHeight ?? 0) > 0)
    }

    const handleEnded = () => {
      setPlaying(false)
      playNext()
    }

    player.addEventListener('timeupdate', update)
    player.addEventListener('loadedmetadata', handleMetadata)
    player.addEventListener('ended', handleEnded)

    return () => {
      player.removeEventListener('timeupdate', update)
      player.removeEventListener('loadedmetadata', handleMetadata)
      player.removeEventListener('ended', handleEnded)
    }
  }, [playNext, setPlaybackMetrics, setPlaying])

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

  const handleStop = useCallback(() => {
    setPlaying(false)
    const player = videoRef.current
    if (player) {
      player.pause()
      player.currentTime = 0
    }
  }, [setPlaying])

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

  const handleSeek = useCallback(
    (value: number) => {
      const player = videoRef.current
      if (!player || !duration) return
      const target = Math.min(duration, Math.max(0, value))
      player.currentTime = target
      setPlaybackMetrics({ currentTime: target, duration })
    },
    [duration, setPlaybackMetrics],
  )

  const handleSpeedCycle = useCallback(() => {
    setPlaybackRate(nextSpeed)
  }, [nextSpeed, setPlaybackRate])

  const topControls: TopBarControl[] = [
    {
      icon: queueMeta.icon,
      label: t(queueMeta.labelId, queueMeta.fallback),
      onClick: cycleQueueMode,
      active: true,
    },
    {
      icon: Gauge,
      label: t('player.speed.cycle', 'Speed') + ` ${speedLabel}`,
      onClick: handleSpeedCycle,
    },
    {
      icon: PictureInPicture,
      label: t('action.pip', 'Picture in picture'),
      onClick: togglePiP,
      disabled: !hasVideoFrame || !nowPlaying,
      active: pipActive,
    },
    {
      icon: Camera,
      label: t('action.snapshot', 'Snapshot'),
      onClick: handleSnapshot,
      disabled: !hasVideoFrame || !nowPlaying,
    },
  ]

  const handlePrimaryToggle = () => {
    if (!nowPlaying && queue[0]) {
      focusItem(queue[0].id)
      return
    }
    togglePlay()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink via-black to-ink text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-8 lg:py-12">
        <TopBar
          title="OnlyPlayer"
          subtitle="Local Media Deck"
          onOpenFolder={handleScan}
          openFolderLabel={
            loading ? t('library.scanning', 'Scanning media...') : t('action.scan', 'Open folder')
          }
          openFolderBusy={loading}
          onOpenTab={openFullTab}
          openTabLabel={t('action.openTab', 'Open in tab')}
          localeSwitcher={<LocaleSwitcher />}
          controls={topControls}
        />

        {error && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Sidebar
            folders={savedFolders}
            onSelect={(id) => void loadFromSavedFolder(id)}
            emptyLabel={t('library.empty', 'Pick a folder to begin')}
          />
          <PlayerSurface
            videoRef={videoRef}
            nowPlaying={nowPlaying}
            queue={queue}
            playing={!!onplaying}
            onTogglePlay={handlePrimaryToggle}
            onStop={handleStop}
            onPrev={playPrevious}
            onNext={playNext}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onSelectItem={focusItem}
            volume={volume}
            muted={muted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
            unitLabel={unitLabel}
          />
        </div>
      </div>
    </div>
  )
}

export default App
