import pkg from '../../../package.json';
import { nextJS } from '../env';

abstract class BaseErr extends Error {
  private readonly version = pkg.version;
  readonly caughtError?: Error;

  constructor(
    readonly message: string,
    readonly error?: Error
  ) {
    super(message, error);
    this.caughtError = error;
  }

  toJSON(): _SerializedErr {
    return {
      version: 'v' + this.version,
      caughtError: this.caughtError?.name,
      message: this.caughtError?.message || this.message,
      stack:
        nextJS.NEXT_NODE_ENV === 'production'
          ? 'HIDDEN'
          : this.caughtError?.stack || this.stack,
      cause:
        JSON.stringify(this.caughtError?.cause) || JSON.stringify(this.cause),
    };
  }
}

type _SerializedErr = {
  version: string;
  caughtError?: string;
  message: string;
  stack?: string;
  cause: string;
};

declare class Err extends BaseErr {}
