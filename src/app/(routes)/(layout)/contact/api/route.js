import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // יצירת טרנספורטר של nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    
    // הגדרת תוכן האימייל
    const mailOptions = {
        from: `"אתר שלי" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `פנייה חדשה מ Your English Bridge: ${subject}`,
      text: `התקבלה פנייה חדשה מהאתר:
      
שם: ${name}
אימייל: ${email}
נושא: ${subject}
הודעה: ${message}`,
      html: `
        <div dir="rtl">
          <h2>התקבלה פנייה חדשה מהאתר</h2>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>אימייל:</strong> ${email}</p>
          <p><strong>נושא:</strong> ${subject}</p>
          <p><strong>הודעה:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    };
    
    // שליחת האימייל
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true, message: 'ההודעה נשלחה בהצלחה' });
  } catch (error) {
    console.error('שגיאה בשליחת האימייל:', error);
    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה בשליחת ההודעה' },
      { status: 500 }
    );
  }
}