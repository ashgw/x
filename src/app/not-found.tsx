import { BlogData } from './(pages)/blog/_types';
import Image from 'next/image';
import Link from 'next/link';
import formatDate from '@/lib/funcs/form-date';
interface FeaturedBlogPostProps {
  blogData: BlogData;
}
export default function FeaturedBlogPost({ blogData }: FeaturedBlogPostProps) {
  const tags = ['rust', 'axum', 'sqlx'];

  return (
    <div className="mx-auto mt-8 w-full max-w-[1280px] px-5 sm:mt-24 sm:px-10">
      <div className="group grid gap-4 rounded-[2rem] border border-black/10 p-5 transition-all duration-300 hover:shadow-[0px_4px_88px_0px_rgba(252,84,12,0.25)] dark:border-white/10 md:grid-cols-2 md:items-center md:gap-5 md:p-8">
        <div className="grid gap-4 lg:gap-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <li className="list-disc dimmed0">
              {formatDate(blogData.parsedContent.attributes.firstModDate)}
            </li>
          </div>
          <Link href={`/blog/${blogData.filenameSlug}`}>
            <h2 className="text-2xl font-bold dimmed2 lg:text-[2.5rem]">
              {blogData.parsedContent.attributes.title}
            </h2>
            <p className="mt-3 dimmed lg:text-xl">
              {blogData.parsedContent.attributes.summary}
            </p>
          </Link>
          <div className="flex flex-wrap items-center gap-[0.625rem] text-sm ease-on-eye">
            {tags.map((tag) => (
              <div key={tag} className="relative rounded-full px-2 py-1">
                {tag}
              </div>
            ))}
            <div className="dimmed0">{'13 minutes'}</div>
          </div>
        </div>
        <Link
          href={`/blog/${blogData.filenameSlug}`}
          className="relative h-full overflow-hidden rounded-[2rem]"
        ></Link>
      </div>
    </div>
  );
}
