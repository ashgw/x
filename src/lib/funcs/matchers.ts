import type { Optional } from '@/lib/types/global';

export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}$/; // eslint-disable-line no-useless-escape
export const OPTIONAL_PROTOCOL_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/; // eslint-disable-line no-useless-escape

export function matchURL(url: string): Optional<RegExpMatchArray> {
  return url.match(URL_REGEX);
}
