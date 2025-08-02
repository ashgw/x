"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";

import { logger } from "@ashgw/observability";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Dialog,
  DialogContent,
} from "@ashgw/ui";

import type { Block, BlockProps, BlockType } from "../types";
import { blockRegistry } from "../registry";
import { BlockItem } from "./BlockItem";

interface BlockEditorProps {
  value: string;
  onChange: (value: string) => void;
}

function extractProps(propsString: string): Record<string, string> {
  const props: Record<string, string> = {};
  const regex = /(\w+)=(?:{`([^`]*)`}|"([^"]*)")/g;
  let match;

  while ((match = regex.exec(propsString)) !== null) {
    const [, key, value1, value2] = match;
    if (key) {
      props[key] = value1 ?? value2 ?? "";
    }
  }

  return props;
}

function parseBlock(blockStr: string): Block | null {
  try {
    // Try to match component syntax first
    const componentMatch = blockStr.match(
      /<(\w+)(?:\s+([^>]+))?>([^<]*)<\/\1>|<(\w+)(?:\s+([^>]+))?\/>/,
    );

    if (componentMatch) {
      const [, tag1, props1, content, tag2, props2] = componentMatch;
      const tag = tag1 ?? tag2;
      const propsStr = props1 ?? props2;

      if (tag && Object.prototype.hasOwnProperty.call(blockRegistry, tag)) {
        const type = tag as BlockType;
        const blockDef = blockRegistry[type];
        const blockProps: BlockProps = { ...blockDef.defaultProps };

        // Parse content if it exists
        if (content?.trim()) {
          blockProps.text = content.trim();
        }

        // Parse props if they exist
        if (propsStr) {
          const extractedProps = extractProps(propsStr);
          Object.assign(blockProps, extractedProps);
        }

        return {
          id: nanoid(),
          type,
          props: blockProps,
        };
      }
    }

    // If no component match and there's content, create a text block
    if (blockStr.trim()) {
      return {
        id: nanoid(),
        type: "C",
        props: { text: blockStr.trim() },
      };
    }

    return null;
  } catch (error) {
    logger.error("Failed to parse block", { error, blockStr });
    return null;
  }
}

function parseExistingMDX(mdx: string): Block[] {
  if (!mdx?.trim()) return [];

  try {
    // First, normalize line endings and remove any BOM
    const normalizedMdx = mdx.replace(/^\ufeff/, "").replace(/\r\n?/g, "\n");

    // Split content into blocks by double newlines
    const blockStrings = normalizedMdx
      .split(/\n\s*\n/)
      .map((str) => str.trim())
      .filter(Boolean);

    // Parse each block and filter out nulls
    const blocks = blockStrings
      .map(parseBlock)
      .filter((block): block is Block => block !== null);

    return blocks;
  } catch (error) {
    logger.error("Failed to parse MDX content", { error, mdx });
    return [];
  }
}

function serializeToMDX(blocks: Block[]): string {
  try {
    return blocks
      .map((block) => {
        const blockDef = blockRegistry[block.type];
        return blockDef.serialize(block.props);
      })
      .filter(Boolean)
      .join("\n\n");
  } catch (error) {
    logger.error("Failed to serialize blocks to MDX", { error });
    return "";
  }
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  // Parse blocks only when value changes
  const initialBlocks = useMemo(() => parseExistingMDX(value), [value]);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addBlock = useCallback((type: BlockType) => {
    const blockDef = blockRegistry[type];
    setBlocks((prev) => [
      ...prev,
      {
        id: nanoid(),
        type,
        props: { ...blockDef.defaultProps },
      },
    ]);
    setShowAddCommand(false);
  }, []);

  const updateBlock = useCallback((id: string, props: BlockProps) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, props } : block)),
    );
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDraggedId(event.active.id.toString());
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedId(null);

    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((block) => block.id === active.id);
        const newIndex = prev.findIndex((block) => block.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  // Debounced update of MDX
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const mdx = serializeToMDX(blocks);
      onChange(mdx);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [blocks, onChange]);

  // Update blocks when value changes externally
  useEffect(() => {
    const newBlocks = parseExistingMDX(value);
    if (newBlocks.length > 0) {
      setBlocks(newBlocks);
    }
  }, [value]);

  return (
    <div className="bg-card relative space-y-4 rounded-lg border p-4">
      <div className="bg-card sticky top-0 z-10 flex items-center justify-between py-2">
        <h3 className="text-lg font-semibold">Content</h3>
        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={() => setShowAddCommand(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Block
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {blocks.map((block) => (
              <BlockItem
                key={block.id}
                block={block}
                onChange={(props) => updateBlock(block.id, props)}
                onDelete={() => deleteBlock(block.id)}
                isDragging={draggedId === block.id}
              />
            ))}
            {blocks.length === 0 && (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-muted-foreground text-center">
                  <p>No content blocks yet</p>
                  <p className="text-sm">Click "Add Block" to start writing</p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={showAddCommand} onOpenChange={setShowAddCommand}>
        <DialogContent className="max-w-[500px] p-0">
          <Command>
            <CommandInput placeholder="Search blocks..." />
            <CommandEmpty>No blocks found.</CommandEmpty>
            <CommandGroup>
              {Object.values(blockRegistry).map((block) => (
                <CommandItem
                  key={block.type}
                  onSelect={() => addBlock(block.type)}
                  className="hover:bg-accent flex cursor-pointer items-center px-4 py-2"
                >
                  {block.icon}
                  <span className="ml-2">{block.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
