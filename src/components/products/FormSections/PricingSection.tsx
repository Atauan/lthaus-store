
import React from 'react';
import { BadgePercent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProductFormContext } from '@/contexts/ProductFormContext';

const PricingSection: React.FC = () => {
  const {
    form,
    profit,
    profitMargin,
    handleMarginChange,
    handleSalePriceChange
  } = useProductFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgePercent className="h-5 w-5" /> 
          Preço e Estoque
        </CardTitle>
        <CardDescription>
          Defina o custo, preço de venda e quantidade em estoque
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormField
              control={form.control}
              name="costPrice"
              rules={{ required: "Preço de custo é obrigatório" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço de Custo (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value) || 0);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salePrice"
              rules={{ required: "Preço de venda é obrigatório" }}
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Preço de Venda (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      {...field}
                      onChange={handleSalePriceChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-2 text-sm text-muted-foreground">
              Lucro: <span className="font-medium text-green-600">R$ {profit.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Margem de Lucro: <span className="text-primary">{profitMargin.toFixed(0)}%</span>
              </label>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs">20%</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={profitMargin}
                  onChange={(e) => handleMarginChange(parseInt(e.target.value))}
                  className="flex-1 accent-primary h-2 bg-secondary rounded-full"
                />
                <span className="text-xs">100%</span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="stock"
              rules={{ 
                required: "Quantidade em estoque é obrigatória",
                min: { value: 1, message: "Estoque deve ser no mínimo 1" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade em Estoque</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      step="1"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value) || 1);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingSection;
