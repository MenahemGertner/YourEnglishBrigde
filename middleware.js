import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth?.token;
    
    // בדיקת שגיאות בטוקן
    if (token?.error === "RefreshAccessTokenError") {
      console.log('Refresh token error - redirecting to signin');
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }

    // בדיקה אם הטוקן קרוב לפוג תוקף
    if (token?.accessTokenExpires) {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = token.accessTokenExpires - currentTime;
      
      // אם הטוקן פג תוקף לגמרי
      if (timeUntilExpiry <= 0) {
        console.log('Access token expired - redirecting to signin');
        return NextResponse.redirect(new URL('/api/auth/signin', req.url));
      }
      
      // אם הטוקן קרוב לפוג תוקף (פחות משעה), הוסף header מיוחד
      if (timeUntilExpiry < 3600) { // שעה אחת
        const response = NextResponse.next();
        response.headers.set('X-Token-Refresh-Needed', 'true');
        return response;
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // בדיקת קיום טוקן תקף
        const isValid = !!token && !token.error;
        
        // רישום לוג למעקב
        if (!isValid) {
          console.log('Authorization failed:', { 
            hasToken: !!token, 
            error: token?.error,
            url: req.url 
          });
        }
        
        return isValid;
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