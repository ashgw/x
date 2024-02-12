import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/api/blogs/content';
import type { BlogData } from '@/lib/types/mdx';
import type { AsyncResponse } from '@/lib/types/global';
import { Status } from '@/lib/constants';

export async function GET(): AsyncResponse<BlogData[]> {
  try {
    const data: BlogData[] = await getBlogPosts();
    return NextResponse.json(
      { data },
      {
        status: Status.OK,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      // TODO: validate query params
      return NextResponse.json(
        { error: 'fix yo shit G' },
        { status: Status.BAD_REQUEST }
      );
    } else {
      return NextResponse.json(
        { error: 'no blogs exist G' },
        { status: Status.NOT_FOUND }
      );
    }
  }
}
