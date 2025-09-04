import { makeAutoObservable } from "mobx";

import { EditorStore } from "./editor";

export class RootStore {
  public readonly editor: EditorStore;

  constructor() {
    this.editor = new EditorStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
