'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import UsefulWordsDropdown from '@/app/(routes)/wordLists/components/dropdown.js'
import LoginButton from '@/components/auth/LoginButton'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  return (
    <nav className="bg-white shadow-md" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Desktop and Landscape Tablet Menu */}
          <div className="hidden md:block">
            <LoginButton />
          </div>
          
          <div className="hidden md:flex items-center space-x-2 space-x-reverse lg:space-x-6 lg:space-x-reverse xl:space-x-8 xl:space-x-reverse">
            <Link href="/about" className="text-sm lg:text-base hover:text-blue-900 transition-colors px-1 lg:px-2">אודות</Link>
            <Link href="/contact" className="text-sm lg:text-base hover:text-blue-900 transition-colors px-1 lg:px-2">צור קשר</Link>
            <div className="text-center text-sm lg:text-base hover:text-blue-900 transition-colors px-1 lg:px-2">
              <UsefulWordsDropdown />
            </div>
            <Link href="/checkYourLevel" className="text-sm lg:text-base hover:text-blue-900 transition-colors px-1 lg:px-2">בדיקת רמה</Link>
          </div>

          <Link href="/" className="hidden md:block text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Your English Bridge
          </Link>

          {/* Mobile Menu (Portrait Tablets and Below) */}
          <div className="md:hidden flex justify-between items-center w-full">
            <button className="text-blue-900" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
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