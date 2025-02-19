'use client';

import React from 'react';
import { Cat } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { updateSequencePosition } from '../actions/updateSequencePosition';
import { getStartingIndexForCategory } from '../../helpers/reviewHelperFunctions';
import { ResetDialog, PositionDialog } from './sequenceDialogs';

function SequenceReset() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const [showResetDialog, setShowResetDialog] = React.useState(false);
  const [showPositionDialog, setShowPositionDialog] = React.useState(false);
  const [position, setPosition] = React.useState('');
  const [error, setError] = React.useState('');
  const [tooltipPosition, setTooltipPosition] = React.useState({ right: '50%', transform: 'translate(50%, 0)' });
  const containerRef = React.useRef(null);
  const tooltipRef = React.useRef(null);

  const handleCatClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleResetConfirm = async () => {
    if (!session?.user?.id) {
      setError('נא להתחבר כדי להמשיך');
      return;
    }

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const currentCategory = urlParams.get('category') || '500';
      const startingIndex = getStartingIndexForCategory(currentCategory);
      
      const result = await updateSequencePosition(session.user.id, startingIndex, true);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      router.push(`/words?index=${startingIndex}&category=${currentCategory}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setShowResetDialog(false);
      setIsOpen(false);
    }
  };

  const handlePositionSubmit = async () => {
    if (!session?.user?.id) {
      setError('נא להתחבר כדי להמשיך');
      return;
    }

    const targetIndex = parseInt(position);
    if (targetIndex >= 1 && targetIndex <= 2500) {
      try {
        const result = await updateSequencePosition(session.user.id, targetIndex, false);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        router.push(`/words?index=${targetIndex}&category=${result.category}`);
      } catch (err) {
        setError(err.message);
      } finally {
        setShowPositionDialog(false);
        setIsOpen(false);
        setPosition('');
      }
    }
  };

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && tooltipRef.current && containerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      const overflowRight = containerRect.right + (tooltipRect.width / 2) > viewportWidth - 16;
      const overflowLeft = containerRect.left - (tooltipRect.width / 2) < 16;

      if (overflowRight) {
        setTooltipPosition({
          right: '0',
          transform: 'translate(0, 0)'
        });
      } else if (overflowLeft) {
        setTooltipPosition({
          right: '100%',
          transform: 'translate(100%, 0)'
        });
      } else {
        setTooltipPosition({
          right: '50%',
          transform: 'translate(50%, 0)'
        });
      }
    }
  }, [isOpen]);

  return (
    <>
      <div ref={containerRef} className="fixed bottom-4 right-4 z-50">
        <div 
          role="button"
          tabIndex={0}
          onClick={handleCatClick}
          onKeyDown={(e) => e.key === 'Enter' && handleCatClick(e)}
          className="relative cursor-pointer"
          title='לעדכן מיקום'
        >
          <Cat 
            size={56}
            className={`transition-all duration-300 text-blue-900 hover:text-blue-700
              ${isOpen ? 'scale-150' : ''}`}
          />
        </div>

        {isOpen && (
          <div 
            ref={tooltipRef}
            style={tooltipPosition}
            className="absolute bottom-full mb-2 bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-200"
          >
            <div className="space-y-3">
              <button 
                className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 transition-colors duration-200 text-sm font-medium"
                onClick={() => setShowResetDialog(true)}
              >
                לתחילת הרשימה
              </button>
              
              <button 
                className="w-full py-2 px-4 bg-blue-50 hover:bg-blue-100 rounded-md text-blue-900 transition-colors duration-200 text-sm font-medium"
                onClick={() => setShowPositionDialog(true)}
              >
                לבחור מיקום אחר ברשימה
              </button>
            </div>
            
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-r border-b border-gray-200" />
          </div>
        )}
      </div>

      <ResetDialog 
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleResetConfirm}
        error={error}
      />

      <PositionDialog 
        isOpen={showPositionDialog}
        onClose={() => setShowPositionDialog(false)}
        onSubmit={handlePositionSubmit}
        position={position}
        setPosition={setPosition}
        error={error}
      />
    </>
  );
}

export default SequenceReset;