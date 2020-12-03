import * as vscode from 'vscode';
import * as Fs from 'fs';

import Provider from './Provider';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "Knight" is now active!');

	let disposable = vscode.commands.registerCommand('Knight.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from Knight!');
	});

	context.subscriptions.push(disposable);

	const provider = new Provider();
	
	vscode.window.registerTreeDataProvider('novel-list', provider);

	let disposableSelectedNovel = vscode.commands.registerCommand('Knight.openSelectedNovel', (args) => {
		// vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args.path));
		const result = Fs.readFileSync(args.path, 'utf-8');
		const panel = vscode.window.createWebviewPanel('testWebview', 'Webview演示', vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});
		panel.webview.html = `<html>
			<body style="color: red;">
				<pre style="flex: 1 1 auto; white-space: pre-wrap; word-wrap: break-word;">
					${result}
				</pre>
			</body>
		</html>`;
	});
	context.subscriptions.push(disposableSelectedNovel);
}

export function deactivate() {}
