"use client";

import { motion } from "framer-motion";

import { Button } from "@ashgw/ui";

export function ViewToggle({
  value,
  onChange,
}: {
  value: "active" | "trash";
  onChange: (view: "active" | "trash") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant={value === "active" ? "squared:default" : "squared:outline"}
        size="sm"
        onClick={() => onChange("active")}
      >
        Active
      </Button>
      <Button
        variant={value === "trash" ? "squared:default" : "squared:outline"}
        size="sm"
        onClick={() => onChange("trash")}
      >
        Trash
      </Button>
    </motion.div>
  );
}
