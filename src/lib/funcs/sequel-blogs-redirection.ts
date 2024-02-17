import { matchURL } from './parsers';
export type Where = 'next' | 'previous';

/*
    MDX blogs that have the metadata attribute `isSequel` should have 
    the format ^.*-part-(\d+).mdx for this to work properly, 
*/
export function whereToGo(href: string, where: Where): string {
  if (!matchURL(href)) {
    return '#';
  }
  const match = href.match(/-part-(\d+)/);
  if (match) {
    let goTo = parseInt(match[1]) + 1;
    if (where === 'previous') {
      goTo = goTo - 2;
    }
    return href.replace(regex, `part-${goTo}`);
  }
  return '#';
}

console.log(whereToGo('http://localhost-part-5', 'previous')); // http://localhostpart-4
console.log(whereToGo('http://localhost-part-5', 'next')); // http://localhostpart-6
console.log(whereToGo('https://localhost-part-69', 'previous')); // # https://localhostpart-68
console.log(whereToGo('http://localhost-part98', 'previous')); // #
console.log(whereToGo('http//localhost-part98', 'previous')); // #
console.log(whereToGo('ht-art-5', 'previous')); // #
console.log(whereToGo('httppart5', 'next')); // #
console.log(whereToGo('httppart-5', 'next')); // #
