import { NextResponse } from 'next/server';
import { NewType } from 'ts-roids';

const BOOTSTRAP_SCRIPT =
  'https://raw.githubusercontent.com/AshGw/zshfuncs/main/funcs.zsh' as const;

type Script = NewType<'Key', string>;
type Err = string;
export async function GET(): Promise<NextResponse<Script> | NextResponse<Err>> {
  try {
    const res = await fetch(BOOTSTRAP_SCRIPT, {
      method: 'GET',
      mode: 'no-cors',
      next: { revalidate: 36969 },
    });
    if (!res.ok) {
      return new NextResponse('Failed to fetch the bootstrap script', {
        status: 424,
      });
    }

    const script = await res.text();
    return new NextResponse(script, { status: 200 });
  } catch (e) {
    console.log(e);
    return new NextResponse('Something unexpected happened', {
      status: 500,
    });
  }
}
