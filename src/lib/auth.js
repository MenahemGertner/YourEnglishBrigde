// src/lib/auth.js - עדכון עם בדיקת מנוי
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from '@/lib/db/supabase';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // עדכון כל 24 שעות
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
        maxAge: 30 * 24 * 60 * 60
      }
    }
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      
      try {
        const { data: existingUser, error } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user:', error);
          return false;
        }
        
        // אם המשתמש לא קיים, הפנה לרישום
        if (!existingUser) {
          return `/registration?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&image=${encodeURIComponent(user.image)}`;
        }
        
        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },
    
    async jwt({ token, user }) {
      // בהתחברות ראשונית או בעדכון תקופתי
      if (user || !token.subscriptionLastCheck || 
          Date.now() - token.subscriptionLastCheck > 24 * 60 * 60 * 1000) {
        
        try {
          // קבלת פרטי המשתמש
          const { data: userData } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', user?.email || token.email)
            .single();
          
          if (userData) {
            token.supabaseUserId = userData.id;
            
            // קבלת פרטי המנוי הפעיל - הוספנו start_date
            const { data: subscriptionData, error: subscriptionError } = await supabaseAdmin
              .from('subscriptions')
              .select('status, subscription_type, start_date, end_date')
              .eq('user_id', userData.id)
              .eq('status', 'active')
              .single();
            
            if (subscriptionError && subscriptionError.code !== 'PGRST116') {
              console.error('Error fetching subscription:', subscriptionError);
              // במקרה של שגיאה, נשמור סטטוס לא פעיל
              token.subscription = {
                status: 'inactive',
                subscription_type: null,
                start_date: null,
                end_date: null
              };
            } else if (subscriptionData) {
              // מנוי פעיל נמצא
              token.subscription = {
                status: subscriptionData.status,
                subscription_type: subscriptionData.subscription_type,
                start_date: subscriptionData.start_date,
                end_date: subscriptionData.end_date
              };
            } else {
              // לא נמצא מנוי פעיל - אולי פג או לא קיים
              // ננסה לקבל את המנוי האחרון לצורכי תצוגה - הוספנו start_date
              const { data: lastSubscription } = await supabaseAdmin
                .from('subscriptions')
                .select('status, subscription_type, start_date, end_date')
                .eq('user_id', userData.id)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();
              
              token.subscription = lastSubscription || {
                status: 'inactive',
                subscription_type: null,
                start_date: null,
                end_date: null
              };
            }
            
            // עדכון זמן בדיקה אחרונה
            token.subscriptionLastCheck = Date.now();
          }
        } catch (error) {
          console.error('JWT callback error:', error);
          // במקרה של שגיאה, נשאיר את הנתונים הישנים או נאפס
          if (!token.subscription) {
            token.subscription = {
              status: 'inactive',
              subscription_type: null,
              start_date: null,
              end_date: null
            };
          }
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // העברת כל המידע לsession
      if (token.supabaseUserId) {
        session.user.id = token.supabaseUserId;
      }
      
      if (token.subscription) {
        session.user.subscription = token.subscription;
      }
      
      return session;
    }
  }
};