import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  
  // Clear the cookie
  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
