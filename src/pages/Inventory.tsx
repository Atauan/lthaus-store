
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpDown, 
  Package, 
  Search, 
  DollarSign, 
  BarChart3, 
  History,
  ShoppingCart, 
  TrendingUp,
  PlusCircle 
} from 'lucide-react';
import { useProducts, StockLog, CostChangeLog } from '@/hooks/useProducts';
import InventoryStockTable from '@/components/inventory/InventoryStockTable';
import InventoryCostTable from '@/components/inventory/InventoryCostTable';
import InventoryStatistics from '@/components/inventory/InventoryStatistics';
import StockUpdateDialog from '@/components/inventory/StockUpdateDialog';

const Inventory = () => {
  const navigate = useNavigate();
  const {
    products,
    stockLogs,
    costChangeLogs,
    loading,
    fetchStockLogs,
    fetchCostChangeLogs,
    updateStock
  } = useProducts();
  
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [costSearchQuery, setCostSearchQuery] = useState('');
  const [filteredStockLogs, setFilteredStockLogs] = useState<StockLog[]>([]);
  const [filteredCostLogs, setFilteredCostLogs] = useState<CostChangeLog[]>([]);
  const [isStockUpdateDialogOpen, setIsStockUpdateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  
  // Fetch logs when component mounts
  useEffect(() => {
    const loadData = async () => {
      await fetchStockLogs();
      await fetchCostChangeLogs();
    };
    
    loadData();
  }, [fetchStockLogs, fetchCostChangeLogs]);
  
  // Filter stock logs based on search
  useEffect(() => {
    if (!stockLogs) return;
    
    const filtered = stockLogs.filter(log => 
      !stockSearchQuery || 
      log.product_name?.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
      log.reference_type.toLowerCase().includes(stockSearchQuery.toLowerCase())
    );
    
    setFilteredStockLogs(filtered);
  }, [stockLogs, stockSearchQuery]);
  
  // Filter cost logs based on search
  useEffect(() => {
    if (!costChangeLogs) return;
    
    const filtered = costChangeLogs.filter(log => 
      !costSearchQuery || 
      log.product_name?.toLowerCase().includes(costSearchQuery.toLowerCase())
    );
    
    setFilteredCostLogs(filtered);
  }, [costChangeLogs, costSearchQuery]);
  
  // Calculate totals for statistics
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, product) => 
    sum + (product.stock * (product.cost || 0)), 0);
  const totalStockCount = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter(product => product.stock < 5).length;
  
  // Open stock update dialog for a product
  const handleOpenStockUpdate = (productId: number) => {
    setSelectedProduct(productId);
    setIsStockUpdateDialogOpen(true);
  };
  
  // Handle stock update
  const handleStockUpdate = async (productId: number, newStock: number, notes: string) => {
    const result = await updateStock(productId, newStock, notes);
    
    if (result.success) {
      // Refresh stock logs after update
      await fetchStockLogs();
      setIsStockUpdateDialogOpen(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Estoque e Inventário</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie seu estoque, acompanhe alterações e analise seus produtos
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
              >
                <Package className="mr-2 h-4 w-4" />
                Ver Produtos
              </Button>
              <Button onClick={() => navigate('/products/add')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </div>
          
          <InventoryStatistics 
            totalProducts={totalProducts}
            totalStockValue={totalStockValue}
            totalStockCount={totalStockCount}
            lowStockProducts={lowStockProducts}
          />
          
          <Tabs defaultValue="stock" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stock">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Movimentação de Estoque
              </TabsTrigger>
              <TabsTrigger value="cost">
                <DollarSign className="mr-2 h-4 w-4" />
                Alterações de Custo
              </TabsTrigger>
              <TabsTrigger value="analysis">
                <BarChart3 className="mr-2 h-4 w-4" />
                Análise de Produtos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="stock" className="mt-4">
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Buscar por produto ou tipo de movimentação..." 
                      value={stockSearchQuery}
                      onChange={(e) => setStockSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={() => setIsStockUpdateDialogOpen(true)}>
                    <Package className="mr-2 h-4 w-4" />
                    Atualizar Estoque
                  </Button>
                </div>
                
                <InventoryStockTable 
                  stockLogs={filteredStockLogs} 
                  loading={loading}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="cost" className="mt-4">
              <Card className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Buscar por produto..." 
                    value={costSearchQuery}
                    onChange={(e) => setCostSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <InventoryCostTable 
                  costChangeLogs={filteredCostLogs} 
                  loading={loading}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <Card className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                    <ShoppingCart className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <h3 className="text-lg font-medium">Produtos Mais Vendidos</h3>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe os produtos com maior saída
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <h3 className="text-lg font-medium">Rentabilidade</h3>
                      <p className="text-sm text-muted-foreground">
                        Analise a rentabilidade por produto
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-muted/30 rounded-lg">
                    <History className="h-10 w-10 text-primary mr-4" />
                    <div>
                      <h3 className="text-lg font-medium">Giro de Estoque</h3>
                      <p className="text-sm text-muted-foreground">
                        Veja o tempo médio de produtos em estoque
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center p-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">
                    Análises detalhadas serão implementadas em breve.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <StockUpdateDialog
        isOpen={isStockUpdateDialogOpen}
        onClose={() => setIsStockUpdateDialogOpen(false)}
        onUpdate={handleStockUpdate}
        products={products}
        selectedProductId={selectedProduct}
      />
    </PageTransition>
  );
};

export default Inventory;
