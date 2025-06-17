'use server'

import { createClient } from '@supabase/supabase-js'
import { categories } from '../../helpers/reviewHelperFunctions'

export async function updateSequencePosition(userId, targetIndex, shouldReset = false) {
    if (!userId) {
      throw new Error('נדרש מזהה משתמש')
    }
  
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
  
      // If shouldReset is true, delete all user words
      if (shouldReset) {
        // First operation: delete from user_words
        const { error: deleteError } = await supabase
          .from('user_words')
          .delete()
          .eq('user_id', userId);
        
        if (deleteError) throw deleteError;
        
        // Second operation: update the users table
        const { error: updateError } = await supabase
          .from('users')
          .update({ practice_counter: 0 }) // Reset practice counter when resetting sequence
          .eq('id', userId); // חשוב להוסיף תנאי כדי לעדכן רק את המשתמש הספציפי
        
        if (updateError) throw updateError;
      }
  
      // Find the appropriate category for the target index
      const category = categories.find((cat, index) => {
        const nextCat = categories[index + 1]
        const currentStart = parseInt(cat) - 299
        const nextStart = nextCat ? parseInt(nextCat) - 299 : Infinity
        return targetIndex >= currentStart && targetIndex < nextStart
      }) || '300'
  
      // Update last_position with new values and reset practice_counter
      const { error: updateError } = await supabase
        .from('users')
        .update({
          last_position: {
            index: targetIndex,
            category,
            learning_sequence_pointer: targetIndex - 1
          }}
          )
        .eq('id', userId)
  
      if (updateError) throw updateError
  
      return { success: true, category }
    } catch (error) {
      console.error('Error in updateSequencePosition:', error)
      return { success: false, error: error.message }
    }
  }