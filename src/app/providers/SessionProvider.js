// app/providers/SessionProvider.js
'use client';
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
  refetchInterval={0}
  refetchOnWindowFocus={false}
  refetchWhenOffline={false}
>
      {children}
    </SessionProvider>
  );
}