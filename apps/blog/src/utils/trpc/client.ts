import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "~/server/root";

export const client = createTRPCReact<AppRouter>();
