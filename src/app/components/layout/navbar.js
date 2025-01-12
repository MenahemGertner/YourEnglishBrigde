'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import UsefulWordsDropdown from '../wordLists/usefulWordsDropdown.js'
import LoginButton from '../auth/LoginButton'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-16">
        <div className="flex justify-between items-center py-4">
          {/* לוגו / שם האתר למסכים גדולים */}
          <Link href="/" className="hidden md:block text-2xl font-bold text-blue-900">
            Your English Bridge
          </Link>
          
          {/* כפתור תפריט למובייל */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button
              className="text-blue-900"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="text-xl font-bold text-blue-900">
              Your English Bridge
            </Link>
          </div>
          
          {/* תפריט למסכים גדולים */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/about" className="hover:text-blue-900 transition-colors px-8">אודות</Link>
            <Link href="/contact" className="hover:text-blue-900 transition-colors">צור קשר</Link>
            <div className="text-center hover:text-blue-900 transition-colors">
              <UsefulWordsDropdown />
            </div>
            <Link href="/checkYourLevel" className="hover:text-blue-900 transition-colors">בדיקת רמה</Link>
            {/* <Link href="/rulesAndStructure" className="hover:text-blue-900 transition-colors">כללים ומבנה השפה</Link> */}
            {/* <Link href="/basicEnglish" className="hover:text-blue-900 transition-colors">אנגלית מהבסיס</Link> */}
            {/* <Link href="/personalGuide" className="hover:text-blue-900 transition-colors">המדריך האישי</Link> */}
            <LoginButton />
          </div>
        </div>
        
        {/* תפריט נפתח למובייל */}
        {isMenuOpen && (
          <div className="md:hidden bg-white">
            <div className="px-2 pt-2 pb-4 space-y-4">
              <Link 
                href="/about"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                אודות
              </Link>
              <Link 
                href="/contact"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                צור קשר
              </Link>
              <div className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded">
                <UsefulWordsDropdown onLinkClick={toggleMenu} />
              </div>
              <Link 
                href="/checkYourLevel"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                בדיקת רמה
              </Link>
              <Link 
                href="/rulesAndStructure"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                כללים ומבנה השפה
              </Link>
              <Link 
                href="/basicEnglish"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                אנגלית מהבסיס
              </Link>
              <Link 
                href="/personalGuide"
                className="block text-center py-2 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                המדריך האישי
              </Link>
              <div className="py-2">
                <LoginButton mobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}