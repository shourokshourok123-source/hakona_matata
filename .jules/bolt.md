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

## 2025-05-24 - LCP and Resource Hint Optimization
**Learning:** For static sites with CSS-driven background images, `preconnect` and `preload` are essential to prevent LCP delays. A critical anti-pattern discovered was applying `loading="lazy"` to elements that are likely to be the Largest Contentful Paint (LCP) candidate. This causes the browser to deprioritize the fetch until the layout is nearly complete, significantly hurting performance scores.
**Action:** When preloading CSS background images, ensure the URL matches exactly. Always remove `loading="lazy"` and add `fetchpriority="high"` to above-the-fold hero images or background preloads.

## 2024-05-26 - O(1) List Updates and Early Exit
**Learning:** Re-rendering an entire list (O(N)) on every update is a common bottleneck that scales poorly. Surgical DOM updates (O(1)) using helper functions significantly improve responsiveness. Additionally, performing DOM-dependent logic (like path parsing for reviews) on pages where the target element doesn't exist is wasted work that can be avoided with a simple early exit.
**Action:** Use helper functions for surgical list updates and always check for the existence of target elements before executing page-specific initialization logic.
