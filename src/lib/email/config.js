// /lib/email/config.js
import { Resend } from 'resend';

// בדיקה שמפתח ה-API קיים
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required in environment variables');
}

// יצירת instance של Resend
export const resend = new Resend(process.env.RESEND_API_KEY);

// הגדרות כלליות למיילים
export const emailConfig = {
  // כתובת השולח הדיפולטית
  defaultFrom: process.env.FROM_EMAIL || 'noreply@Your-English-Bridge.com',
  
  // שם האתר (יופיע בשורת הנושא)
  siteName: process.env.SITE_NAME || 'Your English Bridge',
  
  // URL של האתר (לקישורים במיילים)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  
  // הגדרות timeout
  timeout: 10000, // 10 seconds
  
  // האם לשמור logs מפורטים
  enableLogging: process.env.NODE_ENV === 'development'
};

// פונקציית עזר ליצירת כתובת שולח עם שם
export function createSender(name, email = emailConfig.defaultFrom) {
  return `${name} <${email}>`;
}