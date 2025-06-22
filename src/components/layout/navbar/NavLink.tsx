
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface NavLinkProps {
  path: string;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
  onClick?: () => void; // Added onClick prop for closing sidebar on mobile
}

export function NavLink({ path, icon, label, isMobile = false, onClick }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path) && path.length > 1);

  // Base classes
  let linkClasses = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm";

  if (isMobile) {
    // Classes for mobile (e.g., inside a Sheet)
    linkClasses += isActive
      ? ' bg-primary text-primary-foreground'
      : ' hover:bg-accent hover:text-accent-foreground text-foreground';
    linkClasses += ' w-full text-base py-3'; // Ensure full width for mobile list items
  } else {
    // Classes for TopNav (non-mobile)
    // For TopNav, active state might be just a color change or underline, not a background
    linkClasses += isActive
      ? ' text-primary font-semibold' // Example: primary color text and bold for active TopNav link
      : ' hover:text-primary text-muted-foreground'; // Example: lighter text, hover to primary
    // Remove icon on very small screens within topnav if needed, or ensure it's small
    // The label might be hidden on some screen sizes for TopNav items if space is an issue
  }

  return (
    <Link
      to={path}
      onClick={onClick}
      className={linkClasses}
    >
      {icon && React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })} {/* Ensure icons are small */}
      <span>{label}</span>
    </Link>
  );
}
