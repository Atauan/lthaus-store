import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface SalesHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  refresh: () => void;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  refresh
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
      <h1 className="text-2xl font-bold mr-auto">Vendas</h1>
      
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Buscar vendas..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-muted' : ''}
        >
          <Filter size={16} className="mr-2" />
          Filtros
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
        >
          <RefreshCw size={16} className="mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};

export default SalesHeader;
