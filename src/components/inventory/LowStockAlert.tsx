
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Product } from '@/hooks/useProducts';

interface LowStockAlertProps {
  lowStockProducts: Product[];
  onViewAll: () => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockProducts, onViewAll }) => {
  if (lowStockProducts.length === 0) {
    return null;
  }
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Alerta de Estoque Baixo</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>
          {lowStockProducts.length === 1
            ? "1 produto está com estoque abaixo do mínimo"
            : `${lowStockProducts.length} produtos estão com estoque abaixo do mínimo`}
        </p>
        <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
          {lowStockProducts.slice(0, 3).map(product => (
            <div key={product.id} className="text-sm">
              <span className="font-medium">{product.name}:</span> {product.stock} un. (min: {product.min_stock || 5})
            </div>
          ))}
          {lowStockProducts.length > 3 && (
            <div className="text-sm italic">E mais {lowStockProducts.length - 3} produtos...</div>
          )}
        </div>
        <Button size="sm" variant="outline" className="mt-2 bg-background" onClick={onViewAll}>
          Ver Todos
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default LowStockAlert;
