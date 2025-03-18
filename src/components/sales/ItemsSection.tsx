
import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Wrench, 
  Plus, 
  Minus, 
  Search, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/custom/GlassCard';
import { sampleProducts, sampleServices } from './data/sampleData';
import { SaleItem } from './types/salesTypes';
import { useNavigate } from 'react-router-dom';

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
        
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'product' ? 'default' : 'outline'}
            onClick={() => setSelectedType('product')}
            type="button"
            size="sm"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Produtos
          </Button>
          <Button
            variant={selectedType === 'service' ? 'default' : 'outline'}
            onClick={() => setSelectedType('service')}
            type="button"
            size="sm"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Serviços
          </Button>
        </div>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder={`Buscar ${selectedType === 'product' ? 'produtos' : 'serviços'}...`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {showProductNotFound && (
        <GlassCard className="bg-amber-50/30 border border-amber-200 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">Produto não encontrado</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Deseja cadastrar "{searchQuery}" como novo produto?
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowProductNotFound(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleRegisterNewProduct}
                type="button"
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-muted/20 rounded-lg p-3 max-h-[300px] overflow-auto">
          <h3 className="text-sm font-medium mb-2">
            {selectedType === 'product' ? 'Produtos' : 'Serviços'} Disponíveis
          </h3>
          
          {filteredProducts.length > 0 ? (
            <div className="divide-y">
              {filteredProducts.map((item) => (
                <div 
                  key={item.id} 
                  className="py-2 hover:bg-muted/30 transition-colors flex justify-between items-center cursor-pointer"
                  onClick={() => handleAddItem(item)}
                >
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="flex gap-2 items-center">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">
                        {item.category}
                      </span>
                      {selectedType === 'product' && (
                        <span className={`text-xs ${(item as any).stock <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {(item as any).stock} em estoque
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-sm">R$ {item.price.toFixed(2)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(item);
                      }}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted-foreground text-sm mb-3">
                Nenhum {selectedType === 'product' ? 'produto' : 'serviço'} encontrado
              </p>
              {selectedType === 'product' && (
                <Button onClick={handleProductNotFound} type="button" size="sm">
                  Cadastrar Novo Produto
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Itens Selecionados</h3>
          {selectedItems.length > 0 ? (
            <div className="space-y-2 mb-4 max-h-[300px] overflow-auto pr-1">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{item.name}</h5>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">
                        R$ {item.price.toFixed(2)} x {item.quantity}
                      </p>
                      {item.cost && (
                        <p className="text-xs text-green-600">
                          Lucro: R$ {((item.price - item.cost) * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={() => handleQuantityChange(index, false)}
                      type="button"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 w-7 p-0"
                      onClick={() => handleQuantityChange(index, true)}
                      type="button"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveItem(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg h-[200px]">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-center">
                Nenhum item adicionado
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Selecione produtos ou serviços para adicionar à venda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsSection;
