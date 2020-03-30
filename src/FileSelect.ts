import * as vscode from 'vscode';

class FileSelect {

    private fileUrl: string = "";

    public get FileUrl(): string {
        return this.fileUrl;
    }

    public async openFileDialog() {
        let filters = {
            'Images': ['png', 'jpg', 'jpeg', 'gif']
        };
        let fileUrls = await vscode.window.showOpenDialog({
            canSelectFolders: false,
            canSelectFiles: true,
            canSelectMany: false,
            openLabel: 'Select',
            filters: filters
        });
        if (fileUrls) {
            this.fileUrl = fileUrls[0].fsPath;
            let config = vscode.workspace.getConfiguration("background");
            config.update("filepath", this.fileUrl, vscode.ConfigurationTarget.Global);
            console.log(this.fileUrl);
        }
    }
}
export default new FileSelect();
