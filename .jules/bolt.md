# Bolt's Journal - Hakona Matata Performance

## 2025-05-15 - Initial Assessment
**Learning:** The application is a static site where many pages include heavy images and YouTube iframes. The core logic in `site-logic.js` waits for the `window.load` event, which is delayed by these assets, making the interactive parts (like reviews) feel slow. Rendering reviews also uses `innerHTML` in a loop, causing unnecessary layout thrashes.
**Action:** Move initialization to `DOMContentLoaded` and use `DocumentFragment` with `textContent` for efficient DOM updates.

## 2026-05-19 - Native Lazy Loading
**Learning:** Native `loading="lazy"` on iframes and images is a simple but powerful optimization for static, media-heavy sites. It's especially effective when assets are hosted on external sites (like Pinterest or YouTube) where we can't control the server response or compression.
**Action:** Always check for off-screen media and iframes to apply native lazy loading early in the performance optimization process.
