import React from 'react';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SaleItem } from '../types/salesTypes';

interface SelectedItemsListProps {
  items: SaleItem[];
  onQuantityChange: (index: number, increment: boolean) => void;
  onRemoveItem: (index: number) => void;
}

const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
  items,
  onQuantityChange,
  onRemoveItem
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg h-[200px]">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-center">
          Nenhum item adicionado
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Selecione produtos ou serviços para adicionar à venda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-4 max-h-[300px] overflow-auto pr-1">
      {items.map((item, index) => (
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
              onClick={() => onQuantityChange(index, false)}
              type="button"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center">{item.quantity}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onQuantityChange(index, true)}
              type="button"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
              onClick={() => onRemoveItem(index)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedItemsList;
