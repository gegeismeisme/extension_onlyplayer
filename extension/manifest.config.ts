import { defineManifest } from '@crxjs/vite-plugin'

const manifest = defineManifest({
  manifest_version: 3,
  name: '__MSG_extensionName__',
  description: '__MSG_extensionDescription__',
  version: '0.1.0',
  default_locale: 'en',
  minimum_chrome_version: '123',
  icons: {
    '16': 'icons/onlyplayer.svg',
    '48': 'icons/onlyplayer.svg',
    '128': 'icons/onlyplayer.svg',
  },
  action: {
    default_icon: {
      '16': 'icons/onlyplayer.svg',
      '48': 'icons/onlyplayer.svg',
      '128': 'icons/onlyplayer.svg',
    },
    default_title: '__MSG_extensionName__',
    default_popup: 'index.html',
  },
  options_ui: {
    page: 'index.html',
    open_in_tab: true,
  },
  permissions: ['storage'],
  optional_permissions: ['downloads'],
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  web_accessible_resources: [
    {
      resources: ['icons/*', 'locales/*'],
      matches: ['<all_urls>'],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';",
  },
})

export default manifest
