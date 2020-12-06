import { Event, EventEmitter, ExtensionContext, TreeDataProvider } from "vscode";
import * as Fs from 'fs';
import * as Path from 'path';
import { Novel } from "./Novel";
import { getChapter } from "./online";
import NovelTreeItem from "./NovelTreeItem";
import OnlineTreeItem from "./OnlineTreeItem";

export default class DataProvider implements TreeDataProvider<any> {

  public refreshEvent: EventEmitter<Novel | null> = new EventEmitter<Novel | null>();

  onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  public isOnline = false;

  public treeNode: Novel[] = [];
  public localNovelsPath: string = '';

  constructor(context: ExtensionContext) {
    this.localNovelsPath = Path.join(context.extensionPath, 'books');
    getLocalBooks(this.localNovelsPath).then(res => {
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
    if (element) {
      return await getChapter(element.path);
    }
    return this.treeNode;
    // return getLocalBooks();
  }
}

export const getLocalBooks = (localNovelsPath: string):  Promise<Novel[]> => {
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

