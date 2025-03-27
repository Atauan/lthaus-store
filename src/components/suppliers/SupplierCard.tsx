import React from 'react';
import {
  Building, 
  Mail, 
  Phone, 
  MoreVertical,
  Pencil,
  Trash,
  MapPin,
  Tag,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GlassCard from '@/components/ui/custom/GlassCard';
import IconButton from '@/components/ui/custom/IconButton';
import { Button } from '@/components/ui/button';
import { Supplier } from '@/hooks/products/useSuppliers';

interface SupplierCardProps {
  supplier: Supplier;
  onDeleteSupplier: (supplier: Supplier) => void;
  onEditSupplier?: (supplier: Supplier) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onDeleteSupplier,
  onEditSupplier,
}) => {
  return (
    <GlassCard className="animate-scale-in" hoverEffect>
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
            {onEditSupplier && (
              <DropdownMenuItem onClick={() => onEditSupplier(supplier)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDeleteSupplier(supplier)}
            >
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
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Categorias</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.categories.map((category, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="text-xs"
                  >
                    {category}
                  </Badge>
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
  );
};

export default SupplierCard;
