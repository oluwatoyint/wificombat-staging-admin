"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BtnLoader from './components/btnLoader/BtnLoader';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Automatically redirect to the /login page
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <BtnLoader />
    </div>
  );
}

