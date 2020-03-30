import * as vscode from 'vscode';
import Config from './Config';

class FileSelect {

    private fileUrl: string = "";

    public get FileUrl(): string {
        return this.fileUrl;
    }

    public async openFileDialog(callback: (path: string) => void) {
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
            Config.SetConfig('filepath', this.fileUrl);
            Config.filePath = this.fileUrl;
            callback(this.fileUrl);
            console.log(this.fileUrl);
        }
    }
}
export default new FileSelect();
