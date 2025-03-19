
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';

export interface ProductFormValues {
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

export function useProductForm() {
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
  useEffect(() => {
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

  return {
    form,
    profit,
    profitMargin,
    selectedImages,
    previewUrls,
    isNewCategoryDialogOpen,
    isNewBrandDialogOpen,
    isNewSupplierDialogOpen,
    setIsNewCategoryDialogOpen,
    setIsNewBrandDialogOpen,
    setIsNewSupplierDialogOpen,
    handleMarginChange,
    handleSalePriceChange,
    handleImageUpload,
    removeImage,
    handleResetForm,
    handleAutoFill,
    handleAddCategory,
    handleAddBrand,
    handleAddSupplier,
    onSubmit: form.handleSubmit(onSubmit),
    navigate
  };
}
