# OnlyPlayer Project Plan

## 1. Objectives
- Deliver a PotPlayer-class experience inside a Chromium extension with zero native installs.
- Support both audio and video from local folders, matching key PotPlayer workflows (playlisting, advanced playback controls, snapshots, subtitles).
- Keep the UI icon-driven (minimal text) while automatically localizing required labels, tooltips, and accessibility copy to the browser language.
- Provide an extensible architecture for future codecs, remote control, and network storage.

## 2. Target Platforms & Constraints
- Chromium-based browsers (Chrome 123+, Edge, Brave) with Manifest V3.
- File System Access API is required for seamless folder support; provide degraded file-picker flow where unavailable.
- Iconography relies on bundled SVG sprite sheets; dynamic font downloads must obey extension CSP.
- Text strings flow through an i18n layer that reads `navigator.language` and falls back to English.
- No external network access by default; all processing happens locally unless optional integrations are enabled.

## 3. High-Level Architecture
```
┌────────────────────────────┐
│ UI (React + Tailwind)      │
│  • Library shell           │
│  • Player canvas           │
│  • Settings / modals       │
│  • Icon sprite manager     │
└────────────┬───────────────┘
             │ Zustand store (playback + library + settings + locale)
┌────────────▼───────────────┐
│ Core Services (TS modules) │
│  • Media scanner (FS API)  │
│  • Playback engine wrapper │
│  • Subtitle/EQ utilities   │
│  • Snapshot/GIF tooling    │
│  • i18n loader             │
└────────────┬───────────────┘
             │ chrome.runtime messaging
┌────────────▼───────────────┐
│ Background SW (MV3)        │
│  • Context menus           │
│  • Media Session handlers  │
│  • Global shortcuts        │
│  • Persisted settings sync │
└────────────────────────────┘
```

## 4. Feature Breakdown
| Area | Tasks |
| --- | --- |
| Library Management | Folder picker, recursive scan, format detection, metadata extraction (duration, cover art), playlists (smart + manual), search/filter with icon-only controls. |
| Player UI | Video canvas, audio visualizer, timeline, PiP toggle, mini-player, theme presets, icon grid command board. |
| Controls & Effects | Speed/pitch lock, A-B repeat, frame-step, EQ presets, channel mix, volume boost, bookmark manager, glyph-only overlays. |
| Subtitles & Lyrics | Local file load, drag & drop, styling controls, auto-sync adjustments, optional online search hook, localized subtitle settings panel. |
| Snapshots & Capture | Frame capture, multi-frame GIF/export, storage management UI with camera-style icon buttons. |
| Settings & Profiles | Per-profile layouts, hotkey editor, playback defaults, storage quota usage, import/export, locale pack selector. |
| Background Ops | Resume points, media session integration, notification controls, idle cleanup. |
| QA & Tooling | Unit/component tests, fixture media, lint/format, e2e smoke (Playwright), visual regression for iconography, snapshot tests for translations. |

## 5. Milestones
1. **Scaffolding (Week 1)**
   - Bootstrap Vite + React + MV3 setup with Tailwind, Zustand, Lingui (or equivalent).
   - Establish routing shell (library / player / settings) using placeholder icon panels.
   - Implement store skeleton including locale slice and icon asset loader.
2. **Core Playback (Week 2)**
   - Drag/drop plus folder picker reading.
   - Basic playlist view plus shared `<video>/<audio>` player.
   - Media Session + keyboard shortcuts baseline, localized tooltips.
3. **Advanced Controls (Week 3)**
   - Speed, A-B repeat, frame-step, EQ presets, icon-grid actions.
   - Bookmarking, resume points, PiP + mini-player.
4. **PotPlayer Parity Extras (Week 4)**
   - Subtitle tooling, snapshot/GIF capture, queue management polish.
   - Theming, profile system, locale pack export/import, settings sync.
5. **Stabilization (Week 5)**
   - Comprehensive testing (performance, visual, localization).
   - Documentation, packaging, release checklist.

## 6. Risks & Mitigations
- **Codec gaps** - rely on browser-supported containers; plan optional FFmpeg.wasm integration for niche formats.
- **Large directory performance** - stream scanning, async chunking, caching metadata in IndexedDB.
- **Icon legibility across themes** - dual-tone glyph sets, automated contrast checks.
- **Localization coverage** - start with English/Zh-CN, add crowd-sourced translation pipeline, surface fallback indicators in dev builds.
- **Shortcut conflicts** - provide editable bindings plus context-sensitive activation.

## 7. Open Questions
1. Do we need cross-browser support beyond Chromium (e.g., Firefox) requiring MV2 fallback?
2. Should remote SMB/DLNA browsing be part of v1 or left for a helper app?
3. What locales must ship on day one, and do we require professional translation review?
