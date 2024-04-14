/* eslint-disable */

export type Nullable = null | undefined;
export type Falsy = false | '' | 0 | Nullable;
export type IsFalsy<T> = T extends Falsy ? true : false;
export type IsTruthy<T> = T extends Exclude<T, Falsy> ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsUnknwon<T> = [T] extends [unknown] ? true : false;

/*
astd provides the NonNullable type whcih is defined as such: 
    export type NonNullable<T> = T & {};
 */
export type ExcludeNullable<T> = Exclude<T, Nullable>;
export type ExcludeNullableFields<T> = {
  [P in keyof T]-?: ExcludeNullable<T[P]>;
};

export type Optional<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type Maybe<T> = T | Nullable;
export type KeysOnly<T extends object> = keyof T;
export type ValuesOnly<T extends object> = T[keyof T];
/**
 * Applies Partial utility type to all nested objects.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Mut<T> = {
  -readonly [K in keyof T]: T[K];
};

export type DeepMut<T> = {
  -readonly [K in keyof T]: DeepMut<T[K]>;
};

export type Immut<T> = {
  +readonly [K in keyof T]: T[K];
};

export type DeepImmut<T> = {
  +readonly [K in keyof T]: DeepImmut<T[K]>;
};

export type IsNewable<T> = T extends new (...args: any[]) => any ? true : false;

export type AlterKeyType<T, K extends keyof T, R> = Pick<
  T,
  Exclude<keyof T, K>
> & { [P in K]: R };
// Define the KeysToVals type

export type ValsToKeys<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

// Example usage:
interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
}

// Applying KeysToVals to the Car interface
type CarKeysByValue = ValsToKeys<Car>;
// The result type will map values to their corresponding keys
/*
  type CarKeysByValue = {
    string: "id" | "make" | "model";
    number: "year";
  }
  */

// Usage example:
const keysForString: CarKeysByValue['string'] = 'model';

type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: Expand<O[K]> }
    : never
  : T;

export type TypeGuard<T> = (value: any) => value is T;

const isNumber: TypeGuard<number> = (value: any): value is number => {
  return typeof value === 'number';
};
