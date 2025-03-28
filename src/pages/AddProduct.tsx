
import React, { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { categories, brands } from '@/hooks/products/types';
import { Loader2 } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      brand: '',
      price: 0,
      cost: 0,
      stock: 0,
      min_stock: 5
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const result = await addProduct({
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        price: parseFloat(data.price),
        cost: parseFloat(data.cost),
        stock: parseInt(data.stock),
        min_stock: parseInt(data.min_stock)
      });
      
      if (result.success) {
        toast.success('Produto adicionado com sucesso!');
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        toast.error(`Erro ao adicionar produto: ${result.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Adicionar Produto</h1>
            <p className="text-muted-foreground mt-1">Preencha o formulário para adicionar um novo produto ao catálogo</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Novo Produto</CardTitle>
              <CardDescription>Preencha os campos abaixo para adicionar um novo produto ao sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto</Label>
                    <Input id="name" {...form.register('name')} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      onValueChange={(value) => form.setValue('category', value)}
                      defaultValue={form.getValues('category')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter(cat => cat !== 'Todas')
                          .map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Select 
                      onValueChange={(value) => form.setValue('brand', value)}
                      defaultValue={form.getValues('brand')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands
                          .filter(brand => brand !== 'Todas')
                          .map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" {...form.register('description')} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="price">Preço de Venda (R$)</Label>
                    <Input id="price" type="number" step="0.01" min="0" {...form.register('price')} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="cost">Custo (R$)</Label>
                    <Input id="cost" type="number" step="0.01" min="0" {...form.register('cost')} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock">Estoque Inicial</Label>
                    <Input id="stock" type="number" min="0" {...form.register('stock')} required />
                  </div>
                  
                  <div>
                    <Label htmlFor="min_stock">Estoque Mínimo</Label>
                    <Input id="min_stock" type="number" min="0" {...form.register('min_stock')} required />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      'Adicionar Produto'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default AddProduct;
