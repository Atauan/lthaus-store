
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton, SidebarTrigger, 
  SidebarInset } from './components/ui/sidebar';
import { NavigationItems } from './components/layout/navbar/navigationItems';
import { TopNav } from './components/layout/navbar/TopNav';

// Import your page components
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import UpdatePassword from './pages/Auth/UpdatePassword';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import UserManagement from './pages/UserManagement';
import Sales from './pages/Sales';
import SalesForm from './components/sales/SalesForm';
import Settings from './pages/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MainSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarContent>
        <SidebarMenu>
          {NavigationItems.map((link) => (
            <SidebarMenuItem key={link.path}>
              <SidebarMenuButton asChild tooltip={link.label}>
                <a href={link.path}>
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen w-full flex bg-background">
              <MainSidebar />
              <SidebarInset>
                <TopNav />
                <div className="container mx-auto px-4 pt-16 pb-10">
                  <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/add" element={<AddProduct />} />
                    <Route path="/products/edit/:id" element={<EditProduct />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/sales/new" element={<SalesForm />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/users" element={<UserManagement />} />

                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/update-password" element={<UpdatePassword />} />

                    {/* Not found */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </Router>
      </AuthProvider>
      <Toaster />
      <SonnerToaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
