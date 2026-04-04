# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Site

No build system or package manager. Open directly in a browser:

```bash
open index.html
```

Or serve locally to avoid any CORS issues with the frame images:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Architecture

Pure vanilla HTML/CSS/JS static site — no frameworks, no bundler.

### JS Files (loaded in order at bottom of `index.html`)
- **`js/storytelling.js`** — defines `StorytellingEngine` class, exposed as `window.storytellingEngine`. Preloads 192 JPEG frames for each of the 3 products from their respective folders, then draws frames to a fullscreen `<canvas>` based on scroll position.
- **`js/products.js`** — placeholder file (currently empty, reserved for expanded product data).
- **`js/app.js`** — main controller. Holds the `products` data object (saffron/honey/shilajit with title, color, desc, price). Handles product switching via pill buttons and arrow nav, calls `storytellingEngine.setProduct()`, updates `document.body.dataset.theme`, and manages in-memory cart state.

### CSS Files
- **`css/style.css`** — all layout, components, and theming via CSS custom properties. Theme switches by setting `body[data-theme="saffron|honey|shilajit"]` which overrides `--theme-bg`.
- **`css/animations.css`** — keyframe animations.
- **`css/storytelling.css`** — canvas positioning and fullscreen styles.

### Frame Animation Folders
Each folder contains 192 files named `ezgif-frame-001.jpg` through `ezgif-frame-192.jpg`:
- `ezgif-2fae6b36993927b6-jpg/` → honey
- `moon2222/` → saffron
- `moon333/` → shilajit

### Known Gaps
`app.js` references `#cart-modal`, `#prev-btn`, and `#next-btn` which are absent from `index.html` — these DOM elements need to be added for cart and arrow navigation to function.
