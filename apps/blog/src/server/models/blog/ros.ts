import { z } from "zod";

export const MetaDataAttributesSchemaRo = z.object({
  title: z.string().min(1),
  seoTitle: z.string().min(1),
  summary: z.string().min(1),
  firstModDate: z.date(),
  lastModDate: z.date(),
  isReleased: z.boolean(),
  isSequel: z.boolean(),
  minutesToRead: z.union([z.string(), z.number()]),
  tags: z.array(z.string()),
  category: z.enum(["software", "health", "philosophy"]),
});

export const MdxFileDataSchemaRo = z.object({
  attributes: MetaDataAttributesSchemaRo,
  body: z.string().min(1),
  bodyBegin: z.number(),
  frontMatter: z.string().min(1),
});

export const PostDataSchemaRo = z.object({
  parsedContent: MdxFileDataSchemaRo,
  filename: z.string(),
});

export type MetaDataAttributesRo = z.infer<typeof MetaDataAttributesSchemaRo>;
export type MdxFileDataRo = z.infer<typeof MdxFileDataSchemaRo>;
export type PostDataRo = z.infer<typeof PostDataSchemaRo>;
