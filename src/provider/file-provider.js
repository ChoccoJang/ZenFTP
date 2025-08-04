const fs = require('fs')
const os = require('os')
const path = require('path')
const crypto = require('crypto')
const vscode = require('vscode')
const FtpClient = require('basic-ftp')
const SftpClient = require('ssh2-sftp-client')

const Logger = require('../logger')
const LowerMap = require('../lower-map')

// 파일 view 프로바이저
class FileProvider {

    constructor() {
        this.eventEmitter = new vscode.EventEmitter()
        this.onDidChangeTreeData = this.eventEmitter.event
        this.client = null
        this.protocol = null
        this.currentPath = null
        this.currentServer = null
        this.saveDisposable = null
        this.connected = false
        this.isReadOnly = false
        this.tempFileMap = new LowerMap()
    }

    // 초기화
    async init(serverNode) {

        // 연결 준비
        this.currentServer = serverNode
        this.protocol = serverNode.config.protocol || 'sftp'
        this.isReadOnly = serverNode.config.readOnly === true
        this.currentPath = serverNode.config.rootPath || '/'

        // 읽기전용이 아니면 저장 이벤트 트리거 설정
        if (!this.isReadOnly) {
            if (this.saveDisposable) this.saveDisposable.dispose()
            this.saveDisposable = await vscode.workspace.onDidSaveTextDocument(async (doc) => {
                const tempFileName = doc.fileName
                const realFileName = this.tempFileMap.get(tempFileName)

                try {
                    if (this.protocol === 'sftp') await this.client.fastPut(tempFileName, realFileName)
                    else if (this.protocol === 'ftp') {
                        const stream = fs.createReadStream(tempFileName)
                        await this.client.uploadFrom(stream, realFileName)
                        stream.close()
                    }
                    Logger.debug(`파일저장 성공: ${realFileName}`)
                } catch (e) {
                    Logger.error(`파일저장 실패: ${e.message}`, e)
                }
            })
        }
        // 파일 닫으면 임시파일 제거 및 saveDisposable 제거
        const closeDisposable = vscode.workspace.onDidCloseTextDocument((doc) => {
            const tempFileName = doc.fileName

            fs.unlink(tempFileName, () => {})
            if (!this.isReadOnly && this.saveDisposable) this.saveDisposable.dispose()
            closeDisposable.dispose()
            // 임시<->실제 파일명 저장
            this.tempFileMap.delete(tempFileName)
        })
    }

    // 새로고침
    refresh() {
        this.eventEmitter.fire()
    }

    // 서버 연결
    async connect(serverNode) {

        // 기존 연결 해제
        await this.disconnectServer(this.currentServer)

        //
        this.init(serverNode)

        try {
            if (this.protocol === 'sftp') {
                this.client = new SftpClient()
                await this.client.connect(serverNode.config)
            } else if (this.protocol === 'ftp') {
                this.client = new FtpClient.Client()
                await this.client.access({
                    host: serverNode.config.host,
                    port: serverNode.config.port || 21,
                    user: serverNode.config.username,
                    password: serverNode.config.password,
                    secure: false,
                })
            }
            this.connected = true
            await vscode.commands.executeCommand('setContext', 'ZenFTP.connected', true)
            Logger.debug(`서버연결 성공: ${serverNode.label}`)
            //
            this.refresh()
        } catch (e) {
            Logger.error(`서버연결 실패: ${e.message}`, e)
        }
    }

    // 서버 연결 종료
    async disconnectServer(serverNode) {
        try {
            if (this.connected && this.client) {
                if (this.protocol === 'sftp') await this.client.end()
                else if (this.protocol === 'ftp') await this.client.close()
                //
                this.connected = false
                this.currentServer = null
                this.client = null
                this.currentPath = null
                this.tempFileMap.clear()
                await vscode.commands.executeCommand('setContext', 'ZenFTP.connected', false)
                //
                this.refresh()
                Logger.debug(`서버종료 성공: ${serverNode.label}`)
            }
        } catch (e) {
            Logger.error(`서버종료 실패: ${e.message}`, e)
        }
    }

    // 파일 열기
    async openFile(fileNode) {
        if (fileNode.contextValue !== 'file') return

        // 임시파일
        const fullPath = fileNode.fullPath
        const hashFileName = this.getHashFileName(fullPath)
        const tempFiileName = path.join(os.tmpdir(), hashFileName)
        try {
            if (this.protocol === 'sftp') await this.client.fastGet(fullPath, tempFiileName)
            else if (this.protocol === 'ftp') {
                const stream = fs.createWriteStream(tempFiileName)
                await this.client.downloadTo(stream, fullPath)
            }

            // doc open
            const doc = await vscode.workspace.openTextDocument(tempFiileName)
            await vscode.window.showTextDocument(doc)
            // 임시<->실제 파일명 저장
            this.tempFileMap.set(tempFiileName, fullPath)
            Logger.debug(`파일열기 성공: ${fullPath}`)
        } catch (e) {
            Logger.error(`파일열기 실패: ${e.message}`, e)
        }
    }

    // 폴더 생성
    async addFolder(node) {
        try {
            this.readOnly()

            const name = await vscode.window.showInputBox({ prompt: '새 폴더 이름 입력' })
            if (name) {

                let basePath = ''
                if (!node) basePath = this.currentPath
                else if (node.isDirectory) basePath = node.fullPath
                else basePath = path.posix.dirname(node.fullPath)

                const fullPath = path.posix.join(basePath, name)
                //
                if (this.protocol === 'sftp') await this.client.mkdir(fullPath, true)
                else if (this.protocol === 'ftp') {
                    await this.client.ensureDir(fullPath)
                    await new Promise(r => setTimeout(r, 500))
                }
                //
                Logger.debug(`폴더생성 성공: ${fullPath}`)
                this.refresh()
                setTimeout(() => {
                    this.refresh()
                }, 900)
            }
        } catch (e) {
            Logger.error(`폴더생성 실패: ${e.message}`, e)
        }
    }

    // 파일 생성
    async addFile(node) {
        try {
            this.readOnly()

            const name = await vscode.window.showInputBox({ prompt: '새 파일 이름 입력' })
            if (!name) return

            let basePath = ''
            if (!node) basePath = this.currentPath
            else if (node.isDirectory) basePath = node.fullPath
            else basePath = path.posix.dirname(node.fullPath)

            const fullPath = path.posix.join(basePath, name)

            // 임시 파일명
            const hashFileName = this.getHashFileName(fullPath)
            const tempFileName = path.join(os.tmpdir(), hashFileName)
            fs.writeFileSync(tempFileName, '')

            if (this.protocol === 'sftp') await this.client.fastPut(tempFileName, fullPath)
            else if (this.protocol === 'ftp') await this.client.uploadFrom(tempFileName, fullPath)
            // 임시<->실제 파일명 저장
            this.tempFileMap.set(tempFileName, fullPath)

            //
            const doc = await vscode.workspace.openTextDocument(tempFileName)
            await vscode.window.showTextDocument(doc, { preview: false })
            //
            Logger.debug(`파일생성 성공: ${name}`)
            this.refresh()
        } catch (e) {
            Logger.error(`파일생성 실패: ${e.message}`, e)
        }
    }

    // 파일/폴더 이름 변경
    async rename(node) {
        try {
            this.readOnly()

            const newName = await vscode.window.showInputBox({ prompt: '새로운 이름', value: node.label })
            if (!newName || newName === node.label) return

            //
            const newPath = path.posix.join(path.posix.dirname(node.fullPath), newName)

            if (this.protocol === 'sftp') ;
            else if (this.protocol === 'ftp') await this.client.rename(node.fullPath, newPath)
            //
            Logger.debug(`이름변경 성공: ${newName}`)
            this.refresh()
        } catch (e) {
            Logger.error(`이름변경 실패: ${e.message}`, e)
        }
    }

    // 파일/폴더 삭제
    async delete(node) {
        try {
            this.readOnly()

            const confirm = await vscode.window.showWarningMessage(
                `'${node.label}'을 삭제할까요? 이 작업은 취소할 수 없습니다.`,
                { modal: true },
                'Delete',
            )
            if (confirm === 'Delete') {

                if (this.protocol === 'sftp') ;
                else if (this.protocol === 'ftp') {
                    if (node.isDirectory) await this.client.removeDir(node.fullPath)
                    else await this.client.remove(node.fullPath)
                }
                //
                Logger.debug(`삭제 완료: ${node.label}`)
                this.refresh()
            }
        } catch (e) {
            Logger.error(`삭제 실패: ${e.message}`, e)
        }
    }

    // 트리 아이템 처리
    getTreeItem(element) {
        const item = new vscode.TreeItem(element.label, element.collapsibleState)
        Object.assign(item, element)
        return item
    }

    // 트리 리스트 처리
    async getChildren(element) {
        if (!this.connected || !this.currentPath || !this.client) return []

        // 경로
        const dir = element?.fullPath || this.currentPath

        try {
            const list = await this.client.list(dir)

            // 하나도 없을 경우
            // if (list.length === 0) {
            //     return [
            //         {
            //             label: '파일, 폴더가 없습니다. 여기서 우클릭하여 추가하세요.',
            //             contextValue: 'file-empty',
            //             collapsibleState: vscode.TreeItemCollapsibleState.None,
            //             iconPath: new vscode.ThemeIcon('add'),
            //         }
            //     ]
            // }

            Logger.debug(`폴더조회 성공: ${dir}`)
            //
            return list.sort((a, b) => {
                if (a.type === 2 && b.type !== 2) return -1
                if (a.type !== 2 && b.type === 2) return 1
                return a.name.localeCompare(b.name)
            }).map(entry => {
                const fullPath = path.posix.join(dir, entry.name)
                const isDirectory = entry.type == 2

                // 파일/디렉토리 정보
                const item = {
                    label: entry.name,
                    fullPath,
                    collapsibleState: isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                    type: entry.type,
                    isDirectory,
                    contextValue: isDirectory ? 'folder' : 'file',
                    resourceUri: vscode.Uri.file(fullPath),
                }
                // 파일 커맨드
                if (!isDirectory) {
                    item.command = {
                        command: 'ZenFTP.openFile',
                        title: 'Open File',
                        arguments: [item],
                    }
                }

                return item
            })
        } catch (e) {
            Logger.error(`폴더조회 실패: ${e.message}`, e)
            return []
        }
    }

    // 임시파일
    getHashFileName(fileName) {
        return crypto.createHash('md5').update(fileName + Date.now()).digest('hex') + path.extname(fileName)
    }

    // 읽기모드 체크 및 예외처리
    readOnly() {
        if (this.isReadOnly) {
            throw new Error('읽기모드에서는 지원하지 않습니다.')
        }
    }
}

module.exports = FileProvider
