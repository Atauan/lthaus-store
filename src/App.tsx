
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Index from './pages/Index';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import UserManagement from './pages/UserManagement';
import SalesForm from './components/sales/SalesForm';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import UpdatePassword from './pages/Auth/UpdatePassword';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './hooks/use-theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Protected route component with role-based access
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [] 
}: { 
  children: React.ReactNode, 
  requiredRoles?: Array<'admin' | 'manager' | 'salesperson'> 
}) => {
  const { session, isLoading, user } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // If specific roles are required, check if the user has the required role
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/cadastro" element={<Register />} />
      <Route path="/auth/recuperar-senha" element={<ResetPassword />} />
      <Route path="/auth/atualizar-senha" element={<UpdatePassword />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/products/add" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><AddProduct /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/sales/new" element={<ProtectedRoute><SalesForm /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute requiredRoles={['admin', 'manager']}><Suppliers /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute requiredRoles={['admin']}><UserManagement /></ProtectedRoute>} />
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Toaster position="top-right" />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
