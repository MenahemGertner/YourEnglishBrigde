// app/providers/SessionProvider.js
'use client';
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
  refetchInterval={60} // כל דקה במקום 5 דקות
  refetchOnWindowFocus={true}
  refetchWhenOffline={false}
>
      {children}
    </SessionProvider>
  );
}