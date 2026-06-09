'use client';

import { LoginScreen } from '@/components/LoginScreen';
import { UserRole } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { userRole, setUserRole } = useAppContext();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (userRole) {
      router.push('/dashboard');
    }
  }, [userRole, router]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  if (userRole) {
    return null; // Prevents flashing before redirect
  }

  return (
    <div className="min-h-screen bg-almirall-bg flex flex-col font-sans">
      <LoginScreen onLogin={handleLogin} />
    </div>
  );
}
