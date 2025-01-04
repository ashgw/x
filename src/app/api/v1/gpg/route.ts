import { PUBLIC_CONTENT_SOURCE } from '@/lib/constants';
import { NextRequest, NextResponse } from 'next/server';
import { NewType } from 'ts-roids';

export const runtime = 'edge';

type Key = NewType<'Key', string>;
type Err = string;

const GPG_FILENAME = 'gpg.asc';
export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest
): Promise<NextResponse<Key> | NextResponse<Err>> {
  try {
    const res = await fetch(PUBLIC_CONTENT_SOURCE + GPG_FILENAME, {
      method: 'GET',
      mode: 'no-cors',
      next: { revalidate: 36969 },
    });
    if (!res.ok) {
      return new NextResponse('Failed to fetch the public key', {
        status: 424,
      });
    }

    const key = await res.text();
    return new NextResponse(key);
  } catch (e) {
    console.log(e);
    return new NextResponse('Something unexpected happened', {
      status: 500,
    });
  }
}
