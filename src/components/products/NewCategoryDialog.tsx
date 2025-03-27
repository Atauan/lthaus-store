import React, { useState } from 'react';
import { TagIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategoriesAndBrands } from '@/hooks/products/useCategoriesAndBrands';
import { toast } from 'sonner';

interface NewCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (category: string) => void;
}

const NewCategoryDialog: React.FC<NewCategoryDialogProps> = ({
  open,
  onOpenChange,
  onAddCategory,
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState('');
  const [error, setError] = useState('');
  const { categories, deleteCategory } = useCategoriesAndBrands();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      setError('Por favor, insira um nome para a categoria');
      return;
    }
    
    onAddCategory(newCategory);
    setNewCategory('');
    setError('');
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      toast.error('Selecione uma categoria para excluir');
      return;
    }

    try {
      const success = await deleteCategory(categoryToDelete);
      if (success) {
        toast.success(`Categoria "${categoryToDelete}" excluída com sucesso!`);
        setCategoryToDelete('');
      }
    } catch (error) {
      toast.error('Erro ao excluir categoria');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Gerenciar Categorias
          </DialogTitle>
          <DialogDescription>
            Adicione ou remova categorias para seus produtos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Adicionar Nova Categoria</h4>
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setError('');
                  }}
                  placeholder="Nome da categoria"
                  className={error ? 'border-red-500' : ''}
                />
                <Button type="submit">Adicionar</Button>
              </div>
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </form>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Excluir Categoria Existente</h4>
            <div className="flex gap-2">
              <Select
                value={categoryToDelete}
                onValueChange={setCategoryToDelete}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDeleteCategory}
                disabled={!categoryToDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategoryDialog;
