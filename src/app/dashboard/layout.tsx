'use client';

import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole, triggerFileInput, handleFileUpload, simulateMockScan, fileInputRef } = useAppContext();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect to login if no role
  useEffect(() => {
    if (!userRole) {
      router.push('/');
    }
  }, [userRole, router]);

  if (!userRole) return null;

  return (
    <div className="flex min-h-screen bg-almirall-bg text-gray-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto custom-scrollbar">
          <Header 
            userRole={userRole}
            onSimulateMock={simulateMockScan} 
            onScanClick={triggerFileInput} 
            onLogout={() => {}}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
          
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <main className="w-full max-w-[1500px] mx-auto mt-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
