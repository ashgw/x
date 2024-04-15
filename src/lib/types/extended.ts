/* eslint-disable */
export type EmptyObject = {};
export type Nullable = null | undefined;
export type Falsy = false | '' | 0 | Nullable;
export type IsFalsy<T> = T extends Falsy ? true : false;
export type IsTruthy<T> = T extends Exclude<T, Falsy> ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsUnknwon<T> = [T] extends [unknown] ? true : false;

export type Keys<T> = keyof T;
export type Vals<T> = T[Keys<T>];
/*
astd provides the NonNullable type whcih is defined as such: 
    export type NonNullable<T> = T & {};
 */
export type ExcludeNullable<T> = Exclude<T, Nullable>;
export type ExcludeUndefined<T> = Exclude<T, undefined>;
export type ExcludeNull<T> = Exclude<T, null>;
export type ExcludeNullableFields<T> = {
  [P in Keys<T>]-?: ExcludeNullable<T[P]>;
};

export type Optional<T> = T | null;
export type MaybeUndefined<T> = T | undefined;
export type Maybe<T> = T | Nullable;

export type KeysOnly<T extends object> = Keys<T>;
export type ValuesOnly<T extends object> = T[Keys<T>];
/**
 * Applies Partial utility type to all nested objects.
 */
export type DeepPartial<T> = {
  [P in Keys<T>]?: DeepPartial<T[P]>;
};

export type Mutable<T> = {
  -readonly [K in Keys<T>]: T[K];
};

export type DeepMutable<T> = {
  -readonly [K in Keys<T>]: DeepMutable<T[K]>;
};

export type Immutable<T> = {
  +readonly [K in Keys<T>]: T[K];
};

export type DeepImmutable<T> = {
  +readonly [K in Keys<T>]: DeepImmutable<T[K]>;
};

export type IsNewable<T> = T extends new (...args: any[]) => any ? true : false;

export type AlterKeyType<T, K extends Keys<T>, R> = Pick<
  T,
  Exclude<Keys<T>, K>
> & { [P in K]: R };

export type SwapValuesAndKeys<T extends Record<Keys<T>, Keys<any>>> = {
  [P in T[Keys<T>]]: {
    [K in Keys<T>]: T[K] extends P ? K : never;
  }[keyof T];
};

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
}

type CarKeysByValue = SwapValuesAndKeys<Car>;
// The result type will map values to their corresponding keys
/*
  type CarKeysByValue = {
    string: "id" | "make" | "model";
    number: "year";
  }
  */

const keysForString: CarKeysByValue['string'] = 'model';

export type Stretch<T> = T extends object
  ? T extends infer P
    ? { [K in Keys<P>]: Stretch<P[K]> }
    : never
  : T;

interface NestedObject {
  a: number;
  b: {
    c: string;
    d: {
      e: boolean;
    };
  };
}

type ExpandedNestedObject = Stretch<NestedObject>;

export type TypeGuard<T> = (_: any) => _ is T;

const isNumber: TypeGuard<number> = (value: any): value is number => {
  return typeof value === 'number';
};

export type NullableKeys<T> = {
  [K in keyof T]-?: EmptyObject extends Pick<T, K> ? K : never;
}[keyof T];

export type DeepNullableKeys<T> = {
  [K in keyof T]-?: EmptyObject extends Pick<T, K> ? NullableKeys<K> : never;
}[keyof T];

export type NonNullableKeys<T> = {
  [K in keyof T]-?: EmptyObject extends Pick<T, K> ? never : K;
}[keyof T];

export type DeepNonNullableKeys<T> = {
  [K in keyof T]-?: EmptyObject extends Pick<T, K> ? never : NonNullableKeys<K>;
}[keyof T];

interface UserProfile {
  id: number;
  za?: string;
  username: string;
  email?: string; // Optional property
  address: string | null; // Can be null
  phoneNumber?: string | null; // Optional and can be null
}

type NullableUserProfileKeys = NonNullableKeys<UserProfile>;

export type Function<A extends any[], R> = (...args: A) => R;

type AddFunction = Function<[number, number, number, ...number[]], string>;

const add: AddFunction = (a, b, c) => 'a + b + c';

const result: string = add(10, 20, 9022.1);

export type IsClass<T> = T extends new (...args: any[]) => any ? true : false;
