import { Event, EventEmitter, TreeDataProvider, workspace } from "vscode";
import { CONFIG_FAVORITES } from "./constant";
import { Novel } from "./Novel";
import OnlineTreeItem from "./OnlineTreeItem";
import { getChapter } from "./online";

export default class FavoriteProvider implements TreeDataProvider<Novel> {

  public refreshEvent: EventEmitter<Novel | null> = new EventEmitter<Novel | null>();

  onDidChangeTreeData: Event<Novel | null> = this.refreshEvent.event;

  refresh() {
    this.refreshEvent.fire(null);
  }

  getTreeItem(info: Novel): OnlineTreeItem {
    return new OnlineTreeItem(info);
  }

  async getChildren(info?: Novel): Promise<Novel[]> {
    if (info) {
      return await getChapter(info.path);
    }
    return workspace.getConfiguration().get(CONFIG_FAVORITES, []);
  }

}