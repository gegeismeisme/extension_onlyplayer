import { scanDirectory } from '@/services/folderScanner'
import type { MediaItem } from '@/types/media'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export type PlayerView = 'library' | 'player' | 'settings'
export type PlayerMode = 'hybrid' | 'audio' | 'video'

type PlayerState = {
  library: MediaItem[]
  nowPlayingId?: string
  playing: boolean
  view: PlayerView
  mode: PlayerMode
  loading: boolean
  error?: string
  playbackRate: number
  queueMode: 'single' | 'loop' | 'shuffle'
  setView: (view: PlayerView) => void
  setMode: (mode: PlayerMode) => void
  focusItem: (id: string) => void
  togglePlay: () => void
  setPlaying: (val: boolean) => void
  setPlaybackRate: (rate: number) => void
  cycleQueueMode: () => void
  hydratePreferences: (
    prefs: Partial<Pick<PlayerState, 'playbackRate' | 'queueMode'>>,
  ) => void
  loadFromDirectory: (handle: FileSystemDirectoryHandle) => Promise<void>
  clearLibrary: () => void
  playNext: () => void
  playPrevious: () => void
}

const revokeUrls = (items: MediaItem[]) => {
  items.forEach((item) => {
    URL.revokeObjectURL(item.url)
  })
}

export const usePlayerStore = create<PlayerState>()(
  immer((set, get) => ({
    library: [],
    nowPlayingId: undefined,
    playing: false,
    view: 'library',
    mode: 'hybrid',
    loading: false,
    error: undefined,
    playbackRate: 1,
    queueMode: 'loop',
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
        if (state.nowPlayingId === id) return
        const exists = state.library.some((item) => item.id === id)
        if (exists) {
          state.nowPlayingId = id
          state.playing = true
        }
      }),
    togglePlay: () =>
      set((state) => {
        state.playing = !state.playing
      }),
    setPlaying: (val) =>
      set((state) => {
        state.playing = val
      }),
    setPlaybackRate: (rate) =>
      set((state) => {
        state.playbackRate = rate
      }),
    cycleQueueMode: () =>
      set((state) => {
        const order: PlayerState['queueMode'][] = ['loop', 'shuffle', 'single']
        const idx = order.indexOf(state.queueMode)
        state.queueMode = order[(idx + 1) % order.length]
      }),
    hydratePreferences: (prefs) =>
      set((state) => {
        if (typeof prefs.playbackRate === 'number' && prefs.playbackRate > 0) {
          state.playbackRate = prefs.playbackRate
        }
        const prefMode = (prefs as { queueMode?: string }).queueMode
        if (prefMode === 'loop' || prefMode === 'shuffle' || prefMode === 'single') {
          state.queueMode = prefMode
        } else if (prefMode === 'sequence') {
          state.queueMode = 'loop'
        }
      }),
    loadFromDirectory: async (handle) => {
      set((state) => {
        state.loading = true
        state.error = undefined
      })
      try {
        const files = await scanDirectory(handle)
        set((state) => {
          revokeUrls(state.library)
          state.library = files
          state.nowPlayingId = files[0]?.id
          state.playing = false
          state.loading = false
        })
      } catch (error) {
        set((state) => {
          state.loading = false
          state.error =
            error instanceof Error ? error.message : 'Unable to read directory'
        })
      }
    },
    clearLibrary: () => {
      const { library } = get()
      revokeUrls(library)
      set((state) => {
        state.library = []
        state.nowPlayingId = undefined
        state.playing = false
      })
    },
    playNext: () =>
      set((state) => {
        if (!state.nowPlayingId) return
        if (state.library.length === 0) return

        if (state.queueMode === 'shuffle') {
          const available = state.library.filter((item) => item.id !== state.nowPlayingId)
          if (available.length === 0) return
          const next = available[Math.floor(Math.random() * available.length)]
          state.nowPlayingId = next.id
          state.playing = true
          return
        }

        if (state.queueMode === 'single') {
          state.playing = true
          return
        }

        const idx = state.library.findIndex((item) => item.id === state.nowPlayingId)
        if (idx >= 0) {
          const nextIndex = idx < state.library.length - 1 ? idx + 1 : 0
          if (nextIndex !== idx) {
            state.nowPlayingId = state.library[nextIndex].id
            state.playing = true
          } else {
            state.playing = false
          }
        }
      }),
    playPrevious: () =>
      set((state) => {
        if (!state.nowPlayingId) return
        const idx = state.library.findIndex((item) => item.id === state.nowPlayingId)
        if (idx > 0) {
          state.nowPlayingId = state.library[idx - 1].id
          state.playing = true
        }
      }),
  })),
)
