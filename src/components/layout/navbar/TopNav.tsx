
import React from 'react';
import { Link } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink for DropdownMenu
import React from 'react'; // Import React for React.cloneElement
import { ChevronDown } from 'lucide-react'; // Import ChevronDown for "More" dropdown
import { Button } from '@/components/ui/button'; // Import Button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import DropdownMenu components

import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { NavigationItems } from './navigationItems';
import { NavLink } from './NavLink';

interface TopNavProps {
  // toggleSidebar is no longer needed as MobileMenu handles its own state.
  // We can remove it or make it optional if there's a transitional period.
  // For now, let's remove it.
}

export function TopNav({}: TopNavProps) { // Removed toggleSidebar from props
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-6">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center">
          <MobileMenu navigationItems={NavigationItems} />

          <Link to="/" className="flex items-center gap-2 ml-3"> {/* Added ml-3 for spacing from menu icon */}
            <span className="font-bold text-xl hidden sm:inline">
              Lthaus Imports
            </span>
          </Link>

          {/* Navigation Links for larger screens */}
          <div className="hidden lg:flex items-center gap-1 ml-6">
            {NavigationItems.slice(0, 4).map((item) => ( // Show first 4 items directly
              <NavLink
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
            {NavigationItems.length > 4 && ( // If there are more than 4 items, show a "More" dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm px-3 py-2 flex items-center gap-1">
                    Mais <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {NavigationItems.slice(4).map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <RouterLink to={item.path} className="flex items-center gap-2 w-full">
                        {React.cloneElement(item.icon as React.ReactElement, { className: "h-4 w-4" })}
                        {item.label}
                      </RouterLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3"> {/* Increased gap slightly */}
          <SearchBar />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
