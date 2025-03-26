import React, { Suspense } from 'react';
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
import SalesReportsPage from './pages/SalesReportsPage';
import { Toaster } from "@/components/ui/toaster";
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy-loaded component
const EditProduct = React.lazy(() => import('./pages/EditProduct'));

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <RouterProvider
          router={createBrowserRouter([
            {
              path: "/",
              element: <AppLayout />,
              errorElement: <ErrorBoundary />,
              children: [
                {
                  index: true,
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
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <EditProduct />
                    </Suspense>
                  ),
                },
                {
                  path: "/sales",
                  element: <Sales />,
                },
                {
                  path: "/settings",
                  element: <Settings />,
                },
                {
                  path: "/reports",
                  element: <SalesReportsPage />,
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
