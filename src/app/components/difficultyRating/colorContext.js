'use client'
import { createContext, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const currentWordId = searchParams.get('index');
  
    useEffect(() => {
        const fetchWordLevel = async () => {
          if (session?.user && currentWordId) {
            try {
              const response = await fetch(`/api/userWords/getLevel?word_id=${currentWordId}`);
              console.log('Fetching level for word:', currentWordId); // לצורכי דיבוג
              
              if (!response.ok) {
                console.error('Failed to fetch level:', response.status);
                setSelectedColor(null);
                return;
              }
              
              const data = await response.json();
              console.log('Received level data:', data); // לצורכי דיבוג
              
              const colorMap = {
                1: '#4CAF50',
                2: '#FFC107',
                3: '#FF9800',
                4: '#F44336'
              };
              
              setSelectedColor(data.level ? colorMap[data.level] : null);
            } catch (error) {
              console.error('Error fetching word level:', error);
              setSelectedColor(null);
            }
          } else {
            setSelectedColor(null);
          }
        };
        
        fetchWordLevel();
      }, [currentWordId, session?.user]);
  
    const cardStyle = useMemo(() => {
      return selectedColor ? {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: selectedColor
      } : {};
    }, [selectedColor]);
  
    return (
      <ColorContext.Provider value={{
        selectedColor,
        setSelectedColor,
        cardStyle
      }}>
        {children}
      </ColorContext.Provider>
    );
  };