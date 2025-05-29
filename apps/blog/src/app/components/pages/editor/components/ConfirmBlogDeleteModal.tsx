import type { PostDetailRo } from "~/api/models";

export function ConfirmBlogDeleteModal(props: {
  blog: PostDetailRo;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-card w-full max-w-md rounded-lg border p-6 shadow-lg">
        <h3 className="mb-2 text-lg font-bold">Delete Blog</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{props.blog.title}</span>?
          <br />
          <span className="text-red-500">This action is irreversible.</span>
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="squared:outline" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button variant="squared:default" onClick={props.onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
