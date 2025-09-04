"use client";

import { makeAutoObservable, runInAction } from "mobx";

type Slug = string;

class ViewStore {
  counts = new Map<Slug, number>();
  optimistic = new Set<Slug>();
  bc?: BroadcastChannel;

  constructor() {
    // IMPORTANT: mark pure readers as "false" so they are NOT actions
    makeAutoObservable(
      this,
      {
        getCount: false, // keep as plain function so reads are tracked
      },
      { autoBind: true },
    );

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.bc = new BroadcastChannel("view_store");
      this.bc.addEventListener("message", (ev) => {
        const msg = ev.data as
          | { t: "inc"; slug: string }
          | { t: "set"; slug: string; value: number }
          | { t: "prime"; items: Record<string, number> };
        if (msg.t === "inc") this._incLocal(msg.slug);
        if (msg.t === "set") this._setLocal(msg.slug, msg.value);
        if (msg.t === "prime") this._primeLocal(msg.items);
      });
    }
  }

  // read path used by UI (tracked because it touches an observable Map)
  getCount(slug: Slug, fallback?: number) {
    return this.counts.get(slug) ?? fallback ?? 0;
  }

  // Prime list page once, so we start from server counts
  primeFromCards(items: { slug: Slug; views: number }[]) {
    const obj: Record<string, number> = {};
    for (const it of items) {
      this.counts.set(it.slug, it.views);
      obj[it.slug] = it.views;
    }
    this._post({ t: "prime", items: obj });
  }

  // When a view starts tracking, bump immediately
  incOptimistic(slug: Slug) {
    this.optimistic.add(slug);
    this._incLocal(slug);
    this._post({ t: "inc", slug });
  }

  // On success, set the authoritative total from server
  setConfirmed(slug: Slug, total: number) {
    runInAction(() => {
      this.optimistic.delete(slug);
      this.counts.set(slug, total);
    });
    this._post({ t: "set", slug, value: total });
  }

  // On error, revert the optimistic bump if we did one
  revert(slug: Slug, fallback?: number) {
    runInAction(() => {
      if (this.optimistic.has(slug)) {
        this.optimistic.delete(slug);
        const current = this.counts.get(slug) ?? 0;
        const next = Math.max((fallback ?? current) - 1, 0);
        this.counts.set(slug, next);
      }
    });
  }

  // -------------- internal helpers --------------
  private _incLocal(slug: Slug) {
    runInAction(() => {
      const v = this.counts.get(slug) ?? 0;
      this.counts.set(slug, v + 1);
    });
  }
  private _setLocal(slug: Slug, value: number) {
    runInAction(() => {
      this.counts.set(slug, value);
    });
  }
  private _primeLocal(items: Record<string, number>) {
    runInAction(() => {
      for (const [slug, v] of Object.entries(items)) {
        this.counts.set(slug, v);
      }
    });
  }
  private _post(msg: unknown) {
    try {
      this.bc?.postMessage(msg);
    } catch {
      // ignore
    }
  }
}

export const viewStore = new ViewStore();
