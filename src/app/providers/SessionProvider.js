'use client'
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
      // חידוש הסשן כל 23 שעות (במקום ברירת המחדל של 24)
      refetchInterval={23 * 60 * 60}
      // חידוש הסשן גם כאשר המשתמש חוזר לחלון
      refetchOnWindowFocus={true}
      // שמירת הסשן גם כאשר הדף לא בפוקוס
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}