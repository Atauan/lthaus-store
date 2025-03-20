import React, { useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, categories, brands } from '@/hooks/useProducts';

interface EditProductDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  editType: 'price' | 'profit' | 'stock' | 'cost' | 'full';
  editValue: string;
  setEditValue: (value: string) => void;
  onSave: () => void;
  onFullSave?: (updatedProduct: Product) => void;
}

const EditProductDialog = ({
  open,
  setOpen,
  selectedProduct,
  editType,
  editValue,
  setEditValue,
  onSave,
  onFullSave
}: EditProductDialogProps) => {
  const [fullEditProduct, setFullEditProduct] = React.useState<Product | null>(null);

  useEffect(() => {
    if (open && editType === 'full' && selectedProduct) {
      setFullEditProduct({...selectedProduct});
    }
  }, [open, editType, selectedProduct]);

  const handleFullEditChange = (field: keyof Product, value: any) => {
    if (fullEditProduct) {
      setFullEditProduct({
        ...fullEditProduct,
        [field]: value
      });
    }
  };

  const handleFullSave = () => {
    if (fullEditProduct && onFullSave) {
      onFullSave(fullEditProduct);
      setOpen(false);
    }
  };

  const renderSimpleEdit = () => (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="edit-value" className="text-right">
            {editType === 'price' && 'Preço (R$)'}
            {editType === 'profit' && 'Margem (%)'}
            {editType === 'stock' && 'Quantidade'}
            {editType === 'cost' && 'Custo (R$)'}
          </Label>
          <Input
            id="edit-value"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="col-span-3 border-white"
            type="number"
            step={editType === 'stock' ? "1" : "0.01"}
            min={editType === 'stock' ? "0" : undefined}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)} className="border-white">Cancelar</Button>
        <Button onClick={onSave}>Salvar</Button>
      </DialogFooter>
    </>
  );

  const renderFullEdit = () => (
    <>
      {fullEditProduct && (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={fullEditProduct.name}
                onChange={(e) => handleFullEditChange('name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={fullEditProduct.description || ''}
                onChange={(e) => handleFullEditChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={fullEditProduct.category}
                  onValueChange={(value) => handleFullEditChange('category', value)}
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
                  value={fullEditProduct.brand}
                  onValueChange={(value) => handleFullEditChange('brand', value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Preço de Custo (R$)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fullEditProduct.cost || 0}
                  onChange={(e) => handleFullEditChange('cost', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fullEditProduct.price}
                  onChange={(e) => handleFullEditChange('price', parseFloat(e.target.value) || 0)}
                />
                
                {fullEditProduct.cost && fullEditProduct.cost > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Margem: {(((fullEditProduct.price - fullEditProduct.cost) / fullEditProduct.cost) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                step="1"
                min="0"
                value={fullEditProduct.stock}
                onChange={(e) => handleFullEditChange('stock', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL da Imagem</Label>
              <Input
                id="image"
                type="text"
                value={fullEditProduct.image_url || fullEditProduct.image || ''}
                onChange={(e) => handleFullEditChange('image_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {(fullEditProduct.image_url || fullEditProduct.image) && (
                <div className="mt-2">
                  <div className="w-20 h-20 rounded border overflow-hidden">
                    <img 
                      src={fullEditProduct.image_url || fullEditProduct.image} 
                      alt={fullEditProduct.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button variant="outline" onClick={() => setOpen(false)} className="border-white">Cancelar</Button>
        <Button onClick={handleFullSave}>Salvar Alterações</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] border-primary/20">
        <DialogHeader>
          <DialogTitle>
            {editType === 'price' && 'Alterar Preço'}
            {editType === 'profit' && 'Definir Margem de Lucro'}
            {editType === 'stock' && 'Atualizar Estoque'}
            {editType === 'cost' && 'Alterar Custo'}
            {editType === 'full' && 'Editar Produto'}
          </DialogTitle>
          <DialogDescription>
            {selectedProduct && (
              <span>Produto: {selectedProduct.name}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        {editType === 'full' ? renderFullEdit() : renderSimpleEdit()}
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
