import { openDB } from 'idb'

type FolderRecord = {
  id: string
  name: string
  lastAccessed: number
  handle: FileSystemDirectoryHandle
}

const DB_NAME = 'onlyplayer'
const STORE_NAME = 'folders'

async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      } else if (oldVersion === 1) {
        db.deleteObjectStore(STORE_NAME)
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function saveFolder(handle: FileSystemDirectoryHandle) {
  const db = await getDB()
  const id = handle.name
  const record: FolderRecord = {
    id,
    name: handle.name,
    lastAccessed: Date.now(),
    handle,
  }
  await db.put(STORE_NAME, record)
}

export async function loadFolders(): Promise<FolderRecord[]> {
  const db = await getDB()
  const all = await db.getAll(STORE_NAME)
  return all.sort((a, b) => b.lastAccessed - a.lastAccessed)
}

export async function deleteFolder(id: string) {
  const db = await getDB()
  await db.delete(STORE_NAME, id)
}
