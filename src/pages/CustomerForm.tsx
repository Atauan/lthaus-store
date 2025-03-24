
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UserPlus, User, Mail, Phone, MapPin, Home, MapPinned, Map, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCustomers } from '@/hooks/useCustomers';
import { CustomerFormValues } from '@/types/customer';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/layout/PageTransition';
import { Link } from 'react-router-dom';

// Validation schema for customer form
const customerFormSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipcode: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCustomer, updateCustomer, fetchCustomerById } = useCustomers();
  const isEditMode = !!id;

  // Form definition with validation
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      notes: ''
    }
  });

  // Fetch customer data if in edit mode
  const { isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => fetchCustomerById(id!),
    enabled: isEditMode,
    onSuccess: (data) => {
      // Move this to a useEffect to handle the success callback
    }
  });

  // Handle the data loading success with useEffect
  useEffect(() => {
    if (isEditMode && id) {
      fetchCustomerById(id)
        .then(data => {
          form.reset({
            name: data.name,
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipcode: data.zipcode || '',
            notes: data.notes || ''
          });
        })
        .catch(error => {
          console.error('Error fetching customer:', error);
          toast.error('Erro ao carregar dados do cliente');
          navigate('/customers');
        });
    }
  }, [id, isEditMode, fetchCustomerById, form, navigate]);

  const onSubmit = (values: CustomerFormValues) => {
    if (isEditMode) {
      updateCustomer({ id: id!, values }, {
        onSuccess: () => navigate('/customers')
      });
    } else {
      createCustomer(values, {
        onSuccess: () => navigate('/customers')
      });
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto px-4 pb-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Atualize os dados do cliente' : 'Preencha os dados para cadastrar um novo cliente'}
            </p>
          </div>
        </div>

        {isLoadingCustomer ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? 'Dados do Cliente' : 'Cadastro de Cliente'}</CardTitle>
              <CardDescription>
                Preencha os campos abaixo com as informações do cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informações básicas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Informações Básicas
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo*</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="email@exemplo.com" 
                                type="email"
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(00) 00000-0000" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Informações de endereço */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center">
                        <MapPin className="mr-2 h-5 w-5" />
                        Informações de Endereço
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Rua, número, bairro" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Cidade" 
                                  {...field} 
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Estado" 
                                  {...field} 
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="zipcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="00000-000" 
                                {...field} 
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <FileText className="mr-2 h-5 w-5" />
                      Observações
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas Adicionais</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Informações adicionais sobre o cliente" 
                              className="min-h-[120px]"
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <CardFooter className="flex justify-end gap-4 px-0">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/customers')}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      <UserPlus className="mr-2 h-4 w-4" />
                      {isEditMode ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
