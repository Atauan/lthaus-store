
import React from 'react';
import { NavLink } from './NavLink';
import { NavigationItems } from './navigationItems';

export function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar?: () => void }) {
  // Added isOpen and toggleSidebar props
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-64 border-r bg-white p-4 transition-transform duration-300 ease-in-out z-40 lg:translate-x-0 lg:top-16
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* On small screens, allow sidebar to be closed by clicking outside or a dedicated button (could be in MobileMenu) */}
      {/* The lg:top-16 adjusts for the TopNav height on large screens where Sidebar is permanently visible below TopNav */}
      {/* z-40 to be below TopNav (z-50) but above content */}

      <div className="space-y-1 mt-16 lg:mt-0"> {/* mt-16 for spacing below TopNav on mobile when sidebar is open, lg:mt-0 for normal layout */}
        {NavigationItems.map((link) => (
          <NavLink
            onClick={toggleSidebar} // Close sidebar on link click on mobile
            key={link.path}
            path={link.path}
            icon={link.icon}
            label={link.label}
          />
        ))}
      </div>
    </aside>
  );
}
