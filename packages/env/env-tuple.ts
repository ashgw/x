import type { UnionToTuple, Keys } from "ts-roids";

type OrderedTuple<T> = UnionToTuple<Keys<T>>;

export function envTuple<Schema extends Record<string, unknown>>(s: Schema) {
  return Object.keys(s) as OrderedTuple<typeof s>;
}
