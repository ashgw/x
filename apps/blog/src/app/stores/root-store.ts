import { makeAutoObservable } from "mobx";

import { ViewsStore } from "./views";

export class RootStore {
  public readonly views: ViewsStore;

  constructor() {
    this.views = new ViewsStore();
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
