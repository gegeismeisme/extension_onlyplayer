export type LocaleKey = 'en' | 'zh-CN'

type MessageCatalog = Record<string, string>

export const catalogs: Record<LocaleKey, MessageCatalog> = {
  en: {
    'nav.library': 'Library',
    'nav.audio': 'Audio focus',
    'nav.video': 'Video focus',
    'nav.favorites': 'Favorites',
    'nav.recents': 'Recents',
    'action.scan': 'Scan folders',
    'action.shuffle': 'Shuffle play',
    'action.loop': 'Loop queue',
    'action.pip': 'Picture in picture',
    'action.snapshot': 'Snapshot',
    'action.repeat': 'A-B repeat',
    'action.eq': 'Equalizer presets',
    'action.keymaps': 'Shortcut map',
    'action.profile': 'Profile switch',
    'player.nowPlaying': 'Now playing',
    'player.queue': 'Up next',
    'player.controls': 'Transport',
    'player.speed': 'Speed deck',
    'player.mode.audio': 'Audio mode',
    'player.mode.video': 'Video mode',
    'player.mode.hybrid': 'Hybrid mode',
    'settings.header': 'Settings',
    'settings.locale': 'Language selector',
    'settings.theme': 'Theme switch',
    'settings.profile': 'Profile panel',
    'status.cpu': 'GPU boost',
    'status.wave': 'Visualizer',
  },
  'zh-CN': {
    'nav.library': '媒体库',
    'nav.audio': '音频模式',
    'nav.video': '视频模式',
    'nav.favorites': '收藏夹',
    'nav.recents': '最近播放',
    'action.scan': '扫描目录',
    'action.shuffle': '随机播放',
    'action.loop': '循环队列',
    'action.pip': '画中画',
    'action.snapshot': '画面快照',
    'action.repeat': 'A-B 重复',
    'action.eq': '均衡器预设',
    'action.keymaps': '快捷键映射',
    'action.profile': '播放档位',
    'player.nowPlaying': '正在播放',
    'player.queue': '即将播放',
    'player.controls': '播放控制',
    'player.speed': '速度甲板',
    'player.mode.audio': '音频通道',
    'player.mode.video': '视频通道',
    'player.mode.hybrid': '混合通道',
    'settings.header': '设置',
    'settings.locale': '语言选择',
    'settings.theme': '主题切换',
    'settings.profile': '档案面板',
    'status.cpu': '图形增益',
    'status.wave': '可视化',
  },
}

export const localeMeta: Record<
  LocaleKey,
  { label: string; icon: string }
> = {
  en: { label: 'English', icon: '🇺🇸' },
  'zh-CN': { label: '简体中文', icon: '🇨🇳' },
}

export const fallbackLocale: LocaleKey = 'en'

export const detectLocale = (): LocaleKey => {
  const navigatorLocale =
    typeof window !== 'undefined' ? window.navigator.language : fallbackLocale
  const normalized = navigatorLocale.toLowerCase()
  if (normalized.startsWith('zh')) {
    return 'zh-CN'
  }
  return 'en'
}
