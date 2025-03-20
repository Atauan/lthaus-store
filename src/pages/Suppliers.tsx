
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Package, 
  MoreVertical,
  Pencil,
  Trash,
  Building,
  MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlassCard from '@/components/ui/custom/GlassCard';
import IconButton from '@/components/ui/custom/IconButton';
import NewSupplierDialog from '@/components/products/NewSupplierDialog';
import { useSuppliers } from '@/hooks/products/useSuppliers';
import { toast } from 'sonner';

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  const { suppliers, loading, addSupplier } = useSuppliers();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAddSupplier = async (supplierData: {
    name: string;
    contactName?: string;
    phone?: string;
    email?: string;
    address?: string;
  }) => {
    const result = await addSupplier({
      name: supplierData.name,
      contact_name: supplierData.contactName,
      phone: supplierData.phone,
      email: supplierData.email,
      address: supplierData.address
    });
    
    if (result.success) {
      toast.success(`Fornecedor "${supplierData.name}" adicionado com sucesso!`);
      setIsNewSupplierDialogOpen(false);
    }
  };
  
  const filteredSuppliers = suppliers.filter(supplier => {
    return supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (supplier.contact_name && supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
           (supplier.categories && supplier.categories.some(category => 
             category.toLowerCase().includes(searchQuery.toLowerCase())
           ));
  });
  
  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
              <p className="text-muted-foreground mt-1">Gerencie seus fornecedores de produtos</p>
            </div>
            
            <Button onClick={() => setIsNewSupplierDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Fornecedor
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar fornecedor por nome, contato ou categoria..." 
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <p className="text-muted-foreground">Carregando fornecedores...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <GlassCard 
                    key={supplier.id} 
                    className="animate-scale-in" 
                    hoverEffect
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg leading-tight">{supplier.name}</h3>
                          <p className="text-sm text-muted-foreground">{supplier.contact_name || 'Sem contato'}</p>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {supplier.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{supplier.email}</p>
                        </div>
                      )}
                      
                      {supplier.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{supplier.phone}</p>
                        </div>
                      )}
                      
                      {supplier.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <p className="text-sm">{supplier.address}</p>
                        </div>
                      )}
                      
                      {supplier.categories && supplier.categories.length > 0 && (
                        <div className="flex items-start gap-3">
                          <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium mb-1">Categorias</p>
                            <div className="flex flex-wrap gap-1.5">
                              {supplier.categories.map((category, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-full"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver produtos
                      </Button>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhum fornecedor encontrado. Tente ajustar sua busca.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <NewSupplierDialog
        open={isNewSupplierDialogOpen}
        onOpenChange={setIsNewSupplierDialogOpen}
        onAddSupplier={handleAddSupplier}
      />
    </PageTransition>
  );
};

export default Suppliers;
