import { NextResponse } from 'next/server';

export type Optional<T> = T | null;
export type Maybe<T> = T | undefined;

export type Err = {
  error: string;
};
export type Ok<T> = {
  data: T;
};

export type ErrText = string;
export type OkText<T> = T;

export type AsyncResponse<T> = Promise<NextResponse<Ok<T>> | NextResponse<Err>>;
export type NextPlainTextResponse<T> = Promise<
  NextResponse<Ok<T>> | NextResponse<ErrText>
>;
