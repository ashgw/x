"use client";

import { makeAutoObservable } from "mobx";

type Slug = string;

class ViewStore {
  counts = new Map<Slug, number>();
  bc?: BroadcastChannel;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    if (typeof window !== "undefined") {
      // hydrate from localStorage
      try {
        const raw = localStorage.getItem("view_store_v1");
        if (raw) {
          const obj = JSON.parse(raw) as Record<string, number>;
          this.counts = new Map(Object.entries(obj));
        }
      } catch {
        /* ignore */
      }

      // cross-tab sync
      if ("BroadcastChannel" in window) {
        this.bc = new BroadcastChannel("view_store");
        this.bc.addEventListener("message", (ev) => {
          const msg = ev.data as
            | { t: "set"; slug: string; value: number }
            | { t: "prime"; items: Record<string, number> };

          if (msg.t === "set") {
            const cur = this.counts.get(msg.slug);
            if (cur === undefined || msg.value > cur) {
              this.counts.set(msg.slug, msg.value);
              this._persist();
            }
          } else {
            const items = Object.entries(msg.items).map(([slug, views]) => ({
              slug,
              views,
            }));
            this.primeFromCards(items);
          }
        });
      }
    }
  }

  // read: prefer store, fall back to initial
  getCount(slug: Slug, initial: number) {
    const v = this.counts.get(slug);
    return v ?? initial;
  }

  // write: confirmed value from backend
  setConfirmed(slug: Slug, value: number) {
    const cur = this.counts.get(slug);
    if (cur === undefined || value !== cur) {
      this.counts.set(slug, value);
      this._persist();
      this.bc?.postMessage({ t: "set", slug, value });
    }
  }

  // prime: never decrease, only fill gaps or raise
  primeFromCards(items: { slug: Slug; views: number }[]) {
    let changed = false;
    for (const { slug, views } of items) {
      const cur = this.counts.get(slug);
      if (cur === undefined || views > cur) {
        this.counts.set(slug, views);
        changed = true;
      }
    }
    if (changed) {
      this._persist();
      // optional broadcast if you render in multiple tabs
      // this.bc?.postMessage({ t: "prime", items: Object.fromEntries(this.counts) });
    }
  }

  _persist() {
    try {
      localStorage.setItem(
        "view_store_v1",
        JSON.stringify(Object.fromEntries(this.counts)),
      );
    } catch {
      /* ignore */
    }
  }
}

export const viewStore = new ViewStore();
