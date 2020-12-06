import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { Novel } from "./Novel";

export default class OnlineTreeItem extends TreeItem {
  info: Novel;
  contextValue = 'online';
  constructor(info: Novel) {
    super(`${info.name}`);
    const tips = [
      `名称：${info.name}`
    ];
    this.info = info;
    this.tooltip = tips.join('\r\n');
    this.collapsibleState = info.isDirectory ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
    this.command = info.isDirectory ? undefined : {
      command: 'Knight.openOnlineNovel',
      title: '打开该网络小说',
      arguments: [
        {
          name: info.name,
          path: info.path
        }
      ]
    };
    this.contextValue = info.isDirectory ? 'online': 'onlineChapter';
  }
}