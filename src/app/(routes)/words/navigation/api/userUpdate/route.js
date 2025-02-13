// app/(routes)/words/navigation/api/userUpdate/route.js
import { supabaseAdmin } from '@/lib/db/supabase';
import { NextResponse } from 'next/server';
import { withUser } from '@/utils/withUser';

export const PATCH = withUser(async (request, userId) => {
  const { practice_counter, index, learning_sequence_pointer } = await request.json();
  
  const updateData = {};
  
  if (practice_counter !== undefined) {
    updateData.practice_counter = practice_counter;
  }
  
  if (index !== undefined || learning_sequence_pointer !== undefined) {
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('last_position')
      .eq('id', userId)
      .single();
    
    const currentLastPosition = currentUser?.last_position || {};
    
    updateData.last_position = {
      ...currentLastPosition,
      ...(index !== undefined && { index }),
      ...(learning_sequence_pointer !== undefined && { learning_sequence_pointer })
    };
  }
  
  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { status: 'error', error: 'לא נשלחו שדות לעדכון' },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();

  if (error) throw error;
  return data[0];
});