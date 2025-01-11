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

        if (!existingUser) {
          // יצירת משתמש חדש
          const { error: insertError } = await supabaseAdmin
            .from('users')
            .insert([
              {
                email: user.email,
                name: user.name,
                avatar_url: user.image
              }
            ]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            return false;
          }
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