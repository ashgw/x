import { BlogData } from '@/app/(pages)/blog/_types';
import Link from 'next/link';
import formatDate from '@/lib/funcs/form-date';
import { BLOG_URI } from '@/lib/constants';

export default function BlogPostCard({ blogData }: { blogData: BlogData }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
      <div className="group flex flex-col gap-4 rounded-[2rem] p-5 transition-all duration-300 shadow hover:shadow-[0px_4px_88px_0px_rgba(255,46,200,0.25)] border border-white/10 ">
        <div className="flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li className="list-disc ml-5 dimmed-0">
              {formatDate(blogData.parsedContent.attributes.firstModDate)}
            </li>
          </div>
          <Link href={`${BLOG_URI}/${blogData.filenameSlug}`}>
            <h2 className="text-2xl font-bold dimmed-4 lg:text-[2.5rem]">
              {blogData.parsedContent.attributes.title}
            </h2>
            <p className="mt-3 dimmed-3 lg:text-xl">
              {blogData.parsedContent.attributes.summary}
            </p>
          </Link>
          <div className="flex flex-wrap items-center gap-[0.625rem] text-sm dimmed-4">
            {blogData.parsedContent.attributes.tags.map((tag) => (
              <div key={tag} className="relative rounded-full px-2 py-1">
                {tag}
              </div>
            ))}
            <div className="dimmed-1">{'13 minutes'}</div>
          </div>
        </div>
        <Link
          href={`${BLOG_URI}/${blogData.filenameSlug}`}
          className="relative h-full overflow-hidden rounded-[2rem]"
        ></Link>
      </div>
    </div>
  );
}
