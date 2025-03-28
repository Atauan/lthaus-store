
import { useState, useEffect } from 'react';
import { Product } from './types';

export function useProductFilters(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Filter products based on search query, category, and brand
  useEffect(() => {
    const filtered = products.filter(product => {
      // Filter by search query (name, id, or description)
      const matchesSearch = !searchQuery 
        || product.name.toLowerCase().includes(searchQuery.toLowerCase())
        || product.id.toString().includes(searchQuery)
        || (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by category
      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      
      // Filter by brand
      const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
      
      return matchesSearch && matchesCategory && matchesBrand;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedBrand]);

  return {
    filteredProducts,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand
  };
}
