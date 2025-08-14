import { NextResponse } from 'next/server';
import { clientConfig } from '@/config';

export function GET() {
  const target = new URL(
    '/?utm_source=instagram&utm_medium=bio&utm_campaign=profile',
    clientConfig.DOMAIN
  );
  return NextResponse.redirect(target, 301);
}
