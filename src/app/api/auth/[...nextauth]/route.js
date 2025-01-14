// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from '../../../lib/supabase';

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
      }),
    ],
    callbacks: {
      async signIn({ user, account }) {
        if (!user.email) return false;
  
        try {
          // בדוק אם המשתמש קיים
          const { data: existingUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select()
            .eq('email', user.email)
            .single();
  
          if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching user:', fetchError);
            return false;
          }
  
          // אם המשתמש לא קיים, שלח לדף ההרשמה עם כל הפרטים
          if (!existingUser) {
            return `/register?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&image=${encodeURIComponent(user.image)}`;
          }
  
          return true;
        } catch (error) {
          console.error('SignIn error:', error);
          return false;
        }
      },

    async session({ session, token }) {
      if (session?.user) {
        // קבל את ה-UUID של המשתמש מ-Supabase
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userData) {
          session.user.id = userData.id;
        }
      }
      return session;
    },

    async jwt({ token, account }) {
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };