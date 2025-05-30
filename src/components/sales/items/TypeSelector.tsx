
import React from 'react';
import { ShoppingCart, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TypeSelectorProps {
  selectedType: 'product' | 'service';
  setSelectedType: React.Dispatch<React.SetStateAction<'product' | 'service'>>;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, setSelectedType }) => {
  return (
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
  );
};

export default TypeSelector;
