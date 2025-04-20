'use client'
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

// אירוע מותאם לתקשורת בין טולטיפים
if (typeof window !== 'undefined') {
  window.tooltipEvent = window.tooltipEvent || new EventTarget();
}

export default function Tooltip({ content, children }) {
  const [open, setOpen] = React.useState(false)
  const tooltipRef = React.useRef(null)
  const uniqueId = React.useId()
  
  // האזנה לאירוע פתיחת טולטיפ
  React.useEffect(() => {
    const handleOtherTooltipOpen = (e) => {
      if (e.detail !== uniqueId && open) {
        setOpen(false);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.tooltipEvent.addEventListener('tooltip-open', handleOtherTooltipOpen);
      
      return () => {
        window.tooltipEvent.removeEventListener('tooltip-open', handleOtherTooltipOpen);
      };
    }
  }, [uniqueId, open]);
  
  // לחיצה על הטולטיפ
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !open;
    setOpen(newState);
    
    // אם פותחים, שולחים אירוע החוצה
    if (newState && typeof window !== 'undefined') {
      window.tooltipEvent.dispatchEvent(
        new CustomEvent('tooltip-open', { detail: uniqueId })
      );
    }
  };

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open}>
        <TooltipPrimitive.Trigger asChild>
          <div 
            className="cursor-pointer" 
            onClick={handleToggle}
            onTouchEnd={handleToggle}
          >
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        {open && (
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              ref={tooltipRef}
              className="bg-white text-sm text-black p-3 rounded shadow-lg text-right whitespace-pre-line z-[9999] border border-black"
              sideOffset={5}
              dir="rtl"
              style={{ maxWidth: '90vw' }}
              onPointerDownOutside={() => setOpen(false)}
              onEscapeKeyDown={() => setOpen(false)}
            >
              <div className="text-right">
                {content}
              </div>
              <TooltipPrimitive.Arrow className="fill-white stroke-black" />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}