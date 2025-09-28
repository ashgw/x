import type { UserRo } from "../models";

// role comes in as a string (better auth discrepancy, didnt allow enums)
export interface UserWithAuthSessionsQuery extends Omit<UserRo, "role"> {
  role: string;
}
