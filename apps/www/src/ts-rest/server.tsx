import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { makeQueryClient } from "./query-client";
import { tsrQueryClientSide } from "~/ts-rest/client";

/**
usage like:
```ts
  import {
      dehydrate,
      HydrationBoundary,
      QueryClient,
  } from "@tanstack/react-query";

  await tsrQueryServerSide.getPosts.prefetchQuery({ queryKey: ['POSTS'] });

  return (
    <HydrationBoundary state={dehydrate(tsrQueryServerSide)}>
      <Posts />
    </HydrationBoundary>
  );
```
*/
export const tsrQueryServerSide =
  tsrQueryClientSide.initQueryClient(makeQueryClient());

// TODO: add docs on how to use this
export function HydrateClient(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const dehydratedState = dehydrate(tsrQueryServerSide);

  return (
    <HydrationBoundary state={dehydratedState}>
      {props.children}
    </HydrationBoundary>
  );
}
