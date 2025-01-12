'use server';

import fm from 'front-matter';
import { promises as fsPromises } from 'fs';
import path from 'path';

import type { MDXData, PostData } from './mdx';

type Optional<T> = T | null;
type MaybeUndefined<T> = T | undefined;

function parseMDX(content: string): MDXData {
  return fm(content) as MDXData;
}

async function getMDXFiles({
  dir,
}: {
  dir: string;
}): Promise<Optional<string[]>> {
  try {
    const files = await fsPromises.readdir(dir);
    const mdxFiles = files.filter((file) => path.extname(file) === '.mdx');
    return mdxFiles;
  } catch (error) {
    console.error('Error reading MDX files:', error);
    return null;
  }
}

async function readMDXFile({
  filePath,
}: {
  filePath: string;
}): Promise<Optional<MDXData>> {
  try {
    const rawContent = await fsPromises.readFile(filePath, 'utf-8');
    return parseMDX(rawContent);
  } catch (error) {
    console.error('Error reading MDX file:', error);
    return null;
  }
}
async function getMDXData({
  dir,
}: {
  dir: string;
}): Promise<Optional<PostData[]>> {
  const mdxFiles = await getMDXFiles({ dir });
  if (mdxFiles === null) {
    return null;
  }
  const blogDataPromises = mdxFiles.map(async (file) => {
    const parsedContent = await readMDXFile({ filePath: path.join(dir, file) });
    const filename: string = path.basename(file, path.extname(file));
    return {
      parsedContent,
      filename,
    };
  });

  const blogData = await Promise.all(blogDataPromises);
  return blogData as PostData[];
}

export async function getBlogPosts({
  blogDirectory,
}: {
  blogDirectory: string;
}): Promise<Optional<PostData[]>> {
  return getMDXData({ dir: path.join(process.cwd(), blogDirectory) });
}

export async function getBusinessPosts({
  businessDirectory,
}: {
  businessDirectory: string;
}): Promise<Optional<PostData[]>> {
  return getMDXData({ dir: path.join(process.cwd(), businessDirectory) });
}

export async function getBlogPost({
  blogDirectory,
  slug,
}: {
  slug: string;
  blogDirectory: string;
}): Promise<Optional<PostData>> {
  const blogs = await getBlogPosts({ blogDirectory });
  if (blogs === null) {
    return null;
  }
  const blogPost: MaybeUndefined<PostData> = blogs.find(
    (p) => p.filename === slug
  );
  if (blogPost === undefined) {
    return null;
  }
  return blogPost;
}

export async function getBusinessPost({
  slug,
  businessDirectory,
}: {
  slug: string;
  businessDirectory: string;
}): Promise<Optional<PostData>> {
  const blogs = await getBusinessPosts({ businessDirectory });
  if (!blogs) {
    return null;
  }
  const blogPost: MaybeUndefined<PostData> = blogs.find(
    (p) => p.filename === slug
  );
  if (blogPost === undefined) {
    return null;
  }
  return blogPost;
}
