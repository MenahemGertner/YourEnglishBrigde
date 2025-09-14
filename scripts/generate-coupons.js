// /scripts/generate-coupons-fixed.js
const path = require('path');
const fs = require('fs');

// טעינת .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

console.log('🚀 Starting coupon generation script...\n');

// יצירת Supabase client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// יצירת nodemailer transporter (אם יש הגדרות מייל)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('📧 Email: Enabled\n');
} else {
  console.log('📧 Email: Disabled (no EMAIL_USER/EMAIL_PASS)\n');
}

/**
 * יצירת קוד קופון רנדומלי
 */
function generateCouponCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * שליחת מייל עם קופון
 */
async function sendCouponEmail(email, couponCode, expiresAt) {
  if (!transporter) {
    console.log(`📧 Would send email to ${email} with coupon ${couponCode}`);
    return;
  }

  const expirationDate = new Date(expiresAt).toLocaleDateString('he-IL');
  
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
    to: email,
    subject: 'קופון כניסה חינם - מאתר Your English Bridge',
    html: `
      <div style="direction: rtl; font-family: Arial, sans-serif;">
        <h2>קופון כניסה מיוחד!</h2>
        <p>שלום,</p>
        <p>אנחנו שמחים לשלוח לך קופון כניסה חינם לאתר Your English Bridge:</p>
        
        <div style="background-color: #f0f8ff; border: 2px dashed #007cba; padding: 20px; margin: 20px 0; text-align: center;">
          <h3 style="color: #007cba; margin: 0; font-size: 24px;">${couponCode}</h3>
        </div>
        
        <p><strong>תוקף הקופון:</strong> עד ${expirationDate}</p>
        <p>קופון זה מקנה לך שימוש בכל האתר למשך 3 חודשים ללא תשלום.</p>
        
        <p>בברכה,<br>צוות האתר</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

/**
 * יצירת קופון בבסיס הנתונים
 */
async function createCoupon(email, expirationDays = 7) {
  try {
    // יצירת קוד ייחודי
    let couponCode;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      couponCode = generateCouponCode();
      
      const { data: existingCoupon, error } = await supabaseAdmin
        .from('coupons')
        .select('id')
        .eq('code', couponCode)
        .single();

      if (error && error.code === 'PGRST116') {
        isUnique = true;
      } else if (error) {
        throw new Error(`Error checking coupon: ${error.message}`);
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Could not generate unique coupon code');
    }

    // חישוב תאריך תפוגה
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expirationDays);

    // יצירת הקופון
    const { data: newCoupon, error: insertError } = await supabaseAdmin
      .from('coupons')
      .insert([
        {
          code: couponCode,
          email: email.toLowerCase(),
          expires_at: expiresAt.toISOString(),
          created_by: 'admin',
          is_used: false
        }
      ])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create coupon: ${insertError.message}`);
    }

    return newCoupon;

  } catch (error) {
    throw error;
  }
}

/**
 * יצירת קופונים לרשימת מיילים
 */
async function generateAndSendCoupons(emails, expirationDays = 7) {
  const results = [];

  for (const email of emails) {
    try {
      console.log(`🔄 Processing: ${email}`);
      
      // בדיקת תקינות מייל
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // בדיקה אם יש כבר קופון פעיל
      const { data: existingActiveCoupon, error: checkError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw new Error(`Error checking existing coupon: ${checkError.message}`);
      }

      if (existingActiveCoupon) {
        results.push({
          email,
          success: false,
          error: 'Active coupon already exists',
          couponCode: existingActiveCoupon.code
        });
        continue;
      }

      // יצירת קופון חדש
      const coupon = await createCoupon(email, expirationDays);

      // שליחת מייל
      await sendCouponEmail(email, coupon.code, coupon.expires_at);

      results.push({
        email,
        success: true,
        couponCode: coupon.code,
        expiresAt: coupon.expires_at
      });

      console.log(`✅ Success: ${email} - ${coupon.code}`);

    } catch (error) {
      console.error(`❌ Failed: ${email} - ${error.message}`);
      results.push({
        email,
        success: false,
        error: error.message
      });
    }

    // השהייה קצרה
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * פונקציה ראשית
 */
async function main() {
  try {
    // רשימת המיילים
    const emails = [
      'meni1547@gmail.com'
    ];

    // יצירת קופונים
    const results = await generateAndSendCoupons(emails, 7);

    // סיכום
    console.log('\n📊 SUMMARY');
    console.log('='.repeat(40));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (successful.length > 0) {
      console.log('\n🎉 Successful coupons:');
      successful.forEach(r => {
        console.log(`  ${r.email} → ${r.couponCode}`);
      });
    }

    if (failed.length > 0) {
      console.log('\n💥 Failed attempts:');
      failed.forEach(r => {
        console.log(`  ${r.email} → ${r.error}`);
      });
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// הרצת הסקריפט
if (require.main === module) {
  main();
}

module.exports = { generateAndSendCoupons, createCoupon };