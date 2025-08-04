"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    // Updated regex to handle multiline content with dotall flag
    const componentRegex =
      /<(\w+)(?:\s+([^>]+))?>([^]*?)<\/\1>|<(\w+)(?:\s+([^>]+))?\/>/s;
    const componentMatch = componentRegex.exec(blockStr);

    if (componentMatch) {
      const [, tag1, props1, content, tag2, props2] = componentMatch;
      const tag = tag1 ?? tag2;
      const propsStr = props1 ?? props2;

      logger.debug("Matched component", {
        tag,
        content: content?.slice(0, 50),
        propsStr,
      });

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
      logger.debug("Creating default text block", {
        text: blockStr.slice(0, 50),
      });
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

    logger.debug("Parsing MDX content", {
      length: normalizedMdx.length,
      preview: normalizedMdx.slice(0, 100),
    });

    // Use a more robust approach to split blocks
    // Look for component patterns like <Tag>...</Tag> or <Tag />
    const blockRegex =
      /<(\w+)(?:\s+[^>]+)?>[^]*?<\/\1>|<(\w+)(?:\s+[^>]+)?\/>/gs;
    const matches = [...normalizedMdx.matchAll(blockRegex)];

    logger.debug("Found component matches", { count: matches.length });

    // If no matches found, treat the entire content as a text block
    if (matches.length === 0 && normalizedMdx.trim()) {
      const textBlock = parseBlock(normalizedMdx);
      return textBlock ? [textBlock] : [];
    }

    // Process matches and extract blocks
    const blocks: Block[] = [];
    let lastIndex = 0;

    for (const match of matches) {
      const matchStart = match.index || 0;

      // If there's text content before this match, create a text block
      if (matchStart > lastIndex) {
        const textContent = normalizedMdx
          .substring(lastIndex, matchStart)
          .trim();
        if (textContent) {
          const textBlock = parseBlock(textContent);
          if (textBlock) blocks.push(textBlock);
        }
      }

      // Parse the matched component block
      const componentBlock = parseBlock(match[0]);
      if (componentBlock) blocks.push(componentBlock);

      lastIndex = matchStart + match[0].length;
    }

    // Handle any remaining text after the last component
    if (lastIndex < normalizedMdx.length) {
      const remainingText = normalizedMdx.substring(lastIndex).trim();
      if (remainingText) {
        const textBlock = parseBlock(remainingText);
        if (textBlock) blocks.push(textBlock);
      }
    }

    logger.debug("Parsed blocks", { count: blocks.length });
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
        // For text blocks, use multiline format
        if (block.type === "C") {
          return `<C>\n${block.props.text}\n</C>`;
        }
        // For other blocks, use the standard serializer
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
  const isInitialRender = useRef(true);
  const prevValueRef = useRef(value);
  const initialValueRef = useRef(value);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserInteractingRef = useRef(false);

  // Parse blocks only when value changes
  const initialBlocks = useMemo(() => {
    // Only parse if value has changed from previous render
    if (value !== prevValueRef.current) {
      logger.debug("Value changed, reparsing blocks", {
        valueLength: value?.length,
        prevLength: prevValueRef.current?.length,
      });
      prevValueRef.current = value;
      return parseExistingMDX(value);
    }
    return parseExistingMDX(value);
  }, [value]);

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [manuallyEdited, setManuallyEdited] = useState(false);

  // Force update blocks when value changes externally (e.g. when switching blogs)
  useEffect(() => {
    // Skip the first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      initialValueRef.current = value;
      return;
    }

    // Only update blocks if value has changed significantly (different blog loaded)
    // and we haven't manually edited the content
    if (value !== initialValueRef.current && !manuallyEdited) {
      logger.debug("External value change detected, updating blocks", {
        newLength: value?.length,
        initialLength: initialValueRef.current?.length,
      });

      const newBlocks = parseExistingMDX(value);
      setBlocks(newBlocks);
      initialValueRef.current = value;
      setKey(Date.now()); // Force re-render with new key
    }
  }, [value, manuallyEdited]);

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
    setManuallyEdited(true);
  }, []);

  const updateBlock = useCallback((id: string, props: BlockProps) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, props } : block)),
    );
    setManuallyEdited(true);
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id));
    setManuallyEdited(true);
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
      setManuallyEdited(true);
    }
  }, []);

  // Handle scroll events to prevent auto-saving during scrolling
  const handleScroll = useCallback(() => {
    isScrollingRef.current = true;
    isUserInteractingRef.current = true;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set a timeout to mark scrolling as finished after 2000ms of no scroll events
    // This is longer than the debounce timeout to ensure we don't update during scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      scrollTimeoutRef.current = null;

      // After scrolling stops, wait a bit more before allowing updates
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 1000);
    }, 2000);
  }, []);

  // Debounced update of MDX with a longer timeout to prevent excessive updates
  useEffect(() => {
    // Skip initial render to prevent auto-saving on component mount
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Only update if blocks have been manually edited
    if (!manuallyEdited) return;

    // Don't save while scrolling or when user is interacting with expanded editor
    if (isScrollingRef.current || (isExpanded && isUserInteractingRef.current))
      return;

    const timeoutId = setTimeout(() => {
      const mdx = serializeToMDX(blocks);
      onChange(mdx);
      // Reset manuallyEdited flag to avoid redundant saves triggered by UI-only state changes
      setManuallyEdited(false);
    }, 1000); // Increased timeout to reduce frequency of updates

    return () => clearTimeout(timeoutId);
  }, [blocks, onChange, manuallyEdited, isExpanded]);

  // Reset component when value becomes empty (new blog creation)
  useEffect(() => {
    if (!value || value.trim() === "") {
      setKey(Date.now());
      setBlocks([]);
      setManuallyEdited(false);
    }
  }, [value]);

  // Clean up scroll timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
    <Dialog
      open={isExpanded}
      onOpenChange={(open) => {
        setIsExpanded(open);
        // When closing the expanded editor, reset the user interaction flag after a delay
        if (!open) {
          setTimeout(() => {
            isUserInteractingRef.current = false;
          }, 1000);
        }
      }}
    >
      <DialogContent className="h-[90vh] w-[90vw] max-w-[90vw] p-6">
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Content Editor</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsExpanded(false);
                  // Reset user interaction flag when closing
                  setTimeout(() => {
                    isUserInteractingRef.current = false;
                  }, 1000);
                }}
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

          <div className="relative flex-1 overflow-hidden">
            <div
              className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent absolute inset-0 overflow-y-auto pb-4 pr-2"
              onScroll={handleScroll}
              onMouseDown={() => {
                isUserInteractingRef.current = true;
              }}
              onMouseUp={() => {
                // Reset user interaction flag after a delay
                setTimeout(() => {
                  isUserInteractingRef.current = false;
                }, 1000);
              }}
            >
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
                  <div className="space-y-4 pb-16">
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

              {/* Fade effect at the bottom */}
              <div className="from-background pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t to-transparent"></div>
            </div>
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
