'use client'
import { createContext, useContext, useState } from 'react';

export const WindowContext = createContext(undefined);

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}

export function WindowProvider({ children }) {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };

  return (
    <WindowContext.Provider value={{ activeSection, toggleSection }}>
      {children}
    </WindowContext.Provider>
  );
}