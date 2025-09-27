import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "./auth";

export const nextJsHandler = toNextJsHandler(auth);
