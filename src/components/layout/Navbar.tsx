
import React, { useState, useCallback } from 'react';
import { TopNav } from './navbar/TopNav';
import { Sidebar } from './navbar/Sidebar';
import { useMediaQuery } from '../../hooks/use-mobile'; // Assuming you have a hook like this or similar logic

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1023px)'); // lg breakpoint in Tailwind

  const toggleSidebar = useCallback(() => {
    if (isMobile) { // Only allow toggle on mobile
      setSidebarOpen(prev => !prev);
    }
  }, [isMobile]);

  return (
    <>
      {/* Pass toggleSidebar to TopNav for the MobileMenu button */}
      <TopNav toggleSidebar={toggleSidebar} />
      {/* Pass isOpen and toggleSidebar to Sidebar */}
      <Sidebar isOpen={isMobile ? sidebarOpen : true} toggleSidebar={isMobile ? toggleSidebar : undefined} />

      {/* Optional: Overlay for closing sidebar on mobile when clicking outside */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
