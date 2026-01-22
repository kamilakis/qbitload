# qbitload - Code Analysis

A Firefox browser extension that sends torrent/magnet links to qBittorrent via its Web API.

> Fork of [frogmech/send-to-qbittorrent](https://github.com/frogmech/send-to-qbittorrent)

## Project Structure

```
qbitload/
├── manifest.json           # Extension manifest (v2)
├── background.js           # Background script - main logic
├── leftclicksend.js        # Content script for left-click magnet handling
├── config.html/js          # Main popup - API configuration
├── settings.html/js        # Settings page - dark mode, left-click, categories
├── category-picker.html/js # Category selection popup window
├── icons/                  # Extension icons
└── LICENSE                 # GPL-3.0
```

## Architecture Overview

### Entry Points

1. **Browser Action Popup** (`config.html`) - Opens when clicking the extension icon
2. **Context Menu** - Right-click on links to send to qBittorrent
3. **Content Script** (`leftclicksend.js`) - Intercepts left-clicks on magnet links

### Data Flow

```
User Action → Content Script/Context Menu → storage.local → Background Script → qBittorrent API
```

## File Details

### `manifest.json`
- Manifest v2 (Firefox-compatible)
- Permissions: `contextMenus`, `storage`, `http://*/*`, `https://*/*`
- Extension ID: `send2qbit@automa.gr`
- Content script runs on all URLs at `document_idle`

### `background.js` (Main Logic)

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `setBadge(text, color)` | Set browser action badge (status indicator) |
| `checkServerStatus()` | Check qBittorrent server connectivity, update badge |
| `getCredentials()` | Retrieve API credentials from storage |
| `login()` | Authenticate with qBittorrent API |
| `addTorrent(urls, credentials, category)` | Send torrent to qBittorrent |
| `getCategories()` | Fetch categories from qBittorrent |
| `createCategory(name, savePath)` | Create new category |
| `openQbit()` | Open qBittorrent Web UI in new tab |
| `regularLogin(tabId)` | Auto-fill login form in qBittorrent Web UI |
| `createContextMenu()` | Create right-click context menu items |
| `updateContextMenuTitle()` | Update menu title with default category |

**Event Listeners:**

- `runtime.onStartup` / `runtime.onInstalled` - Initialize context menu and check status
- `contextMenus.onClicked` - Handle right-click menu actions
- `storage.onChanged` - React to magnet links (from content script), credential changes
- `runtime.onMessage` - Handle messages from popups/settings
- `tabs.onUpdated` - Handle CSRF disable flow

**Badge Status Indicators:**
- Gray `?` - Not configured
- Green (no text) - Connected
- Red `!` - Server error or unreachable

**Periodic Tasks:**
- Server status check every 30 seconds

### `leftclicksend.js` (Content Script)

Runs on all pages when `leftClickSend` setting is enabled:
- Intercepts clicks on `a[href^="magnet:"]` links
- Stores magnet URL in `storage.local.magnetLink`
- Shows toast notification on success/failure

**Toast Colors:**
- Dark (`#222`) - Success
- Red (`#c62828`) - Failure

### `config.html` / `config.js` (Main Popup)

Configuration form for qBittorrent API:
- Scheme (HTTP/HTTPS)
- Host
- Port
- Username
- Password

Also includes:
- "Open WebUI" button
- Link to settings page
- Dark mode support

### `settings.html` / `settings.js` (Settings Page)

Settings:
- Dark mode toggle
- Left-click sending toggle
- Default category selector
- Create new category form
- "Disable CSRF" button (opens qBittorrent and disables CSRF protection)

### `category-picker.html` / `category-picker.js` (Category Popup)

Popup window for "Send to qBittorrent (choose category...)" context menu:
- Lists existing categories
- Option to create new category with save path
- Send/Cancel buttons

## Storage Keys (`browser.storage.local`)

| Key | Type | Description |
|-----|------|-------------|
| `apiScheme` | string | "http" or "https" |
| `apiHost` | string | qBittorrent host |
| `apiPort` | string | qBittorrent port |
| `apiUsername` | string | Login username |
| `apiPassword` | string | Login password |
| `darkMode` | boolean | Dark mode enabled |
| `leftClickSend` | boolean | Left-click magnet sending enabled |
| `defaultCategory` | string | Default category for torrents |
| `magnetLink` | string | Temporary: magnet URL from content script |
| `pendingTorrentUrl` | string | Temporary: URL for category picker |

## qBittorrent API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v2/auth/login` | POST | Authenticate |
| `/api/v2/app/version` | GET | Health check |
| `/api/v2/torrents/add` | POST | Add torrent |
| `/api/v2/torrents/categories` | GET | List categories |
| `/api/v2/torrents/createCategory` | POST | Create category |

## Message Actions (runtime.sendMessage)

| Action | Sender | Handler |
|--------|--------|---------|
| `openQbit` | config.js | background.js |
| `disableCSRF` | settings.js | background.js |
| `getCategories` | settings.js, category-picker.js | background.js |
| `createCategory` | settings.js, category-picker.js | background.js |
| `addTorrentWithCategory` | category-picker.js | background.js |
| `torrentAdded` | background.js | leftclicksend.js |

## Context Menu Items

1. **"Send to qBittorrent [category]"** (`sendToQbit`) - Send with default category
2. **"Send to qBittorrent (choose category...)"** (`sendToQbitWithCategory`) - Open category picker

## Dark Mode Implementation

Applied via CSS classes:
- `.dark-mode-body` - Body background/text
- `.dark-mode-others` - Inputs, buttons, selects

Each page (config, settings, category-picker) has its own dark mode initialization.

## Recent Changes (Current Session)

1. Added connection status badge with `setBadge()` and `checkServerStatus()`
2. Badge shows: gray `?` (not configured), green (connected), red `!` (error)
3. Status checked on startup, periodically (30s), and on credential changes
4. `addTorrent()` now handles errors and sends success/failure messages
5. Toast notifications show success (dark) or failure (red with error message)
