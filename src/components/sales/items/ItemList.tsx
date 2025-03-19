
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ItemListProps {
  items: any[];
  type: 'product' | 'service';
  onAddItem: (item: any) => void;
  onNotFoundAction: () => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, type, onAddItem, onNotFoundAction }) => {
  return (
    <div className="bg-muted/20 rounded-lg p-3 max-h-[300px] overflow-auto">
      <h3 className="text-sm font-medium mb-2">
        {type === 'product' ? 'Produtos' : 'Serviços'} Disponíveis
      </h3>
      
      {items.length > 0 ? (
        <div className="divide-y">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="py-2 hover:bg-muted/30 transition-colors flex justify-between items-center cursor-pointer"
              onClick={() => onAddItem(item)}
            >
              <div>
                <h4 className="font-medium text-sm">{item.name}</h4>
                <div className="flex gap-2 items-center">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">
                    {item.category}
                  </span>
                  {type === 'product' && (
                    <span className={`text-xs ${item.stock <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {item.stock} em estoque
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
                    onAddItem(item);
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
            Nenhum {type === 'product' ? 'produto' : 'serviço'} encontrado
          </p>
          {type === 'product' && (
            <Button onClick={onNotFoundAction} type="button" size="sm">
              Cadastrar Novo Produto
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemList;
