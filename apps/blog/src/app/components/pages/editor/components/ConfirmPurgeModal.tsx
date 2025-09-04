"use client";

import { motion } from "framer-motion";
import { Button } from "@ashgw/ui";

export function ConfirmPurgeModal(props: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPurging?: boolean;
}) {
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
          Permanently Delete
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          This action cannot be undone. This will permanently delete "
          <span className="font-semibold">{props.title}</span>".
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
            disabled={props.isPurging}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={props.onConfirm}
            disabled={props.isPurging}
            loading={props.isPurging}
          >
            {props.isPurging ? "Deleting..." : "Delete Permanently"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
