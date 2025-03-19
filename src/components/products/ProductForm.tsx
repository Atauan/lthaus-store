
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { 
  Package, 
  TagIcon, 
  BadgePercent, 
  Layers3, 
  Building2, 
  Upload, 
  XCircle,
  Info,
  Star,
  Paintbrush,
  Save,
  Undo,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import GlassCard from '@/components/ui/custom/GlassCard';
import IconButton from '@/components/ui/custom/IconButton';
import NewCategoryDialog from './NewCategoryDialog';
import NewBrandDialog from './NewBrandDialog';
import NewSupplierDialog from './NewSupplierDialog';
import ProductAutoFill from './ProductAutoFill';
import { useProducts } from '@/hooks/useProducts';

// Sample categories, brands and suppliers for demonstration
const categories = ['Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
const brands = ['Apple', 'Samsung', 'Anker', 'JBL', 'Generic', 'Xiaomi'];
const suppliers = ['Tech Imports Ltda', 'Distribuidora ABC', 'Mobile Acessórios', 'Global Tech'];

interface ProductFormValues {
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  category: string;
  brand: string;
  stock: number;
  supplier?: string;
  productType: 'internal' | 'external';
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [profit, setProfit] = useState<number>(0);
  const [profitMargin, setProfitMargin] = useState<number>(40); // Default 40% profit margin
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isNewBrandDialogOpen, setIsNewBrandDialogOpen] = useState(false);
  const [isNewSupplierDialogOpen, setIsNewSupplierDialogOpen] = useState(false);
  
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      category: '',
      brand: '',
      stock: 1,
      productType: 'external', // Default to external (for sale to customers)
    },
  });

  const watchCostPrice = form.watch('costPrice');
  
  // Calculate sale price based on cost and margin
  const calculateSalePrice = (cost: number, margin: number) => {
    if (cost <= 0) return 0;
    const multiplier = 1 + (margin / 100);
    const calculatedPrice = cost * multiplier;
    return parseFloat(calculatedPrice.toFixed(2));
  };

  // Update sale price and profit when cost or margin changes
  React.useEffect(() => {
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, profitMargin);
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculatedSalePrice - cost);
  }, [watchCostPrice, profitMargin, form]);

  // Handle margin slider change
  const handleMarginChange = (newMargin: number) => {
    setProfitMargin(newMargin);
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    const calculatedSalePrice = calculateSalePrice(cost, newMargin);
    form.setValue('salePrice', calculatedSalePrice);
    setProfit(calculatedSalePrice - cost);
  };

  // Handle sale price direct input
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const salePrice = parseFloat(e.target.value) || 0;
    const cost = parseFloat(watchCostPrice.toString()) || 0;
    
    if (cost > 0 && salePrice > cost) {
      const newProfit = salePrice - cost;
      setProfit(newProfit);
      
      // Calculate and update margin based on new sale price
      const newMargin = ((salePrice - cost) / cost) * 100;
      setProfitMargin(parseFloat(newMargin.toFixed(0)));
    }
    
    form.setValue('salePrice', salePrice);
  };

  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images maximum
      const newImages = [...selectedImages, ...filesArray].slice(0, 5);
      setSelectedImages(newImages);

      // Generate preview URLs
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      
      // Revoke old URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      setPreviewUrls(newPreviewUrls);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    // Revoke the URL being removed
    URL.revokeObjectURL(previewUrls[index]);
    
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  // Reset the form
  const handleResetForm = () => {
    // Revoke all preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedImages([]);
    setPreviewUrls([]);
    setProfitMargin(40);
    form.reset({
      name: '',
      description: '',
      costPrice: 0,
      salePrice: 0,
      category: '',
      brand: '',
      stock: 1,
      supplier: '',
      productType: 'external',
    });
  };

  // Handle auto-fill
  const handleAutoFill = (productData: any) => {
    form.setValue('name', productData.name);
    form.setValue('description', productData.description);
    form.setValue('category', productData.category);
    form.setValue('brand', productData.brand);
    
    // Set cost price (if available)
    if (productData.cost) {
      form.setValue('costPrice', productData.cost);
    }
    
    // Set sale price
    form.setValue('salePrice', productData.price);
    
    // Update profit margin if we have both cost and price
    if (productData.cost && productData.price) {
      const newMargin = ((productData.price - productData.cost) / productData.cost) * 100;
      setProfitMargin(parseFloat(newMargin.toFixed(0)));
      setProfit(productData.price - productData.cost);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Map form data to product structure
      const productData = {
        name: data.name,
        description: data.description,
        category: data.category,
        brand: data.brand,
        price: data.salePrice,
        cost: data.costPrice > 0 ? data.costPrice : null,
        stock: data.stock
      };
      
      // Call the addProduct function from useProducts hook
      const result = await addProduct(productData);
      
      if (result.success) {
        toast.success("Produto adicionado com sucesso!");
        
        // Reset the form
        handleResetForm();
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/products');
        }, 2000);
      } else {
        toast.error(`Erro ao adicionar produto: ${result.error?.message || 'Erro desconhecido'}`);
      }
    } catch (error: any) {
      toast.error(`Erro ao adicionar produto: ${error.message}`);
    }
  };

  // Add new category
  const handleAddCategory = (newCategory: string) => {
    console.log("New category to add:", newCategory);
    toast.success(`Categoria "${newCategory}" adicionada com sucesso!`);
    form.setValue('category', newCategory);
    setIsNewCategoryDialogOpen(false);
  };

  // Add new brand
  const handleAddBrand = (newBrand: string) => {
    console.log("New brand to add:", newBrand);
    toast.success(`Marca "${newBrand}" adicionada com sucesso!`);
    form.setValue('brand', newBrand);
    setIsNewBrandDialogOpen(false);
  };

  // Add new supplier
  const handleAddSupplier = (newSupplier: string) => {
    console.log("New supplier to add:", newSupplier);
    toast.success(`Fornecedor "${newSupplier}" adicionado com sucesso!`);
    form.setValue('supplier', newSupplier);
    setIsNewSupplierDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main product info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main product information card */}
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
                                      <SelectItem key={category} value={category}>
                                        {category}
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

              {/* Pricing and inventory card */}
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
            </div>

            {/* Right column - Additional info & images */}
            <div className="space-y-6">
              {/* AI Auto-fill card */}
              <GlassCard borderEffect hoverEffect className="bg-blue-50/30">
                <div className="text-center">
                  <ProductAutoFill onAutoFill={handleAutoFill} />
                </div>
              </GlassCard>

              {/* Product Type and Supplier */}
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
                            onClick={() => setIsNewSupplierDialogOpen(true)}
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

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" /> 
                    Imagens do Produto
                  </CardTitle>
                  <CardDescription>
                    Adicione até 5 imagens do produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={url} 
                          alt={`Preview ${index}`}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <IconButton
                          type="button"
                          variant="primary"
                          size="sm"
                          className="absolute -top-2 -right-2"
                          onClick={() => removeImage(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </IconButton>
                      </div>
                    ))}
                    
                    {previewUrls.length < 5 && (
                      <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-md cursor-pointer hover:bg-primary/5 transition-colors">
                        <Upload className="h-5 w-5 text-primary/70" />
                        <span className="text-xs text-primary/70 mt-1">Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageUpload}
                          multiple={true}
                        />
                      </label>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Formatos suportados: JPG, PNG e WEBP
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/products')}
            >
              <Undo className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleResetForm}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Limpar Campos
            </Button>
            
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Salvar Produto
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialogs for adding new categories, brands, and suppliers */}
      <NewCategoryDialog 
        open={isNewCategoryDialogOpen}
        onOpenChange={setIsNewCategoryDialogOpen}
        onAddCategory={handleAddCategory}
      />
      
      <NewBrandDialog 
        open={isNewBrandDialogOpen}
        onOpenChange={setIsNewBrandDialogOpen}
        onAddBrand={handleAddBrand}
      />
      
      <NewSupplierDialog 
        open={isNewSupplierDialogOpen}
        onOpenChange={setIsNewSupplierDialogOpen}
        onAddSupplier={handleAddSupplier}
      />
    </div>
  );
};

export default ProductForm;
