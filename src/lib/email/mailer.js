// /lib/email/mailer.js
import { resend, emailConfig, createSender } from './config.js';
import { createWelcomeTemplate, welcomeEmailSubject } from './templates/welcome.js';
import { createNotificationTemplate, notificationEmailSubject } from './templates/notification.js';

/**
 * שליחת מייל ברכה למשתמש חדש
 * @param {string} email - כתובת המייל של המשתמש
 * @param {string} name - שם המשתמש
 * @returns {Promise<Object>} תוצאת השליחה
 */
export async function sendWelcomeEmail(email, name) {
  try {
    // בדיקת תקינות הפרמטרים
    if (!email || !name) {
      throw new Error('Email and name are required');
    }

    // יצירת תבנית המייל
    const htmlContent = createWelcomeTemplate(name, email);
    
    // הגדרות המייל
    const emailData = {
      from: createSender(emailConfig.siteName, emailConfig.defaultFrom),
      to: email,
      subject: welcomeEmailSubject,
      html: htmlContent,
    };

    if (emailConfig.enableLogging) {
      console.log(`📧 Sending welcome email to: ${email}`);
    }

    // שליחה דרך Resend
    const result = await resend.emails.send(emailData);

    // לוג הצלחה
    if (emailConfig.enableLogging) {
      console.log(`✅ Welcome email sent successfully to ${email}`, {
        id: result.data?.id,
        recipient: email
      });
    }

    return {
      success: true,
      messageId: result.data?.id,
      recipient: email,
      type: 'welcome'
    };

  } catch (error) {
    // טיפול בשגיאות
    console.error(`❌ Failed to send welcome email to ${email}:`, {
      error: error.message,
      stack: error.stack,
      recipient: email
    });

    // יצירת שגיאה מובנית
    const emailError = new Error(`Failed to send welcome email: ${error.message}`);
    emailError.type = 'EMAIL_ERROR';
    emailError.originalError = error;
    emailError.recipient = email;

    throw emailError;
  }
}

/**
 * שליחת מייל כללי (פונקציית עזר לעתיד)
 * @param {Object} emailOptions - אפשרויות המייל
 * @param {string} emailOptions.to - כתובת המייל של הנמען
 * @param {string} emailOptions.subject - נושא המייל
 * @param {string} emailOptions.html - תוכן HTML של המייל
 * @param {string} [emailOptions.from] - כתובת השולח (אופציונלי)
 * @returns {Promise<Object>} תוצאת השליחה
 */
export async function sendEmail({ to, subject, html, from = null }) {
  try {
    if (!to || !subject || !html) {
      throw new Error('Missing required email parameters: to, subject, html');
    }

    const emailData = {
      from: from || emailConfig.defaultFrom,
      to,
      subject,
      html,
    };

    if (emailConfig.enableLogging) {
      console.log(`📧 Sending email to: ${to}, Subject: ${subject}`);
    }

    const result = await resend.emails.send(emailData);

    if (emailConfig.enableLogging) {
      console.log(`✅ Email sent successfully to ${to}`);
    }

    return {
      success: true,
      messageId: result.data?.id,
      recipient: to
    };

  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    
    const emailError = new Error(`Failed to send email: ${error.message}`);
    emailError.type = 'EMAIL_ERROR';
    emailError.originalError = error;
    emailError.recipient = to;

    throw emailError;
  }
}

/**
 * בדיקת חיבור לשירות המייל
 * @returns {Promise<boolean>} האם החיבור תקין
 */
export async function testEmailConnection() {
  try {
    // ניסיון שליחת מייל בדיקה (לא באמת שולח)
    if (emailConfig.enableLogging) {
      console.log('🔧 Testing email service connection...');
    }

    // כאן אפשר להוסיף בדיקה אמיתית של Resend API
    // לעת עתה רק בדיקה שהמפתח קיים
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not found');
    }

    if (emailConfig.enableLogging) {
      console.log('✅ Email service connection is OK');
    }

    return true;

  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    return false;
  }
}

/**
 * שליחת מייל התראה על סיום מנוי
 * @param {string} email - כתובת המייל של המשתמש
 * @param {string} name - שם המשתמש
 * @param {string} endDate - תאריך סיום המנוי
 * @param {string} subscriptionType - סוג המנוי
 * @returns {Promise<Object>} תוצאת השליחה
 */
export async function sendSubscriptionNotification(email, name, endDate, subscriptionType = 'פרימיום') {
  try {
    // בדיקת תקינות הפרמטרים
    if (!email || !name || !endDate) {
      throw new Error('Email, name and endDate are required');
    }

    // יצירת תבנית המייל
    const htmlContent = createNotificationTemplate(name, email, endDate, subscriptionType);
        
    // הגדרות המייל
    const emailData = {
      from: createSender(emailConfig.siteName, emailConfig.defaultFrom),
      to: email,
      subject: notificationEmailSubject,
      html: htmlContent,
    };

    if (emailConfig.enableLogging) {
      console.log(`📧 Sending subscription notification to: ${email}`);
    }

    // שליחה דרך Resend
    const result = await resend.emails.send(emailData);

    // לוג הצלחה
    if (emailConfig.enableLogging) {
      console.log(`✅ Subscription notification sent successfully to ${email}`, {
        id: result.data?.id,
        recipient: email,
        endDate: endDate
      });
    }

    return {
      success: true,
      messageId: result.data?.id,
      recipient: email,
      type: 'subscription_notification',
      endDate: endDate
    };

  } catch (error) {
    // טיפול בשגיאות
    console.error(`❌ Failed to send subscription notification to ${email}:`, {
      error: error.message,
      stack: error.stack,
      recipient: email,
      endDate: endDate
    });

    // יצירת שגיאה מובנית
    const emailError = new Error(`Failed to send subscription notification: ${error.message}`);
    emailError.type = 'EMAIL_ERROR';
    emailError.originalError = error;
    emailError.recipient = email;
    emailError.endDate = endDate;

    throw emailError;
  }
}