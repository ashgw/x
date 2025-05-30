"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { DateService } from "@ashgw/cross-runtime";
import { Badge, Skeleton } from "@ashgw/ui";

import type { PostEditorDto } from "~/api/models/post";
import { featuredComponents } from "~/app/components/misc/featured/blog";
import { H1 } from "../../[post]/components/headers";

// Dynamically import MDX component to avoid ES Module issues
const MDX = dynamic(
  () => import("../../[post]/components/mdx").then((mod) => mod.MDX),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,
  },
);

interface BlogPreviewProps {
  isVisible: boolean;
  formData: PostEditorDto;
  title: string;
  creationDate: string;
}

export function BlogPreview({
  isVisible,
  formData,
  title,
  creationDate,
}: BlogPreviewProps) {
  const [mdxContent, setMdxContent] = useState<string>("");

  // Update MDX content whenever form data changes
  useEffect(() => {
    setMdxContent(formData.mdxContent);
  }, [formData.mdxContent]);

  if (!isVisible) return null;

  const formattedDate = DateService.formatDate({ stringDate: creationDate });

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }} // Faster toggle transition
    >
      <motion.div
        className="bg-card max-h-[850px] overflow-y-auto rounded-lg border p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 100,
        }}
      >
        <section className="container mx-auto">
          <div className="flex items-center justify-between">
            <H1 id={formData.title || title}>{formData.title || title}</H1>
          </div>
          <div className="mb-8 flex items-center justify-between text-sm">
            <div>{formattedDate}</div>
            <div>
              <div className="average-transition">
                <Badge variant="outlineUpdated">Preview</Badge>
              </div>
            </div>
          </div>
          <article className="text-wrap">
            {mdxContent ? (
              <MDX source={mdxContent} components={featuredComponents} />
            ) : (
              <Skeleton className="h-48 w-full" />
            )}
          </article>
        </section>
      </motion.div>
    </motion.div>
  );
}
