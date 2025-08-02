import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

import { Button, cn } from "@ashgw/ui";

import type { Block, BlockProps, BlockType } from "../types";
import { blockRegistry } from "../registry";

interface BlockItemProps {
  block: Block;
  onDelete: () => void;
  onChange: (props: BlockProps) => void;
  isDragging?: boolean;
}

export function BlockItem({
  block,
  onDelete,
  onChange,
  isDragging,
}: BlockItemProps) {
  const [isPreview, setIsPreview] = useState(false);
  const blockDef = blockRegistry[block.type as BlockType];

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!blockDef) {
    return null;
  }

  const { Preview: PreviewComponent, Editor: EditorComponent } = blockDef;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card group relative rounded-lg border p-4 transition-all duration-200",
        "hover:border-primary/50 hover:shadow-sm",
        isDragging && "border-primary/50 opacity-50 shadow-lg",
        !isDragging && "animate-in fade-in-0 zoom-in-95",
      )}
    >
      {/* Block Type Label */}
      <div className="text-muted-foreground absolute left-2 top-2 flex items-center gap-2 text-xs">
        {blockDef.icon}
        <span>{blockDef.label}</span>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/90 h-8 w-8"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Area */}
      <div className="pt-10">
        {isPreview ? (
          <div className="bg-muted/50 rounded-md p-4">
            <PreviewComponent {...block.props} />
          </div>
        ) : (
          <EditorComponent
            value={block.props}
            onChange={onChange}
            onPreviewToggle={() => setIsPreview(!isPreview)}
            isPreview={isPreview}
          />
        )}
      </div>
    </div>
  );
}
