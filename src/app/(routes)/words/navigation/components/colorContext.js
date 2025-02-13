'use client'
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import IconData from '@/lib/data/ColorMap';

// קבועים לשימוש בקומפוננטה
const COLOR_CONSTANTS = {
    ANIMATION_DURATION: 300,
    BORDER_WIDTH: '2px',
    BORDER_STYLE: 'solid',
};

// לוגיקת צבעים מרוכזת
const colorUtils = {
    getColorByLevel: (level) => IconData.find(item => item.level === level)?.color,
    getLevelInfo: (level) => IconData.find(item => item.level === level),
    getAllLevels: () => IconData,
};

export const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
    const [selectedColor, setSelectedColor] = useState(null);
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const currentWordId = searchParams.get('index');
    
    // פונקציה לשינוי צבע עם אנימציה
    const handleColorChange = useCallback((level) => {
        const color = colorUtils.getColorByLevel(level);
        setSelectedColor(color);
        
        return new Promise((resolve) => {
            setTimeout(() => {
                setSelectedColor(null);
                resolve();
            }, COLOR_CONSTANTS.ANIMATION_DURATION);
        });
    }, []);
    
    // קבלת רמת המילה מהשרת
    useEffect(() => {
        const fetchWordLevel = async () => {
            if (session?.user && currentWordId) {
                try {
                    const response = await fetch(`/words/navigation/api/userProgress/wordLevel?word_id=${currentWordId}`);
                    
                    if (!response.ok) {
                        console.error('Failed to fetch level:', response.status);
                        setSelectedColor(null);
                        return;
                    }
                    
                    const data = await response.json();
                    const color = colorUtils.getColorByLevel(data.level);
                    setSelectedColor(color);
                    
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
    
    // סטיילינג לכרטיס
    const cardStyle = useMemo(() => {
        if (!selectedColor) return {};
        
        return {
            borderWidth: COLOR_CONSTANTS.BORDER_WIDTH,
            borderStyle: COLOR_CONSTANTS.BORDER_STYLE,
            borderColor: selectedColor
        };
    }, [selectedColor]);
    
    const contextValue = useMemo(() => ({
        selectedColor,
        setSelectedColor,
        handleColorChange,
        cardStyle,
        // חשיפת פונקציות העזר למקרה שנצטרך אותן ברכיבים אחרים
        getColorByLevel: colorUtils.getColorByLevel,
        getLevelInfo: colorUtils.getLevelInfo,
        getAllLevels: colorUtils.getAllLevels,
    }), [selectedColor, handleColorChange, cardStyle]);

    return (
        <ColorContext.Provider value={contextValue}>
            {children}
        </ColorContext.Provider>
    );
};