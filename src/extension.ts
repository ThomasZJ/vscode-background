// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Style from './Style';
import FileSelect from './FileSelect';
import Config from './Config';
import { INSPECT_MAX_BYTES } from 'buffer';
import { Console } from 'console';

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

	let open = vscode.commands.registerCommand('extension.openfile', () => {
		FileSelect.openFileDialog((path) => {
			Style.install();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
		});
	});

	let opacity = vscode.commands.registerCommand('extension.opacity', () => {
		const option = {
			ignoreFocusOut: true,
			password: false,
			placeHolder: '0.00 ~ 1.00',
			prompt: 'Current Opacity:' + '(' + Config.Opacity + ')'
		};
		vscode.window.showInputBox(option).then(
			(value: string | undefined) => {
				if (value && Number.parseFloat(value)) {
					Config.Opacity = value;
					Config.SetConfig('opacity', Number.parseFloat(value));
					Style.install();
					vscode.commands.executeCommand('workbench.action.reloadWindow');
				}
			}
		);
	});

	let alignment = vscode.commands.registerCommand('extension.alignment', () => {
		vscode.window.showQuickPick(AlignmentItems, { matchOnDetail: true, matchOnDescription: true }).then(selectedItem => {
			if (selectedItem && typeof selectedItem.command === 'function') {
				selectedItem.command(selectedItem);
			}
		});
	});

	let size = vscode.commands.registerCommand('extension.size', () => {
		vscode.window.showQuickPick(SizeItems, { matchOnDetail: true, matchOnDescription: true }).then(selectedItem => {
			if (selectedItem && typeof selectedItem.command === 'function') {
				selectedItem.command(selectedItem);
			}
		});
	});

	context.subscriptions.push(star);
	context.subscriptions.push(stop);
	context.subscriptions.push(open);
	context.subscriptions.push(opacity);
	context.subscriptions.push(alignment);
	context.subscriptions.push(size);

	let AlignmentItems: CommandQuickPickItem[] = [];
	AlignmentItems.push({ label: 'Alignment Top Left', varlue: 'Top Left', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Top Center', varlue: 'Top Center', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Top Right', varlue: 'Top Right', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Center Left', varlue: 'Center Left', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Center Center', varlue: 'Center Center', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Center Right', varlue: 'Center Right', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Bottom Left', varlue: 'Bottom Left', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Bottom Center', varlue: 'Bottom Center', command: AlignmentCommand });
	AlignmentItems.push({ label: 'Alignment Bottom Right', varlue: 'Bottom Right', command: AlignmentCommand });

	let SizeItems: CommandQuickPickItem[] = [];
	SizeItems.push({ label: 'Auto', varlue: 'auto', command: SizeCommand });
	SizeItems.push({ label: 'Cover', varlue: 'cover', command: SizeCommand });

	function AlignmentCommand(_item: CommandQuickPickItem): Promise<void> {
		return new Promise<void>(() => {
			Config.Alignment = _item.varlue;
			Config.SetConfig('alignment', Config.Alignment);
			Style.install();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
			// console.log(_item.varlue);
		});
	}

	function SizeCommand(_item: CommandQuickPickItem): Promise<void> {
		return new Promise<void>(() => {
			Config.Size = _item.varlue;
			Config.SetConfig('size', Config.Size);
			Style.install();
			vscode.commands.executeCommand('workbench.action.reloadWindow');
			// console.log(_item.varlue);
		});
	}
}

interface CommandQuickPickItem extends vscode.QuickPickItem {
	command: (v: CommandQuickPickItem) => Promise<void>;
	varlue: string;
}

// this method is called when your extension is deactivated
export function deactivate() { }
