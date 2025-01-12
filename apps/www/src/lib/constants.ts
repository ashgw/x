import { env } from '~/env';

import { NamesService } from './services/Names.service';

export const BUSINESS_CONTENT_PATH = '/public/services';
export const EMAIL = 'contact@ashgw.me';

export const SITE_NAME =
  NamesService.getSiteName({
    url: env.NEXT_PUBLIC_WWW_URL,
  }) ?? '';

export const REPO_SOURCE = 'https://github.com/ashgw/ashgw.me';
export const CREATOR = 'Ashref Gwader';
export const BOOKING_LINK = 'https://cal.com/ashgw/30min';
