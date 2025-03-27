import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sampleProducts, sampleServices } from './data/sampleData';
import { SaleItem } from './types/salesTypes';
import TypeSelector from './items/TypeSelector';
import SearchBar from './items/SearchBar';
import ProductNotFound from './items/ProductNotFound';
import ItemList from './items/ItemList';
import SelectedItemsList from './items/SelectedItemsList';

interface ItemsSectionProps {
  selectedItems: SaleItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SaleItem[]>>;
}

const ItemsSection: React.FC<ItemsSectionProps> = ({ selectedItems, setSelectedItems }) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'product' | 'service'>('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductNotFound, setShowProductNotFound] = useState(false);

  const filteredProducts = selectedType === 'product' 
    ? sampleProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleServices.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleAddItem = (item: any) => {
    const existingItemIndex = selectedItems.findIndex(
      i => i.id === item.id && i.type === selectedType
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: item.id,
          type: selectedType,
          name: item.name,
          price: item.price,
          cost: selectedType === 'product' ? item.cost : undefined,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, increment: boolean) => {
    const updatedItems = [...selectedItems];
    if (increment) {
      updatedItems[index].quantity += 1;
    } else if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
    }
    setSelectedItems(updatedItems);
  };

  const handleProductNotFound = () => {
    setShowProductNotFound(true);
  };

  const handleRegisterNewProduct = () => {
    navigate('/products/add');
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Produtos e Serviços</h2>
        <TypeSelector 
          selectedType={selectedType} 
          setSelectedType={setSelectedType} 
        />
      </div>
      
      <SearchBar 
        type={selectedType} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {showProductNotFound && (
        <ProductNotFound 
          searchQuery={searchQuery}
          onClose={() => setShowProductNotFound(false)}
          onRegister={handleRegisterNewProduct}
        />
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <ItemList 
          items={filteredProducts}
          type={selectedType}
          onAddItem={handleAddItem}
          onNotFoundAction={handleProductNotFound}
        />
        
        <div>
          <h3 className="text-sm font-medium mb-2">Itens Selecionados</h3>
          <SelectedItemsList 
            items={selectedItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ItemsSection;
