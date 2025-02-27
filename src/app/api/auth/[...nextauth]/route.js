// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from '@/lib/db/supabase';
import jwt from 'jsonwebtoken';

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
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        const { data: existingUser, error: fetchError } = await supabaseAdmin
          .from('users')
          .select()
          .eq('email', user.email)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching user:', fetchError);
          return false;
        }

        if (!existingUser) {
          return `/registration?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&image=${encodeURIComponent(user.image)}`;
        }

        return true;
      } catch (error) {
        console.error('SignIn error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // הוספת מזהה משתמש לטוקן בהתחברות ראשונית
      if (account && user) {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (userData) {
          token.supabaseUserId = userData.id;
          
          // יצירת JWT עם תוקף של 55 דקות (פחות משעה כדי שיהיה מרווח ביטחון)
          token.accessToken = createSupabaseToken(userData.id, user.email);
          token.accessTokenExpires = Math.floor(Date.now() / 1000) + (55 * 60); // 55 דקות
        }
      }
      
      // בדיקה אם הטוקן קרוב לפוג תוקף (פחות מ-5 דקות נותרו) ואם כן, חידוש הטוקן
      const currentTime = Math.floor(Date.now() / 1000);
      if (token.supabaseUserId && (!token.accessTokenExpires || token.accessTokenExpires - currentTime < 300)) {
        token.accessToken = createSupabaseToken(token.supabaseUserId, token.email);
        token.accessTokenExpires = Math.floor(Date.now() / 1000) + (55 * 60); // 55 דקות
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user && token) {
        // העברת פרטי המשתמש והטוקן לסשן
        session.user.id = token.supabaseUserId;
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    }
  }
};

// פונקציה עזר ליצירת טוקן Supabase
function createSupabaseToken(userId, email) {
  return jwt.sign(
    {
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 שעה
      sub: userId,
      email: email,
      role: 'authenticated',
    },
    process.env.SUPABASE_JWT_SECRET
  );
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };