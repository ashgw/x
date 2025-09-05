import { z } from "zod";
import { httpErrorSchema } from "../schemas";

export type SchemaMap = Record<number, z.ZodTypeAny>;

export type InferResponseUnion<T extends SchemaMap> = {
  [S in Extract<keyof T, number>]: T[S] extends z.ZodTypeAny
    ? { status: S; body: z.infer<T[S]> }
    : never;
}[Extract<keyof T, number>];

export const checkHealthSchemaResponses = {
  200: z.object({ ping: z.literal("pong") }),
  500: httpErrorSchema,
};

export type CheckHealthResponses = InferResponseUnion<
  typeof checkHealthSchemaResponses
>;

export async function checkHealth(): Promise<CheckHealthResponses> {
  await new Promise((r) => setTimeout(r, 1));
  return {
    status: 200, // i basically need it lke this actually
    body: {
      ping: "pong",
    },
  };
}
