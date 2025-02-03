import localFont from "next/font/local"
import "./globals.css"
import Navbar from "./components/layout/navbar"
import Footer from "./components/layout/footer"
import Providers from "./providers/Providers"
import AuthProvider from "./providers/SessionProvider"
import StoppingPoint from './components/difficultyRating/stoppingPoint';
import { ColorProvider } from './components/difficultyRating/colorContext';

const geistSans = localFont({
  src: "../styles/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
})

const geistMono = localFont({
  src: "../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
})

export const metadata = {
  title: {
    default: "Your English Bridge",
    template: '%s | Your English Bridge'
  },
  description: "אנגלית לכל אחד"
}


export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased page-container`}>
        <AuthProvider>
          <Providers>
            <ColorProvider>
            <Navbar />
            <div className="content-wrapper">
              <main>{children}</main>
              <StoppingPoint/>
            </div>
            <Footer />
            </ColorProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}