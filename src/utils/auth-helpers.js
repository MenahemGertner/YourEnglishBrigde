// lib/utils/auth-helpers.js - עדכון עם בדיקת מנוי
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

// פונקציה עזר מתקדמת - בודקת גם מנוי פעיל
export async function requireActiveSubscription() {
  const session = await requireAuth(); // משתמש בפונקציה הבסיסית
  
  // בדיקה שיש מנוי פעיל
  if (!session.user.subscription || session.user.subscription.status !== 'active') {
    throw new Error('נדרש מנוי פעיל');
  }
  
  return session;
}

// פונקציה עזר מתקדמת - בודקת שהמשתמש ניגש למידע שלו בלבד + מנוי פעיל
export async function requireAuthAndOwnership(userId) {
  // בדיקה בסיסית שיש userId
  if (!userId) {
    throw new Error('נדרש מזהה משתמש');
  }
  
  // קבלת הסשן עם בדיקת מנוי פעיל
  const session = await requireActiveSubscription();
  
  // וידוא שהמשתמש ניגש למידע שלו בלבד
  if (session.user.id !== userId) {
    throw new Error('גישה לא מורשית');
  }
  
  return session;
}

// פונקציה עזר חדשה - לבדיקת סוג מנוי מסוים
export async function requireSubscriptionType(requiredType) {
  const session = await requireActiveSubscription();
  
  if (session.user.subscription.subscription_type !== requiredType) {
    throw new Error(`נדרש מנוי מסוג ${requiredType}`);
  }
  
  return session;
}

// פונקציה עזר חדשה - לקבלת מידע מנוי (אפילו אם לא פעיל)
export async function getSubscriptionInfo() {
  const session = await requireAuth();
  return session.user.subscription || null;
}