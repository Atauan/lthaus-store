
import React, { useState } from 'react';
import { Truck, User, Building, MapPin, Phone, Mail } from 'lucide-react';
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

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSupplier: (supplier: string) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, insira um nome para o fornecedor');
      return;
    }
    
    onAddSupplier(name);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setContactName('');
    setPhone('');
    setEmail('');
    setAddress('');
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
