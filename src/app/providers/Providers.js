'use client'
import { WindowProvider } from './WindowContext'

export default function Providers({ children }) {
  return (
    <WindowProvider>
      {children}
    </WindowProvider>
  );
}