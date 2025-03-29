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
  category: "software" | "health" | "philosophy";
}

export interface MdxFileData {
  attributes: MetaDataAttributes;
  body: string;
  bodyBegin: number;
  frontMatter: string;
}

export interface PostData {
  parsedContent: MdxFileData;
  filename: string;
}
