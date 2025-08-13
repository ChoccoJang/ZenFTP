// logger

const vscode = require('vscode')

class Logger {

    constructor() {
        this.output = vscode.window.createOutputChannel('ZenFTP')
    }

    init() {
        const config = vscode.workspace.getConfiguration('ZenFTP')
        const logLevel = config.get('logLevel', 'INFO').toUpperCase()

        // 지정한 것만
        if (['DEBUG', 'INFO', 'ERROR'].includes(logLevel)) {
            this.logLevel = logLevel
        }
    }

    debug(...args) {
        this.init()
        if (this.logLevel === 'DEBUG') {
            this.output.appendLine(`[DEBUG] ${args.join(' ')}`);
        }
    }

    info(...args) {
        this.init()
        if (['DEBUG', 'INFO'].includes(this.logLevel)) {
            const message = `[INFO] ${args.join(' ')}`
            this.output.appendLine(message)
            vscode.window.showInformationMessage(message)
        }
    }

    error(...args) {
        this.init()
        const message = `[ERROR] ${args.join(' ')}`
        this.output.appendLine(message)
        vscode.window.showErrorMessage(message)
    }
}

module.exports = new Logger()
