
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Sales = React.lazy(() => import('@/pages/Sales'));
const NewSale = React.lazy(() => import('@/pages/NewSale'));
const Products = React.lazy(() => import('@/pages/Products'));
const Customers = React.lazy(() => import('@/pages/Customers'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 pt-16 lg:pl-64">
            <div className="container mx-auto p-4 md:p-6">
              <Suspense fallback={<LoadingScreen />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/sales/new" element={<NewSale />} />
                  <Route path="/sales/edit/:id" element={<NewSale />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </div>
          </main>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
