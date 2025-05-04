// Follow this naming convention for zod schemas and types
// <entity><action>SchemaDto for zod schemas
// <entity><action>Dto for the types of the dtos

import { z } from "zod";

export const postGetSchemaDto = z.object({
  filename: z.string().min(1),
});

export type PostGetDto = z.infer<typeof postGetSchemaDto>;
