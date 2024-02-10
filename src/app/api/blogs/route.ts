// api/me/route.ts
import { z } from 'zod';
import { NextResponse, NextRequest } from 'next/server';
import { getBlogPosts } from '@/app/api/blogs/content';
import type { BlogData } from '@/lib/types/mdx';
const ageSchema = z.number().min(5).max(10); // later, no time now

export async function GET() {
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
