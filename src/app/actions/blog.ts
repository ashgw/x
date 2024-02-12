'use server';

import { pub, nextJS } from '@/lib/env';
import type { BlogData } from '@/lib/types/mdx';
import { BLOG_API_URI } from '@/lib/constants';
import type { Maybe } from '@/lib/types/global';
import { Status } from '@/lib/constants';

const SITE_URL =
  nextJS.NEXT_NODE_ENV == 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;

export async function getPost(slug: string): Promise<Maybe<BlogData>> {
  try {
    const response = await fetch(SITE_URL + BLOG_API_URI, {
      cache: 'no-store',
    });

    if (response.status == Status.OK) {
      const result = (await response.json()) as { data: BlogData[] };
      const blogPost = result.data.find((p) => p?.filenameSlug === slug);
      return blogPost;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Fix your schema', error);
    return;
  }
}

export async function getBlogPosts(): Promise<Maybe<BlogData[]>> {
  try {
    const response = await fetch(SITE_URL + BLOG_API_URI, {
      cache: 'no-store', // somehow Next bugs on caches
    });

    if (response.status == Status.OK) {
      const result = (await response.json()) as { data: BlogData[] };
      return result.data;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Fix your schema', error);
    return;
  }
}
