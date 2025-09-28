import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Root, Parent } from "mdast";

export function capitalize(input: string): string {
  if (!input) return "";
  return input.charAt(0).toUpperCase() + input.slice(1);
}

/** Strip raw HTML and images from markdown. Keep links and text. */
export function sanitizeMarkdown(input: string): string {
  const removeHtmlAndImages = () => {
    return (tree: Root) => {
      visit(tree, "html", (_node, index, parent) => {
        if (parent && typeof index === "number") {
          (parent as Parent).children.splice(index, 1);
        }
      });
      visit(tree, "image", (_node, index, parent) => {
        if (parent && typeof index === "number") {
          (parent as Parent).children.splice(index, 1);
        }
      });
      visit(tree, "imageReference", (_node, index, parent) => {
        if (parent && typeof index === "number") {
          (parent as Parent).children.splice(index, 1);
        }
      });
    };
  };

  const file = unified()
    .use(remarkParse)
    .use(removeHtmlAndImages)
    .use(remarkStringify)
    .processSync(input);

  return String(file);
}
