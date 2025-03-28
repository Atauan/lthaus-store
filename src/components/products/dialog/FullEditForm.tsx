
import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from '@/hooks/products/types';
import { brands, categories } from '@/hooks/products/types';
import { Loader2 } from 'lucide-react';
import ProductImageUpload from './ProductImageUpload';

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
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (field: keyof Product, value: any) => {
    onProductChange(field, value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setSelectedFile(file);
    if (file) {
      onProductChange('file', file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome do Produto</Label>
          <Input
            id="name"
            value={product.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={product.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Custo (R$)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            min="0"
            value={product.cost || 0}
            onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
          />
        </div>
        
        <div>
          <Label htmlFor="stock">Estoque</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={product.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value))}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={product.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={product.category} 
            onValueChange={(value) => handleChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(cat => cat !== 'Todas')
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="brand">Marca</Label>
          <Select 
            value={product.brand} 
            onValueChange={(value) => handleChange('brand', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma marca" />
            </SelectTrigger>
            <SelectContent>
              {brands
                .filter(brand => brand !== 'Todas')
                .map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label>Imagem do Produto</Label>
        <ProductImageUpload 
          currentImageUrl={product.image_url}
          onFileChange={handleImageChange}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
};

export default FullEditForm;
