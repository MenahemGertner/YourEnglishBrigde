// src/lib/auth.js
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
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days
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
      // בהתחברות ראשונית, הוסף את מזהה הsupabase
      if (user) {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (userData) {
          token.supabaseUserId = userData.id;
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // העבר את מזהה המשתמש לסשן
      if (token.supabaseUserId) {
        session.user.id = token.supabaseUserId;
      }
      
      return session;
    }
  }
};