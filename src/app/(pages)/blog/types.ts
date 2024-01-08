export type MDXContent = string;

export type MetaDataAttributes = {
  title: string;
  seoTitle: string;
  summary: string;
  lastModDate: string;
  firstModDate: string;
  isPublic: boolean;
};

export type MDXData = {
  attributes: MetaDataAttributes;
  body: MDXContent;
  bodyBegin: number;
  frontMatter: string;
};

export type BlogData = {
  parsedContent: MDXData;
  filenameSlug: string;
};
