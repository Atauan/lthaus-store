import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/custom/GlassCard';

interface ProductNotFoundProps {
  searchQuery: string;
  onClose: () => void;
  onRegister: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ searchQuery, onClose, onRegister }) => {
  return (
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
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            onClick={onRegister}
            type="button"
          >
            Cadastrar
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProductNotFound;
