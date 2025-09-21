// components/auth/ProContent.js
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProContent({ 
  children, 
  fallback = null,
  redirectTo = '/api/auth/signin',
  requireAuth = true 
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // אם נדרש אימות והמשתמש לא מחובר
    if (requireAuth && status === 'unauthenticated') {
      router.push(redirectTo);
    }
  }, [status, requireAuth, redirectTo, router]);

  // טעינה
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">טוען...</div>
      </div>
    );
  }

  // לא מחובר
  if (requireAuth && !session) {
    return fallback || (
      <div className="text-center p-8">
        <p className="text-lg mb-4">נדרש להתחבר כדי לצפות בתוכן זה</p>
        <button 
          onClick={() => router.push('/api/auth/signin')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          התחבר
        </button>
      </div>
    );
  }

  return <>{children}</>;
}