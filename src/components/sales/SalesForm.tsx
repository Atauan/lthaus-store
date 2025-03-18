import React, { useState } from 'react';
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Wrench, 
  User, 
  CheckCircle, 
  CreditCard, 
  Smartphone,
  Banknote,
  Plus,
  Minus,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import GlassCard from '@/components/ui/custom/GlassCard';

const sampleProducts = [
  { id: 1, name: 'Cabo USB-C', category: 'Cabos', price: 29.90, cost: 15.00, stock: 15 },
  { id: 2, name: 'Capa iPhone 13', category: 'Capas', price: 79.90, cost: 40.00, stock: 8 },
  { id: 3, name: 'Película Galaxy S21', category: 'Proteção', price: 39.90, cost: 20.00, stock: 12 },
  { id: 4, name: 'Carregador Sem Fio', category: 'Carregadores', price: 129.90, cost: 65.00, stock: 6 },
  { id: 5, name: 'Fone de Ouvido TWS', category: 'Áudio', price: 149.90, cost: 75.00, stock: 4 },
];

const sampleServices = [
  { id: 1, name: 'Troca de Tela', category: 'Reparo', price: 199.90 },
  { id: 2, name: 'Troca de Bateria', category: 'Reparo', price: 149.90 },
  { id: 3, name: 'Limpeza de Conector', category: 'Manutenção', price: 49.90 },
  { id: 4, name: 'Atualização de Software', category: 'Software', price: 79.90 },
];

type SaleItem = {
  id: number;
  type: 'product' | 'service';
  name: string;
  price: number;
  quantity: number;
};

type SalesFormValues = {
  customerName: string;
  paymentMethod: string;
  installments?: number;
};

const SalesForm = () => {
  const [selectedType, setSelectedType] = useState<'product' | 'service'>('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [showProductNotFound, setShowProductNotFound] = useState(false);
  
  const form = useForm<SalesFormValues>({
    defaultValues: {
      customerName: '',
      paymentMethod: 'pix',
    },
  });

  const filteredProducts = selectedType === 'product' 
    ? sampleProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sampleServices.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleAddItem = (item: any) => {
    const existingItemIndex = selectedItems.findIndex(
      i => i.id === item.id && i.type === selectedType
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: item.id,
          type: selectedType,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, increment: boolean) => {
    const updatedItems = [...selectedItems];
    if (increment) {
      updatedItems[index].quantity += 1;
    } else if (updatedItems[index].quantity > 1) {
      updatedItems[index].quantity -= 1;
    }
    setSelectedItems(updatedItems);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const onSubmit = (data: SalesFormValues) => {
    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um item à venda");
      return;
    }

    console.log({
      ...data,
      items: selectedItems,
      total: calculateTotal(),
      date: new Date().toISOString()
    });
    
    toast.success("Venda registrada com sucesso!");
    setSelectedItems([]);
    form.reset();
  };

  const handleProductNotFound = () => {
    setShowProductNotFound(true);
  };

  const handleRegisterNewProduct = () => {
    toast.info("Redirecionando para cadastro de novo produto...");
    setShowProductNotFound(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex gap-2">
          <Button
            variant={selectedType === 'product' ? 'default' : 'outline'}
            onClick={() => setSelectedType('product')}
            className="flex-1"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Produtos
          </Button>
          <Button
            variant={selectedType === 'service' ? 'default' : 'outline'}
            onClick={() => setSelectedType('service')}
            className="flex-1"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Serviços
          </Button>
        </div>
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder={`Buscar ${selectedType === 'product' ? 'produtos' : 'serviços'}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {showProductNotFound && (
        <GlassCard className="bg-amber-50/30 border border-amber-200 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium">Produto não encontrado</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Deseja cadastrar "{searchQuery}" como novo produto?
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowProductNotFound(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                onClick={handleRegisterNewProduct}
              >
                Cadastrar
              </Button>
            </div>
          </div>
        </GlassCard>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">
            {selectedType === 'product' ? 'Produtos' : 'Serviços'} Disponíveis
          </h3>
          <div className="bg-white rounded-lg shadow-soft max-h-[400px] overflow-auto">
            {filteredProducts.length > 0 ? (
              <div className="divide-y">
                {filteredProducts.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 hover:bg-muted/30 transition-colors flex justify-between items-center cursor-pointer"
                    onClick={() => handleAddItem(item)}
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex gap-2 items-center">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-secondary">
                          {item.category}
                        </span>
                        {selectedType === 'product' && (
                          <span className={`text-xs ${(item as any).stock <= 5 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {(item as any).stock} em estoque
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">R$ {item.price.toFixed(2)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(item);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum {selectedType === 'product' ? 'produto' : 'serviço'} encontrado
                </p>
                {selectedType === 'product' && (
                  <Button onClick={handleProductNotFound}>
                    Cadastrar Novo Produto
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h3 className="text-lg font-medium mb-3">Detalhes da Venda</h3>
              
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Nome do cliente" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div>
                <h4 className="text-sm font-medium mb-2">Itens Selecionados</h4>
                {selectedItems.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {selectedItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            R$ {item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => handleQuantityChange(index, false)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 w-7 p-0"
                            onClick={() => handleQuantityChange(index, true)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between p-2 font-medium">
                      <span>Total:</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4 bg-muted/30 rounded-md">
                    Nenhum item adicionado
                  </p>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="pix">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4" />
                              <span>PIX</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="debito">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span>Cartão de Débito</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="credito">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span>Cartão de Crédito</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dinheiro">
                            <div className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              <span>Dinheiro</span>
                            </div>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              {form.watch('paymentMethod') === 'credito' && (
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcelas</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString() || "1"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Número de parcelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}x {num === 1 ? 'à vista' : `de R$ ${(calculateTotal() / num).toFixed(2)}`}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full mt-6" size="lg">
                <CheckCircle className="mr-2 h-4 w-4" />
                Finalizar Venda
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SalesForm;
