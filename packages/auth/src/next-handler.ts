import { toNextJsHandler } from "better-auth/next-js";
import { config } from "./config";

export const nextJsHandler = toNextJsHandler(config);
