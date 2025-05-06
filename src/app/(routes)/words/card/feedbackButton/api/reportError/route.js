// app/(routes)/word/card/feedbackButton/api/reportError/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { wordNumber, errorDescription } = body;
    
    // וידוא שיש את כל השדות הנדרשים
    if (!wordNumber || !errorDescription) {
      return NextResponse.json(
        { success: false, message: 'חסרים פרטים בטופס' },
        { status: 400 }
      );
    }
    
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
      subject: `דיווח על טעות באתר - מילה מספר ${wordNumber}`,
      text: `התקבל דיווח על טעות באתר:
      
מספר המילה: ${wordNumber}
תיאור הטעות: ${errorDescription}`,
      html: `
        <div dir="rtl">
          <h2>התקבל דיווח על טעות באתר</h2>
          
          <p><strong>מספר המילה:</strong> ${wordNumber}</p>
          
          <p><strong>תיאור הטעות:</strong><br>
          ${errorDescription.replace(/\n/g, '<br>')}</p>
          
          <hr>
          <p>הודעה זו נשלחה באופן אוטומטי מאתר שלי.</p>
        </div>
      `,
    };
    
    // שליחת האימייל
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ 
      success: true, 
      message: 'תודה! הדיווח על הטעות התקבל בהצלחה' 
    });
    
  } catch (error) {
    console.error('שגיאה בשליחת דיווח הטעות:', error);
    return NextResponse.json(
      { success: false, message: 'אירעה שגיאה בשליחת הדיווח' },
      { status: 500 }
    );
  }
}