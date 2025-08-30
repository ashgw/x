import Link from "next/link";
import { Eye } from "lucide-react";
import { observer } from "mobx-react-lite";

import { DateService } from "@ashgw/cross-runtime";

import type { PostCardRo } from "~/api/models";
import { useStore } from "~/app/stores";
import { formatViews } from "~/utils/formatViews";

export const PostCard = observer(({ postData }: { postData: PostCardRo }) => {
  const { store } = useStore();
  const viewCount = store.views.getViews(postData.slug) || postData.views;

  return (
    <div className="glowsup-dimmed slower-transition hover:slower-translate mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
      <div className="slower-transition group flex flex-col gap-4 rounded-[2rem] border border-white/10 p-5 shadow hover:scale-110 hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)]">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="text-muted-foreground flex items-center gap-2 px-1 text-sm">
            <span>
              {DateService.formatDate({
                stringDate: postData.firstModDate.toISOString(),
              })}
            </span>
            <span className="mx-1 scale-150 select-none text-white/40">·</span>
            <span
              className="flex items-center gap-1 opacity-70"
              title={`${viewCount} views`}
            >
              <Eye className="h-3 w-3" />
              <span>{formatViews(viewCount)}</span>
            </span>
          </div>

          <Link href={`/${postData.slug}`}>
            <h2 className="dimmed-4 text-2xl font-bold lg:text-[2.5rem]">
              {postData.title}
            </h2>
            <p className="dimmed-3 mt-3 lg:text-xl">{postData.summary}</p>
          </Link>

          <div className="dimmed-4 flex flex-wrap items-center gap-[0.625rem] text-sm">
            {postData.tags.map((tag) => (
              <Link
                href={`/tag/${tag}`}
                key={tag}
                className="relative rounded-full border border-white/10 px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:border-white/20"
              >
                {tag}
              </Link>
            ))}
            <div className="dimmed-1 flex items-center gap-2">
              <span>
                {postData.minutesToRead
                  ? `${postData.minutesToRead} minutes`
                  : "∞ minutes"}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={`/${postData.slug}`}
          className="relative h-full overflow-hidden rounded-[2rem]"
        />
      </div>
    </div>
  );
});
