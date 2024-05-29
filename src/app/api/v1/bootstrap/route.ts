import { NextResponse } from 'next/server';
import { NewType } from 'ts-roids';

// TODO: KEEP TRACK OF STABLE COMMITS, DON'T JUST FETCH OFF OF MAIN
const BOOTSTRAP_SCRIPT =
  'https://raw.githubusercontent.com/AshGw/dotfiles/main/install/bootstrap' as const;

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

    const script = (await res.text()) as Script;
    return new NextResponse(script, { status: 200 });
  } catch (e) {
    console.log(e);
    return new NextResponse('Something unexpected happened', {
      status: 500,
    });
  }
}
