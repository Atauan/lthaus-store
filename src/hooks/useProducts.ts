
import { useState } from 'react';

// Sample product data (in a real app, this would come from an API)
export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  cost?: number;
  stock: number;
  image: string;
}

// Using the same product data
const initialProducts = [
  { 
    id: 1, 
    name: 'Cabo Lightning', 
    description: 'Cabo para iPhone com conector Lightning',
    category: 'Cabos',
    brand: 'Generic',
    price: 29.90,
    cost: 15.50,
    stock: 45,
    image: '/placeholder.svg'
  },
  { 
    id: 2, 
    name: 'Capa iPhone 13', 
    description: 'Capa transparente para iPhone 13',
    category: 'Capas',
    brand: 'Apple',
    price: 79.90,
    cost: 45.00,
    stock: 23,
    image: '/placeholder.svg'
  },
  { 
    id: 3, 
    name: 'Fone de Ouvido Bluetooth', 
    description: 'Fone sem fio com cancelamento de ruído',
    category: 'Áudio',
    brand: 'JBL',
    price: 149.90,
    cost: 85.50,
    stock: 12,
    image: '/placeholder.svg'
  },
  { 
    id: 4, 
    name: 'Carregador 20W', 
    description: 'Carregador rápido USB-C',
    category: 'Carregadores',
    brand: 'Anker',
    price: 89.90,
    cost: 55.00,
    stock: 18,
    image: '/placeholder.svg'
  },
  { 
    id: 5, 
    name: 'Película de Vidro', 
    description: 'Película de vidro temperado para Samsung',
    category: 'Proteção',
    brand: 'Generic', 
    price: 19.90,
    cost: 8.50,
    stock: 56,
    image: '/placeholder.svg'
  },
  { 
    id: 6, 
    name: 'Suporte para Carro', 
    description: 'Suporte veicular magnético',
    category: 'Acessórios',
    brand: 'Generic',
    price: 49.90,
    cost: 22.50,
    stock: 9,
    image: '/placeholder.svg'
  },
];

export const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
export const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  return {
    products,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    updateProduct
  };
}
