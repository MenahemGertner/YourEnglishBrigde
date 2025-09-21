// lib/utils/auth-helpers.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// פונקציה עזר בסיסית - רק בודקת שיש משתמש מחובר
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error('נדרש אימות');
  }
  
  return session;
}

// פונקציה עזר מתקדמת - בודקת שהמשתמש ניגש למידע שלו בלבד
export async function requireAuthAndOwnership(userId) {
  // בדיקה בסיסית שיש userId
  if (!userId) {
    throw new Error('נדרש מזהה משתמש');
  }

  // קבלת הסשן
  const session = await requireAuth(); // משתמש בפונקציה הבסיסית
  
  // וידוא שהמשתמש ניגש למידע שלו בלבד
  if (session.user.id !== userId) {
    throw new Error('גישה לא מורשית');
  }
  
  return session;
}