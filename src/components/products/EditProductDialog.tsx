
import React, { useEffect, useState } from 'react';
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
import { Image, Upload, X } from 'lucide-react';

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
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setFullEditProduct(null);
    } else if (editType === 'full' && selectedProduct) {
      setFullEditProduct({...selectedProduct});
      setPreviewUrl(selectedProduct.image_url || selectedProduct.image || null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Update image_url in the product state
      if (fullEditProduct) {
        handleFullEditChange('image_url', fileUrl);
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    // Clear any selected file
    if (selectedFile) {
      URL.revokeObjectURL(previewUrl || '');
      setSelectedFile(null);
    }
    setPreviewUrl(url);
    
    // Update image_url in the product state
    if (fullEditProduct) {
      handleFullEditChange('image_url', url);
    }
  };

  const clearImage = () => {
    if (selectedFile && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    
    // Clear image_url in the product state
    if (fullEditProduct) {
      handleFullEditChange('image_url', '');
    }
  };

  const handleFullSave = () => {
    if (fullEditProduct && onFullSave) {
      // If we have a selected file, we'll let the parent component handle the file upload
      const productToSave = {
        ...fullEditProduct,
        // Add file property to be picked up by the onFullSave handler
        file: selectedFile
      } as any;
      
      onFullSave(productToSave);
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label className="mb-1 block">Imagem do Produto</Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-url" className="text-sm text-muted-foreground">Inserir URL da imagem</Label>
                  <Input
                    id="image-url"
                    type="text"
                    value={fullEditProduct.image_url || ''}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image-file" className="text-sm text-muted-foreground">Ou fazer upload do dispositivo</Label>
                  <div className="flex items-center">
                    <label 
                      htmlFor="image-file"
                      className="flex items-center justify-center gap-2 w-full h-9 px-4 py-2 bg-muted hover:bg-muted/80 text-sm font-medium rounded-md cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Selecionar arquivo
                      <input 
                        id="image-file" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              {previewUrl && (
                <div className="mt-3 relative inline-block">
                  <div className="w-24 h-24 rounded border overflow-hidden">
                    <img 
                      src={previewUrl} 
                      alt={fullEditProduct.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
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
