
import React, { useState } from 'react';
import { Truck, User, Building, MapPin, Phone, Mail, Tag, Plus } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuppliers } from '@/hooks/products/useSuppliers';

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  categories?: string[];
}

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSupplier: (supplierData: SupplierFormData) => void;
}

const NewSupplierDialog: React.FC<NewSupplierDialogProps> = ({
  open,
  onOpenChange,
  onAddSupplier,
}) => {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const { allCategories, addCategory } = useSuppliers();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, insira um nome para o fornecedor');
      return;
    }
    
    onAddSupplier({
      name,
      contactName,
      phone,
      email,
      address,
      categories: selectedCategories
    });
    
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setSelectedCategories([]);
    setError('');
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const success = await addCategory(newCategory.trim());
    if (success) {
      setSelectedCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Novo Fornecedor
            </DialogTitle>
            <DialogDescription>
              Adicione um novo fornecedor para seus produtos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                <Building className="h-4 w-4" />
                Nome da Empresa
              </label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Nome da empresa"
                className={error ? 'border-red-500' : ''}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  <User className="h-4 w-4" />
                  Pessoa de Contato
                </label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Nome do contato"
                />
              </div>

              <div>
                <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                  <Phone className="h-4 w-4" />
                  Telefone
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                <Mail className="h-4 w-4" />
                E-mail
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                <MapPin className="h-4 w-4" />
                Endereço
              </label>
              <Textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Endereço completo"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                <Tag className="h-4 w-4" />
                Categorias
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category}
                    <button 
                      type="button" 
                      className="ml-1 text-xs rounded-full hover:bg-muted p-0.5"
                      onClick={() => handleRemoveCategory(category)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      type="button"
                      className="justify-start flex-1"
                    >
                      Selecionar categorias
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar categoria..." />
                      <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                      <CommandGroup>
                        {allCategories.map((category) => (
                          <CommandItem
                            key={category}
                            onSelect={() => {
                              setSelectedCategories(prev => 
                                prev.includes(category) 
                                  ? prev.filter(c => c !== category)
                                  : [...prev, category]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategories.includes(category) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                
                <div className="relative flex-1">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nova categoria..."
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              resetForm();
              onOpenChange(false);
            }}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Fornecedor</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewSupplierDialog;
