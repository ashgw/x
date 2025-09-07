import { logger } from "@ashgw/observability";
import type { PurgeViewWindowCronDto } from "../schemas/dtos";
import type { PurgeViewWindowCronResponses } from "../schemas/responses";

export async function purgeViewWindow(
  input: PurgeViewWindowCronDto,
): Promise<PurgeViewWindowCronResponses> {
  await new Promise((r) => setTimeout(r, 1));
  logger.log(input);
  return {
    status: 200,
    body: undefined,
  };
}
