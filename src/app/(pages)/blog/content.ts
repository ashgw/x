'use server';
import { promises as fsPromises } from 'fs';

import path from 'path';
import fm from 'front-matter';
import type { MDXData, BlogData } from '@/lib/types/mdx';
import { BLOG_CONTENT_PATH } from '@/lib/constants';
import type { Maybe } from '@/lib/types/global';

function parseMDX(content: string): MDXData {
  return fm(content) as MDXData;
}

async function getMDXFiles(dir: string): Promise<string[]> {
  try {
    const files = await fsPromises.readdir(dir);
    const mdxFiles = files.filter((file) => path.extname(file) === '.mdx');
    return mdxFiles;
  } catch (error) {
    console.error('Error reading directory:', error);
    // TODO: handle error
    throw error;
  }
}

async function readMDXFile(filePath: string): Promise<MDXData> {
  try {
    const rawContent = await fsPromises.readFile(filePath, 'utf-8');
    return parseMDX(rawContent);
  } catch (error) {
    // TODO: hadnle err
    console.error('Error reading MDX file:', error);
    throw new Error();
  }
}
async function getMDXData(dir: string): Promise<BlogData[]> {
  const mdxFiles = await getMDXFiles(dir);

  const blogDataPromises = mdxFiles.map(async (file) => {
    const parsedContent = await readMDXFile(path.join(dir, file));
    const filenameSlug: string = path.basename(file, path.extname(file));
    return {
      parsedContent,
      filenameSlug,
    };
  });

  return Promise.all(blogDataPromises);
}

export async function getBlogPosts(): Promise<BlogData[]> {
  return getMDXData(path.join(process.cwd(), BLOG_CONTENT_PATH));
}

export async function getBlogPost(slug: string): Promise<Maybe<BlogData>> {
  // TODO: optimize
  const blogs = await getBlogPosts();
  const blogPost = blogs.find((p) => p?.filenameSlug === slug);
  return blogPost;
}
