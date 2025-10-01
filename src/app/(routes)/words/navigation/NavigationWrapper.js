// app/words/navigation/NavigationWrapper.js
'use client';

import { useState } from 'react';
import NextAndPrevious from "./components/nextAndPrevious";
import StatusIcons from './components/statusIcons';
import ProContent from '@/components/auth/ProContent';
import GuestContent from '@/components/auth/GuestContent';
import SequenceReset from './personalGuide/components/sequenceReset';

export default function NavigationWrapper({ index, category, categorySize }) {
  const [useBasicRating, setUseBasicRating] = useState(false);

  return (
    <>
      {/* מערכת דירוג למנויים - ללא חסימה של אורחים */}
      <ProContent 
        requireAuth={false}  // לא חוסמים משתמשים לא מחוברים!
        expiredFallback={
          // משתמש פג תוקף שבחר מערכת בסיסית
          useBasicRating ? (
            <NextAndPrevious index={index} categorySize={categorySize} />
          ) : null  // אם לא בחר - לא מציגים כלום (רק ההודעה תוצג)
        }
        onSwitchToBasic={() => setUseBasicRating(true)}
        showExpiredNotification={!useBasicRating}
      >
        {/* מערכת חכמה למנויים פעילים */}
        <StatusIcons index={index} category={category}/>
        <SequenceReset/>
      </ProContent>
      
      {/* מערכת בסיסית לאורחים (לא מחוברים) */}
      <GuestContent>
        <NextAndPrevious index={index} categorySize={categorySize} />
      </GuestContent>
    </>
  );
}