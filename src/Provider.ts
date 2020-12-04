import { Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from "vscode";
import * as Fs from 'fs';
import * as Path from 'path';
import { getChapter } from "./online";

interface Novel {
  name: string;
  path: string;
  isDirectory?: boolean;
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

export class OnlineTreeItem extends TreeItem {
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
  }
}

// const localNovelsPath = `/Users/careteen/Desktop/repos/careteen/@careteen/vscode-extension-knight/books`;
const localNovelsPath = '/Users/apple/Desktop/sohu/myself/myself-privilege/util/vscode/vscode-extension-knight/books';

export default class DataProvider implements TreeDataProvider<any> {

  public refreshEvent: EventEmitter<Novel | null> = new EventEmitter<Novel | null>();

  onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  public isOnline = false;

  public treeNode: Novel[] = [];

  constructor() {
    getLocalBooks().then(res => {
      this.treeNode = res;
    });
  }
  
  refresh(isOnline: boolean) {
    this.isOnline = isOnline;
    this.refreshEvent.fire(null);
  }

  getTreeItem(info: Novel): NovelTreeItem | OnlineTreeItem {
    if (this.isOnline) {
      return new OnlineTreeItem(info);
    }
    return new NovelTreeItem(info);
  }

  async getChildren(element?: Novel | undefined): Promise<Novel[]> {
    console.log('element: ', element);
    if (element) {
      return await getChapter(element.path);
    }
    return this.treeNode;
    // return getLocalBooks();
  }
}

export const getLocalBooks = ():  Promise<Novel[]> => {
  const files = Fs.readdirSync(localNovelsPath);
  const localnovellist = [] as any;
  files.forEach((file: string) => {
    const extname = Path.extname(file).substr(1);
    if (extname === 'txt') {
      const name = Path.basename(file, '.txt');
      const path = Path.join(localNovelsPath, file);
      localnovellist.push({ path, name });
    }
  });
  return Promise.resolve(localnovellist);
};

