
import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '@/components/layout/navbar/TopNav';
import Sidebar from '@/components/layout/navbar/Sidebar';
import { useMediaQuery } from '@/hooks/use-mobile';
import MobileMenu from './navbar/MobileMenu';
import { Toaster } from '@/components/ui/sonner';

export const AppLayout = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');

  return (
    <div className="min-h-screen bg-background relative">
      <TopNav />
      
      {!isMobile && <Sidebar />}
      {isMobile && <MobileMenu />}
      
      <main className={`min-h-screen ${!isMobile ? 'lg:pl-64' : ''} pt-16`}>
        <Outlet />
      </main>
      
      <Toaster position="top-right" richColors />
    </div>
  );
};
