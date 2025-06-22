import React, { ReactNode } from 'react';
import Navbar from './Navbar'; // Assuming Navbar.tsx is in the same directory
// import { useAuth } from '../../contexts/AuthContext'; // If needed for conditional rendering based on auth state
// import { Navigate } from 'react-router-dom'; // If you want to protect routes

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // const { user, loading } = useAuth(); // Example: Get auth state

  // Example: Redirect to login if not authenticated and not loading
  // if (!loading && !user) {
  //   return <Navigate to="/login" replace />;
  // }

  // Example: Show a loader while auth state is loading
  // if (loading) {
  //   return <div>Loading authentication...</div>;
  // }

  return (
    <div className="flex h-screen bg-background"> {/* Ensure full height */}
      {/* Sidebar is part of Navbar and Navbar is rendered here */}
      <Navbar /> {/* Navbar now only contains TopNav essentially */}

      {/* Main content area */}
      {/* The TopNav is fixed (h-16, so pt-16 for main content area).
          There is no more persistent sidebar, so pl-0 is the default. */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16">
          {/* Removed lg:pl-64 as there's no more fixed sidebar */}
          <div className="p-4 sm:p-6">
            {children} {/* This is where <Outlet /> will render the page content */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
