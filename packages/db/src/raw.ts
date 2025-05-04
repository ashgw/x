import type {
  ActionType,
  Post,
  PostCategory,
  ResourceType,
  Upload,
  UploadType,
  User,
  UserPermission,
} from "./generated/client";

// Explicitly re-export the types
export type {
  Post,
  PostCategory,
  Upload,
  ActionType,
  ResourceType,
  UploadType,
  User,
  UserPermission,
};

// Re-export everything else
export * from "./generated/client";
