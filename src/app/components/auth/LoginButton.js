'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import { LogIn, LogOut, CircleUser } from "lucide-react"

export default function LoginButton() {
  const { data: session, status } = useSession()
  

  if (session) {
    const getFirstName = (fullName) => {
        return fullName.split(' ')[0];
    };
    
    return (
        <>
        <div className="flex items-center gap-2">
            <span className="font-bold">שלום {getFirstName(session.user.name)}</span>
            <CircleUser className="h-4 w-4"/>
            </div>
            <button onClick={() => signOut()}>
                <div className="flex items-center gap-1">         
                    <LogOut className="h-4 w-4"/>
                    <span className="font-bold">התנתק</span>
                </div>
            </button>
        </>
    )
  }

  return (
    <button onClick={() => signIn('google')}>
        <div className="flex items-center gap-1">
        <LogIn className="h-4 w-4"/>
      <span className="font-bold">התחבר</span>      
      </div>
    </button>
  )
}