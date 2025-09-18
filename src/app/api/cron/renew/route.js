export async function POST(request) {
  const { userId, newEndDate } = await request.json();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ 
      end_date: newEndDate,
      notification_sent_at: null,  // איפוס ההתראה
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('status', 'active');
    
  return NextResponse.json({ success: !error });
}