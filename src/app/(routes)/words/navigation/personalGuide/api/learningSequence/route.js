// import { NextResponse } from 'next/server';
// import { getServerSession } from "next-auth/next";
// import { authOptions } from '@/lib/auth';
// import { supabaseAdmin } from '@/lib/db/supabase';

// // Helper function to check if word is part of learning sequence
// async function isPartOfLearningSequence(userId, currentIndex, learningSequencePointer) {
//   // Case 1: זו המילה הבאה ברצף הרגיל
//   if (parseInt(currentIndex) === learningSequencePointer) {
//     return true;
//   }

//   // Case 2: זו מילת חזרה שהגיע זמנה
//   const { data: reviewWord } = await supabaseAdmin
//     .from('user_words')
//     .select('next_review, current_sequence_position')
//     .eq('user_id', userId)
//     .eq('word_id', parseInt(currentIndex))
//     .single();

//   // בדיקה אם זו מילת חזרה תקינה
//   if (reviewWord) {
//     const isValidReview = reviewWord.next_review === learningSequencePointer - 1;
//     return isValidReview;
//   }

//   return false;
// }

// export async function GET(request) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { data: userData } = await supabaseAdmin
//       .from('users')
//       .select('last_position')
//       .eq('email', session.user.email)
//       .single();

//     return NextResponse.json(userData?.last_position || null);
//   } catch (error) {
//     console.error('Server error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session?.user?.email) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const body = await request.json();
//     const { index, category } = body;

//     const { data: userData, error: userError } = await supabaseAdmin
//       .from('users')
//       .select('id, last_position')
//       .eq('email', session.user.email)
//       .single();

//     if (userError || !userData) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     const currentLearningPointer = userData.last_position?.learning_sequence_pointer || 1;

//     // בדיקת מילת חזרה
//     const { data: reviewWord } = await supabaseAdmin
//       .from('user_words')
//       .select('next_review, current_sequence_position')
//       .eq('user_id', userData.id)
//       .eq('word_id', parseInt(index))
//       .single();

//     const isSequential = reviewWord 
//       ? (reviewWord.current_sequence_position === (currentLearningPointer - 1) || 
//          reviewWord.current_sequence_position === currentLearningPointer)
//       : (parseInt(index) === currentLearningPointer - 1 || 
//          parseInt(index) === currentLearningPointer);

//     let lastPosition;

//     if (reviewWord && reviewWord.next_review === currentLearningPointer - 1) {
//       lastPosition = {
//         index,
//         category,
//         current_sequence_position: parseInt(index),
//         learning_sequence_pointer: currentLearningPointer
//       };
//     } else {
//       lastPosition = {
//         index,
//         category,
//         current_sequence_position: parseInt(index),
//         learning_sequence_pointer: isSequential ? parseInt(index) + 1 : currentLearningPointer
//       };
//     }

//     const { error: updateError } = await supabaseAdmin
//       .from('users')
//       .update({ last_position: lastPosition })
//       .eq('id', userData.id);

//     if (updateError) {
//       throw updateError;
//     }

//     return NextResponse.json({ 
//       success: true, 
//       isSequential,
//       isReviewWord: !!reviewWord && reviewWord.next_review === currentLearningPointer - 1,
//       reviewWord: reviewWord
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }