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
      <Navbar />

      {/* Main content area */}
      {/* The TopNav is fixed, so content should start below it. */}
      {/* The Sidebar is also fixed, so content should be to the right of it on larger screens. */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* This div will handle the main content flow.
            pt-16 ensures content starts below the fixed TopNav.
            lg:pl-64 ensures content starts to the right of the Sidebar on large screens.
            On smaller screens (less than lg), pl-0 (default) is used as Sidebar is hidden or overlaying.
        */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pt-16 lg:pl-64">
          <div className="p-4 sm:p-6"> {/* Use sm:p-6 for slightly larger padding on small screens and up */}
            {children} {/* This is where <Outlet /> will render the page content */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
