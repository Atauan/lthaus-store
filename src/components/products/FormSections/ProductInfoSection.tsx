
import React from 'react';
import { Package, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProductFormContext } from '@/contexts/ProductFormContext';
import { toast } from 'sonner';
import { useCategoriesAndBrands } from '@/hooks/products/useCategoriesAndBrands';

const ProductInfoSection: React.FC = () => {
  const { 
    form, 
    setIsNewCategoryDialogOpen, 
    setIsNewBrandDialogOpen,
    categories,
    brands 
  } = useProductFormContext();

  const { deleteCategory } = useCategoriesAndBrands();

  const handleDeleteCategory = async (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Deseja realmente excluir a categoria "${category}"?`)) {
      const success = await deleteCategory(category);
      if (success) {
        toast.success(`Categoria "${category}" excluída com sucesso!`);
        // If the current form value matches the deleted category, reset it
        if (form.getValues("category") === category) {
          form.setValue("category", "");
        }
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> 
          Informações do Produto
        </CardTitle>
        <CardDescription>
          Preencha as informações básicas do produto
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Nome do produto é obrigatório" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrição detalhada do produto" 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            rules={{ required: "Categoria é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem 
                              key={category} 
                              value={category}
                              className="flex justify-between group"
                            >
                              <div className="flex justify-between w-full pr-2">
                                <span>{category}</span>
                                <button 
                                  onClick={(e) => handleDeleteCategory(category, e)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                                </button>
                              </div>
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
                    onClick={() => setIsNewCategoryDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            rules={{ required: "Marca é obrigatória" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
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
                    onClick={() => setIsNewBrandDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfoSection;
