import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import NewSale from './pages/NewSale';
import EditSale from './pages/EditSale';
import Settings from './pages/Settings';
import SalesDashboard from './pages/SalesDashboard';

function App() {
  return (
    <div className="app">
      <div className="app-container">
        <RouterProvider
          router={createBrowserRouter([
            {
              element: (
                <AppLayout />
              ),
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
                  path: "/sales",
                  element: <Sales />,
                },
                {
                  path: "/sales/new",
                  element: <NewSale />,
                },
                {
                  path: "/sales/edit/:id",
                  element: <EditSale />,
                },
                {
                  path: "/settings",
                  element: <Settings />,
                },
              ],
            },
          ])}
        />
      </div>
    </div>
  );
}

export default App;
