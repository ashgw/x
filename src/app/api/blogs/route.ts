// api/me/route.ts
import { z } from 'zod';
import { NextResponse, NextRequest } from 'next/server';
import { getBlogPosts } from '@/app/api/blogs/content';
import type { BlogData } from '@/lib/types/mdx';
import type { Maybe } from '@/lib/types/global';
const ageSchema = z.number().min(5).max(10); // later, no time now

type BlogsJSON = {
  blogs: BlogData[];
};
type Err = {
  error: string;
};

type AsyncResponse<Ok, Err> = Promise<
  NextResponse<Ok> | NextResponse<Maybe<Err>>
>;

export async function GET(): AsyncResponse<BlogsJSON, Err> {
  try {
    const blogs: BlogData[] = await getBlogPosts();
    return NextResponse.json(
      { blogs },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'schema fumbled' }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'no blogs exist G' }, { status: 400 });
    }
  }
}
