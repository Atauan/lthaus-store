import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useSuppliers } from '@/hooks/products/useSuppliers';
import { useCategoriesAndBrands } from '@/hooks/products/useCategoriesAndBrands';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BasicInfoSection from './form-sections/BasicInfoSection';
import ContactInfoSection from './form-sections/ContactInfoSection';
import CategoriesSection from './form-sections/CategoriesSection';

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  categories?: string[];
}

interface SupplierFormContainerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSupplier: (supplierData: SupplierFormData) => void;
}

const SupplierFormContainer: React.FC<SupplierFormContainerProps> = ({
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
  
  // Use the shared categories from product system
  const { categories } = useCategoriesAndBrands();

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
            <BasicInfoSection 
              name={name}
              setName={setName}
              address={address}
              setAddress={setAddress}
              error={error}
              setError={setError}
            />

            <ContactInfoSection 
              contactName={contactName}
              setContactName={setContactName}
              phone={phone}
              setPhone={setPhone}
              email={email}
              setEmail={setEmail}
            />

            <CategoriesSection 
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              allCategories={categories}
            />
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

export default SupplierFormContainer;
