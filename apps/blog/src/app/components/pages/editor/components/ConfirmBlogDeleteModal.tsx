"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";

export function ConfirmBlogDeleteModal(props: {
  blog: PostDetailRo;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}) {
  const [confirmation, setConfirmation] = useState("");

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const isMatch = confirmation.trim() === props.blog.title;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={overlayVariants}
    >
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"
        onClick={props.onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="bg-card relative z-50 w-full max-w-md rounded-lg border p-6 shadow-xl"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.h3
          className="mb-2 text-lg font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Delete Blog
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          To confirm deletion of{" "}
          <span className="font-semibold">{props.blog.title}</span>, please type
          the blog title exactly below.
          <br />
        </motion.p>
        <Input
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder="Type blog title here"
          className="mb-4 w-full"
          disabled={props.isDeleting}
        />

        <motion.div
          className="flex justify-end gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="squared:outline"
            onClick={props.onCancel}
            disabled={props.isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={props.onConfirm}
            disabled={!isMatch || props.isDeleting}
            loading={props.isDeleting}
          >
            {props.isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
