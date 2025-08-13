## ✨ Features

* 🔍 Full remote file tree view (FTP / SFTP)
* 📡 Seamless remote file editing
* 💾 Auto-upload on save *(unless in read-only mode)*
* ⬆️ Manual file/folder upload via drag & drop or context menu
* 🔒 Read-only mode supported
* ⚡️ Fast and lightweight – no need for full remote workspace
* 🧠 VS Code theme icon integration
* 💻 Manage multiple servers (single connection at a time)

---

## 📸 Screenshots

<img src="https://raw.githubusercontent.com/ChoccoJang/ZenFTP/main/resources/screenshot.png" alt="ZenFTP Screenshot" width="800" />

---

## 🚀 Getting Started

1. Open the command palette (⇧⌘P or Ctrl+Shift+P)
2. Search for `ZenFTP: Add Server`
3. Connect via FTP or SFTP
4. Browse and edit remote files instantly

---

## 🔧 Available Commands

| Command ID                  | Description                |
| --------------------------- | -------------------------- |
| `ZenFTP.addServer`          | Add a new server           |
| `ZenFTP.connectServer`      | Connect to selected server |
| `ZenFTP.disconnectServer`   | Disconnect current server  |
| `ZenFTP.refreshRemoteFiles` | Refresh file/folder list   |
| `ZenFTP.renameFile`         | Rename file                |
| `ZenFTP.deleteFile`         | Delete file                |
| `ZenFTP.addFolder`          | Create folder              |
| `ZenFTP.addFile`            | Create file                |
| `ZenFTP.openFile`           | Open file in editor        |
| `ZenFTP.upload`             | Upload file or folder      |

> Full command list is available via Command Palette or context menu.

---

## ⚙️ Settings

You can configure servers via `settings.json`:

```jsonc
"ZenFTP.servers": [
  {
    "name": "My Server",
    "host": "ftp.example.com",
    "username": "user",
    "password": "pass",
    "protocol": "ftp",
    "readOnly": false
  }
]
```

---

## 🤝 Contributing

Pull requests and issue reports are welcome!
Check out the [GitHub repository](https://github.com/ChoccoJang/ZenFTP).

---

## 📄 License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by ChoccoJang
</p>
