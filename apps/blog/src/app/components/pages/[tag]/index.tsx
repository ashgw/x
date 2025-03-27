import type { PostData } from "~/lib";
import { BlogCards } from "~/app/components/pages/home/components/BlogCards";
import { NoTagsFound } from "./components/NoTagsFound";

export default function TagsPage({
  posts,
  tag,
}: {
  posts: PostData[];
  tag: string;
}) {
  const postsWithTag: PostData[] = [];
  const allTags = new Set<string>("");

  posts.forEach((post) => {
    if (post.parsedContent.attributes.tags.includes(tag)) {
      postsWithTag.push(post);
    }
    post.parsedContent.attributes.tags.forEach((tag) => allTags.add(tag));
  });

  const suggestedTags = Array.from(allTags)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  if (postsWithTag.length > 0) {
    return <BlogCards posts={postsWithTag} />;
  }

  return <NoTagsFound suggestedTags={suggestedTags} />;
}
