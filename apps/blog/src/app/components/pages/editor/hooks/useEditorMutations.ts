"use client";

import { toast } from "sonner";

import { trpcClientSide } from "~/trpc/callers/client";
import { logger } from "@ashgw/logger";
import { useStore } from "~/app/stores";

interface UseEditorMutationsParams {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onTrashSuccess?: () => void;
  onTrashError?: () => void;
}

export function useEditorMutations({
  onCreateSuccess,
  onUpdateSuccess,
  onTrashSuccess,
  onTrashError,
}: UseEditorMutationsParams = {}) {
  const utils = trpcClientSide.useUtils();
  const { store } = useStore();

  const createMutation = trpcClientSide.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      void utils.post.getAllAdminPosts.invalidate();
      onCreateSuccess?.();
    },
    onError: (error) => {
      logger.error("Failed to create post", { error });
      toast.error("Failed to create post", { description: error.message });
    },
  });

  const updateMutation = trpcClientSide.post.updatePost.useMutation({
    onSuccess: () => {
      toast.success("Blog post updated successfully");
      void utils.post.getAllAdminPosts.invalidate();
      onUpdateSuccess?.();
    },
    onError: (error) => {
      logger.error("Failed to update post", { error });
      toast.error("Failed to update post", { description: error.message });
    },
  });

  const trashPost = trpcClientSide.post.trashPost.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Blog post deleted successfully");
      store.editor.movePostToTrash(variables.slug);
      void utils.post.getAllAdminPosts.invalidate();
      void utils.post.getTrashedPosts.invalidate();
      onTrashSuccess?.();
    },
    onError: (error) => {
      logger.error("Failed to delete post", { error });
      toast.error("Failed to delete post", { description: error.message });
      onTrashError?.();
    },
  });

  const restoreMutation = trpcClientSide.post.restoreFromTrash.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Post restored successfully");
      store.editor.restorePostFromTrash(variables.trashId);
      void utils.post.getTrashedPosts.invalidate();
      void utils.post.getAllAdminPosts.invalidate();
    },
    onError: (error) => {
      logger.error("Failed to restore post", { error });
      toast.error("Failed to restore post", { description: error.message });
    },
  });

  const purgeMutation = trpcClientSide.post.purgeTrash.useMutation({
    onSuccess: (_, variables) => {
      toast.success("Post permanently deleted");
      store.editor.purgePostFromTrash(variables.trashId);
      void utils.post.getTrashedPosts.invalidate();
    },
    onError: (error) => {
      logger.error("Failed to purge post", { error });
      toast.error("Failed to purge post", { description: error.message });
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    createMutation,
    updateMutation,
    trashPost,
    restoreMutation,
    purgeMutation,
    isSubmitting,
  };
}
