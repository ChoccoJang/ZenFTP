const fs = require('fs')
const path = require('path')
const vscode = require('vscode')

const Logger = require('../logger')

// 서버 그룹
class ServerGroupItem extends vscode.TreeItem {
    constructor(label) {
        super(label, vscode.TreeItemCollapsibleState.Expanded)

        this.contextValue = "serverGroup"
        this.iconPath = new vscode.ThemeIcon("folder")
    }
}

// 서버 정보
class ServerItem extends vscode.TreeItem {
    constructor(server) {
        super(server.name, vscode.TreeItemCollapsibleState.None);

        this.config = server
        this.label = server.name
        this.iconPath = new vscode.ThemeIcon('globe')
        this.description = `${server.host}:${server.port || 21}`
        this.server = server
        this.contextValue = "server"
        this.command = {
            command: 'ZenFTP.connectServer',
            title: 'Connect to Server',
            arguments: [{ label: server.name, config: server }]
        }
    }
}


// 서버 view 프로바이저
class ServerProvider {

    constructor() {
        this.eventEmitter = new vscode.EventEmitter()
        this.onDidChangeTreeData = this.eventEmitter.event
        this.servers = this.loadServerConfigs()
    }

    getServerGroup(server) {
        const defaultGroupName = Logger.l('common.server.group.default.name')
        return server.group || defaultGroupName
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

    // 서버 추가
    async addServer(context) {

        // 패널 생성
        const panel = vscode.window.createWebviewPanel('ZenFTPAddServer', Logger.l('server.add.title'), vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))],
        })

        // 로고 이미지
        const logoUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.png'))
        )

        // html
        const htmlPath = path.join(context.extensionPath, 'resources', 'html/add-server.html')
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
                Logger.debug(Logger.l('server.add.success', message.value.name))
                this.refresh()
                panel.dispose()
            }
        })
    }

    // 서버 삭제
    async removeServer(node) {
        const confirm = await vscode.window.showWarningMessage(
            Logger.l('server.delete.confirm', node.label),
            { modal: true },
            Logger.l('common.btn.delete'),
        )
        if (confirm === Logger.l('common.btn.delete')) {
            const config = vscode.workspace.getConfiguration('ZenFTP')
            let servers = config.get('servers') || []
            servers = servers.filter(s => !(s.name === node.label && this.getServerGroup(s) === this.getServerGroup(node.server)))

            //
            await config.update('servers', servers, vscode.ConfigurationTarget.Global);
            Logger.debug(Logger.l('server.delete.success', node.label))
            this.refresh()
        }
    }

    // 서버 수정
    async editServer(context, node) {
        const config = vscode.workspace.getConfiguration('ZenFTP')
        let servers = config.get('servers') || []
        const current = servers.find(s => s.name === node.label && this.getServerGroup(s) === this.getServerGroup(node.server))
        if (!current) {
            Logger.error(Logger.l('server.select.edit', node.label));
            return
        }

        // 패널 생성
        const panel = vscode.window.createWebviewPanel('ZenFTPAddServer', Logger.l('server.edit.title', current.name), vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'resources'))],
        })

        // 로고 이미지
        const logoUri = panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(context.extensionPath, 'resources', 'icon.png'))
        )

        // html
        const htmlPath = path.join(context.extensionPath, 'resources', 'html/modify-server.html')
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

                servers = servers.map(s => (s.name === node.label && this.getServerGroup(s) === this.getServerGroup(node.server)) ? message.value : s)
                await config.update('servers', servers, vscode.ConfigurationTarget.Global)
                Logger.debug(Logger.l('server.edit.success', message.value.name))
                this.refresh()
                panel.dispose()
            }
        })

        panel.webview.onDidReceiveMessage({ type: 'init' })
    }

    // 트리 아이템 처리
    getTreeItem(element) {
        return element
    }

    // 트리 리스트 처리
    getChildren(element) {
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

        // 그룹 리스트
        if (!element) {
            const groups = [...new Set(this.servers.map(s => this.getServerGroup(s)))]
            return groups.map(group => new ServerGroupItem(group))
        }

        // 해당 그룹 서버 리스트
        if (element instanceof ServerGroupItem) {
            const servers = this.servers.filter(s => this.getServerGroup(s) === element.label)
            return servers.map(s => new ServerItem(s))
        }

        return []
    }
}

module.exports = ServerProvider
