'use server';
import { promises as fsPromises } from 'fs';
import path from 'path';
import fm from 'front-matter';
import type { MDXData } from '@/lib/types/mdx';
import type { Maybe } from '@/lib/types/global';
import { BLOG_CONTENT_PATH } from '@/lib/constants';

const MDX_DIR = path.join(process.cwd(), BLOG_CONTENT_PATH);

export type _MaybeBlogData = {
  parsedContent: Maybe<MDXData>;
  filenameSlug: string;
};

function parseMDX(content: string) {
  return fm(content) as MDXData;
}

async function getMDXFileNames(dir: string) {
  try {
    const files = await fsPromises.readdir(dir);
    const names = files.filter((file) => path.extname(file) === '.mdx');
    return names;
  } catch (error) {
    console.error('Error reading directory:', error);
    // TODO: handle error
    return;
  }
}

async function readMDXFile(filePath: string) {
  try {
    let rawContent = await fsPromises.readFile(filePath, 'utf-8');
    return parseMDX(rawContent);
  } catch (error) {
    console.error('Error reading MDX file:', error);
    return;
  }
}

async function getMDXData(dir: string) {
  let mdxFiles = await getMDXFileNames(dir);
  if (mdxFiles === undefined) {
    return;
  }
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

export async function getBlogPosts() {
  return getMDXData(MDX_DIR);
}
