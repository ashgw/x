import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { WordCounterService } from "@ashgw/cross-runtime";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@ashgw/ui";

import type { PostEditorDto } from "~/api/models/post";
import { PostCategoryEnum } from "~/api/models/post";

interface PostEditorFormProps {
  form: UseFormReturn<PostEditorDto>;
  onSubmit: SubmitHandler<PostEditorDto>;
  isSubmitting?: boolean;
}

export function PostEditorForm({
  form,
  onSubmit,
  isSubmitting,
}: PostEditorFormProps) {
  const { reset, control, register, setValue, watch, handleSubmit } = form;

  const [tagInput, setTagInput] = useState("");

  const content = watch("mdxContent");
  const tags = watch("tags");
  const wordCount = WordCounterService.countWords(content);
  const minutesToRead = WordCounterService.countMinutesToRead(content);

  function _handleAddTag() {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      form.setValue("tags", [...tags, newTag]);
    }
    setTagInput("");
  }

  function _handleRemoveTag(tag: string) {
    setValue(
      "tags",
      tags.filter((t) => t !== tag),
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        className="bg-card rounded-lg border p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 100,
        }}
      >
        <motion.h2
          className="mb-4 text-lg font-semibold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Editor
        </motion.h2>
        <Form {...form}>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <FormField
                control={control}
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={control}
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={control}
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
                          <DropdownMenuLabel>
                            Select a category
                          </DropdownMenuLabel>
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
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {field.value.map((tag, index) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="bg-muted mb-1 mr-1 inline-flex items-center rounded px-2 py-1 text-xs"
                            >
                              {tag}
                              <button
                                type="button"
                                className="ml-1 text-red-500 hover:text-red-700"
                                onClick={() => _handleRemoveTag(tag)}
                              >
                                ×
                              </button>
                            </motion.span>
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
                                _handleAddTag();
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={_handleAddTag}
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
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6"
            >
              <label className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" {...register("isReleased")} />
                <span>Released</span>
              </label>
              <span className="text-muted-foreground text-sm">
                {`${minutesToRead} min read`} ({wordCount} words)
              </span>
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={control}
                name="mdxContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your blog content in MDX..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div
              className="flex justify-end gap-2"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Button
                variant="squared:outline"
                type="button"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="squared:default"
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
      </motion.div>
    </motion.div>
  );
}
