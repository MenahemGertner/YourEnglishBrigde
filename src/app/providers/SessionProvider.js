// app/providers/SessionProvider.js
'use client';
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
      // חידוש כל 5 דקות (בטוח ויעיל)
      refetchInterval={5 * 60}
      // חידוש כאשר חוזרים לחלון
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}