import { NextRequest, NextResponse } from 'next/server';
import { NewType } from 'ts-roids';
import { GPG_PUBLIC_KEY_EXTERNAL_URL } from '@/lib/constants';

type Key = NewType<'Key', string>;
type Err = string;

export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: NextRequest
): Promise<NextResponse<Key> | NextResponse<Err>> {
  try {
    const res = await fetch(GPG_PUBLIC_KEY_EXTERNAL_URL, {
      method: 'GET',
      mode: 'no-cors',
      next: {revalidate: 36969}
    });
    if (!res.ok) {
      return new NextResponse('Failed to fetch the public key', {
        status: 424,
      });
    }

    const key = (await res.text()) as Key;
    return new NextResponse(key);
  } catch (e) {
    console.log(e);
    return new NextResponse('Something unexpected happened', {
      status: 500,
    });
  }
}
