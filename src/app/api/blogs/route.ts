// api/me/route.ts
import { z } from 'zod';
import { NextResponse, NextRequest } from 'next/server';
import { getBlogPosts } from '@/app/api/blogs/content';
import type { BlogData } from '@/lib/types/mdx';
import type { AsyncResponse } from '@/lib/types/global';

export async function GET(): AsyncResponse<BlogData[]> {
  try {
    const data: BlogData[] = await getBlogPosts();
    return NextResponse.json(
      { data },
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
