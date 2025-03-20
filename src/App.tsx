
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Index from './pages/Index';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Suppliers from './pages/Suppliers';
import UserManagement from './pages/UserManagement';
import SalesForm from './components/sales/SalesForm';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './hooks/use-theme';
import './App.css';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - All routes are public for now until auth is finished */}
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/add" element={<AddProduct />} />
      <Route path="/products/edit/:productId" element={<EditProduct />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/sales/new" element={<SalesForm />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/users" element={<UserManagement />} />
      
      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
