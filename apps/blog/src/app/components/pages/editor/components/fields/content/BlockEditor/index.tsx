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
import { Maximize2, Minimize2, Plus } from "lucide-react";
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
    const componentRegex =
      /<(\w+)(?:\s+([^>]+))?>([^<]*)<\/\1>|<(\w+)(?:\s+([^>]+))?\/>/;
    const componentMatch = componentRegex.exec(blockStr);

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
  if (!mdx || mdx.trim() === "") return [];

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
  // Use a key to force reset the component when value changes dramatically
  const [key, setKey] = useState(Date.now());
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse blocks only when value changes
  const initialBlocks = useMemo(() => parseExistingMDX(value), [value, key]);
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

  // Debounced update of MDX with a longer timeout to prevent excessive updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const mdx = serializeToMDX(blocks);
      onChange(mdx);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [blocks, onChange]);

  // Reset component when value becomes empty (new blog creation)
  useEffect(() => {
    if (!value || value.trim() === "") {
      setKey(Date.now());
      setBlocks([]);
    }
  }, [value]);

  // Compact editor view
  const compactView = (
    <div className="bg-card relative rounded-lg border p-4">
      <div className="bg-card flex items-center justify-between py-2">
        <h3 className="text-lg font-semibold">Content</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={() => setIsExpanded(true)}
          >
            <Maximize2 className="mr-2 h-4 w-4" />
            Expand Editor
          </Button>
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
      </div>

      <div className="mt-4 max-h-[300px] overflow-y-auto rounded-md border p-2">
        {blocks.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-muted-foreground text-center">
              <p>No content blocks yet</p>
              <p className="text-sm">Click "Add Block" to start writing</p>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground space-y-1 text-sm">
            {blocks.map((block) => {
              const blockDef = blockRegistry[block.type];
              return (
                <div
                  key={block.id}
                  className="hover:bg-accent/20 flex items-center gap-2 truncate rounded-md p-2"
                  onClick={() => setIsExpanded(true)}
                >
                  <span className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full">
                    {blockDef.icon}
                  </span>
                  <span className="truncate">
                    {blockDef.label}: {block.props.text?.slice(0, 30)}
                    {block.props.text && block.props.text.length > 30
                      ? "..."
                      : ""}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Expanded editor view in a Dialog
  const expandedView = (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <DialogContent className="h-[90vh] w-[90vw] max-w-[90vw] p-6">
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Content Editor</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <Minimize2 className="mr-2 h-4 w-4" />
                Minimize Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddCommand(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Block
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
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
                <div className="space-y-4">
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
                        <p className="text-sm">
                          Click "Add Block" to start writing
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div key={key} className="relative">
      {compactView}
      {expandedView}

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
