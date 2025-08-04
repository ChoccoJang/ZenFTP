const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

const Logger = require('../logger')

// 서버 view 프로바이저
class ServerProvider {

    constructor() {
        this.eventEmitter = new vscode.EventEmitter()
        this.onDidChangeTreeData = this.eventEmitter.event
        this.servers = this.loadServerConfigs()
    }

    // 서버 설정 로드
    loadServerConfigs() {
        const config = vscode.workspace.getConfiguration('ZenFTP')
        return config.get('servers') || []
    }

    // 새로고침
    refresh() {
        this.servers = this.loadServerConfigs()
        this.eventEmitter.fire()
    }

    // 트리 아이템 처리
    getTreeItem(element) {
        const item = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        Object.assign(item, element)
        return item
    }

    // 트리 리스트 처리
    getChildren() {
        // 서버가 하나도 없을 경우
        // if (this.servers.length === 0) {
        //     return [
        //         {
        //             label: '서버가 없습니다. 여기서 우클릭하여 추가하세요.',
        //             contextValue: 'server-empty',
        //             icon: 'add',
        //         }
        //     ]
        // }

        //
        return this.servers.map(server => {
            return ({
                label: server.name,
                description: `${server.host}:${server.port || 21}`,
                config: server,
                contextValue: 'server',
                iconPath: new vscode.ThemeIcon('globe'),
                command: {
                    command: 'ZenFTP.connectServer',
                    title: 'Connect to Server',
                    arguments: [{ label: server.name, config: server }]
                }
            })
        })
    }

    // 서버 추가
    async addServer(context) {

        // 패널 생성
        const panel = vscode.window.createWebviewPanel('ZenFTPAddServer', 'ZenFTP Add Server', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))],
        })

        // 로고 이미지
        const logoUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.png'))
        )

        // html
        const htmlPath = path.join(context.extensionPath, 'resources', 'add-server.html')
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8')
        // ${logoUri} 실제 URI로 대체
        htmlContent = htmlContent.replace(/\${logoUri}/g, logoUri.toString())
        panel.webview.html = htmlContent

        // webview 이벤트 리시버
        panel.webview.onDidReceiveMessage(message => {
            if (message.type === 'save' && message.value) {
                const servers = this.loadServerConfigs()
                servers.push(message.value)
                this.saveServerConfigs(servers)
                panel.dispose()
                // vscode.window.showInformationMessage(`서버 '${message.value.name}' 추가됨.`);
            }
        })

        // const name = await vscode.window.showInputBox({ prompt: '서버 이름 입력' })
        // const host = await vscode.window.showInputBox({ prompt: '호스트 주소 입력' })
        // const username = await vscode.window.showInputBox({ prompt: '사용자명 입력' })
        // const password = await vscode.window.showInputBox({ prompt: '비밀번호 입력', password: true })
        // const protocol = await vscode.window.showQuickPick(['sftp', 'ftp'], { placeHolder: '프로토콜 선택 (sftp 또는 ftp)' })
        // const readOnlyPick = await vscode.window.showQuickPick(['예', '아니오'], { placeHolder: '읽기 전용으로 추가할까요?' })
        // const readOnly = readOnlyPick === '예'

        // if (name && host && username && password && protocol) {
        //     const config = vscode.workspace.getConfiguration('ZenFTP')
        //     const servers = config.get('servers') || []
        //     servers.push({ name, host, username, password, protocol, readOnly });

        //     //
        //     await config.update('servers', servers, vscode.ConfigurationTarget.Global)
        //     Logger.debug(`서버추가 성공: ${name}`)
        //     this.refresh()
        // }
    }

    // 서버 삭제
    async removeServer(node) {
        const confirm = await vscode.window.showWarningMessage(`서버 '${node.label}'를 삭제할까요?`, '삭제', '취소')
        if (confirm === '삭제') {
            const config = vscode.workspace.getConfiguration('ZenFTP')
            let servers = config.get('servers') || []
            servers = servers.filter(s => s.name !== node.label)

            //
            await config.update('servers', servers, vscode.ConfigurationTarget.Global);
            Logger.debug(`서버삭제 성공: ${name}`)
            this.refresh()
        }
    }

    // 서버 수정
    async editServer(node) {
        const config = vscode.workspace.getConfiguration('ZenFTP')
        let servers = config.get('servers') || []
        const current = servers.find(s => s.name === node.label)
        if (!current) return

        //
        const name = await vscode.window.showInputBox({ prompt: '서버 이름 수정', value: current.name })
        const host = await vscode.window.showInputBox({ prompt: '호스트 주소 수정', value: current.host })
        const username = await vscode.window.showInputBox({ prompt: '사용자명 수정', value: current.username })
        const password = await vscode.window.showInputBox({ prompt: '비밀번호 수정', value: current.password, password: true })
        const protocol = await vscode.window.showQuickPick(['sftp', 'ftp'], { placeHolder: '프로토콜 선택', canPickMany: false })
        const readOnlyPick = await vscode.window.showQuickPick(['예', '아니오'], { placeHolder: '읽기 전용으로 설정할까요?' })
        const readOnly = readOnlyPick === '예'

        if (name && host && username && password && protocol) {
            const updated = { name, host, username, password, protocol, readOnly }
            servers = servers.map(s => s.name === node.label ? updated : s);

            //
            await config.update('servers', servers, vscode.ConfigurationTarget.Global)
            Logger.debug(`서버수정 성공: ${name}`)
            this.refresh()
        }
    }
}

module.exports = ServerProvider
