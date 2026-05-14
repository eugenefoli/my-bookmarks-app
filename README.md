# 📌 My Bookmarks Dashboard

A personal bookmark manager that lives in a **single HTML file** — no build tools, no dependencies, no server required. Just open `index.html` in any browser.

![Bookmark Dashboard](https://img.shields.io/badge/Built%20With-HTML%20%2B%20CSS%20%2B%20JS-blue?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- **Add bookmarks** with title, URL, category, and optional notes
- **Responsive card grid** — works on desktop and mobile
- **Real-time search** — filter by title, category, or notes
- **Category filter pills** — dynamically generated from your saved bookmarks
- **Click heatmap** — color-codes cards based on how often you click them
  - 🔥 Most clicked gets a gold highlight
  - ★ Top 25% get deep blue
  - ▲▲ Top 50% get medium blue
  - ▲ Rest get light blue
- **Top 5 default view** — shows your 5 most-visited bookmarks; "See more" reveals the rest
- **Import from browser** — drag & drop a bookmarks export file to bulk-import
  - Supports Chrome, Edge, Firefox, Safari (`.html`) and Firefox backup (`.json`)
  - Folder names become categories automatically
  - Duplicate URLs are skipped silently
- **Delete bookmarks** with a single click
- **LocalStorage persistence** — bookmarks survive page refreshes
- **8 sample bookmarks** pre-loaded on first visit

---

## 🚀 Getting Started

### Option 1 — Open directly
```bash
open index.html
```
No server needed. Works in Chrome, Firefox, Safari, Edge.

### Option 2 — Serve locally (optional)
```bash
npx serve .
# or
python3 -m http.server 8080
```

---

## 📥 Importing Browser Bookmarks

1. Export bookmarks from your browser:
   - **Chrome / Edge**: Bookmarks manager → ⋮ → Export bookmarks
   - **Firefox**: Manage Bookmarks → Import & Backup → Export Bookmarks to HTML
   - **Safari**: File → Export Bookmarks…
2. Scroll to the **Import from Browser** panel at the bottom of the page
3. Click the drop zone (or drag & drop your file)
4. Click **Import Bookmarks**

---

## 🗂 Project Structure

```
my-bookmarks-app/
└── index.html    # Entire app — HTML + CSS + JavaScript in one file
```

All data is stored in the browser's **localStorage** under the key `my-bookmarks-v1`.

---

## 🛠 Customisation

All styles live in the `<style>` block at the top of `index.html`. Key CSS variables:

```css
--blue-600: #2563eb;   /* primary action color */
--blue-700: #1d4ed8;   /* hover state */
--radius:   12px;      /* card border radius */
```

To change the number of bookmarks shown by default, edit this line in the `<script>` block:
```js
const TOP = 5;
```

---

## 📄 License

MIT — see [LICENSE](LICENSE).
