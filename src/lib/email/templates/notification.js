// /lib/email/templates/notification.js
import { emailConfig } from '../config.js';

/**
 * תבנית מייל התראה על סיום מנוי
 * @param {string} userName - שם המשתמש
 * @param {string} userEmail - כתובת המייל של המשתמש
 * @param {string} endDate - תאריך סיום המנוי
 * @param {string} subscriptionType - סוג המנוי
 * @returns {string} HTML של המייל
 */
export function createNotificationTemplate(userName, userEmail, endDate, subscriptionType = 'פרימיום') {
  // המרת תאריך לפורמט יפה
  const formattedDate = new Date(endDate).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>התראה על סיום מנוי - ${emailConfig.siteName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f8f9fa;">
           
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
             
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">
            ⏰ תזכורת מנוי
          </h1>
        </div>
             
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2d3748; font-size: 22px; margin: 0 0 20px 0;">
            שלום ${userName},
          </h2>
               
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            רצינו להזכיר לך שהמנוי ${subscriptionType} שלך ב${emailConfig.siteName} יסתיים בעוד <strong style="color: #e53e3e;">3 ימים</strong>.
          </p>
               
          <!-- Alert Box -->
          <div style="background-color: #fed7d7; border-right: 4px solid #e53e3e; padding: 20px; border-radius: 4px; margin: 0 0 30px 0;">
            <h3 style="color: #c53030; font-size: 18px; margin: 0 0 10px 0;">
              📅 פרטי המנוי:
            </h3>
            <p style="margin: 0; color: #2d3748; font-size: 14px;">
              <strong>סוג מנוי:</strong> ${subscriptionType}<br>
              <strong>תאריך סיום:</strong> ${formattedDate}<br>
              <strong>אימייל:</strong> ${userEmail}
            </p>
          </div>
               
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            כדי להמשיך ליהנות מכל השירותים הפרימיום שלנו ללא הפרעה, 
            אנו מזמינים אותך לחדש את המנוי שלך עוד היום.
          </p>
               
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            <strong>מה קורה אם המנוי יסתיים?</strong><br>
            • הגישה לתוכן הפרימיום תהפך למוגבלת<br>
            • החשבון שלך יישמר והנתונים לא יאבדו<br>
            • תוכל לחדש את המנוי בכל עת
          </p>
               
          <!-- CTA Buttons -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.siteUrl}/subscription/renew" 
               style="display: inline-block; background-color: #38a169; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 10px 10px 0;">
              🔄 חדש מנוי
            </a>
            <a href="${emailConfig.siteUrl}/dashboard" 
               style="display: inline-block; background-color: #4299e1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 10px 10px 0;">
              📊 אזור אישי
            </a>
          </div>
               
          <div style="background-color: #f0fff4; border-right: 4px solid #38a169; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #276749; font-size: 14px; line-height: 1.5; margin: 0;">
              <strong>💡 טיפ:</strong> רוצה להמשיך לקבל התראות? ודא שהמייל שלנו לא מגיע לספאם 
              והוסף אותנו לרשימת הקשר שלך.
            </p>
          </div>
               
          <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
            יש לך שאלות או שאתה צריך עזרה? אנחנו כאן בשביל לעזור!
            פנה אלינו בכל עת.
          </p>
        </div>
             
        <!-- Footer -->
        <div style="background-color: #edf2f7; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0 0 10px 0;">
            ${emailConfig.siteName} | <a href="${emailConfig.siteUrl}" style="color: #4299e1; text-decoration: none;">${emailConfig.siteUrl}</a>
          </p>
          <p style="color: #a0aec0; font-size: 11px; margin: 0;">
            מייל זה נשלח אוטומטית. אל תענה למייל זה.
          </p>
        </div>
             
      </div>
           
      <!-- Bottom Spacing -->
      <div style="height: 40px;"></div>
         
    </body>
    </html>
  `;
}

/**
 * נושא המייל
 */
export const notificationEmailSubject = `⏰ המנוי שלך ב${emailConfig.siteName} יסתיים בעוד 3 ימים`;