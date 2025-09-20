"use client";

import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@ashgw/ui";

import { Header } from "./header";
import { BlogList } from "./blog-list";
import { TrashList } from "./lists/ItemList";
import { ConfirmBlogDeleteModal } from "./blog-list";
import { PostEditorForm } from "./editor-form";
import { BlogPreview } from "./preview";

import type { UseEditorControllerReturn } from "../hooks/useEditorController";

export function EditorLayout({
  controller,
}: {
  controller: UseEditorControllerReturn;
}) {
  const { ui, data, handlers, editor, trash, preview, modals, mutations } =
    controller;

  return (
    <div className="container mx-auto p-8">
      <Header
        onClick={handlers.handleNewBlog}
        sortOptions={ui.sortOptions}
        onSortOptionsChange={(opts) => ui.setSortOptions(opts)}
        blogs={data.activePosts}
        isPreviewEnabled={preview.showPreview}
        onTogglePreview={preview.togglePreview}
      />

      {ui.viewMode === "active" ? (
        <div
          className={`grid grid-cols-1 gap-8 lg:grid-cols-3 ${modals.deleteModal.visible ? "pointer-events-none" : ""}`}
        >
          <BlogList
            blogs={data.filteredAndSortedBlogs}
            onEdit={handlers.handleEditBlog}
            onDelete={handlers.handleDeleteBlog}
            isLoading={
              data.postsQuery.isLoading ||
              (data.isLoadingBlog && !ui.isTrashingBlog)
            }
            errorMessage={data.postsQuery.error?.message}
          />

          {data.showEditorSkeleton ? (
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border p-4">
                <Skeleton className="w-full" />
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait" initial={false}>
                <PostEditorForm
                  key="editor"
                  form={editor.form}
                  onSubmit={handlers.onSubmit}
                  isSubmitting={mutations.isSubmitting}
                  isHidden={preview.showPreview}
                />
                {preview.showPreview ? (
                  <BlogPreview
                    key="preview"
                    isVisible={preview.showPreview}
                    form={editor.form}
                    title={editor.previewTitle}
                    creationDate={editor.previewCreationDate}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <TrashList
            items={data.trashedPosts}
            onRestore={(item) =>
              handlers.restoreMutation.mutate({ trashId: item.id })
            }
            onPurge={(item) =>
              handlers.purgeMutation.mutate({ trashId: item.id })
            }
            isLoading={trash.trashedQuery.isLoading}
          />
          <div className="lg:col-span-2">
            <div className="text-muted-foreground flex h-full items-center justify-center rounded-lg border p-4">
              Select an item to restore or purge.
            </div>
          </div>
        </div>
      )}

      {modals.deleteModal.visible ? (
        <ConfirmBlogDeleteModal
          blog={modals.deleteModal.entity}
          onConfirm={handlers.confirmDelete}
          onCancel={handlers.cancelDelete}
          isDeleting={mutations.trashPost.isPending}
        />
      ) : null}
    </div>
  );
}

export default EditorLayout;
