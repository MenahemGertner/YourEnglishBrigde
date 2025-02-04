'use client'
import { useSession } from 'next-auth/react'

export default function GuestContent({ children, fallback = null }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>טוען...</div>
  }

  // מציג את התוכן רק אם המשתמש אינו מחובר
  if (!session) {
    return <>{children}</>
  }

  // מציג את ה-fallback (או כלום) אם המשתמש מחובר
  return fallback
}