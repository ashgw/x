"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";

import { DateService } from "@ashgw/cross-runtime";
import { logger } from "@ashgw/observability";
import { Badge, Skeleton } from "@ashgw/ui";

import type { PostEditorDto } from "~/api/models/post";
import {
  FramerMotionFadeInComponent,
  ThreeTrafficLightsMovingObjects,
  YeetMe,
} from "~/app/components/misc/featured/blog";
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
}

const featuredComponents = {
  YeetMe: YeetMe,
  TTLMO: ThreeTrafficLightsMovingObjects,
  FramerMotionFadeInComponent,
};

export function BlogPreview({ isVisible, formData, title }: BlogPreviewProps) {
  const [mdxContent, setMdxContent] = useState<string>("");

  // Update MDX content whenever form data changes
  useEffect(() => {
    setMdxContent(formData.mdxContent);
  }, [formData.mdxContent]);

  if (!isVisible) return null;

  // Format the current date for display
  let formattedDate = "Today";
  try {
    formattedDate = DateService.formatDate({
      stringDate: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error formatting date:", error);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
        className="bg-card mt-4 rounded-lg border p-6"
      >
        <motion.h2
          className="mb-4 text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Preview
        </motion.h2>

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
    </AnimatePresence>
  );
}
