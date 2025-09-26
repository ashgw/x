import type { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import { motion } from "@ashgw/ui/motion";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@ashgw/design/ui";

import type { PostEditorDto } from "~/api/models/post";

interface TagsFieldProps {
  form: UseFormReturn<PostEditorDto>;
}

export function TagsField({ form }: TagsFieldProps) {
  const { control, setValue } = form;
  const [tagInput, setTagInput] = useState("");
  const tags = form.watch("tags");

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

  return (
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
                <Button variant="outline" type="button" onClick={_handleAddTag}>
                  Add
                </Button>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
