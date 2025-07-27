import { makeAutoObservable } from "mobx";

export class ViewsStore {
  private views: Record<string, number> = {};

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public getViews(slug: string): number {
    return this.views[slug] ?? 0;
  }

  public setViews(slug: string, count: number): void {
    this.views[slug] = count;
  }
}
