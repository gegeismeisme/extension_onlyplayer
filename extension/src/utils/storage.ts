type Prefs = {
  playbackRate: number
  queueMode: 'single' | 'loop' | 'shuffle'
}

const PREF_KEY = 'onlyplayer:prefs'

const hasChromeStorage =
  typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local

export async function loadPreferences(): Promise<Partial<Prefs>> {
  try {
    if (hasChromeStorage) {
      const data = await new Promise<Partial<Prefs>>((resolve, reject) => {
        chrome.storage.local.get([PREF_KEY], (result) => {
          const err = chrome.runtime?.lastError
          if (err) {
            reject(err)
          } else {
            resolve(result[PREF_KEY] ?? {})
          }
        })
      })
      return data
    }

    const raw = localStorage.getItem(PREF_KEY)
    return raw ? (JSON.parse(raw) as Prefs) : {}
  } catch (error) {
    console.warn('Failed to load preferences', error)
    return {}
  }
}

export async function savePreferences(prefs: Prefs): Promise<void> {
  try {
    if (hasChromeStorage) {
      await new Promise<void>((resolve, reject) => {
        chrome.storage.local.set({ [PREF_KEY]: prefs }, () => {
          const err = chrome.runtime?.lastError
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      return
    }
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs))
  } catch (error) {
    console.warn('Failed to persist preferences', error)
  }
}
