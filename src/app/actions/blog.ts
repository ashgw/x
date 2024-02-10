'use server';
import { pub, nextJS } from '@/lib/env';
import type { BlogData } from '@/lib/types/mdx';
import { BLOG_API_URI } from '@/lib/constants';
const VALIDATE_EVERY_SECS = 7200;
const SITE_URL =
  nextJS.NEXT_NODE_ENV == 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;

export async function getPost(slug: string) {
  try {
    const response = await fetch(SITE_URL + BLOG_API_URI, {
      cache: 'no-store',
    });

    if (response.status == 200) {
      const result: { blogs: BlogData[] } = await response.json();
      let blogPost = result.blogs.find((p) => p?.filenameSlug === slug);
      return blogPost;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return;
  }
}

export async function getBlogPosts() {
  try {
    const response = await fetch(SITE_URL + BLOG_API_URI, {
      cache: 'no-store',
    });

    if (response.status == 200) {
      const result: { blogs: BlogData[] } = await response.json();
      return result.blogs;
    } else {
      console.error('Error fetching data:', response.status);
      return;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return;
  }
}
