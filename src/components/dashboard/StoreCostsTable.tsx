
import React, { useState } from 'react';
import { Pencil, Trash, Building2, Droplet, Users, TrendingUp, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { StoreCost, useStoreCosts } from '@/hooks/settings/useStoreCosts';
import StoreCostsForm from './StoreCostsForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const getMonthName = (monthNumber: string) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return months[parseInt(monthNumber) - 1];
};

const StoreCostsTable: React.FC = () => {
  const { costs, refresh } = useStoreCosts();
  const [editingCost, setEditingCost] = useState<StoreCost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleDeleteCost = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de custos?')) {
      try {
        const { error } = await supabase
          .from('store_costs')
          .delete()
          .eq('id', id);
          
        if (error) {
          throw error;
        }
        
        toast.success('Registro excluído com sucesso!');
        refresh();
      } catch (error: any) {
        toast.error(`Erro ao excluir registro: ${error.message}`);
      }
    }
  };
  
  const handleEditClick = (cost: StoreCost) => {
    setEditingCost(cost);
    setIsEditDialogOpen(true);
  };
  
  const calculateTotal = (cost: StoreCost) => {
    return cost.rent + cost.utilities + cost.salaries + cost.marketing + cost.other;
  };
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead className="hidden sm:table-cell">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" /> Aluguel
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <div className="flex items-center gap-1">
                <Droplet className="h-4 w-4" /> Utilidades
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Salários
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" /> Marketing
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Outros
              </div>
            </TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Nenhum registro de custos encontrado.
              </TableCell>
            </TableRow>
          ) : (
            costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell className="font-medium">
                  {getMonthName(cost.month)}/{cost.year}
                </TableCell>
                <TableCell className="hidden sm:table-cell">R$ {cost.rent.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">R$ {cost.utilities.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">R$ {cost.salaries.toFixed(2)}</TableCell>
                <TableCell className="hidden lg:table-cell">R$ {cost.marketing.toFixed(2)}</TableCell>
                <TableCell className="hidden lg:table-cell">R$ {cost.other.toFixed(2)}</TableCell>
                <TableCell className="font-medium">
                  R$ {calculateTotal(cost).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleEditClick(cost)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive" 
                      onClick={() => handleDeleteCost(cost.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Custos Mensais</DialogTitle>
          </DialogHeader>
          {editingCost && (
            <StoreCostsForm 
              editingCost={editingCost} 
              onSuccess={() => {
                setIsEditDialogOpen(false);
                refresh();
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreCostsTable;
