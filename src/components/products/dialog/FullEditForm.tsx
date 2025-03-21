
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, categories, brands } from '@/hooks/useProducts';
import ImageManager from './ImageManager';

interface FullEditFormProps {
  product: Product;
  onProductChange: (field: keyof Product, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FullEditForm: React.FC<FullEditFormProps> = ({
  product,
  onProductChange,
  onSave,
  onCancel
}) => {
  return (
    <>
      <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={product.name}
              onChange={(e) => onProductChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={product.description || ''}
              onChange={(e) => onProductChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={product.category}
                onValueChange={(value) => onProductChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'Todas').map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Select
                value={product.brand}
                onValueChange={(value) => onProductChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma marca" />
                </SelectTrigger>
                <SelectContent>
                  {brands.filter(b => b !== 'Todas').map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Preço de Custo (R$)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={product.cost || 0}
                onChange={(e) => onProductChange('cost', parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={product.price}
                onChange={(e) => onProductChange('price', parseFloat(e.target.value) || 0)}
              />
              
              {product.cost && product.cost > 0 && (
                <div className="text-xs text-muted-foreground">
                  Margem: {(((product.price - product.cost) / product.cost) * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                min="0"
                value={product.stock}
                onChange={(e) => onProductChange('stock', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_stock">Estoque Mínimo</Label>
              <Input
                id="min_stock"
                type="number"
                step="1"
                min="1"
                value={product.min_stock || 5}
                onChange={(e) => onProductChange('min_stock', parseInt(e.target.value) || 5)}
              />
              <div className="text-xs text-muted-foreground">
                Você receberá alertas quando o estoque estiver abaixo deste valor
              </div>
            </div>
          </div>

          <ImageManager
            product={product}
            onProductChange={onProductChange}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-white">Cancelar</Button>
        <Button onClick={onSave}>Salvar Alterações</Button>
      </DialogFooter>
    </>
  );
};

export default FullEditForm;
