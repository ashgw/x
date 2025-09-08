import type { HealthCheckResponses } from "../schemas/responses";

// TODO: make it so that, using inferrepsonse nad hsit, he body sholud not be return ed at all if it's undefined
// now the problem is that ts-rest exmpecs tthe body to be her ebut be undefined and shit
// so we make it easy abstraction for the developer to basically go ahead
// and return nothing, and we set it up in the type and shit so that ts rest receives
// body: undefined, just a DX trick that's all, idk why ts-rest doenst do this but whatver
// we silply need ot omit yhe bidy from the type (c.noBody()) & add it
// autmatically to the library so it doesnt fucking complain and shit
export async function healthCheck(): Promise<HealthCheckResponses> {
  await new Promise((r) => setTimeout(r, 1));
  return {
    status: 200,
    body: undefined,
  };
}
