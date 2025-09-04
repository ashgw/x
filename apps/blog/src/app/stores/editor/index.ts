import { makeAutoObservable } from "mobx";

import type { PostDetailRo, TrashPostRo } from "~/api/models/post";

export class EditorStore {
  public viewMode: "active" | "trash" = "active";
  public activePosts: PostDetailRo[] = [];
  public trashedPosts: TrashPostRo[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public setViewMode(mode: "active" | "trash"): void {
    this.viewMode = mode;
  }

  public toggleViewMode(): void {
    this.viewMode = this.viewMode === "active" ? "trash" : "active";
  }

  public setActivePosts(posts: PostDetailRo[]): void {
    this.activePosts = posts;
  }

  public setTrashedPosts(posts: TrashPostRo[]): void {
    this.trashedPosts = posts;
  }

  public movePostToTrash(slug: string): void {
    // Remove from active posts when moved to trash
    this.activePosts = this.activePosts.filter((post) => post.slug !== slug);
  }

  public restorePostFromTrash(trashId: string): void {
    // Remove from trash when restored
    this.trashedPosts = this.trashedPosts.filter((post) => post.id !== trashId);
  }

  public purgePostFromTrash(trashId: string): void {
    // Remove from trash when permanently deleted
    this.trashedPosts = this.trashedPosts.filter((post) => post.id !== trashId);
  }

  public addTrashPost(post: TrashPostRo): void {
    // Add to trash (for real-time updates)
    this.trashedPosts = [post, ...this.trashedPosts];
  }

  public addActivePost(post: PostDetailRo): void {
    // Add to active posts (for real-time updates)
    this.activePosts = [post, ...this.activePosts];
  }
}
