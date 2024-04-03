import { PostData } from '@/lib/types/mdx';
import Link from 'next/link';
import { formatDate } from '@/lib/funcs/dates';
import { BLOG_URI } from '@/lib/constants';

export default function PostCard({ postData }: { postData: PostData }) {
  if (
    !postData.parsedContent.attributes.isReleased ||
    postData.parsedContent.attributes.isSequel
  ) {
    return;
  }
  return (
    <div className="glowsup-dimmed slower-transition hover:slower-translate mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
      <div className=" group flex flex-col gap-4 rounded-[2rem] p-5 hover:scale-110 slower-transition shadow hover:shadow-[0px_4px_88px_0px_var(--deeper-purple)] border border-white/10">
        <div className="flex flex-col gap-4 lg:gap-6">
          <li className="list-disc ml-5 dimmed-0">
            {formatDate(postData.parsedContent.attributes.firstModDate)}
          </li>
          <Link href={`${BLOG_URI}/${postData.filename}`}>
            <h2 className="text-2xl font-bold dimmed-4 lg:text-[2.5rem]">
              {postData.parsedContent.attributes.title}
            </h2>
            <p className="mt-3 dimmed-3 lg:text-xl">
              {postData.parsedContent.attributes.summary}
            </p>
          </Link>
          <div className="flex flex-wrap items-center gap-[0.625rem] text-sm dimmed-4">
            {postData.parsedContent.attributes.tags.map((tag) => (
              <div key={tag} className="relative rounded-full px-2 py-1">
                {tag}
              </div>
            ))}
            <div className="dimmed-1">
              {postData.parsedContent.attributes.minutesToRead
                ? postData.parsedContent.attributes.minutesToRead + ' minutes'
                : '\u221e' + ' minutes'}
            </div>
          </div>
        </div>
        <Link
          href={`${BLOG_URI}/${postData.filename}`}
          className="relative h-full overflow-hidden rounded-[2rem]"
        ></Link>
      </div>
    </div>
  );
}
