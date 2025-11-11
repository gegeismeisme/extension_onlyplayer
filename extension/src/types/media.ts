export type MediaKind = 'audio' | 'video'

export type MediaItem = {
  id: string
  name: string
  kind: MediaKind
  url: string
  size: number
  ext: string
  handle: FileSystemFileHandle
}
