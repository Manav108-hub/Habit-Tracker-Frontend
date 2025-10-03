// middleware.ts - Remove or disable auth checks
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function middleware(request: NextRequest) {
  // Don't check authentication in middleware - handled client-side
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty - no routes protected by middleware
};