
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaleItem } from './types/salesTypes';
import { toast } from 'sonner';

interface AddTemporaryProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: SaleItem) => void;
}

const AddTemporaryProductDialog: React.FC<AddTemporaryProductDialogProps> = ({
  isOpen,
  onClose,
  onAddItem
}) => {
  const [activeTab, setActiveTab] = useState<'product' | 'service'>('product');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [quantity, setQuantity] = useState('1');
  
  const handleAddItem = () => {
    if (!name) {
      toast.error("Nome do item é obrigatório");
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      toast.error("Preço deve ser maior que zero");
      return;
    }
    
    if (!quantity || parseInt(quantity) <= 0) {
      toast.error("Quantidade deve ser maior que zero");
      return;
    }
    
    const newItem: SaleItem = {
      name,
      type: activeTab,
      price: parseFloat(price),
      cost: cost ? parseFloat(cost) : undefined,
      quantity: parseInt(quantity),
      custom_price: true
    };
    
    onAddItem(newItem);
    resetForm();
    onClose();
    toast.success(`${activeTab === 'product' ? 'Produto' : 'Serviço'} temporário adicionado`);
  };
  
  const resetForm = () => {
    setName('');
    setPrice('');
    setCost('');
    setQuantity('1');
    setActiveTab('product');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>
            Adicionar {activeTab === 'product' ? 'Produto' : 'Serviço'} Temporário
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'product' | 'service')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Produto</TabsTrigger>
            <TabsTrigger value="service">Serviço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="product" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Nome do Produto</Label>
              <Input 
                id="product-name" 
                placeholder="Nome do produto" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Preço (R$)</Label>
                <Input 
                  id="product-price" 
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-cost">Custo (R$)</Label>
                <Input 
                  id="product-cost" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product-quantity">Quantidade</Label>
              <Input 
                id="product-quantity" 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="service" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Nome do Serviço</Label>
              <Input 
                id="service-name" 
                placeholder="Nome do serviço" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service-price">Preço (R$)</Label>
                <Input 
                  id="service-price" 
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service-cost">Custo (R$)</Label>
                <Input 
                  id="service-cost" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-quantity">Quantidade</Label>
              <Input 
                id="service-quantity" 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddItem}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemporaryProductDialog;
