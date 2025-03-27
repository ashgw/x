import { MdxService } from "~/lib/index";
import { BlogCards } from "./components/BlogCards";

export async function HomePage() {
  const posts = await new MdxService("public/blogs").getPosts();

  return <BlogCards posts={posts} />;
}
