import { TreeDataProvider, TreeItem } from "vscode";
import * as Fs from 'fs';
import * as Path from 'path';

interface Novel {
  name: string;
  path: string;
}
export class NovelTreeItem extends TreeItem {
  info: Novel;
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

const LocalNovelsPath = '/Users/apple/Desktop/sohu/myself/myself-privilege/util/vscode/vscode-extension-knight/books';

export default class DataProvider implements TreeDataProvider<any> {
  getTreeItem(info: Novel): NovelTreeItem {
    return new NovelTreeItem(info);
  }

  getChildren(): Promise<Novel[]> {
    return getLocalBooks();
  }
}

export const getLocalBooks = ():  Promise<Novel[]> => {
  const files = Fs.readdirSync(LocalNovelsPath);
  const localnovellist = [] as any;
  files.forEach((file: string) => {
    const extname = Path.extname(file).substr(1);
    if (extname === '.txt') {
      const name = Path.basename(file, '.txt');
      const path = Path.join(LocalNovelsPath, file);
      localnovellist.push({ path, name });
    }
  });
  return Promise.resolve(localnovellist);
};

