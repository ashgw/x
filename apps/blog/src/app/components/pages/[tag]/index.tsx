import type { PostDetailRo } from "~/api/models";
import { BlogCards } from "~/app/components/pages/home/components/BlogCards";
import { NoTagsFound } from "./components/NoTagsFound";

export function TagsPage({
  posts,
  tag,
}: {
  posts: PostDetailRo[];
  tag: string;
}) {
  const postsWithTag: PostDetailRo[] = [];

  const allAvailableTags = new Set<string>("");

  posts.forEach((post) => {
    if (post.tags.includes(tag) && post.isReleased) {
      postsWithTag.push(post);
    }
    post.tags.forEach((tag) => allAvailableTags.add(tag));
  });

  if (postsWithTag.length > 0) {
    return <BlogCards posts={postsWithTag} />;
  }

  return <NoTagsFound validTags={allAvailableTags} />;
}
