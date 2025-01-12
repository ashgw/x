export type MDXContent = string;

export interface MetaDataAttributes {
  title: string;
  seoTitle: string;
  summary: string;
  firstModDate: string;
  lastModDate: string;
  isReleased: boolean;
  isSequel: boolean;
  minutesToRead: string | number;
  tags: string[];
}

export interface MDXData {
  attributes: MetaDataAttributes;
  body: MDXContent;
  bodyBegin: number;
  frontMatter: string;
}

export interface PostData {
  parsedContent: MDXData;
  filename: string;
}
