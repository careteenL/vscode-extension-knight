import * as vscode from 'vscode';
import * as Fs from 'fs';
import * as Path from 'path';

import Provider from './Provider';
import FavoriteProvider from './FavoriteProvider';
import { getContent, searchOnline } from './online';
import { CONFIG_FAVORITES, CONFIG_PROGRESS } from './constant';
import { Novel, WebviewMessage } from './index.d';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "Knight" is now active!');

	const provider = new Provider(context);
	const favoriteProvider = new FavoriteProvider();
	
	vscode.window.registerTreeDataProvider('novel-list', provider);
	vscode.window.registerTreeDataProvider('favorite-novel', favoriteProvider);

	// 本地
	let disposableSelectedNovel = vscode.commands.registerCommand('Knight.openSelectedNovel', (args) => {
		// vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args.path));
		const result = Fs.readFileSync(args.path, 'utf-8');
		const panel = vscode.window.createWebviewPanel('KnightLocalWebview', args.name, vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true,
		});

		const cssSrc = panel.webview.asWebviewUri(vscode.Uri.file(Path.join(context.extensionPath, 'static', 'localnovel.css')));
		const jsSrc = panel.webview.asWebviewUri(vscode.Uri.file(Path.join(context.extensionPath, 'static', 'localnovel.js')));

		const config = vscode.workspace.getConfiguration();
		const handleMessage = (message: WebviewMessage) => {
			const progressSetting = config.get(CONFIG_PROGRESS, {} as any);
			progressSetting[args.name] = message.progress;
			console.log(message, progressSetting);
			switch (message.command) {
				case 'updateProgress':
					return config.update(CONFIG_PROGRESS, progressSetting, true);
				default:
					vscode.window.showWarningMessage('webview发送了未知消息');
					break;
			}
		};

		const defaultProgress = {} as any;
		defaultProgress[args.name] = 0;
		console.log('aaa', config.get(CONFIG_PROGRESS, {}));
		const postedMessage: WebviewMessage = {
			command: 'goProgress',
			progress: config.get(CONFIG_PROGRESS, defaultProgress)[args.name]
		};
		console.log('postedMessage: ', postedMessage);
		// 读取本地进度告知webview
		panel.webview.postMessage(postedMessage);
		// 接受webview传来的进度条
		panel.webview.onDidReceiveMessage(handleMessage, undefined, context.subscriptions);
		panel.webview.html = `<html>
			<head>
				<link rel="stylesheet" href="${cssSrc}">
			</head>
			<body>
				<div class="content">
					<pre style="flex: 1 1 auto; white-space: pre-wrap; word-wrap: break-word;">
						${result}
					</pre>
				</div>
			</body>
			<script src="${jsSrc}"></script>
		</html>`;
	});
	context.subscriptions.push(disposableSelectedNovel);

	// 线上
	let disposableSearchOnlineNovel = vscode.commands.registerCommand('Knight.searchOnlineNovel', args => {
		return searchOnline(provider);
	});
	context.subscriptions.push(disposableSearchOnlineNovel);

	let disposableOpenOnlineNovel = vscode.commands.registerCommand('Knight.openOnlineNovel', async (args) => {
		const panel = vscode.window.createWebviewPanel('KnightOnlineWebview', args.name, vscode.ViewColumn.One, {
			enableScripts: true,
			retainContextWhenHidden: true
		});
		panel.webview.html = await getContent(args.path);
	});
	context.subscriptions.push(disposableOpenOnlineNovel);

	// 添加收藏
	let disposablelAddFavorite = vscode.commands.registerCommand('Knight.addFavorite', args => {
		console.log('args: ', args);
		const config = vscode.workspace.getConfiguration();
		let favorites: Novel[] = config.get(CONFIG_FAVORITES, []);
		favorites = [...favorites, args];
		config.update(CONFIG_FAVORITES, favorites, true).then(() => {
			favoriteProvider.refresh();
		});
	});
	context.subscriptions.push(disposablelAddFavorite);
}

export function deactivate() {}
