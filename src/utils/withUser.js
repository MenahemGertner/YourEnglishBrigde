import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabaseAdmin } from '@/lib/db/supabase';

export function withUser(handler) {
  return async (request) => {
    try {
      console.log('[withUser] Starting authentication check');
      
      let session;
      try {
        session = await getServerSession(authOptions);
        console.log('[withUser] Session received:', {
          hasSession: !!session,
          sessionData: session,
          userEmail: session?.user?.email
        });
      } catch (sessionError) {
        console.error('[withUser] Error getting session:', sessionError);
        return NextResponse.json(
          { status: 'error', error: 'שגיאת אימות' },
          { status: 401 }
        );
      }

      if (!session?.user?.email) {
        console.log('[withUser] No valid session found');
        return NextResponse.json(
          { status: 'error', error: 'משתמש לא מחובר' },
          { status: 401 }
        );
      }

      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

      console.log('[withUser] Supabase query result:', {
        userData,
        userError
      });

      if (userError || !userData) {
        console.log('[withUser] User not found in database');
        return NextResponse.json(
          { status: 'error', error: 'משתמש לא נמצא' },
          { status: 404 }
        );
      }

      return handler(request, userData.id);

    } catch (error) {
      console.error('[withUser] Error in middleware:', error);
      return NextResponse.json(
        { status: 'error', error: error.message },
        { status: 500 }
      );
    }
  };
}