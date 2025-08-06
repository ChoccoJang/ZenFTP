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
        // 서버 정보가 있는지
        const hasNoServers = !this.servers || this.servers.length === 0
        vscode.commands.executeCommand('setContext', 'ZenFTP.hasNoServers', hasNoServers)
        //
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
        panel.webview.onDidReceiveMessage(async message => {
            if (message.type === 'save' && message.value) {
                const config = vscode.workspace.getConfiguration('ZenFTP')
                const servers = config.get('servers') || []
                servers.push(message.value)

                await config.update('servers', servers, vscode.ConfigurationTarget.Global)
                Logger.debug(`서버추가 성공: ${message.value.name}`)
                this.refresh()
                panel.dispose()
            }
        })
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
            Logger.debug(`서버삭제 성공: ${node.label}`)
            this.refresh()
        }
    }

    // 서버 수정
    async editServer(context, node) {
        const config = vscode.workspace.getConfiguration('ZenFTP')
        let servers = config.get('servers') || []
        const current = servers.find(s => s.name === node.label)
        if (!current) {
            Logger.error(`서버 '${node.label}' 설정을 찾을 수 없습니다.`);
            return
        }

        // 패널 생성
        const panel = vscode.window.createWebviewPanel('ZenFTPAddServer', `ZenFTP Modify Server - ${current.name}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))],
        })

        // 로고 이미지
        const logoUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.png'))
        )

        // html
        const htmlPath = path.join(context.extensionPath, 'resources', 'modify-server.html')
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8')
        // ${logoUri} 실제 URI로 대체
        htmlContent = htmlContent.replace(/\${logoUri}/g, logoUri.toString())
        panel.webview.html = htmlContent

        // webview 이벤트 리시버
        panel.webview.onDidReceiveMessage(async message => {
            // 초기값 전달
            if (message.type === 'init') {
                panel.webview.postMessage({ type: 'init', value: current })
            } else if (message.type === 'save' && message.value) {
                const config = vscode.workspace.getConfiguration('ZenFTP')
                let servers = config.get('servers') || []

                servers = servers.map(s => s.name === node.label ? message.value : s)
                await config.update('servers', servers, vscode.ConfigurationTarget.Global)
                Logger.debug(`서버수정 성공: ${message.value.name}`)
                this.refresh()
                panel.dispose()
            }
        })

        panel.webview.onDidReceiveMessage({ type: 'init' })
    }
}

module.exports = ServerProvider
