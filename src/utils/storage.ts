// IndexedDB utilities for storing game files

export interface GameData {
  name: string
  data: ArrayBuffer
  timestamp: number
}

const DB_NAME = 'NESGames'
const DB_VERSION = 1
const STORE_NAME = 'games'

// Open database
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' })
      }
    }
  })
}

// Save game to IndexedDB
export async function saveGameToStorage(
  gameName: string,
  file: File,
): Promise<void> {
  const buffer = await file.arrayBuffer()
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const putRequest = store.put({
      name: gameName,
      data: buffer,
      timestamp: Date.now(),
    })

    putRequest.onsuccess = () => resolve()
    putRequest.onerror = () => reject(putRequest.error)
    transaction.onerror = () => reject(transaction.error)
  })
}

// Load game from IndexedDB
export async function loadGameFromStorage(
  gameName: string,
): Promise<File | null> {
  const db = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(gameName)

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        const blob = new Blob([getRequest.result.data], {
          type: 'application/octet-stream',
        })
        const file = new File([blob], `${gameName}.nes`, {
          type: 'application/octet-stream',
        })
        resolve(file)
      } else {
        resolve(null)
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

// Load game from file path
export async function loadGameFromPath(filePath: string): Promise<File | null> {
  try {
    const response = await fetch(filePath)
    if (response.ok) {
      const blob = await response.blob()
      const fileName = filePath.split('/').pop() || 'game.nes'
      const file = new File([blob], fileName, {
        type: 'application/octet-stream',
      })
      return file
    }
  } catch (e) {
    console.log('Không tìm thấy file tại:', filePath)
  }
  return null
}

