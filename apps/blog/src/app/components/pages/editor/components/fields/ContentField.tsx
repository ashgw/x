import type { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@ashgw/ui";

import type { PostEditorDto } from "~/api/models/post";

interface ContentFieldProps {
  control: Control<PostEditorDto>;
}

export function ContentField({ control }: ContentFieldProps) {
  return (
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
  );
}
