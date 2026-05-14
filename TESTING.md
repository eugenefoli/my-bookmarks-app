# Testing Checklist

Run through this checklist **before every push** to `main`. Open the app at the live URL:

🔗 **https://eugenefoli.github.io/my-bookmarks-app/**

---

## 1. Core — Add & Delete

- [ ] Fill in Title + URL → click **Save Bookmark** → card appears in grid
- [ ] Title is required: submit with empty title → form does not submit
- [ ] URL is required: submit with empty URL → form does not submit
- [ ] Adding a bookmark scrolls it to the top (most recently added first among same-click-count)
- [ ] Click **✕** on a card → confirmation dialog appears → confirm → card disappears
- [ ] Cancel the delete confirmation → card remains

## 2. Persistence

- [ ] Add a bookmark → reload the page → bookmark still appears
- [ ] Delete a bookmark → reload → bookmark is gone
- [ ] Click a link → reload → click count is preserved and heat tier is correct

## 3. Search

- [ ] Type in the search bar → cards filter in real-time
- [ ] Search matches **title** (partial, case-insensitive)
- [ ] Search matches **category** (partial, case-insensitive)
- [ ] Clear search → all bookmarks return
- [ ] Search with no matches → empty state message appears

## 4. Category Filter Pills

- [ ] All categories from bookmarks appear as pills
- [ ] **All** pill is always present and selected by default
- [ ] Click a category pill → only that category's bookmarks show
- [ ] Add a bookmark with a new category → new pill appears automatically
- [ ] Delete all bookmarks in a category → pill disappears

## 5. Heatmap & Click Tracking

- [ ] Click a bookmark link → click count badge appears/increments on card
- [ ] After several clicks on one bookmark, its card border turns **gold** (🔥 tier)
- [ ] Other clicked bookmarks show blue heat tiers (▲, ▲▲, ★) relative to each other
- [ ] Unclicked bookmarks stay at default (no heat color)
- [ ] Heat tiers re-compute correctly after clicking different bookmarks

## 6. Top-5 Collapse

- [ ] Default view (no search, "All" category): only **5 cards** visible
- [ ] **"See more (N more)"** button appears when there are >5 bookmarks
- [ ] Click **See more** → all bookmarks visible
- [ ] **See less** button appears → click it → collapses back to 5
- [ ] While searching → **all** matching results show (no 5-card limit)
- [ ] While filtering by category → **all** matching results show (no limit)

## 7. Import from Browser

- [ ] Click **Import from Browser** toggle → panel expands/collapses
- [ ] Upload a Netscape HTML export (Chrome/Edge/Firefox/Safari) → bookmarks imported, folder names become categories
- [ ] Upload a Firefox JSON backup → bookmarks imported correctly
- [ ] Import a file with duplicate URLs → duplicates are skipped, toast shows count
- [ ] Import an invalid file → error toast appears
- [ ] After import, new category pills appear for imported folders

## 8. Bookmarklet (must test from the HTTPS URL, not file://)

> ⚠️ The bookmarklet **only works** when the app is open at `https://eugenefoli.github.io/my-bookmarks-app/`. It will **not** work from `file://` in Chrome due to browser security restrictions.

- [ ] Scroll to **"📎 Quick-Save Bookmarklet"** card → blue drag button is visible
- [ ] **Drag** the button to the bookmark bar → it appears there
- [ ] Navigate to any https:// page (e.g. https://example.com) → click the bookmarklet
- [ ] Small popup window opens, shows the page title + URL
- [ ] Popup shows ✅ and closes automatically after ~1.5 seconds
- [ ] Reload the dashboard → the new bookmark appears under **"Quick Save"** category
- [ ] Click the bookmarklet on a page already in your bookmarks → popup shows ⚠️ "Already in your bookmarks" and closes
- [ ] **Copy bookmarklet code** button → copies to clipboard (paste in browser console to verify)

## 9. Responsive / Mobile

- [ ] Open at 375px viewport width → single-column card grid
- [ ] Add form fields stack vertically
- [ ] Search bar spans full width
- [ ] Import panel is usable at narrow width

---

## How to Run Quickly

```bash
# Open live app
open https://eugenefoli.github.io/my-bookmarks-app/

# Or serve locally (bookmarklet won't work on file://, but all other features will)
cd ~/Documents/Github/my-bookmarks-app
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

*All checkboxes should be ticked before merging or pushing to `main`.*
