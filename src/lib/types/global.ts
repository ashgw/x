import { NextResponse } from 'next/server';

export type Optional<T> = T | null;
export type Maybe<T> = T | undefined;

export interface Err {
  error: string;
}
export interface Ok<T> {
  data: T;
}

export type AsyncResponse<T> = Promise<NextResponse<Ok<T>> | NextResponse<Err>>;
