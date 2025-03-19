
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface StockUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: number, newStock: number, notes: string) => void;
  products: Product[];
  selectedProductId: number | null;
}

const StockUpdateDialog = ({ 
  isOpen, 
  onClose, 
  onUpdate, 
  products,
  selectedProductId 
}: StockUpdateDialogProps) => {
  const [productId, setProductId] = useState<number | ''>('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [newStock, setNewStock] = useState<number>(0);
  const [stockChangeType, setStockChangeType] = useState<'absolute' | 'increment' | 'decrement'>('absolute');
  const [stockChange, setStockChange] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (selectedProductId) {
        setProductId(selectedProductId);
        const product = products.find(p => p.id === selectedProductId);
        if (product) {
          setCurrentStock(product.stock);
          setNewStock(product.stock);
        }
      } else {
        setProductId('');
        setCurrentStock(0);
        setNewStock(0);
      }
      setStockChangeType('absolute');
      setStockChange(0);
      setNotes('');
    }
  }, [isOpen, selectedProductId, products]);
  
  // Update product selection
  const handleProductChange = (id: string) => {
    const numId = parseInt(id);
    setProductId(numId);
    
    const product = products.find(p => p.id === numId);
    if (product) {
      setCurrentStock(product.stock);
      setNewStock(product.stock);
    }
  };
  
  // Update new stock based on change type and amount
  const handleStockChangeTypeChange = (type: 'absolute' | 'increment' | 'decrement') => {
    setStockChangeType(type);
    
    if (type === 'absolute') {
      setNewStock(stockChange);
    } else if (type === 'increment') {
      setNewStock(currentStock + stockChange);
    } else if (type === 'decrement') {
      setNewStock(Math.max(0, currentStock - stockChange));
    }
  };
  
  // Handle stock change amount
  const handleStockChangeAmount = (amount: number) => {
    setStockChange(amount);
    
    if (stockChangeType === 'absolute') {
      setNewStock(amount);
    } else if (stockChangeType === 'increment') {
      setNewStock(currentStock + amount);
    } else if (stockChangeType === 'decrement') {
      setNewStock(Math.max(0, currentStock - amount));
    }
  };
  
  // Submit form
  const handleSubmit = () => {
    if (!productId) {
      return;
    }
    
    onUpdate(
      productId as number, 
      newStock, 
      notes || `${stockChangeType === 'absolute' ? 'Definido' : stockChangeType === 'increment' ? 'Incrementado' : 'Decrementado'} novo valor de estoque`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Atualizar Estoque
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto</Label>
            <Select 
              value={productId.toString()} 
              onValueChange={handleProductChange}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name} (Em estoque: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estoque Atual</Label>
              <Input 
                value={currentStock} 
                disabled 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Novo Estoque</Label>
              <Input 
                value={newStock} 
                disabled 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Alteração</Label>
            <Select 
              value={stockChangeType} 
              onValueChange={(value) => handleStockChangeTypeChange(value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="absolute">Definir Valor Absoluto</SelectItem>
                <SelectItem value="increment">Adicionar Unidades</SelectItem>
                <SelectItem value="decrement">Remover Unidades</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">
              {stockChangeType === 'absolute' 
                ? 'Novo Valor de Estoque' 
                : stockChangeType === 'increment' 
                  ? 'Quantidade a Adicionar' 
                  : 'Quantidade a Remover'}
            </Label>
            <Input 
              id="amount"
              type="number" 
              min="0" 
              value={stockChange} 
              onChange={(e) => handleStockChangeAmount(parseInt(e.target.value) || 0)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea 
              id="notes"
              placeholder="Motivo da alteração de estoque..." 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!productId}>Atualizar Estoque</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockUpdateDialog;
