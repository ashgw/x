import Link from "next/link";

import { DateService } from "@ashgw/cross-runtime";

import type { PostDataRo } from "~/server/models";

export function PostCard({ postData }: { postData: PostDataRo }) {
  return (
    <>
      {postData.parsedContent.attributes.isReleased ||
      postData.parsedContent.attributes.isSequel ? (
        <div className="glowsup-dimmed slower-transition hover:slower-translate mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
          <div className="slower-transition group flex flex-col gap-4 rounded-[2rem] border border-white/10 p-5 shadow hover:scale-110 hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)]">
            <div className="flex flex-col gap-4 lg:gap-6">
              <li className="dimmed-0 ml-5 list-disc">
                {DateService.formatDate({
                  stringDate:
                    postData.parsedContent.attributes.firstModDate.toISOString(),
                })}
              </li>
              <Link href={`/${postData.filename}`}>
                <h2 className="dimmed-4 text-2xl font-bold lg:text-[2.5rem]">
                  {postData.parsedContent.attributes.title}
                </h2>
                <p className="dimmed-3 mt-3 lg:text-xl">
                  {postData.parsedContent.attributes.summary}
                </p>
              </Link>
              <div className="dimmed-4 flex flex-wrap items-center gap-[0.625rem] text-sm">
                {postData.parsedContent.attributes.tags.map((tag) => (
                  <Link
                    href={`/tag/${tag}`}
                    key={tag}
                    className="relative rounded-full border border-white/10 px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:border-white/20"
                  >
                    {tag}
                  </Link>
                ))}
                <div className="dimmed-1">
                  {postData.parsedContent.attributes.minutesToRead
                    ? postData.parsedContent.attributes.minutesToRead +
                      " minutes"
                    : "\u221e" + " minutes"}
                </div>
              </div>
            </div>
            <Link
              href={`/tag/${postData.filename}`}
              className="relative h-full overflow-hidden rounded-[2rem]"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
