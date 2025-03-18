
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X,
  Store,
  Instagram,
  ShoppingBag,
  FileText,
  Phone,
  Receipt,
  Percent,
  Send
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import GlassCard from '@/components/ui/custom/GlassCard';
import PaymentMethodsSection from './PaymentMethodsSection';
import SalesSummary from './SalesSummary';
import SaleReceiptModal from './SaleReceiptModal';

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

const saleChannels = [
  { id: 'store', name: 'Loja física', icon: <Store className="h-4 w-4" /> },
  { id: 'whatsapp', name: 'WhatsApp', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'instagram', name: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
  { id: 'marketplace', name: 'Marketplace', icon: <ShoppingBag className="h-4 w-4" /> },
  { id: 'other', name: 'Outro', icon: <FileText className="h-4 w-4" /> },
];

type SaleItem = {
  id: number;
  type: 'product' | 'service';
  name: string;
  price: number;
  cost?: number;
  quantity: number;
};

type PaymentMethod = {
  method: string;
  amount: number;
};

type SalesFormValues = {
  customerName: string;
  customerContact: string;
  saleChannel: string;
  otherChannel?: string;
  paymentMethods: PaymentMethod[];
  discount: number;
  discountType: 'percentage' | 'fixed';
  notes: string;
};

const SalesForm = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'product' | 'service'>('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [showProductNotFound, setShowProductNotFound] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [saleNumber, setSaleNumber] = useState(generateSaleNumber());
  const [saleData, setSaleData] = useState<any>(null);
  
  const form = useForm<SalesFormValues>({
    defaultValues: {
      customerName: '',
      customerContact: '',
      saleChannel: 'store',
      otherChannel: '',
      paymentMethods: [{ method: 'pix', amount: 0 }],
      discount: 0,
      discountType: 'percentage',
      notes: '',
    },
  });

  function generateSaleNumber() {
    return Math.floor(10000 + Math.random() * 90000);
  }

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
          cost: selectedType === 'product' ? item.cost : undefined,
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

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateProfit = () => {
    return selectedItems.reduce((sum, item) => {
      const itemCost = item.cost || 0;
      return sum + ((item.price - itemCost) * item.quantity);
    }, 0);
  };

  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    const discountValue = form.watch('discountType') === 'percentage' 
      ? subtotal * (form.watch('discount') / 100)
      : form.watch('discount');
    
    return Math.max(0, subtotal - discountValue);
  };

  const onSubmit = (data: SalesFormValues) => {
    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um item à venda");
      return;
    }

    // Update payment methods with correct total if not already set
    if (data.paymentMethods[0].amount === 0) {
      data.paymentMethods[0].amount = calculateFinalTotal();
    }

    // Check if the total payment amount matches the final total
    const totalPaymentAmount = data.paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
    if (Math.abs(totalPaymentAmount - calculateFinalTotal()) > 0.01) {
      toast.error("O valor total dos pagamentos deve ser igual ao valor final da venda");
      return;
    }

    const saleData = {
      ...data,
      saleNumber,
      items: selectedItems,
      subtotal: calculateSubtotal(),
      finalTotal: calculateFinalTotal(),
      profit: calculateProfit(),
      date: new Date().toISOString()
    };
    
    console.log(saleData);
    setSaleData(saleData);
    setIsReceiptModalOpen(true);
  };

  const handleNewSale = () => {
    setSelectedItems([]);
    setSaleNumber(generateSaleNumber());
    setIsReceiptModalOpen(false);
    form.reset({
      customerName: '',
      customerContact: '',
      saleChannel: 'store',
      otherChannel: '',
      paymentMethods: [{ method: 'pix', amount: 0 }],
      discount: 0,
      discountType: 'percentage',
      notes: '',
    });
    toast.success("Nova venda iniciada!");
  };

  const handleFinishSale = () => {
    toast.success("Venda finalizada com sucesso!");
    setIsReceiptModalOpen(false);
    navigate('/sales');
  };

  const handleProductNotFound = () => {
    setShowProductNotFound(true);
  };

  const handleRegisterNewProduct = () => {
    toast.info("Redirecionando para cadastro de novo produto...");
    navigate('/products/add');
  };

  return (
    <div className="container mx-auto px-4 pb-10 pt-16 lg:pl-64">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Venda</h1>
          <p className="text-muted-foreground mt-1">Venda #{saleNumber} • {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/sales')}>
            Cancelar
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-white rounded-lg shadow-soft p-6">
                <h2 className="text-xl font-semibold mb-4">Informações da Venda</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="saleChannel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de Venda</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o método de venda" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {saleChannels.map((channel) => (
                                <SelectItem key={channel.id} value={channel.id}>
                                  <div className="flex items-center gap-2">
                                    {channel.icon}
                                    <span>{channel.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('saleChannel') === 'other' && (
                    <FormField
                      control={form.control}
                      name="otherChannel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Especifique o método</FormLabel>
                          <FormControl>
                            <Input placeholder="Método de venda personalizado" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente (opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Nome do cliente" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato do Cliente (opcional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Telefone ou WhatsApp" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-soft p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Produtos e Serviços</h2>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={selectedType === 'product' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('product')}
                      type="button"
                      size="sm"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Produtos
                    </Button>
                    <Button
                      variant={selectedType === 'service' ? 'default' : 'outline'}
                      onClick={() => setSelectedType('service')}
                      type="button"
                      size="sm"
                    >
                      <Wrench className="mr-2 h-4 w-4" />
                      Serviços
                    </Button>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder={`Buscar ${selectedType === 'product' ? 'produtos' : 'serviços'}...`} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {showProductNotFound && (
                  <GlassCard className="bg-amber-50/30 border border-amber-200 p-4 mb-4">
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
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleRegisterNewProduct}
                          type="button"
                        >
                          Cadastrar
                        </Button>
                      </div>
                    </div>
                  </GlassCard>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/20 rounded-lg p-3 max-h-[300px] overflow-auto">
                    <h3 className="text-sm font-medium mb-2">
                      {selectedType === 'product' ? 'Produtos' : 'Serviços'} Disponíveis
                    </h3>
                    
                    {filteredProducts.length > 0 ? (
                      <div className="divide-y">
                        {filteredProducts.map((item) => (
                          <div 
                            key={item.id} 
                            className="py-2 hover:bg-muted/30 transition-colors flex justify-between items-center cursor-pointer"
                            onClick={() => handleAddItem(item)}
                          >
                            <div>
                              <h4 className="font-medium text-sm">{item.name}</h4>
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
                              <span className="font-semibold text-sm">R$ {item.price.toFixed(2)}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-2 h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddItem(item);
                                }}
                                type="button"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-muted-foreground text-sm mb-3">
                          Nenhum {selectedType === 'product' ? 'produto' : 'serviço'} encontrado
                        </p>
                        {selectedType === 'product' && (
                          <Button onClick={handleProductNotFound} type="button" size="sm">
                            Cadastrar Novo Produto
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Itens Selecionados</h3>
                    {selectedItems.length > 0 ? (
                      <div className="space-y-2 mb-4 max-h-[300px] overflow-auto pr-1">
                        {selectedItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/30">
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{item.name}</h5>
                              <div className="flex justify-between">
                                <p className="text-xs text-muted-foreground">
                                  R$ {item.price.toFixed(2)} x {item.quantity}
                                </p>
                                {item.cost && (
                                  <p className="text-xs text-green-600">
                                    Lucro: R$ {((item.price - item.cost) * item.quantity).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleQuantityChange(index, false)}
                                type="button"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleQuantityChange(index, true)}
                                type="button"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 ml-1 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveItem(index)}
                                type="button"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg h-[200px]">
                        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground text-center">
                          Nenhum item adicionado
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          Selecione produtos ou serviços para adicionar à venda
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <SalesSummary 
                subtotal={calculateSubtotal()}
                profit={calculateProfit()}
                form={form}
                calculateFinalTotal={calculateFinalTotal}
              />
              
              <PaymentMethodsSection 
                form={form} 
                total={calculateFinalTotal()}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre a venda..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate('/sales')}>
                  Cancelar
                </Button>
                <Button type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finalizar Venda
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="space-y-4 sticky top-24">
            <SalesSummary 
              subtotal={calculateSubtotal()}
              profit={calculateProfit()}
              form={form}
              calculateFinalTotal={calculateFinalTotal}
              className="hidden lg:block"
            />
            
            <div className="bg-white rounded-lg shadow-soft p-6 space-y-4">
              <h2 className="text-lg font-semibold">Ações Rápidas</h2>
              
              <Button variant="outline" className="w-full justify-start" onClick={handleNewSale} type="button">
                <Plus className="mr-2 h-4 w-4" />
                Nova Venda
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/sales')} type="button">
                <Receipt className="mr-2 h-4 w-4" />
                Histórico de Vendas
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/products/add')} type="button">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cadastrar Produto
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {saleData && (
        <SaleReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          saleData={saleData}
          onNewSale={handleNewSale}
          onFinish={handleFinishSale}
        />
      )}
    </div>
  );
};

export default SalesForm;
