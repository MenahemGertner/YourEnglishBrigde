export default function Logo({ width = 100, height = 100 }) {
    return (
      <div className="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 400"
          width={width}
          height={height}
        >
          <defs>
            <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3A1C71" />
              <stop offset="50%" stopColor="#4776E6" />
              <stop offset="100%" stopColor="#8E54E9" />
            </linearGradient>
            
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4776E6" />
              <stop offset="100%" stopColor="#8E54E9" />
            </linearGradient>
          </defs>
          
          {/* <circle cx="200" cy="200" r="160" fill="white" stroke="url(#mainGradient)" strokeWidth="8" /> */}
          
          {/* Increased strokeWidth from 12 to 16 for all main paths */}
          <path d="M120,140 L180,140" stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M120,200 L170,200" stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M120,260 L180,260" stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M120,140 L120,260" stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" />
          
          <path d="M230,140 C270,140 280,170 260,190 C290,210 270,260 230,260" 
                stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" 
                transform="translate(-30, 0)" />
                
          <path d="M180,140 L230,140 M180,260 L230,260 M180,140 L180,200 M180,200 L195,200 M180,200 L180,260" 
                stroke="url(#mainGradient)" strokeWidth="16" fill="none" strokeLinecap="round" 
                transform="translate(-30, 0)" />
                
          {/* Increased strokeWidth from 6 to 9 for accent path */}
          <path d="M130,320 C160,280 200,300 240,260 C280,220 320,260 340,220" 
                stroke="url(#accentGradient)" strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray="1,8" />
                
          {/* Increased circle radius from 8 to 12 */}
          <circle cx="130" cy="320" r="12" fill="#4776E6" />
          <circle cx="240" cy="260" r="12" fill="#5E48E3" />
          <circle cx="340" cy="220" r="12" fill="#8E54E9" />
        </svg>
        
        <div className="text-center space-y-1">
          <h1 className="text-xl md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your English Bridge
          </h1>
          <h2 className="text-md md:text-sm font-semibold text-gray-800">
            דרך חדשה ללמוד שפה
          </h2>
        </div>
      </div>
    );
  }