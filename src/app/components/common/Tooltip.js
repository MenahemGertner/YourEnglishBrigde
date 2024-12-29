'use client'
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Tooltip({ content, children }) {
  const [open, setOpen] = React.useState(false)
  const tooltipRef = React.useRef(null)

  // מטפל באירועי קליק מחוץ לטולטיפ
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        event.stopPropagation()
      }
    }

    if (open) {
      document.addEventListener('click', handleClickOutside, true)
      return () => document.removeEventListener('click', handleClickOutside, true)
    }
  }, [open])

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={open}>
        <TooltipPrimitive.Trigger asChild onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}>
          <div className="cursor-pointer">
            {children}
          </div>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            ref={tooltipRef}
            className="bg-white text-sm text-black p-3 rounded shadow-lg text-center whitespace-pre-line z-[9999] border border-black"
            onPointerDownOutside={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen(false)
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            sideOffset={5}
            dir="ltr"
            style={{ maxWidth: '90vw' }}
          >
            <div 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              {content}
            </div>
            <TooltipPrimitive.Arrow className="fill-white stroke-black" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}