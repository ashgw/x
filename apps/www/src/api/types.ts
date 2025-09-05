import type { z } from "zod";

export type SchemaMap = Record<number, z.ZodTypeAny>;

export type InferResponses<T extends SchemaMap> = {
  [S in Extract<keyof T, number>]: T[S] extends z.ZodTypeAny
    ? { status: S; body: z.infer<T[S]> }
    : never;
}[Extract<keyof T, number>];

export type InferRequest<T extends z.ZodTypeAny> = z.infer<T>;
