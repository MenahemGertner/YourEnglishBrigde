'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import NextAndPrevious from "./components/nextAndPrevious";
import StatusIcons from './components/statusIcons';
import ProgressBar from './components/progressBar';
import ProContent from '@/components/auth/ProContent';
import GuestContent from '@/components/auth/GuestContent';
import SequenceReset from './personalGuide/components/sequenceReset';
import Drawer from '@/components/dashboard/drawer';
import PersonalSettings from '@/components/dashboard/components/personalSettings';
import { Settings } from 'lucide-react';
import { useWordRating } from './hooks/useWordRating';

// NavigationWrapper.js
export default function NavigationWrapper({ index, category, categorySize }) {
  const { data: session } = useSession();
  const [useBasicRating, setUseBasicRating] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  
  // ה-hook המרכזי - מקור האמת היחיד
  const { 
    handleWordRating, 
    isLoading, 
    error,
    navigationState,
    handleNextCategory,
    practiceProgress 
  } = useWordRating({ index, category });

  const progressPercentage = practiceProgress
    ? Math.min((practiceProgress.counter / practiceProgress.threshold) * 100, 100)
    : 0;

  const openSettingsDrawer = () => setIsSettingsDrawerOpen(true);
  const closeSettingsDrawer = () => setIsSettingsDrawerOpen(false);

  return (
    <>
      <ProContent
        requireAuth={false}
        expiredFallback={
          useBasicRating ? (
            <NextAndPrevious index={index} categorySize={categorySize} />
          ) : null
        }
        onSwitchToBasic={() => setUseBasicRating(true)}
        showExpiredNotification={!useBasicRating}
      >
        <ProgressBar
          progress={progressPercentage}
          onOpenSettings={openSettingsDrawer}
        />

        <StatusIcons 
          index={index}
          category={category}
          onOpenSettings={openSettingsDrawer}
          // העברת הפונקציות והמצב מה-hook
          handleWordRating={handleWordRating}
          isLoading={isLoading}
          error={error}
          navigationState={navigationState}
          handleNextCategory={handleNextCategory}
        />

        <SequenceReset/>
      </ProContent>

      <GuestContent>
        <NextAndPrevious index={index} categorySize={categorySize} />
      </GuestContent>

      <Drawer
        isOpen={isSettingsDrawerOpen}
        onClose={closeSettingsDrawer}
        title="הגדרות אישיות"
        icon={<Settings className="w-6 h-6" />}
      >
        <PersonalSettings userId={session?.user?.id} />
      </Drawer>
    </>
  );
}