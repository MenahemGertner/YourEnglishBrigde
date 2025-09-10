import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogIn, LogOut, User, ChevronDown, Settings, CreditCard, BarChart3, HelpCircle } from "lucide-react";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // סגירת תפריט בלחיצה מחוץ לקומפוננטה
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const result = await signIn('google', { redirect: false });
      
      if (result?.error) {
        console.error('Sign in error:', result.error);
      } else if (result?.url) {
        if (result.url.includes('/registration')) {
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
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
      signOut({ callbackUrl: '/' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // פונקציות עזר
  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const names = fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // מצב מחובר - כפתור פרופיל עם תפריט
  if (session) {
    const firstName = getFirstName(session.user.name);
    const initials = getInitials(session.user.name);

    return (
      <div className="relative inline-block">
        {/* כפתור פרופיל */}
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className={`
            flex items-center gap-3 
            bg-white/10 hover:bg-white/20 
            text-white border-none 
            px-3 py-2 rounded-full 
            cursor-pointer transition-all duration-300
            ${isMenuOpen ? 'bg-white/20' : ''}
          `}
        >
          {/* אווטר עם ראשי תיבות */}
          <div className="
            w-9 h-9 rounded-full 
            bg-gradient-to-br from-blue-400 to-purple-600
            flex items-center justify-center 
            text-white font-bold text-sm
            border-2 border-white/20
          ">
            {initials}
          </div>
          
          {/* שם המשתמש - נעלם במסכים קטנים */}
          <span className="hidden sm:block font-semibold text-sm">
            {firstName}
          </span>
          
          {/* חץ */}
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-300 ${
              isMenuOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* תפריט פרופיל */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="
              absolute top-full right-0 mt-2
              w-64 bg-white rounded-xl
              shadow-xl border border-gray-200
              opacity-100 visible transform translate-y-0
              transition-all duration-300 ease-out
              z-50 overflow-hidden
            "
          >
            {/* כותרת התפריט */}
            <div className="px-5 py-4 border-b border-gray-100 text-center">
              <div className="
                w-12 h-12 rounded-full 
                bg-gradient-to-br from-blue-400 to-purple-600
                flex items-center justify-center 
                text-white font-bold text-lg
                mx-auto mb-3
              ">
                {initials}
              </div>
              <div className="font-semibold text-gray-900 text-base">
                {session.user.name}
              </div>
              <div className="text-gray-500 text-sm">
                {session.user.email}
              </div>
            </div>

            {/* אפשרויות התפריט */}
            <div className="py-2">
              {/* <button 
                onClick={() => {
                  router.push('/dashboard/profile');
                  setIsMenuOpen(false);
                }}
                className="
                  flex items-center gap-3 w-full
                  px-5 py-3 text-right
                  text-gray-700 hover:bg-gray-50 hover:text-blue-600
                  transition-colors duration-200
                "
              >
                <User className="w-5 h-5" />
                <span>פרטים אישיים</span>
              </button> */}

              {/* <button 
                onClick={() => {
                  router.push('/dashboard/settings');
                  setIsMenuOpen(false);
                }}
                className="
                  flex items-center gap-3 w-full
                  px-5 py-3 text-right
                  text-gray-700 hover:bg-gray-50 hover:text-blue-600
                  transition-colors duration-200
                "
              >
                <Settings className="w-5 h-5" />
                <span>הגדרות</span>
              </button> */}

              {/* <button 
                onClick={() => {
                  router.push('/dashboard/subscription');
                  setIsMenuOpen(false);
                }}
                className="
                  flex items-center gap-3 w-full
                  px-5 py-3 text-right
                  text-gray-700 hover:bg-gray-50 hover:text-blue-600
                  transition-colors duration-200
                "
              >
                <CreditCard className="w-5 h-5" />
                <span>ניהול מנוי</span>
              </button> */}

              {/* <button 
                onClick={() => {
                  router.push('/dashboard/progress');
                  setIsMenuOpen(false);
                }}
                className="
                  flex items-center gap-3 w-full
                  px-5 py-3 text-right
                  text-gray-700 hover:bg-gray-50 hover:text-blue-600
                  transition-colors duration-200
                "
              >
                <BarChart3 className="w-5 h-5" />
                <span>הישגים ופרוגרס</span>
              </button> */}

              {/* קו הפרדה */}
              {/* <div className="h-px bg-gray-100 my-2"></div> */}

              {/* <button 
                onClick={() => {
                  router.push('/help');
                  setIsMenuOpen(false);
                }}
                className="
                  flex items-center gap-3 w-full
                  px-5 py-3 text-right
                  text-gray-700 hover:bg-gray-50 hover:text-blue-600
                  transition-colors duration-200
                "
              >
                <HelpCircle className="w-5 h-5" />
                <span>עזרה ותמיכה</span>
              </button> */}

              {/* קו הפרדה */}
              {/* <div className="h-px bg-gray-100 my-2"></div> */}

              {/* התנתקות */}
              <button 
                onClick={handleSignOut}
                className="
                  flex items-center gap-3 w-full
                  px-8 py-3 text-right
                  text-red-600 hover:bg-red-50
                  transition-colors duration-200
                "
              >
                
                <span>התנתקות</span>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // מצב לא מחובר - כפתור אנונימי עם תפריט
  return (
    <div className="relative inline-block">
      {/* כפתור התחברות אנונימי */}
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`
          flex items-center gap-2
          bg-white text-blue-600
          border-none px-5 py-2.5 rounded-full
          cursor-pointer font-semibold text-sm
          transition-all duration-300
          shadow-md hover:shadow-lg hover:transform hover:-translate-y-0.5
          ${isMenuOpen ? 'shadow-lg transform -translate-y-0.5' : ''}
        `}
      >
        {/* אייקון אנונימי */}
        <div className="
          w-5 h-5 rounded-full 
          bg-gray-400 
          flex items-center justify-center 
          text-white text-xs
        ">
          <User className="w-3 h-3" />
        </div>
        
        {/* טקסט - נעלם במסכים קטנים */}
        <span className="hidden sm:inline">התחבר / הירשם</span>
        
        {/* חץ */}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${
            isMenuOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* תפריט התחברות */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="
            absolute top-full right-0 mt-2
            w-60 bg-white rounded-xl
            shadow-xl border border-gray-200
            opacity-100 visible transform translate-y-0
            transition-all duration-300 ease-out
            z-50 overflow-hidden
          "
        >
          {/* כותרת התפריט */}
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 text-center">
            <div className="font-semibold text-gray-900 text-base mb-2">
              הצטרף אלינו!
            </div>
            <div className="text-gray-500 text-sm">
              בחר אופן התחברות
            </div>
          </div>

          {/* אפשרויות התחברות */}
          <div className="py-3">
            <button 
              onClick={handleSignIn}
              className="
                flex items-center gap-3 w-full
                px-5 py-3 text-right
                text-gray-700 hover:bg-gray-50 hover:text-blue-600
                transition-colors duration-200
              "
            >
              <div className="w-5 h-5 text-lg">🔐</div>
              <span>התחבר עם Google</span>
            </button>

            {/* אפשרויות נוספות לעתיד */}
            {/* <button 
              onClick={() => {
                alert('בקרוב - התחברות עם אימייל');
                setIsMenuOpen(false);
              }}
              className="
                flex items-center gap-3 w-full
                px-5 py-3 text-right
                text-gray-500 hover:bg-gray-50
                transition-colors duration-200
              "
            >
              <div className="w-5 h-5 text-lg">📧</div>
              <span>התחבר עם אימייל</span>
            </button> */}

            {/* קו הפרדה */}
            <div className="h-px bg-gray-100 my-2"></div>

            <button 
              onClick={() => {
                router.push('/registration');
                setIsMenuOpen(false);
              }}
              className="
                flex items-center gap-3 w-full
                px-5 py-3 text-right
                text-gray-700 hover:bg-gray-50 hover:text-blue-600
                transition-colors duration-200
              "
            >
              <div className="w-5 h-5 text-lg">✨</div>
              <span>משתמש חדש? הירשם</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}