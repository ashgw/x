"use client";

import { motion } from "framer-motion";

import { Button } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models/post";

interface ConfirmBlogDeleteModalProps {
  blog: PostDetailRo;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function ConfirmBlogDeleteModal(props: ConfirmBlogDeleteModalProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={overlayVariants}
    >
      {/* Dark backdrop with blur */}
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-[2px]"
        onClick={props.onCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal content */}
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
          Are you sure you want to delete{" "}
          <span className="font-semibold">{props.blog.title}</span>?
          <br />
          <span className="text-red-500">This action is irreversible.</span>
        </motion.p>

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
            disabled={props.isDeleting}
            loading={props.isDeleting}
          >
            {props.isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
