import type { ReactNode, RefObject } from 'react'
import type { MediaItem } from '@/types/media'
import { IconButton } from '@/components/IconButton'
import { StepBack, StepForward, Play, Pause, Square } from 'lucide-react'

type PlayerSurfaceProps = {
  videoRef: RefObject<HTMLVideoElement | null>
  nowPlaying?: MediaItem
  playing: boolean
  onTogglePlay: () => void
  onStop: () => void
  onPrev: () => void
  onNext: () => void
  currentTime: number
  duration: number
  onSeek: (value: number) => void
  volume: number
  muted: boolean
  onVolumeChange: (value: number) => void
  onToggleMute: () => void
  unitLabel: string
}

const iconForKind: Record<'audio' | 'video', ReactNode> = {
  audio: <span aria-hidden="true">🎧</span>,
  video: <span aria-hidden="true">🎞️</span>,
}

const formatSeconds = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return '--:--'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const formatSize = (bytes: number, unitLabel: string) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return `0 ${unitLabel}`
  return `${(bytes / 1024 / 1024).toFixed(1)} ${unitLabel}`
}

export function PlayerSurface({
  videoRef,
  nowPlaying,
  playing,
  onTogglePlay,
  onStop,
  onPrev,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  unitLabel,
}: PlayerSurfaceProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-black/40 p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <div className="aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black to-slate-900">
            <video ref={videoRef} className="h-full w-full object-cover" playsInline controls={false} />
          </div>
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">
                  {nowPlaying ? iconForKind[nowPlaying.kind] : <span>⏺️</span>}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">Now playing</p>
                  <p className="font-display text-lg">{nowPlaying?.name ?? '—'}</p>
                </div>
              </div>
              {nowPlaying && (
                <div className="text-right text-xs text-white/60">
                  <div>{nowPlaying.ext.toUpperCase()}</div>
                  <div>{formatSize(nowPlaying.size, unitLabel)}</div>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <span>{formatSeconds(currentTime)}</span>
              <span>{formatSeconds(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={currentTime}
              onChange={(event) => onSeek(Number(event.target.value))}
              className="w-full accent-plasma"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-4">
        <IconButton icon={StepBack} label="Previous" onClick={onPrev} />
        <IconButton
          icon={playing ? Pause : Play}
          label="Play/Pause"
          onClick={onTogglePlay}
          active={playing}
        />
        <IconButton icon={StepForward} label="Next" onClick={onNext} />
        <IconButton icon={Square} label="Stop" onClick={onStop} />
        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl"
            onClick={onToggleMute}
            aria-label="Mute"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
            className="w-32 accent-plasma"
          />
        </div>
      </div>

    </div>
  )
}
