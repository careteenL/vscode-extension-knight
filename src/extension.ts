import * as vscode from 'vscode';
import * as Fs from 'fs';

import Provider from './Provider';
import FavoriteProvider from './FavoriteProvider';
import { getContent, searchOnline } from './online';
import { CONFIG_FAVORITES } from './constant';
import { Novel } from './Novel';


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
		panel.webview.html = `<html>
			<body style="color: red;">
				<pre style="flex: 1 1 auto; white-space: pre-wrap; word-wrap: break-word;">
					${result}
				</pre>
			</body>
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
