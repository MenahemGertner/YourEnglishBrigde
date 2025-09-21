// middleware.js
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // כל הלוגיקה כאן מטופלת על ידי withAuth
    // פשוט מחזיר next() עבור requests מאומתים
    return;
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // פשוט בודק שיש טוקן תקף
        return !!token;
      }
    },
  }
);

// מגן רק על ה-API routes שצריכים אימות
export const config = {
  matcher: [
    '/api/words/:path*',
    '/api/registration/:path*', 
    '/api/practice/:path*',
    // הוסף כאן routes נוספים שצריכים הגנה
  ]
};