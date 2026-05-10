import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  const path = request.nextUrl.searchParams.get('path');
  const tag = request.nextUrl.searchParams.get('tag');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  }

  return NextResponse.json({ error: 'path or tag required' }, { status: 400 });
}
