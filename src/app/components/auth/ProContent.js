'use client'
import { useSession } from 'next-auth/react'

export default function ProContent({ children, fallback = null }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>טוען...</div>
  }

  if (!session) {
    return fallback
  }

  return <>{children}</>
}