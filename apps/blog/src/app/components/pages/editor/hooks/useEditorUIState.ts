"use client";

import { useState } from "react";

import type { SortOptions } from "../components/header/components/SortOptions";

export function useEditorUIState() {
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    sortField: "lastModDate",
    sortOrder: "desc",
    statusFilter: "all",
    categoryFilter: "all",
    tagFilter: null,
  });

  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => setShowPreview((p) => !p);

  return {
    sortOptions,
    setSortOptions,
    showPreview,
    togglePreview,
  };
}
