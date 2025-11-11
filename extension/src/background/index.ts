chrome.runtime.onInstalled.addListener(() => {
  console.info('OnlyPlayer service worker ready')
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.ping === 'onlyplayer') {
    sendResponse({ pong: true, timestamp: Date.now() })
  }
  return false
})

export {} // ensure this file is treated as a module
