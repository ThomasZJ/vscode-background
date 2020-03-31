// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Style from './Style';
import FileSelect from './FileSelect';
import Config from './Config';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "jokerbackground" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let star = vscode.commands.registerCommand('extension.backgroundstar', () => {
		Style.install();
		vscode.commands.executeCommand('workbench.action.reloadWindow');
	});
	let stop = vscode.commands.registerCommand('extension.backgroundstop', () => {
		Style.uninstall();
		vscode.commands.executeCommand('workbench.action.reloadWindow');
	});
	let open = vscode.commands.registerCommand('extension.filepath', () => {
		FileSelect.openFileDialog((path) => {
			console.log(path);
			Style.install();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		});
	});
	let opacity = vscode.commands.registerCommand('extension.opacity', () => {
		const option = {
			ignoreFocusOut: true,
			password: false,
			placeHolder: '0.00 ～ 1.00',
			prompt: 'Default Opacity:' + Config.Opacity + '）'
		};
		vscode.window.showInputBox(option).then(
			value => {
				if (value && Number.parseFloat(value)) {
					Config.Opacity = value;
					Config.SetConfig('opacity', Number.parseFloat(value));
					vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
			}
		);
	});

	context.subscriptions.push(star);
	context.subscriptions.push(stop);
	context.subscriptions.push(open);
	context.subscriptions.push(opacity);
}

// this method is called when your extension is deactivated
export function deactivate() { }
