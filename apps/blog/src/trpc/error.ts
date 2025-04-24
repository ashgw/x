import { TRPCError as BaseTRPCError } from "@trpc/server";

type EnhancedTRPCErrorOpts = ConstructorParameters<typeof BaseTRPCError>[0] & {
  meta?: Record<string, unknown>; // contextual metadata, anything you want to add to the error
};

export class CustomTRPCError extends BaseTRPCError {
  public readonly meta?: Record<string, unknown>;
  constructor(opts: EnhancedTRPCErrorOpts) {
    const { meta, ...rest } = opts;
    super(rest);
    this.meta = meta;
  }
}
