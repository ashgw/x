import { NextResponse } from 'next/server';

export type Optional<T> = T | null;
export type Maybe<T> = T | undefined;

interface ErrorResponse {
  error: string;
}
interface SuccessResponse<T> {
  data: T;
}

type AsyncResponse<
  T,
  Ok extends SuccessResponse<T>,
  Err extends ErrorResponse,
> = Promise<NextResponse<Ok> | NextResponse<Maybe<Err>>>;
