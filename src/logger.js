// logger

const vscode = require('vscode')

class Logger {

    constructor() {
        this.output = vscode.window.createOutputChannel('ZenFTP')
    }

    debug(message) {
        console.debug(message)
    }

    info(message) {
        this.debug(message)
        vscode.window.showInformationMessage(message)
    }

    error(message, e) {
        this.debug(e)
        vscode.window.showErrorMessage(message)
    }
}

module.exports = new Logger()
