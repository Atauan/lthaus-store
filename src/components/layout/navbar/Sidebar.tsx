
import React from 'react';
import { NavLink } from './NavLink';
import { NavigationItems } from './navigationItems';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-white p-4 hidden lg:block">
      <div className="space-y-1">
        {NavigationItems.map((link) => (
          <NavLink
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
