
import React from 'react';
import { Search, Filter, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SalesSearchFiltersProps {
  searchQuery: string;
  selectedDateRange: string;
  selectedPayment: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedDateRange: (value: string) => void;
  setSelectedPayment: (value: string) => void;
}

const SalesSearchFilters: React.FC<SalesSearchFiltersProps> = ({
  searchQuery,
  selectedDateRange,
  selectedPayment,
  handleSearch,
  setSelectedDateRange,
  setSelectedPayment
}) => {
  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input 
          placeholder="Buscar venda..." 
          className="pl-9"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      
      <div className="w-36">
        <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <SelectValue placeholder="Período" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-36">
        <Select value={selectedPayment} onValueChange={setSelectedPayment}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Pagamento" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="dinheiro">Dinheiro</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SalesSearchFilters;
