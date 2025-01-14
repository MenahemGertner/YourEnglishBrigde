// api/nextAndPrevious/route.js
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
  currentIndex = parseInt(currentIndex);
  
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

    // Only check for review words when going forward
    if (session?.user?.email && direction === 'next') {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      if (userData) {
        // Get all review words and find the first one that's due
        const { data: reviewWords } = await supabase
          .from('user_words')
          .select('*')
          .eq('user_id', userData.id)
          .gt('level', 1)
          .order('next_review', { ascending: true });

        // Find the first word that's due for review based on the exact intervals
        const dueReviewWord = reviewWords?.find(word => 
          word.next_review !== null && 
          word.next_review <= index
        );

        if (dueReviewWord) {
          const { db } = await connectToDatabase();
          const collection = db.collection(category);
          
          const reviewWordData = await collection.findOne({ 
            index: dueReviewWord.word_id 
          });

          if (reviewWordData) {
            // Calculate next review time based on the current level
            const nextReview = calculateNextReview(dueReviewWord.level, index);
            
            // Update the review time in database
            await supabase
              .from('user_words')
              .update({
                next_review: nextReview,
                last_seen: new Date().toISOString()
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

    // If no review word is due, get next/previous regular word
    const { db } = await connectToDatabase();
    const collection = db.collection(category);
    
    const query = direction === 'next' ? 
      { index: { $gt: index } } : 
      { index: { $lt: index } };
    const sort = direction === 'next' ? { index: 1 } : { index: -1 };
    
    const nextWord = await collection.findOne(query, { sort });
    
    if (!nextWord) {
      if (direction === 'next') {
        // If no next word, start from beginning
        const firstWord = await collection.findOne({}, { sort: { index: 1 } });
        return NextResponse.json(firstWord || { error: 'No words found' });
      }
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