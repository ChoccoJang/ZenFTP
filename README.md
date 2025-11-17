# ZenFTP

[English](#english) | [한국어](#한국어)

## English

ZenFTP is a VS Code extension that lets you browse and edit remote files over FTP or SFTP without leaving the editor. It provides a dedicated activity bar view where you can manage servers, inspect remote directories, and keep local edits synchronized.

### Features
- Add unlimited FTP or SFTP servers and switch between them from the `ZenFTP` view.
- Browse, rename, upload, download, create, and delete files or folders directly in VS Code.
- Upload individual files or an entire folder at once, with automatic refresh of the remote tree.
- Configure read-only servers or use different credentials per server for safer operations.
- Built-in logging levels (`DEBUG`, `INFO`, `ERROR`) to help diagnose connectivity issues.

### Installation
1. Search for `ZenFTP` in the VS Code Extensions view or run `ext install ChoccoJang.zen-ftp`.
2. Reload VS Code once the installation completes. A new ZenFTP icon appears in the Activity Bar.

### Getting Started
1. Open the ZenFTP view and run `ZenFTP: Add Server`.
2. Fill in the required connection info:
   - `group`: Server grouping label.
   - `name`: Display label for the server.
   - `host`: FTP/SFTP host name or IP.
   - `port`: Optional; defaults to 21 for FTP and 22 for SFTP.
   - `protocol`: `ftp` or `sftp`.
   - `username` and `password`: Authentication credentials.
   - `rootPath`: Optional remote working directory.
   - `readOnly`: Set `true` to prevent upload or delete operations.
3. Select the server and run `ZenFTP: Connect Server`. Every action can be triggered from the command palette, by clicking the toolbar icons above each tree, or via right-click context menus inside the ZenFTP views.

### Configuration
You can manage servers manually by editing your VS Code `settings.json`:


```json
"ZenFTP.servers": [
  {
    "group": "server",
    "name": "Production",
    "host": "example.com",
    "protocol": "sftp",
    "username": "deploy",
    "password": "••••••••",
    "rootPath": "/var/www",
    "readOnly": false
  }
],
"ZenFTP.logLevel": "INFO"
```

Set `ZenFTP.logLevel` to `DEBUG` when you need verbose logs in the ZenFTP output channel.

### Troubleshooting
- Use VS Code's **Output → ZenFTP** channel to inspect connection logs.
- Verify firewalls allow FTP/SFTP ports and that passive mode is enabled on the server if required.
- When transfers fail, switch to `DEBUG` logging and reconnect to capture detailed traces for issue reports.

### 📄 License

[MIT](LICENSE)

## 한국어

ZenFTP는 VS Code 안에서 FTP/SFTP 원격 파일을 바로 탐색하고 수정할 수 있는 확장입니다. 전용 Activity Bar 뷰에서 서버를 관리하고 원격 디렉터리를 확인하며 로컬 수정 사항을 동기화할 수 있습니다.

### 주요 기능
- `ZenFTP` 뷰에 원하는 만큼 서버를 추가하고 쉽게 전환합니다.
- VS Code에서 바로 원격 파일과 폴더를 열기, 이름 변경, 업로드/다운로드, 생성, 삭제할 수 있습니다.
- 단일 파일 혹은 전체 폴더 업로드를 지원하며 업로드 후 트리를 자동 새로 고침합니다.
- 서버별로 읽기 전용 모드나 다른 자격 증명을 설정해 안전하게 작업합니다.
- (`DEBUG`, `INFO`, `ERROR`) 로그 레벨로 연결 문제를 빠르게 진단합니다.

### 설치
1. VS Code 확장 검색에서 `ZenFTP`를 찾거나 `ext install ChoccoJang.zen-ftp` 명령을 실행합니다.
2. 설치 후 VS Code를 다시 로드하면 Activity Bar에 ZenFTP 아이콘이 나타납니다.

### 시작하기
1. ZenFTP 뷰를 연 뒤 `ZenFTP: Add Server` 명령을 실행합니다.
2. 필요한 연결 정보를 입력합니다.
   - `group`: 서버 그룹 이름.
   - `name`: 서버 표시 이름.
   - `host`: FTP/SFTP 호스트 또는 IP.
   - `port`: 선택 사항(FTP 21, SFTP 22 기본값).
   - `protocol`: `ftp` 또는 `sftp`.
   - `username`, `password`: 인증 정보.
   - `rootPath`: 선택 사항인 기본 경로.
   - `readOnly`: 업로드/삭제 차단 여부.
3. 서버를 선택해 `ZenFTP: Connect Server`를 실행합니다. 명령 팔레트뿐 아니라 트리 상단 아이콘 클릭이나 트리 항목을 마우스 오른쪽 버튼으로 열리는 컨텍스트 메뉴를 통해서도 모든 기능을 수행할 수 있습니다.

### 설정
VS Code `settings.json`에서 직접 서버 목록을 관리할 수 있습니다.

```json
"ZenFTP.servers": [
  {
    "group": "server",
    "name": "Production",
    "host": "example.com",
    "protocol": "sftp",
    "username": "deploy",
    "password": "••••••••",
    "rootPath": "/var/www",
    "readOnly": false
  }
],
"ZenFTP.logLevel": "INFO"
```

`ZenFTP.logLevel` 값을 `DEBUG`로 설정하면 ZenFTP 출력 채널에서 자세한 로그를 확인할 수 있습니다.

### 문제 해결
- VS Code **Output → ZenFTP** 채널에서 연결 로그를 확인하세요.
- 방화벽이 FTP/SFTP 포트를 허용하고, 필요한 경우 서버에서 Passive 모드를 활성화했는지 확인하세요.
- 전송이 실패하면 로그 레벨을 `DEBUG`로 바꾸고 다시 연결해 상세 추적을 확보한 뒤 이슈를 보고하세요.

### 📄 라이센스

[MIT](LICENSE)
