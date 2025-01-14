import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, CircleUser } from "lucide-react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      // נקבל את נתוני המשתמש מגוגל
      const result = await signIn('google', { redirect: false });
  
      if (result?.error) {
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        if (result.url.includes('/register')) {
          // שמירת פרטי המשתמש לשימוש בהרשמה
          const profile = result.profile || {};
          sessionStorage.setItem('userName', profile.name || '');
          sessionStorage.setItem('userImage', profile.image || '');
          router.push(result.url);
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (session) {
    const getFirstName = (fullName) => {
      if (!fullName) return '';
      return fullName.split(' ')[0];
    };

    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold">שלום {getFirstName(session.user.name)}</span>
          <CircleUser className="h-4 w-4"/>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="hover:text-gray-600 transition-colors"
        >
          <div className="flex items-center gap-1">
            <LogOut className="h-4 w-4"/>
            <span className="font-bold">התנתק</span>
          </div>
        </button>
      </div>
    );
  }

//   if (status === "loading") {
//     return (
//       <div className="flex items-center gap-1">
//         <span className="font-bold">טוען...</span>
//       </div>
//     );
//   }

  return (
    <button 
      onClick={handleSignIn}
      className="hover:text-gray-600 transition-colors"
    >
      <div className="flex items-center gap-1">
        <LogIn className="h-4 w-4"/>
        <span className="font-bold">התחבר / הירשם</span>
      </div>
    </button>
  );
}