import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    
    // בדיקת שגיאות בטוקן
    if (token?.error === "RefreshAccessTokenError") {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // בדיקת קיום טוקן תקף
        return !!token && !token.error;
      }
    },
  }
);

export const config = {
  matcher: [
    '/words/navigation/api/:path*',
    '/registration/api/:path*',
    '/practiceSpace/api/:path*',
    '/api/auth/:path*'
  ]
};