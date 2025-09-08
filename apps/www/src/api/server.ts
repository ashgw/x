// TODO: feed cursor ts-rest & tanstack query 5 & add docs
import { makeQueryClient } from "./query-client";
import { tsrQueryClientSide } from "./client";

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
