import { matchURL } from './matchers';

export type Where = 'next' | 'previous';

/*
    MDX blogs that have the metadata attribute `isSequel` should have 
    the format ^.*-part-(\d+).mdx for this to work properly, 
*/
export function whereToGo(href: string, where: Where): string {
  if (!matchURL(href)) {
    return '#';
  }
  const regex: RegExp = /-part-(\d+)/;
  const match: RegExpMatchArray | null = href.match(regex);
  if (match) {
    let goTo = parseInt(match[1]) + 1;
    if (where === 'previous') {
      goTo = goTo - 2;
    }
    return href.replace(regex, `part-${goTo}`);
  }
  return '#';
}

