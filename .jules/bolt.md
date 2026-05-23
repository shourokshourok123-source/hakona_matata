# Bolt's Journal - Hakona Matata Performance

## 2025-05-15 - Initial Assessment
**Learning:** The application is a static site where many pages include heavy images and YouTube iframes. The core logic in `site-logic.js` waits for the `window.load` event, which is delayed by these assets, making the interactive parts (like reviews) feel slow. Rendering reviews also uses `innerHTML` in a loop, causing unnecessary layout thrashes.
**Action:** Move initialization to `DOMContentLoaded` and use `DocumentFragment` with `textContent` for efficient DOM updates.

## 2026-05-19 - Native Lazy Loading
**Learning:** Native `loading="lazy"` on iframes and images is a simple but powerful optimization for static, media-heavy sites. It's especially effective when assets are hosted on external sites (like Pinterest or YouTube) where we can't control the server response or compression.
**Action:** Always check for off-screen media and iframes to apply native lazy loading early in the performance optimization process.

## 2024-05-23 - DOM Parsing Bottleneck in Chat
**Learning:** Using `innerHTML +=` for chat histories or long lists is a major performance anti-pattern. It forces the browser to re-parse the entire existing HTML string into a new DOM tree every time a single message is added, leading to O(N^2) complexity relative to the number of messages.
**Action:** Always use `appendChild` with `createElement` and `textContent` for appending to live lists. This is O(1) per update and significantly more efficient as the list grows.

## 2025-01-24 - Optimizing LCP and Resource Discovery
**Learning:** Native `loading="lazy"` should never be applied to Above-The-Fold (ATF) assets like logos or primary movie posters, as it delays the browser's discovery of the Largest Contentful Paint (LCP) element. Furthermore, for sites relying on third-party CDNs (e.g., Pinterest, YouTube), the cost of DNS lookup and TCP/TLS handshakes can be mitigated using `preconnect` and `dns-prefetch` resource hints.
**Action:** Identify LCP candidates and set `fetchpriority="high"` while ensuring `loading="lazy"` is removed. Always implement resource hints for critical third-party domains to shave off early-load latency.
