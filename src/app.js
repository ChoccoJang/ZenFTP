
// zenya-ftp for VS Code extension with FTP/SFTP
const vscode = require('vscode')

const ServerProvider = require('./provider/server-provider')
const FileProvider = require('./provider/file-provider')

function activate(context) {

    //
    let selectedFileNode = undefined

    //
    const serverProvider = new ServerProvider()
    const fileProvider = new FileProvider()

    // treeview 생성
    const serverTreeView = vscode.window.createTreeView('ZenFTPServers', { treeDataProvider: serverProvider })
    const fileTreeView = vscode.window.createTreeView('ZenFTPFiles', { treeDataProvider: fileProvider })

    // 파일 뷰에서 선택된 노드 추적
    fileTreeView.onDidChangeSelection((e) => {
        selectedFileNode = e.selection?.[0]
    })

    // 명령어 구독
    context.subscriptions.push(
        // -- 서버
        vscode.commands.registerCommand('ZenFTP.connectServer', (serverNode) => fileProvider.connect(serverNode)),
        vscode.commands.registerCommand('ZenFTP.refreshServers', () => serverProvider.refresh()),
        vscode.commands.registerCommand('ZenFTP.addServer', () => serverProvider.addServer(context)),
        vscode.commands.registerCommand('ZenFTP.editServer', (node) => serverProvider.editServer(context, node)),
        vscode.commands.registerCommand('ZenFTP.removeServer', (node) => serverProvider.removeServer(node)),
        vscode.commands.registerCommand('ZenFTP.disconnectServer', (serverNode) => fileProvider.disconnectServer(serverNode)),

        // -- 파일/폴더
        vscode.commands.registerCommand('ZenFTP.openFile', (node) => fileProvider.openFile(node)),
        vscode.commands.registerCommand('ZenFTP.addFolder', (node) => fileProvider.addFolder(node)),
        vscode.commands.registerCommand('ZenFTP.addFile', (node) => fileProvider.addFile(node)),
        vscode.commands.registerCommand('ZenFTP.rename', (node) => fileProvider.rename(node, selectedFileNode)),
        vscode.commands.registerCommand('ZenFTP.delete', (node) => fileProvider.delete(node, selectedFileNode)),
        vscode.commands.registerCommand('ZenFTP.refreshFiles', () => fileProvider.refresh()),
        vscode.commands.registerCommand('ZenFTP.upload', (node) => fileProvider.upload(context, node)),
    )

    // 최초 서버 리스트 로드
    serverProvider.refresh()
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
}
