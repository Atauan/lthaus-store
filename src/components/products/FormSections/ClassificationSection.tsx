
import React from 'react';
import { TagIcon, Plus, Star, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '@/hooks/useProductForm';

// Sample suppliers
const suppliers = ['Tech Imports Ltda', 'Distribuidora ABC', 'Mobile Acessórios', 'Global Tech'];

interface ClassificationSectionProps {
  form: UseFormReturn<ProductFormValues>;
  onAddSupplier: () => void;
}

const ClassificationSection: React.FC<ClassificationSectionProps> = ({
  form,
  onAddSupplier
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TagIcon className="h-5 w-5" /> 
          Classificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Produto</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span>Venda ao Cliente</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="internal">
                      <div className="flex items-center gap-2">
                        <Paintbrush className="h-4 w-4 text-indigo-500" />
                        <span>Uso Interno</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fornecedor</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={onAddSupplier}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ClassificationSection;
