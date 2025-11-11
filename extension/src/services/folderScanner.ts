import type { MediaItem, MediaKind } from '@/types/media'

const audioExt = ['mp3', 'm4a', 'aac', 'wav', 'flac', 'ogg', 'opus']
const videoExt = ['mp4', 'mkv', 'webm', 'mov', 'avi', 'm4v']

const audioSet = new Set(audioExt)
const videoSet = new Set(videoExt)

const MAX_ITEMS = 500

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `mid-${Math.random().toString(36).slice(2)}`

const detectKind = (ext: string): MediaKind | null => {
  if (audioSet.has(ext)) return 'audio'
  if (videoSet.has(ext)) return 'video'
  return null
}

async function* iterateHandles(dir: FileSystemDirectoryHandle) {
  const directory = dir as FileSystemDirectoryHandle & {
    values?: () => AsyncIterable<FileSystemHandle>
    entries?: () => AsyncIterable<[string, FileSystemHandle]>
  }

  if (directory.values) {
    for await (const handle of directory.values()) {
      yield handle
    }
    return
  }

  if (directory.entries) {
    for await (const [, handle] of directory.entries()) {
      yield handle
    }
  }
}

export async function scanDirectory(
  root: FileSystemDirectoryHandle,
): Promise<MediaItem[]> {
  const items: MediaItem[] = []
  const queue: FileSystemDirectoryHandle[] = [root]

  while (queue.length > 0 && items.length < MAX_ITEMS) {
    const dir = queue.shift()
    if (!dir) break

    for await (const entry of iterateHandles(dir)) {
      if (entry.kind === 'directory') {
        queue.push(entry as FileSystemDirectoryHandle)
        continue
      }

      if (items.length >= MAX_ITEMS) break

      const ext = entry.name.split('.').pop()?.toLowerCase() ?? ''
      const kind = detectKind(ext)
      if (!kind) continue

      const fileHandle = entry as FileSystemFileHandle
      const file = await fileHandle.getFile()
      const url = URL.createObjectURL(file)

      items.push({
        id: createId(),
        name: entry.name,
        kind,
        url,
        size: file.size,
        ext,
        handle: fileHandle,
      })
    }
  }

  return items
}
