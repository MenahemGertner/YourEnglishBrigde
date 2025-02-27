import React from 'react';
import Hero from '../components/homePage/hero';
import MethodAdvantages from '@/components/homePage/methodAdvantages';
import UserComparison from '@/components/homePage/userComparison'

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <Hero />
      <div className="mb-16">
        <MethodAdvantages />
        </div>
        <UserComparison/>      
    </main>
  );
}