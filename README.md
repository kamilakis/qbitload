# qbitload

[![Firefox Add-on](https://img.shields.io/badge/Firefox-Add--on-orange?logo=firefox)](https://addons.mozilla.org/firefox/addon/qbitload/)
[![GitHub](https://img.shields.io/github/license/kamilakis/qbitload)](https://github.com/kamilakis/qbitload/blob/master/LICENSE)

A Firefox extension to send torrent/magnet links to qBittorrent with category support and connection status indicators.

> **Fork Notice:** This project is a fork of [send-to-qbittorrent](https://github.com/frogmech/send-to-qbittorrent) by [frogmech](https://github.com/frogmech). Thank you for the original work!

## Features

- Right-click context menu to send torrent/magnet links to qBittorrent
- Category support (select default category, create new categories)
- Left-click magnet link interception (optional)
- Connection status badge on the extension icon
- Toast notifications for success/failure feedback
- Dark mode support

## Installation

### From Firefox Add-ons (Recommended)

Install directly from [Firefox Add-ons (AMO)](https://addons.mozilla.org/firefox/addon/qbitload/).

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/kamilakis/qbitload/releases)
2. In Firefox, go to `about:addons` > gear icon > "Install Add-on From File..."
3. Select the downloaded `.xpi` file

## Usage

1. Click on the extension icon to open the config menu
2. Enter your qBittorrent WebUI credentials (scheme, host, port, username, password)
3. Click "Save Credentials"
4. Right-click any magnet/torrent link and select "Send to qBittorrent"

### Settings

Access settings via the gear icon in the popup:
- **Dark mode** - Toggle dark theme
- **Left-click sending** - Send magnet links on left-click instead of opening them
- **Default category** - Set a default category for all torrents
- **Create new category** - Add categories directly from the extension

### Connection Status Badge

The extension icon shows connection status:
- **Green** - Connected to qBittorrent
- **Red !** - Server error or unreachable
- **Gray ?** - Not configured

## Important

You **must** disable Cross-Site Request Forgery (CSRF) protection in qBittorrent for the API calls to work. You can:
- Disable it manually in qBittorrent: Options > Web UI > uncheck "Enable Cross-Site Request Forgery (CSRF) protection"
- Use the "Disable CSRF" button in the extension's settings page

## License

GPL-3.0 License - see [LICENSE](LICENSE) file (inherited from original project).

## Contributing

Issues and pull requests are welcome at [GitHub](https://github.com/kamilakis/qbitload).

## Credits

- Original extension: [frogmech/send-to-qbittorrent](https://github.com/frogmech/send-to-qbittorrent)
