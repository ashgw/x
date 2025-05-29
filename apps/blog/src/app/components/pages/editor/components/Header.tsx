import { Plus } from "lucide-react";

import { Button } from "@ashgw/ui";

import type { SortOptions as SortOptionsType } from "./SortOptions";
import type { PostDetailRo } from "~/api/models/post";
import { SortOptions } from "./SortOptions";

interface HeaderProps {
  onClick: () => void;
  sortOptions: SortOptionsType;
  onSortOptionsChange: (options: SortOptionsType) => void;
  blogs: PostDetailRo[];
}

export function Header({
  onClick,
  sortOptions,
  onSortOptionsChange,
  blogs,
}: HeaderProps): JSX.Element {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Editor</h1>
        <Button variant="squared:default" onClick={onClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Blog
        </Button>
      </div>
      <div className="w-full">
        <SortOptions
          options={sortOptions}
          onOptionsChange={onSortOptionsChange}
          blogs={blogs}
        />
      </div>
    </div>
  );
}
