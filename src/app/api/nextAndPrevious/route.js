import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function calculateNextReview(level, currentIndex) {
  if (level === 1) return null;
  if (isNaN(currentIndex)) return null;
  
  const intervals = {
    2: 10,
    3: 5,
    4: 3
  };
  
  const interval = intervals[level];
  if (!interval) return null;
  
  return currentIndex + interval;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawIndex = searchParams.get('index');
    const category = searchParams.get('category') || '500';
    const direction = searchParams.get('direction');

    if (!rawIndex || !category || !direction) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const index = parseInt(rawIndex);
    if (isNaN(index)) {
      return NextResponse.json(
        { error: 'Invalid index parameter' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const { db } = await connectToDatabase();
    const collection = db.collection(category);

    // בדוק אם זו המילה האחרונה ברשימה
    const totalCount = await collection.countDocuments();
    const isLastWord = index >= totalCount - 1;

    if (session?.user?.email && (direction === 'next' || isLastWord)) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userData) {
        // קבל את כל המילים לחזרה
        const { data: reviewWords } = await supabase
          .from('user_words')
          .select('*')
          .eq('user_id', userData.id)
          .gt('level', 1)
          .order('level', { ascending: false })
          .order('next_review', { ascending: true });

        let dueReviewWord = null;

        if (isLastWord) {
          // אם זו המילה האחרונה, בדוק אם יש מילים לחזרה
          dueReviewWord = reviewWords?.find(word => word.word_id !== index);
        } else {
          // במהלך הרשימה הרגיל, בדוק את next_review
          dueReviewWord = reviewWords?.find(word => 
            word.next_review <= index && word.word_id !== index
          );
        }

        if (dueReviewWord) {
          const reviewWordData = await collection.findOne({ 
            index: dueReviewWord.word_id 
          });

          if (reviewWordData) {
            // עדכן את זמן החזרה הבא
            const nextReview = calculateNextReview(dueReviewWord.level, index);
            
            await supabase
              .from('user_words')
              .update({
                next_review: nextReview,
                last_seen: new Date().toISOString(),
                current_sequence_position: index
              })
              .eq('user_id', userData.id)
              .eq('word_id', dueReviewWord.word_id);

            return NextResponse.json({
              ...reviewWordData,
              isReviewWord: true,
              reviewLevel: dueReviewWord.level
            });
          }
        }
      }
    }

    // אם אין מילים לחזרה או שאנחנו הולכים אחורה
    const query = direction === 'next' ? 
      { index: { $gt: index } } : 
      { index: { $lt: index } };
    const sort = direction === 'next' ? { index: 1 } : { index: -1 };
    
    const nextWord = await collection.findOne(query, { sort });
    
  if (direction === 'next' && !nextWord) {
  // הגענו לסוף הרשימה הרגילה
  if (session?.user?.email) {
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single();

    if (userData) {
      // קבל את כל המילים שצריכות חזרה, ממוינות לפי רמת קושי ותאריך אחרון שנראו
      const { data: remainingReviews } = await supabase
        .from('user_words')
        .select('word_id, level, last_seen')
        .eq('user_id', userData.id)
        .gt('level', 1)  // רק מילים שצריכות חזרה
        .order('level', { ascending: false })  // קודם המילים הקשות יותר
        .order('last_seen', { ascending: true });  // אח"כ המילים שלא ראינו מזמן

      // בודקים אם יש מילים לחזרה
      if (remainingReviews && remainingReviews.length > 0) {
        // מביאים את המילה הראשונה מהרשימה הממוינת
        const reviewWord = await collection.findOne({ 
          index: remainingReviews[0].word_id 
        });
        
        if (reviewWord) {
          // מעדכנים את זמן הצפייה האחרון
          await supabase
            .from('user_words')
            .update({
              last_seen: new Date().toISOString()
            })
            .eq('user_id', userData.id)
            .eq('word_id', remainingReviews[0].word_id);

          // מחזירים את המילה עם מידע נוסף
          return NextResponse.json({
            ...reviewWord,
            isReviewWord: true,
            reviewLevel: remainingReviews[0].level,
            isEndOfListReview: true
          });
        }
      }
    }
  }
  
  // רק אם אין בכלל מילים לחזרה
  return NextResponse.json({ 
    completed: true,
    message: 'סיימת ללמוד את כל המילים והחזרות!'
  });
}
    
    return NextResponse.json(nextWord);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}