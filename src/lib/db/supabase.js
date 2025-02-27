import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// לקוח רגיל עם הרשאות מוגבלות (אנונימי)
export const supabase = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// לקוח אדמין (רק לפעולות מיוחדות)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// פונקציה ליצירת לקוח עם טוקן משתמש (לשימוש בצד שרת)
export function createServerClient(accessToken) {
  return createClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  );
}