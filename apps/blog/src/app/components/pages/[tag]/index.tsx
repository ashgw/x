import type { PostData } from "~/lib";
import { BlogCards } from "~/app/components/pages/home/components/BlogCards";
import { NoTagsFound } from "./components/NoTagsFound";

export function TagsPage({ posts, tag }: { posts: PostData[]; tag: string }) {
  const postsWithTag: PostData[] = [];
  const allTags = new Set<string>("");

  posts.forEach((post) => {
    if (
      post.parsedContent.attributes.tags.includes(tag) &&
      post.parsedContent.attributes.isReleased
    ) {
      postsWithTag.push(post);
    }
    post.parsedContent.attributes.tags.forEach((tag) => allTags.add(tag));
  });

  if (postsWithTag.length > 0) {
    return <BlogCards posts={postsWithTag} />;
  }

  return <NoTagsFound allAvailableTags={allTags} />;
}
