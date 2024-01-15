import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import type { MDXData, BlogData } from './_types';
import { BLOG_CONTENT_PATH } from '@/lib/constants';

function parseMDX(content: string): MDXData {
  return fm(content) as MDXData;
}

function getMDXFiles(dir: string): Array<string> {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx');
}

function readMDXFile(filePath: string): MDXData {
  let rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseMDX(rawContent);
}

function getMDXData(dir: string): Array<BlogData> {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let parsedContent: MDXData = readMDXFile(path.join(dir, file));
    let filenameSlug: string = path.basename(file, path.extname(file));
    // console.log(parsedContent);
    // console.log(filenameSlug);
    return {
      parsedContent, // will be used to layout the content just right
      filenameSlug, // to be used in automatic routing
    };
  });
}

export function getBlogPosts(): Array<BlogData> {
  return getMDXData(path.join(process.cwd(), BLOG_CONTENT_PATH));
}
