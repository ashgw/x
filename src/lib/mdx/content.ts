'use server';

import { BLOG_CONTENT_PATH, BUSINESS_CONTENT_PATH } from '@/lib/constants';
import type { MDXData, PostData } from '@/lib/types/mdx';
import fm from 'front-matter';
import { promises as fsPromises } from 'fs';
import path from 'path';
import type { MaybeUndefined, Optional } from 'ts-roids';

function parseMDX(content: string): MDXData {
  return fm(content) as MDXData;
}

async function getMDXFiles(dir: string): Promise<Optional<string[]>> {
  try {
    const files = await fsPromises.readdir(dir);
    const mdxFiles = files.filter((file) => path.extname(file) === '.mdx');
    return mdxFiles;
  } catch (error) {
    console.error('Error reading MDX files:', error);
    return null;
  }
}

async function readMDXFile(filePath: string): Promise<Optional<MDXData>> {
  try {
    const rawContent = await fsPromises.readFile(filePath, 'utf-8');
    return parseMDX(rawContent);
  } catch (error) {
    console.error('Error reading MDX file:', error);
    return null;
  }
}
async function getMDXData(dir: string): Promise<Optional<PostData[]>> {
  const mdxFiles = await getMDXFiles(dir);
  if (mdxFiles === null) {
    return null;
  }
  const blogDataPromises = mdxFiles.map(async (file) => {
    const parsedContent = await readMDXFile(path.join(dir, file));
    const filename: string = path.basename(file, path.extname(file));
    return {
      parsedContent,
      filename,
    };
  });

  const blogData = await Promise.all(blogDataPromises);
  return blogData as PostData[];
}

export async function getBlogPosts(
  blogDirectory: string = BLOG_CONTENT_PATH
): Promise<Optional<PostData[]>> {
  return getMDXData(path.join(process.cwd(), blogDirectory));
}

export async function getBusinessPosts(
  businessDirectory: string = BUSINESS_CONTENT_PATH
): Promise<Optional<PostData[]>> {
  return getMDXData(path.join(process.cwd(), businessDirectory));
}

export async function getBlogPost(slug: string): Promise<Optional<PostData>> {
  const blogs = await getBlogPosts();
  if (blogs === null) {
    return null;
  }
  const blogPost: MaybeUndefined<PostData> = blogs.find(
    (p) => p?.filename === slug
  );
  if (blogPost === undefined) {
    return null;
  }
  return blogPost;
}

export async function getBusinessPost(
  slug: string
): Promise<Optional<PostData>> {
  const blogs = await getBusinessPosts();
  if (!blogs) {
    return null;
  }
  const blogPost: MaybeUndefined<PostData> = blogs.find(
    (p) => p?.filename === slug
  );
  if (blogPost === undefined) {
    return null;
  }
  return blogPost;
}
