"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Button, ScrollArea, Skeleton, Badge } from "@ashgw/ui";

import type { TrashPostArticleRo } from "~/api/models/post";

interface TrashListProps {
  items: TrashPostArticleRo[];
  onRestore: (item: TrashPostArticleRo) => void;
  onPurge: (item: TrashPostArticleRo) => void;
  isLoading?: boolean;
}

const TrashItem = memo(
  ({
    item,
    index,
    onRestore,
    onPurge,
    shouldReduceMotion,
  }: {
    item: TrashPostArticleRo;
    index: number;
    onRestore: (item: TrashPostArticleRo) => void;
    onPurge: (item: TrashPostArticleRo) => void;
    shouldReduceMotion: boolean;
  }) => {
    const initialAnimation = shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: -30 };

    const animateAnimation = shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0 };

    return (
      <motion.div
        key={item.id}
        initial={initialAnimation}
        animate={animateAnimation}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.4,
          delay: shouldReduceMotion ? 0 : index * 0.05,
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: shouldReduceMotion ? undefined : 100,
        }}
        className="rounded-md border-b p-3 pb-4 last:border-0 last:pb-0"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <div className="text-muted-foreground mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span>{new Date(item.deletedAt).toLocaleString()}</span>
              <Badge variant="outline">{item.category}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="squared:outline"
              size="sm"
              onClick={() => onRestore(item)}
            >
              Restore
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onPurge(item)}
            >
              Purge
            </Button>
          </div>
        </div>
      </motion.div>
    );
  },
);

export const TrashList = memo(
  ({ items, onRestore, onPurge, isLoading }: TrashListProps) => {
    const shouldReduceMotion = useReducedMotion();

    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
          className="bg-card rounded-lg border p-4"
        >
          <h2 className="mb-4 text-lg font-semibold">Trash</h2>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.3,
                  delay: shouldReduceMotion ? 0 : i * 0.05,
                }}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-1 h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
        className="bg-card rounded-lg border p-4"
      >
        <motion.h2
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.3,
            delay: shouldReduceMotion ? 0 : 0.1,
          }}
          className="mb-4 text-lg font-semibold"
        >
          Trash
        </motion.h2>
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: shouldReduceMotion ? 0.2 : 0.5,
              delay: 0.2,
            }}
            className="text-muted-foreground py-8 text-center"
          >
            Trash is empty.
          </motion.div>
        ) : (
          <ScrollArea className="h-[850px] pr-4">
            <div className="space-y-4">
              {items.map((item, index) => (
                <TrashItem
                  key={item.id}
                  item={item}
                  index={index}
                  onRestore={onRestore}
                  onPurge={onPurge}
                  shouldReduceMotion={!!shouldReduceMotion}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </motion.div>
    );
  },
);

TrashItem.displayName = "TrashItem";
TrashList.displayName = "TrashList";
