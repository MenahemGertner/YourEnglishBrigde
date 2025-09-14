// /lib/email/templates/coupon.js
import { emailConfig } from '../config.js';

/**
 * תבנית מייל לשליחת קוד קופון
 * @param {string} couponCode - קוד הקופון
 * @param {Date} expiresAt - תאריך התפוגה
 * @returns {string} HTML של המייל
 */
export function createCouponTemplate(couponCode, expiresAt) {
  // פורמט תאריך יפה בעברית
  const expirationDate = new Intl.DateTimeFormat('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(expiresAt));

  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>קוד הקופון שלך ל${emailConfig.siteName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f8f9fa;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">
            🎟️ קוד הקופון שלך מוכן!
          </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2d3748; font-size: 22px; margin: 0 0 20px 0;">
            שלום,
          </h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            קיבלת הזמנה להירשם ל${emailConfig.siteName}! 
            להלן קוד הקופון שלך לביצוע הרשמה חינמית:
          </p>
          
          <!-- Coupon Code Box -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            <p style="color: rgba(255,255,255,0.8); margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">
              קוד הקופון שלך:
            </p>
            <div style="background: rgba(255,255,255,0.2); border: 2px dashed rgba(255,255,255,0.5); padding: 20px; border-radius: 8px; margin: 10px 0;">
              <span style="color: white; font-size: 32px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 3px;">
                ${couponCode}
              </span>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 12px;">
              העתק את הקוד והדבק אותו בעמוד ההרשמה
            </p>
          </div>
          
          <!-- Instructions -->
          <div style="background-color: #f0f9ff; border-right: 4px solid #0ea5e9; padding: 25px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #0369a1; font-size: 18px; margin: 0 0 15px 0;">
              📋 הוראות שימוש:
            </h3>
            <ol style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0; padding-right: 20px;">
              <li style="margin-bottom: 8px;">היכנס לאתר ${emailConfig.siteName}</li>
              <li style="margin-bottom: 8px;">התחל תהליך הרשמה עם כתובת המייל הזו</li>
              <li style="margin-bottom: 8px;">בחר במסלול "התנסות חינם"</li>
              <li style="margin-bottom: 8px;">הזן את קוד הקופון בחלון שיופיע</li>
              <li>השלם את תהליך ההרשמה</li>
            </ol>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${emailConfig.siteUrl}/registration" 
               style="display: inline-block; background-color: #10b981; color: white; padding: 18px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); transition: all 0.3s;">
              התחל הרשמה כעת
            </a>
          </div>
          
          <!-- Expiration Warning -->
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <span style="font-size: 20px;">⏰</span>
              <div>
                <p style="color: #92400e; font-size: 16px; margin: 0 0 5px 0; font-weight: 600;">
                  חשוב לזכור:
                </p>
                <p style="color: #a16207; font-size: 14px; line-height: 1.5; margin: 0;">
                  קוד זה תקף עד <strong>${expirationDate}</strong> וניתן לשימוש חד-פעמי בלבד.
                  לאחר השימוש או פקיעת התוקף, הקוד לא יהיה זמין יותר.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Support -->
          <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 30px 0 0 0; text-align: center;">
            נתקלת בבעיה? צריך עזרה?<br>
            אל תהסס לפנות אלינו - אנחנו כאן בשבילך!
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #edf2f7; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0 0 8px 0;">
            ${emailConfig.siteName} | <a href="${emailConfig.siteUrl}" style="color: #4299e1; text-decoration: none;">${emailConfig.siteUrl}</a>
          </p>
          <p style="color: #a0aec0; font-size: 11px; margin: 0;">
            קיבלת מייל זה כי ביקשת קוד קופון להרשמה באתר שלנו
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
 * נושא המייל לקופון
 */
export const couponEmailSubject = `🎟️ קוד הקופון שלך ל${emailConfig.siteName} - תוקף מוגבל!`;