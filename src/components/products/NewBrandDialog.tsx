
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
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

interface NewBrandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBrand: (brand: string) => void;
}

const NewBrandDialog: React.FC<NewBrandDialogProps> = ({
  open,
  onOpenChange,
  onAddBrand,
}) => {
  const [newBrand, setNewBrand] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBrand.trim()) {
      setError('Por favor, insira um nome para a marca');
      return;
    }
    
    onAddBrand(newBrand);
    setNewBrand('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Nova Marca
            </DialogTitle>
            <DialogDescription>
              Adicione uma nova marca para seus produtos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={newBrand}
              onChange={(e) => {
                setNewBrand(e.target.value);
                setError('');
              }}
              placeholder="Nome da marca"
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Marca</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewBrandDialog;
