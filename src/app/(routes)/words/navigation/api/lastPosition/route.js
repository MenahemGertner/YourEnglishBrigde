// // app/(routes)/words/navigation/api/lastPosition/route.js
// import { createClient } from '@supabase/supabase-js'

// export async function GET(request) {
//   // Retrieve user ID from query parameters
//   const { searchParams } = new URL(request.url)
//   const userId = searchParams.get('userId')

//   if (!userId) {
//     return Response.json({ 
//       error: 'User ID is required' 
//     }, { status: 400 })
//   }

//   // Initialize Supabase client
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL, 
//     process.env.SUPABASE_SERVICE_ROLE_KEY
//   )

//   try {
//     // Fetch the last_position for the specific user
//     const { data, error } = await supabase
//       .from('users')  // Replace with your actual table name
//       .select('last_position')
//       .eq('id', userId)
//       .single()

//     if (error) throw error

//     // Extract index and category from last_position
//     const { index, category } = data.last_position || {}

//     return Response.json({ 
//       index, 
//       category 
//     })
//   } catch (error) {
//     return Response.json({ 
//       error: 'Failed to retrieve last position', 
//       details: error.message 
//     }, { status: 500 })
//   }
// }