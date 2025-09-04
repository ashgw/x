import { makeAutoObservable } from "mobx";

import { EditorStore } from "./editor";
import { ViewsStore } from "./views";

export class RootStore {
  public readonly views: ViewsStore;
  public readonly editor: EditorStore;

  constructor() {
    this.views = new ViewsStore();
    this.editor = new EditorStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
