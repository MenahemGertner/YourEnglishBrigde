'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function UsefulWordsDropdown({ onLinkClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLinkClick = (category) => {
    setIsOpen(false);
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <div className="relative w-full flex justify-center" ref={dropdownRef}>
      <div className="inline-block">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center"
        >
          מילים נפוצות 
          {isOpen ? (
            <ChevronUp className="mr-2" size={20} />
          ) : (
            <ChevronDown className="mr-2" size={20} />
          )}
        </button>
        {isOpen && (
          <div className="absolute z-10 bg-white shadow-lg rounded mt-2 py-2 w-48 left-1/2 transform -translate-x-1/2">
            {[
              // { href: '/beginners', label: 'מתחילים מהבסיס'},
              { href: "/wordLists?category=300", label: "רמה 1" },
              { href: "/wordLists?category=600", label: "רמה 2" },
              { href: "/wordLists?category=900", label: "רמה 3" },
              { href: "/wordLists?category=1200", label: "רמה 4" },
              { href: "/wordLists?category=1500", label: "רמה 5" },
              // { href: '/underConstruction', label: 'מתקדמים'},
              { href: "/checkYourLevel", label: "מה הרמה שלי?" }
            ].map((item, index, array) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-2 text-black hover:text-blue-900 hover:bg-blue-50"
                  onClick={() => handleLinkClick(item.label)}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}