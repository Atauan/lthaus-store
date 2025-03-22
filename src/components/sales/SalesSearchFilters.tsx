
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface SalesSearchFiltersProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  minAmount: string;
  setMinAmount: (amount: string) => void;
  maxAmount: string;
  setMaxAmount: (amount: string) => void;
  searchQuery?: string;
  handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedDateRange?: string;
  setSelectedDateRange?: (value: string) => void;
  selectedPayment?: string;
  setSelectedPayment?: (value: string) => void;
}

const SalesSearchFilters: React.FC<SalesSearchFiltersProps> = ({
  timeRange,
  setTimeRange,
  paymentMethod,
  setPaymentMethod,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  searchQuery,
  handleSearch,
  selectedDateRange,
  setSelectedDateRange,
  selectedPayment,
  setSelectedPayment
}) => {
  // Use the appropriate props based on which ones are provided
  const dateRangeValue = selectedDateRange || timeRange;
  const dateRangeSetter = setSelectedDateRange || setTimeRange;
  const paymentValue = selectedPayment || paymentMethod;
  const paymentSetter = setSelectedPayment || setPaymentMethod;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {searchQuery !== undefined && handleSearch && (
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar vendas..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="time-range">Período</Label>
            <Select value={dateRangeValue} onValueChange={dateRangeSetter}>
              <SelectTrigger id="time-range">
                <SelectValue placeholder="Selecionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment-method">Método de Pagamento</Label>
            <Select value={paymentValue} onValueChange={paymentSetter}>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Selecionar método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="bank_transfer">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="min-amount">Valor Mínimo</Label>
            <Input
              id="min-amount"
              type="number"
              placeholder="0,00"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-amount">Valor Máximo</Label>
            <Input
              id="max-amount"
              type="number"
              placeholder="0,00"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSearchFilters;
