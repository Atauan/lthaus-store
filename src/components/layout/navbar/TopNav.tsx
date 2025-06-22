
import React from 'react';
import { Link } from 'react-router-dom';
import { MobileMenu } from './MobileMenu';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';

interface TopNavProps {
  toggleSidebar: () => void; // Added prop
}

export function TopNav({ toggleSidebar }: TopNavProps) { // Destructure prop
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-4">
          {/* Pass toggleSidebar to MobileMenu */}
          <MobileMenu toggleSidebar={toggleSidebar} />

          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl hidden sm:inline">
              Lthaus Imports
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <SearchBar />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
