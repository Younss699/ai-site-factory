import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(req: NextRequest) {
const res = NextResponse.next();
const csp = [
"default-src 'self'",
"script-src 'self' 'unsafe-inline'", // pas de scripts tiers
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
"img-src 'self' data:",
"font-src 'self' https://fonts.gstatic.com",
"connect-src 'self'", // API même domaine
"frame-ancestors 'none'",
"base-uri 'self'",
"form-action 'self'"
].join('; ');
res.headers.set('Content-Security-Policy', csp);
res.headers.set('X-Frame-Options', 'DENY');
res.headers.set('X-Content-Type-Options', 'nosniff');
res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), 
camera=()');
