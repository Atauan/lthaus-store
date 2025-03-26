
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStoreCosts } from '@/hooks/settings/useStoreCosts';
import StoreCostsForm from './StoreCostsForm';
import StoreCostsTable from './StoreCostsTable';
import MonthlyProfitChart from './MonthlyProfitChart';

const StoreCostsModule: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { costs, monthlyProfits, refresh } = useStoreCosts();
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciamento de Custos</CardTitle>
          <CardDescription>
            Analise os custos operacionais e o impacto no lucro da loja
          </CardDescription>
        </div>
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Gráfico</TabsTrigger>
            <TabsTrigger value="table">Registros</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <MonthlyProfitChart data={monthlyProfits} />
          </TabsContent>
          
          <TabsContent value="table">
            <StoreCostsTable />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Custos Mensais</DialogTitle>
          </DialogHeader>
          <StoreCostsForm 
            onSuccess={() => {
              setIsAddDialogOpen(false);
              refresh();
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StoreCostsModule;
