import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

type SidebarProps = {
  folders: Array<{ id: string; name: string }>
  onFolderSelect: (id: string) => void
  emptyLabel: string
  playlist: Array<{ id: string; name: string; kind: 'audio' | 'video' }>
  activeTrackId?: string
  onTrackSelect: (id: string) => void
}

export function Sidebar({
  folders,
  onFolderSelect,
  emptyLabel,
  playlist,
  activeTrackId,
  onTrackSelect,
}: SidebarProps) {
  const [showPlaylist, setShowPlaylist] = useState(true)

  return (
    <aside className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-white/40">Folders</p>
        {folders.length === 0 ? (
          <p>{emptyLabel}</p>
        ) : (
          <ul className="space-y-2" role="list">
            {folders.map((folder) => (
              <li key={folder.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-left transition hover:border-plasma/50"
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <span>{folder.name}</span>
                  <span className="text-xs text-white/40">↺</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <button
          type="button"
          className="mb-2 flex w-full items-center justify-between text-xs uppercase tracking-[0.4em] text-white/40"
          onClick={() => setShowPlaylist((prev) => !prev)}
        >
          <span>Playlist</span>
          {showPlaylist ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {showPlaylist && (
          <ul className="space-y-1 overflow-y-auto pr-1" style={{ maxHeight: '50vh' }} role="list">
            {playlist.map((track) => (
              <li key={track.id}>
                <button
                  type="button"
                  onClick={() => onTrackSelect(track.id)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border border-white/5 bg-black/30 px-3 py-2 text-left transition hover:border-plasma/50',
                    activeTrackId === track.id && 'border-plasma/60 bg-white/10 shadow-neon',
                  )}
                >
                  <span>{track.name}</span>
                  <span className="text-xs text-white/50">
                    {track.kind === 'video' ? '🎞️' : '🎧'}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  )
}
