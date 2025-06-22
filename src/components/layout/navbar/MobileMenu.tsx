
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

// This component is now just a button to toggle the main Sidebar visibility on mobile.
// The Sidebar itself (with its NavLinks) is controlled by Navbar.tsx state.

interface MobileMenuProps {
  toggleSidebar: () => void;
}

export function MobileMenu({ toggleSidebar }: MobileMenuProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden" // Only show on screens smaller than lg
      onClick={toggleSidebar}
      aria-label="Abrir menu"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
