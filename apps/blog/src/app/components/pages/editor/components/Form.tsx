import type { UseFormReturn } from "react-hook-form";

import type { PostEditorDto } from "~/api/models/post";

interface PostEditorFormProps {
  form: UseFormReturn<PostEditorDto>;
  onSubmit: (data: PostEditorDto) => void;
}

export function PostEditorForm({ form, onSubmit }: PostEditorFormProps) {
  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="lg:col-span-2">
      <div className="bg-card rounded-lg border p-4">
        <h2 className="mb-4 text-lg font-semibold">Editor</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary (1-2 sentences)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                        >
                          {field.value.charAt(0) +
                            field.value.slice(1).toLowerCase()}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Select a category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(PostCategoryEnum).map((cat) => (
                          <DropdownMenuItem
                            key={cat}
                            onClick={() => field.onChange(cat)}
                          >
                            <div className="flex items-center gap-2">
                              {cat === field.value && (
                                <Check className="h-4 w-4" />
                              )}
                              <span>
                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {field.value.map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted mb-1 mr-1 inline-flex items-center rounded px-2 py-1 text-xs"
                          >
                            {tag}
                            <button
                              type="button"
                              className="ml-1 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          className="flex-1 rounded-md border p-2"
                          placeholder="Add tag"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          onClick={handleAddTag}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" {...form.register("isReleased")} />
                <span>Released</span>
              </label>
              <span className="text-muted-foreground text-sm">
                {`${minutesToRead} min read`} ({wordCount} words)
              </span>
            </div>

            <FormField
              control={form.control}
              name="mdxContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog content in MDX..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="squared:outline"
                type="button"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
              <Button
                variant="squared:default"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
