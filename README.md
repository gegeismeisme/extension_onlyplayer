# OnlyPlayer Browser Extension

OnlyPlayer is a Chromium-compatible browser extension that turns any modern browser into a PotPlayer-inspired local media workstation. It focuses on fast directory browsing, rich playback controls, and a customizable UI so users on locked-down machines can still enjoy a full-featured player without installing native software. The interface is icon-first: virtually every action is represented by glyphs, while the limited textual hints auto-localize to the browser language.

## Key Experiences
- **Directory-first playback** - pick local folders via the File System Access API, auto-index supported audio/video formats, and build smart playlists represented by icon badges (audio note, film reel, favorites star, etc.).
- **Unified media core** - one player component handles audio and video with seamless switching, shared shortcuts, unified icon-based transport controls, and consistent theming.
- **PotPlayer-inspired tools** - quick bookmark jump list, A-B repeat, playback speed presets, frame-step, audio EQ, subtitle search/loading, and snapshotting to browser storage, each surfaced through glyph-led toolbars with translated tooltips.
- **Always-on controls** - floating mini-player, global media keys (Media Session API), picture-in-picture, and background playback managed by the extension service worker with symbol-only overlays.
- **Stateful experience** - per-file resume points, last-played folders, user-defined profiles (e.g., "Movie mode", "Podcast mode"), and syncable settings via chrome.storage, with locale-aware labels wherever text is required.

## Tech Stack Choices
| Layer | Technology | Reasoning |
| --- | --- | --- |
| UI | React + TypeScript + Tailwind | Fast iteration, typed component contracts, theming flexibility. |
| Build | Vite + `@crxjs/vite-plugin` | Efficient HMR while targeting Manifest V3, easy bundle outputs. |
| State | Zustand + Immer | Lightweight yet powerful store for playback/session state. |
| Media | Native `<audio>/<video>` + Media Source Extensions | Maximum codec compatibility within browser constraints. |
| File Access | File System Access API (Chromium) with fallbacks | Enables folder picking and streaming local files securely. |
| Background | Chrome Extension Manifest V3 service worker | Handles global shortcuts, context menus, background scanning. |
| Styling | Tailwind + CSS variables + icon font/SVG sprite sheet | PotPlayer-like skins, symbol-driven UI, dark/light themes. |
| i18n | `@lingui/core` (or similar) with navigator language detection | Minimal text auto-localizes; tooltips and accessibility labels track browser locale. |

## Feature Inventory (v1 Focus)
1. Folder picker UI with recursive scan, format filters, quick search, and icon-coded media types.
2. Tabbed library views (All media, Audio-only, Video-only, Favorites, Recents) with glyph tabs and localized screen-reader labels.
3. Primary player panel with:
   - Timeline scrubber, waveform mini-visualizer for audio
   - Speed control (0.25x-4x), pitch-lock, A-B repeat
   - Subtitle loader (local + URL) and styling panel
   - Audio filters: equalizer presets, channel balance, volume boost
4. Icon-grid action board replacing textual buttons, with hover/click tooltips translated dynamically.
5. Queue management (drag and drop order, autoplay next, shuffle, loop) with icon badges (loop arrows, shuffle crossing, etc.).
6. Bookmarking and chapter markers, export/import as JSON.
7. Snapshot and GIF capture (video) saved to sandboxed storage with download option.
8. Keyboard shortcuts mirroring PotPlayer defaults with configurable bindings.
9. Media Session integration for OS-level media buttons and notification controls.
10. Picture-in-picture and compact mini-player window.
11. Settings sync (profiles, UI layout, recent folders) with optional cloud backup via browser sync storage, plus locale pack download/update flow.

## Stretch Ideas
- DLNA or SMB discovery through an optional helper service for network media.
- WASM-powered extra codec pack (for example FFmpeg.wasm) for unsupported formats.
- Web lyrics and subtitle auto-fetch via configurable providers.
- Remote control via WebRTC between devices logged into the same extension account.

## Development Workflow
1. `pnpm install`
2. `pnpm dev` - launches Vite dev server plus extension reloader.
3. `pnpm build` - outputs production bundle under `dist/`.
4. Load `dist` as an unpacked extension in Chrome or Edge.

## Testing and QA
- Unit and component tests with Vitest plus Testing Library.
- Playback regression harness relying on sample media fixtures.
- Manual smoke scripts covering folder scan, playback, PiP, shortcuts.
- Visual regression checks ensure iconography stays consistent across locales; localization snapshots verify translations.

## Status
🚧 Planning phase. See `plan.md` for milestones and implementation sequence.
