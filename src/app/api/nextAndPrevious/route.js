// app/api/nextAndPrevious/route.js
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
  
  const interval = intervals[level];
  if (!interval) return null;
  
  return currentIndex + interval;
}

function getCategoryForIndex(index) {
  if (index >= 0 && index <= 500) return '500';
  if (index > 500 && index <= 1000) return '1000';
  if (index > 1000 && index <= 1500) return '1500';
  if (index > 1500 && index <= 2000) return '2000';
  if (index > 2000 && index <= 2500) return '2500';
  return null;
}

function getCategoryBounds(category) {
  const bounds = {
    '500': [1, 500],
    '1000': [501, 1000],
    '1500': [1001, 1500],
    '2000': [1501, 2000],
    '2500': [2001, 2500]
  };
  return bounds[category];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawIndex = searchParams.get('index');
    const direction = searchParams.get('direction');

    if (!rawIndex || !direction) {
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

    const currentCategory = getCategoryForIndex(index);
    if (!currentCategory) {
      return NextResponse.json(
        { error: 'Index out of valid range' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const { db } = await connectToDatabase();
    
    const collection = db.collection(currentCategory);
    const currentWord = await collection.findOne({ index });

    if (!currentWord) {
      return NextResponse.json(
        { error: 'Word not found' },
        { status: 404 }
      );
    }

    const [minIndex, maxIndex] = getCategoryBounds(currentCategory);
    
    // בדיקה אם אנחנו בקצה הרשימה
    if ((direction === 'next' && index === maxIndex) || 
        (direction === 'prev' && index === minIndex)) {
      return NextResponse.json({ 
        completed: true,
        message: direction === 'next' ? 
          'הגעת לסוף הרשימה הנוכחית' : 
          'הגעת לתחילת הרשימה הנוכחית'
      });
    }

    // חיפוש המילה הבאה/קודמת בתוך אותה קטגוריה
    const query = {
  index: direction === 'next' ? 
    { $gt: currentWord.current_sequence_position || index, $lte: maxIndex } : 
    { $lt: currentWord.current_sequence_position || index, $gte: minIndex }
};
    
    const sort = direction === 'next' ? { index: 1 } : { index: -1 };
    const nextWord = await collection.findOne(query, { sort });

    if (!nextWord) {
      return NextResponse.json({ 
        completed: true,
        message: direction === 'next' ? 
          'הגעת לסוף הרשימה הנוכחית' : 
          'הגעת לתחילת הרשימה הנוכחית'
      });
    }

    // בדיקת חזרות רק אם המשתמש מחובר ומנווט קדימה
    if (session?.user?.email && direction === 'next') {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userData) {
        const { data: reviewWords } = await supabase
          .from('user_words')
          .select('*')
          .eq('user_id', userData.id)
          .gt('level', 1)
          .order('level', { ascending: false })
          .order('next_review', { ascending: true });

        const dueReviewWord = reviewWords?.find(word => 
          word.next_review <= index && 
          word.word_id !== index &&
          getCategoryForIndex(word.word_id) === currentCategory
        );

        if (dueReviewWord) {
          const reviewWordData = await collection.findOne({ 
            index: dueReviewWord.word_id 
          });

          if (reviewWordData) {
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
              category: currentCategory,
              isReviewWord: true,
              reviewLevel: dueReviewWord.level
            });
          }
        }
      }
    }

    return NextResponse.json({
      ...nextWord,
      category: currentCategory
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}