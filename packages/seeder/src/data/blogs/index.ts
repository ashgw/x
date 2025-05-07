import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import type { PostCategory } from "@ashgw/db/raw";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Blog {
  slug: string;
  title: string;
  seoTitle: string;
  summary: string;
  isReleased: boolean;
  firstModDate: Date;
  lastModDate: Date;
  minutesToRead: number;
  tags: string[];
  category: PostCategory;
  mdxContentRaw: string;
}

function getCorresponsingMdxContent(slug: string): string {
  const filePath = path.join(__dirname, `${slug}.mdx`);
  const fileContent = readFileSync(filePath, "utf-8");

  // Remove front matter if it exists (content between --- markers)
  if (fileContent.startsWith("---")) {
    const parts = fileContent.split("---");
    // Skip first part (empty) and second part (front matter)
    return parts.slice(2).join("---").trim();
  }

  return fileContent.trim();
}

export const blogs: Blog[] = [
  {
    slug: "branded-types",
    title: "Branded Types",
    seoTitle: "Write Safer TypeScript with Branded Types",
    summary: "Write safer TypeScript with branded types",
    isReleased: true,
    firstModDate: new Date("2024-04-27T09:15:00-04:00"),
    lastModDate: new Date("2024-04-27T09:15:00-04:00"),
    minutesToRead: 4,
    tags: ["typescript", "typing"],
    category: "SOFTWARE",
    mdxContentRaw: getCorresponsingMdxContent("branded-types"),
  },
];
