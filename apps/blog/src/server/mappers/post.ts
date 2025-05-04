import type { Post } from "@ashgw/db/raw";

import type { PostDataRo } from "../models";

export class PostMapper {
  public static ro({ _post }: { post: Post }): PostDataRo {
    return {};
  }
}
