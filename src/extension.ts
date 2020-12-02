import * as vscode from 'vscode';

import Provider from './Provider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "Knight" is now active!');

	let disposable = vscode.commands.registerCommand('Knight.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from Knight!');
	});

	context.subscriptions.push(disposable);

	const provider = new Provider();
	
	vscode.window.registerTreeDataProvider('novel-list', provider);

	vscode.commands.registerCommand('Knight.openSelectedNovel', (args) => {
		vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args.path));
	});
}

export function deactivate() {}
