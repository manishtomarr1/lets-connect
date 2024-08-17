import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const token = req.cookies.get('token');

  console.log('Token:', token); // Debugging: Log the token

  if (!token) {
    console.log('No token found, redirecting to login.'); // Debugging: Log if no token is found
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token is valid:', decoded); // Debugging: Log if the token is valid
    return NextResponse.next();
  } catch (err) {
    console.error('Token verification failed:', err); // Debugging: Log verification failure
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
