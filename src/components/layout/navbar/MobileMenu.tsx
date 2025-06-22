
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react'; // Added X for close button
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { NavLink } from './NavLink'; // Assuming NavLink is styled for mobile via isMobile prop
import { Link } from 'react-router-dom'; // For the main site title/link

interface NavigationItem {
  path: string;
  icon: React.ReactNode;
  label: string;
}

interface MobileMenuProps {
  navigationItems: NavigationItem[];
  // toggleSidebar prop is no longer needed as Sheet handles its own state via SheetTrigger/SheetClose
}

export function MobileMenu({ navigationItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2" // Only show on screens smaller than lg, add some margin
          aria-label="Abrir menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0"> {/* Adjusted width, removed padding for full control */}
        <SheetHeader className="p-4 border-b flex flex-row justify-between items-center">
          <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
            {/* Optionally, add an icon/logo here */}
            <SheetTitle className="text-lg font-semibold">Lthaus Imports</SheetTitle>
          </Link>
          <SheetClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              isMobile={true} // Ensure NavLink styles for mobile
              onClick={() => setIsOpen(false)} // Close sheet on link click
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
