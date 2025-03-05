'use client'
import { useEffect } from 'react';
import { useWindowContext } from '@/app/(routes)/words/card/providers/WindowContext';

const useOpenWindow = (sectionTitle) => {
  const { activeSection, toggleSection } = useWindowContext();

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = 
        activeSection === sectionTitle && 
        !event.target.closest('.window-content') && 
        !event.target.closest('.toggle-button');

      if (clickedOutside) {
        toggleSection(sectionTitle);
      }
    };

    if (activeSection === sectionTitle) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeSection, sectionTitle, toggleSection]);

  return {
    isOpen: activeSection === sectionTitle,
    toggleSection
  };
};

export default useOpenWindow;