import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import Providers from "./providers/Providers"
import AuthProvider from "./providers/SessionProvider"
import StoppingPoint from '@/app/(routes)/words/navigation/personalGuide/components/stoppingPoint';
import { ColorProvider } from '@/app/(routes)/words/navigation/components/colorContext';


const inter = Inter({
  subsets: ['latin', 'latin-ext'], 
  variable: '--font-inter',
  display: 'swap'
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
      <body className={`${inter.variable} antialiased page-container`}>
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