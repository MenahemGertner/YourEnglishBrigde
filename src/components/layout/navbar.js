'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Cat } from 'lucide-react'
import UsefulWordsDropdown from '@/app/(routes)/wordLists/components/dropdown.js'
import LoginButton from '@/components/auth/LoginButton'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <nav className="bg-white shadow-md" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-16">
        <div className="flex justify-between items-center py-4">
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <LoginButton />
          </div>
          
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/about" className="hover:text-blue-900 transition-colors">אודות</Link>
            <Link href="/contact" className="hover:text-blue-900 transition-colors">צור קשר</Link>
            <div className="text-center hover:text-blue-900 transition-colors">
              <UsefulWordsDropdown />
            </div>
            <Link href="/checkYourLevel" className="hover:text-blue-900 transition-colors">בדיקת רמה</Link>
          </div>

          <Link href="/" className="hidden md:block text-2xl font-bold text-indigo-900">
            Your English Bridge
          </Link>

          {/* Mobile Menu */}
          <div className="md:hidden flex justify-between items-center w-full">
            <button className="text-blue-900" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/" className="text-xl font-bold text-indigo-900">
              Your English Bridge
            </Link>
          </div>
        </div>
        
        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col px-2 pt-2 pb-4">
              <Link 
                href="/about"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                אודות
              </Link>
              <Link 
                href="/contact"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                צור קשר
              </Link>
              <div className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded">
                <UsefulWordsDropdown onLinkClick={toggleMenu} />
              </div>
              <Link 
                href="/checkYourLevel"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                בדיקת רמה
              </Link>
              <Link 
                href="/rulesAndStructure"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                כללים ומבנה השפה
              </Link>
              <Link 
                href="/basicEnglish"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                אנגלית מהבסיס
              </Link>
              <Link 
                href="/personalGuide"
                className="text-center py-3 hover:text-blue-900 hover:bg-blue-50 rounded"
                onClick={toggleMenu}
              >
                <span className='flex justify-center gap-2'>המדריך האישי <Cat/></span>
              </Link>
              
              {/* Login Button at the bottom with separator */}
              <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
                <LoginButton mobile className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}