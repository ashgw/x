import fs from 'fs';
import path from 'path';
import fm from 'front-matter';
import { MDXData, BlogData } from './types';

function parseMDX(content: string): MDXData {
  try {
    return fm(content) as MDXData;
  } catch (err) {
    console.error(err);
    // TODO: fix this shit here
    throw err;
  }
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
    console.log(parsedContent);
    console.log(filenameSlug);
    return {
      parsedContent, // will be used to layout the content just right
      filenameSlug, // to be used in automatic routing
    };
  });
}

export function getBlogPosts(): Array<BlogData> {
  return getMDXData(path.join(process.cwd(), 'content'));
}

let blogPosts = getBlogPosts();

// Use map to transform each element in the array
let transformedPosts = blogPosts.map((post) => {
  let zz = post.parsedContent;
  let aa = post.filenameSlug;
  // Your transformation logic here
  return { zz, aa };
});

// You can now use transformedPosts as needed
console.log(transformedPosts);
