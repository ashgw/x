import type { UserRo } from "../models";

// role comes in as a string
export interface UserWithAuthSessionsQuery extends Omit<UserRo, "role"> {
  role: string;
}
