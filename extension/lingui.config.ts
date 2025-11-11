import { defineConfig } from '@lingui/cli'

export default defineConfig({
  locales: ['en', 'zh-CN'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/locales/{locale}',
      include: ['src'],
    },
  ],
  format: 'po',
})
