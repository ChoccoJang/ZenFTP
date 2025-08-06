// logger

const vscode = require('vscode')

class Logger {

    constructor() {
        this.output = vscode.window.createOutputChannel('ZenFTP')
    }

    debug(message) {
        this.output.appendLine(`[DEBUG] ${message}`)
    }

    info(message) {
        this.output.appendLine(`[INFO] ${message}`)
        vscode.window.showInformationMessage(message)
    }

    error(message, e) {
        this.output.appendLine(`[ERROR] ${message}`)
        vscode.window.showErrorMessage(message)
    }
}

module.exports = new Logger()
