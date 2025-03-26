
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import Settings from './pages/Settings';
import SalesDashboard from './pages/SalesDashboard';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <RouterProvider
          router={createBrowserRouter([
            {
              element: <AppLayout />,
              errorElement: <ErrorBoundary />,
              children: [
                {
                  path: "/",
                  element: <Navigate to="/dashboard" replace />,
                },
                {
                  path: "/dashboard",
                  element: <Dashboard />,
                },
                {
                  path: "/analytics",
                  element: <SalesDashboard />,
                },
                {
                  path: "/products",
                  element: <Products />,
                },
                {
                  path: "/products/edit/:productId",
                  element: <React.lazy(() => import('./pages/EditProduct')) />,
                },
                {
                  path: "/sales",
                  element: <Sales />,
                },
                {
                  path: "/settings",
                  element: <Settings />,
                }
              ]
            }
          ])}
        />
        <Toaster />
      </div>
    </div>
  );
}

export default App;
