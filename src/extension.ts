import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "Knight" is now active!');

	let disposable = vscode.commands.registerCommand('Knight.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from Knight!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
