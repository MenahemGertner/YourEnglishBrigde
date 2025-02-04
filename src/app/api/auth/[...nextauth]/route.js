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
      // יצירת טוקן בהתחברות ראשונית
      if (account && user) {
        return {
          ...token,
          accessToken: jwt.sign(
            {
              email: user.email,
              sub: user.id,
            },
            process.env.NEXTAUTH_SECRET,
            { expiresIn: '8h' }  // טוקן תקף ל-8 שעות
          )
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        // קבלת ה-UUID של המשתמש מ-Supabase
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userData) {
          session.user.id = userData.id;
          // הוספת הטוקן לסשן
          session.accessToken = token.accessToken;
        }
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };