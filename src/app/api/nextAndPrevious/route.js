import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../utils/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../auth/[...nextauth]/route';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawIndex = searchParams.get('index');
    const category = searchParams.get('category') || '500';
    const direction = searchParams.get('direction');

    console.log('API Request params:', { rawIndex, category, direction });

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
    console.log('Session user ID:', session?.user?.id);

    if (session?.user?.id && direction === 'next') {
      try {
        // קודם כל נבדוק אם יש מילים לחזרה
        const { data: reviewWords, error: reviewError } = await supabase
          .from('user_words')
          .select('*')
          .eq('user_id', session.user.id)
          .gt('level', 1)
          .lte('next_review', index)
          .order('next_review', { ascending: true });

        console.log('Review words found:', reviewWords);

        if (reviewError) {
          console.error('Review words error:', reviewError);
          throw reviewError;
        }

        if (reviewWords && reviewWords.length > 0) {
          const { db } = await connectToDatabase();
          const collection = db.collection(category);
          
          // קח את המילה הראשונה מרשימת החזרות
          const reviewWordData = await collection.findOne({ 
            index: reviewWords[0].word_id 
          });
          
          console.log('Found review word data:', reviewWordData);

          if (reviewWordData) {
            const intervals = { 2: 10, 3: 5, 4: 3 };
            const nextReview = index + (intervals[reviewWords[0].level] || 0);
            
            // עדכן את זמן החזרה הבא
            await supabase
              .from('user_words')
              .update({
                next_review: nextReview,
                last_seen: new Date().toISOString()
              })
              .eq('user_id', session.user.id)
              .eq('word_id', reviewWords[0].word_id);

            return NextResponse.json(reviewWordData);
          }
        }
      } catch (reviewError) {
        console.error('Review process error:', reviewError);
      }
    }

    // אם אין מילים לחזרה, או יש שגיאה, נסה להביא את המילה הרגילה הבאה
    const { db } = await connectToDatabase();
    const collection = db.collection(category);
    
    const query = direction === 'next' ? { index: { $gt: index } } : { index: { $lt: index } };
    const sort = direction === 'next' ? { index: 1 } : { index: -1 };
    const nextWord = await collection.findOne(query, { sort });

    console.log('Regular next word:', nextWord);

    if (!nextWord && session?.user?.id) {
      // אם אין מילה רגילה הבאה, נבדוק שוב אם יש מילים לחזרה (כולל אלו שעוד לא הגיע זמנן)
      const { data: allReviewWords } = await supabase
        .from('user_words')
        .select('*')
        .eq('user_id', session.user.id)
        .gt('level', 1)
        .order('next_review', { ascending: true });

      console.log('All review words when no next word:', allReviewWords);

      if (allReviewWords && allReviewWords.length > 0) {
        const reviewWordData = await collection.findOne({ 
          index: allReviewWords[0].word_id 
        });

        if (reviewWordData) {
          const intervals = { 2: 10, 3: 5, 4: 3 };
          const nextReview = index + (intervals[allReviewWords[0].level] || 0);
          
          await supabase
            .from('user_words')
            .update({
              next_review: nextReview,
              last_seen: new Date().toISOString()
            })
            .eq('user_id', session.user.id)
            .eq('word_id', allReviewWords[0].word_id);

          return NextResponse.json(reviewWordData);
        }
      }
    }
    
    if (!nextWord) {
      return NextResponse.json({ error: 'No word found' }, { status: 404 });
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