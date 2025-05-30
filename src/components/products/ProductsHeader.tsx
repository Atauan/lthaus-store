
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';

interface ProductsHeaderProps {
  handleAddProduct: () => void;
}

const ProductsHeader = ({ handleAddProduct }: ProductsHeaderProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSyncProducts = () => {
    setIsSyncing(true);
    
    // Simulate syncing with inventory
    setTimeout(() => {
      toast.success("Produtos sincronizados com o estoque com sucesso!");
      setIsSyncing(false);
    }, 1500);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu catálogo de produtos</p>
      </div>

      <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="border-primary/20"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSyncProducts} 
          disabled={isSyncing}
          className="border-primary/20"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          Sincronizar com Estoque
        </Button>
        
        <Button onClick={handleAddProduct} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
};

export default ProductsHeader;
