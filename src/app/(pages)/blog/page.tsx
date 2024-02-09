'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/app/components/reusables/loading-screen';
import { ChevronDown } from 'lucide-react';
import type { BlogData } from './_types';
import { notFound } from 'next/navigation';
import BlogPostCard from '@/app/components/blog/blog-card';

enum _Result {
  Found,
  Loading,
  NotFound,
  Error,
}

// TODO: metadata
export default function BlogPage() {
  const [allBlogs, setAllBlogs] = useState<BlogData[]>();
  const [loaded, setLoaded] = useState<_Result>(_Result.Loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/blogs', {
          next: { revalidate: 7200 },
        });
        if (response.status == 200) {
          const result: { blogs: BlogData[] } = await response.json();
          setAllBlogs(result.blogs);
          setLoaded(_Result.Found);
        } else {
          console.error('Error fetching data:', response.status);
          setLoaded(_Result.NotFound);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoaded(_Result.Error);
      }
    };

    fetchData();
  }, []);

  if (loaded === _Result.Loading) {
    return <LoadingScreen />;
  } else if (loaded === _Result.NotFound) {
    return notFound(); // TODO: an actual error UI not notFound();
  } else if (loaded === _Result.Error) {
    return notFound();
  }
  return (
    <section className="mx-auto container sm:max-w-xl md:max-w-3xl lg:max-w-3xl xl:max-w-3xl">
      <h1 className="font-medium text-2xl mb-8 tracking-tighter hidden">
        Unclassified, raw
      </h1>
      {allBlogs!
        .sort(
          // @ts-ignore
          (b1, b2) =>
            new Date(b2.parsedContent.attributes.firstModDate) >
            new Date(b1.parsedContent.attributes.firstModDate)
        )
        .map((post) => (
          <BlogPostCard key={post.filenameSlug} blogData={post}></BlogPostCard>
        ))}
      <div className="flex items-center justify-center animate-bounce m-14 cursor-pointer">
        <ChevronDown />
      </div>
      <div className="w-6 h-2"></div>
    </section>
  );
}
