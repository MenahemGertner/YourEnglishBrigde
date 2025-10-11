'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';

export default function Drawer({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  children,
  width = '480px',
  position = 'right'
}) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  // סגירה אוטומטית כאשר הנתיב משתנה
  useEffect(() => {
    if (isOpen && prevPathRef.current !== pathname) {
      onClose();
    }
    prevPathRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  // חסימת גלילה כשהדרוור פתוח
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // סגירה עם ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const positionStyles = position === 'right' ? { right: 0 } : { left: 0 };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="fixed top-0 h-full bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out overflow-y-auto"
        style={{ 
          ...positionStyles,
          width: '100%',
          maxWidth: width 
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-5 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center gap-3">
            {icon && <div className="w-6 h-6">{icon}</div>}
            <h2 id="drawer-title" className="text-xl font-bold">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="סגור"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </>
  );
}
