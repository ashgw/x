"use client";

import { makeAutoObservable } from "mobx";

type Slug = string;

class ViewStore {
  // in-memory counts for the current browser context
  counts = new Map<Slug, number>();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // read: prefer store, fall back to initial value from server
  getCount(slug: Slug, initial: number) {
    const v = this.counts.get(slug);
    return v ?? initial;
  }

  // write: set confirmed value coming back from the backend
  setConfirmed(slug: Slug, value: number) {
    const cur = this.counts.get(slug);
    if (cur === undefined || value !== cur) {
      this.counts.set(slug, value);
    }
  }

  // prime: only raise or fill gaps based on server rendered cards
  primeFromCards(items: { slug: Slug; views: number }[]) {
    let changed = false;
    for (const { slug, views } of items) {
      const cur = this.counts.get(slug);
      if (cur === undefined || views > cur) {
        this.counts.set(slug, views);
        changed = true;
      }
    }
    // nothing else to do. MobX observers will react if anything changed.
    return changed;
  }

  // optional: optimistic bump for instant UI feedback
  // call this right before you fire the increment RPC
  incOptimistic(slug: Slug) {
    const cur = this.counts.get(slug) ?? 0;
    this.counts.set(slug, cur + 1);
  }
}

export const viewStore = new ViewStore();
