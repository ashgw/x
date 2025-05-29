import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@ashgw/ui";

import type { PostDetailRo } from "~/api/models";

export function ConfirmBlogDeleteModal(props: {
  blog: PostDetailRo;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 30,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div
          className="bg-card w-full max-w-md rounded-lg border p-6 shadow-lg"
          variants={modalVariants}
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
              variant="squared:default"
              onClick={props.onConfirm}
              disabled={props.isDeleting}
              loading={props.isDeleting}
            >
              {props.isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
