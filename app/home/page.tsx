"use client"

import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import HeroSection from "./hero"
import { TrendingSection, PopularSection } from "./sections"
import ContinueWatching from './continue-watching';

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      <HeroSection />
      {userId && <ContinueWatching userId={userId} />}
      <TrendingSection />
      <PopularSection />
    </div>
  )
}
