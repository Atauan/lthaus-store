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
import { Product } from '@/hooks/useProducts';
import { categories, brands } from '@/hooks/products/types';
import ImageManager from './ImageManager';

interface FullEditFormProps {
  product: Product;
  onProductChange: (updatedProduct: Partial<Product>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const FullEditForm: React.FC<FullEditFormProps> = ({
  product,
  onProductChange,
  onSave,
  onCancel
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onProductChange({ [name]: value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    onProductChange({ [name]: value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Categoria
          </Label>
          <Select
            onValueChange={handleSelectChange('category')}
            defaultValue={product.category}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="brand" className="text-right">
            Marca
          </Label>
          <Select
            onValueChange={handleSelectChange('brand')}
            defaultValue={product.brand}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione uma marca" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Preço
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={product.price}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right">
            Estoque
          </Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={product.stock}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      <ImageManager
        images={product.images || []}
        onImagesChange={(images) => onProductChange({ images })}
      />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar alterações</Button>
      </DialogFooter>
    </form>
  );
};

export default FullEditForm;
