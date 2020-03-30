import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const jsName = 'bootstrap-window.js';
const pkg = require("./../package.json");

class Style {
    jsPath: string = "";
    extName: string = "extension-am9rZXJiYWNrZ3JvdW5k";

    constructor() {
        let fileName: string | undefined = require.main?.filename;
        if (fileName) {
            this.jsPath = path.join(path.dirname(fileName), jsName);
            vscode.window.showInformationMessage(this.jsPath);
        }
        this.extName = "extension-am9rZXJiYWNrZ3JvdW5k";
    }

    install() {
        let addJs: string = this.getJs();
        let js: string = this.getContent(this.jsPath);
        let originJs: string = this.clearContent(js);
        this.saveContent(this.jsPath, originJs + addJs);
        return true;
    }

    uninstall() {
        try {
            const js = this.getContent(this.jsPath);
            const originJs = this.clearContent(js);
            this.saveContent(this.jsPath, originJs);
            return true;
        }
        catch (e) {
            return false;
        }
    }

    getJs(): string {
        const opacity = 0.9;
        let config = vscode.workspace.getConfiguration("background");
        let imagesJs = "";
        let path: string | undefined = '"' + config.get<string>("filepath") + '"';
        if (path) {
            imagesJs = path.replace(/\\/g, '/');
        }
        return `
/*${this.extName}-start*/
/*${this.extName}.ver.${pkg.version}*/
window.onload = function() {
    const image = ${imagesJs}
    const defaultOpacity = ${opacity}

    document.body.style.opacity = defaultOpacity
    document.body.style.backgroundSize = "cover"
    document.body.style.backgroundRepeat = "no-repeat"
    document.body.style.backgroundImage = "url('" + image + "')"
}
/*${this.extName}-end*/`.replace(/\s*$/, '');
    }

    getContent(contentPath: string) {
        return fs.readFileSync(contentPath, 'utf-8');
    }

    saveContent(contentPath: string, content: any) {
        fs.writeFileSync(contentPath, content, 'utf-8');
    }

    clearContent(content: string) {
        let re = new RegExp("\\/\\*" + this.extName + "-start\\*\\/[\\s\\S]*?\\/\\*" + this.extName + "-end\\*" + "\\/", "g");
        content = content.replace(re, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
}
export default new Style();
