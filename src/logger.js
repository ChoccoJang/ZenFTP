const vscode = require('vscode')
const i18n = require('./i18n')

// logger
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

    l(key, ...args) {
        const lang = vscode.env.language.toLowerCase()
        const message = i18n[key]
        const template = (lang === 'ko' && message?.ko) || message?.en || key

        return args.reduce((text, val, i) => text.replace(new RegExp(`\\{${i}\\}`, 'g'), val), template)
    }
}

module.exports = new Logger()
