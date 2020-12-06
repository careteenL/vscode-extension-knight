import { TreeItem } from "vscode";
import { Novel } from "./index.d";

export default class NovelTreeItem extends TreeItem {
  info: Novel;
  contextValue = 'local';
  constructor(info: Novel) {
    super(`${info.name}`);
    const tips = [
      `名称：${info.name}`
    ];
    this.info = info;
    this.tooltip = tips.join('\r\n');
    this.command = {
      command: 'Knight.openSelectedNovel',
      title: '打开该小说',
      arguments: [
        {
          name: info.name,
          path: info.path
        }
      ]
    };
  }
}