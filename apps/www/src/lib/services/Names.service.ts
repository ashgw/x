type Optional<T> = T | null;
export const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}$/; // eslint-disable-line no-useless-escape
export const OPTIONAL_PROTOCOL_URL_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/.*)?$/; // eslint-disable-line no-useless-escape

export class NamesService {
  public static matchURL(dto: { url: string }): Optional<RegExpExecArray> {
    return URL_REGEX.exec(dto.url);
  }

  public static getSiteName({ url }: { url: string }): Optional<string> {
    const match = OPTIONAL_PROTOCOL_URL_REGEX.exec(url);
    if (match) {
      const parts = match[1]?.split('.');
      if (!parts) {
        return null;
      }
      const tld = parts.pop();
      const domain = parts.join('.');
      if (!domain || !tld) {
        return null;
      }
      return domain + '.' + tld;
    } else {
      return null;
    }
  }
}
