import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type MediaKind = 'audio' | 'video'
export type PlayerView = 'library' | 'player' | 'settings'
export type PlayerMode = 'hybrid' | 'audio' | 'video'

export type MediaItem = {
  id: string
  glyph: string
  kind: MediaKind
  accent: string
  duration: string
}

type PlayerState = {
  queue: MediaItem[]
  nowPlaying?: MediaItem
  playing: boolean
  view: PlayerView
  mode: PlayerMode
  setView: (view: PlayerView) => void
  setMode: (mode: PlayerMode) => void
  focusItem: (id: string) => void
  togglePlay: () => void
}

const demoQueue: MediaItem[] = [
  { id: 'seq-01', glyph: '🎞️', kind: 'video', accent: 'V1', duration: '12:47' },
  { id: 'seq-02', glyph: '🎧', kind: 'audio', accent: 'A2', duration: '58:03' },
  { id: 'seq-03', glyph: '🎬', kind: 'video', accent: 'V2', duration: '02:13' },
  { id: 'seq-04', glyph: '🎹', kind: 'audio', accent: 'A7', duration: '34:55' },
]

export const usePlayerStore = create<PlayerState>()(
  immer((set) => ({
    queue: demoQueue,
    nowPlaying: demoQueue[0],
    playing: false,
    view: 'library',
    mode: 'hybrid',
    setView: (view) =>
      set((state) => {
        state.view = view
      }),
    setMode: (mode) =>
      set((state) => {
        state.mode = mode
      }),
    focusItem: (id) =>
      set((state) => {
        const target = state.queue.find((item) => item.id === id)
        if (target) {
          state.nowPlaying = target
        }
      }),
    togglePlay: () =>
      set((state) => {
        state.playing = !state.playing
      }),
  })),
)
