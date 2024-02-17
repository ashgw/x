import type { Optional } from '@/lib/types/global';

export function matchURL(url: string): Optional<RegExpMatchArray> {
  return url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/); // eslint-disable-line no-useless-escape
}
