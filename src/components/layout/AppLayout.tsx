
import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/layout/navbar/TopNav';
import { Sidebar } from '@/components/layout/navbar/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './navbar/MobileMenu';
import { Toaster } from '@/components/ui/sonner';

export const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background relative">
      <TopNav />
      
      {!isMobile && <Sidebar />}
      
      <main className="min-h-screen pt-16 pb-16 lg:pb-0 lg:pl-64 transition-all duration-300">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
      
      {isMobile && <MobileMenu />}
      
      <Toaster position="top-right" richColors />
    </div>
  );
};
