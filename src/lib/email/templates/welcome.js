// /lib/email/templates/welcome.js
import { emailConfig } from '../config.js';

/**
 * תבנית מייל ברכה למשתמש חדש
 * @param {string} userName - שם המשתמש
 * @param {string} userEmail - כתובת המייל של המשתמש
 * @returns {string} HTML של המייל
 */
export function createWelcomeTemplate(userName, userEmail) {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ברוכים הבאים ל${emailConfig.siteName}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; background-color: #f8f9fa;">
      
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 600;">
            🎉 ברוכים הבאים!
          </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #2d3748; font-size: 22px; margin: 0 0 20px 0;">
            שלום ${userName},
          </h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
            אנחנו שמחים לקבל אותך כחבר חדש ב${emailConfig.siteName}!
            החשבון שלך נרשם בהצלחה וכעת אתה יכול להתחיל להשתמש בכל השירותים שלנו.
          </p>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            פרטי החשבון שלך:
          </p>
          
          <!-- User Info Box -->
          <div style="background-color: #f7fafc; border-right: 4px solid #4299e1; padding: 20px; border-radius: 4px; margin: 0 0 30px 0;">
            <p style="margin: 0; color: #2d3748; font-size: 14px;">
              <strong>שם:</strong> ${userName}<br>
              <strong>אימייל:</strong> ${userEmail}
            </p>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${emailConfig.siteUrl}" 
               style="display: inline-block; background-color: #4299e1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
              היכנס לאתר
            </a>
          </div>
          
          <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
            אם יש לך שאלות או שאתה צריך עזרה, אל תהסס לפנות אלינו.
            אנחנו כאן בשביל לעזור!
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #edf2f7; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px; margin: 0;">
            ${emailConfig.siteName} | <a href="${emailConfig.siteUrl}" style="color: #4299e1; text-decoration: none;">${emailConfig.siteUrl}</a>
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
export const welcomeEmailSubject = `ברוכים הבאים ל${emailConfig.siteName}! 🎉`;