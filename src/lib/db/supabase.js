// lib/db/supabase.js
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