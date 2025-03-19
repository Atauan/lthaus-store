
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { 
  Search, 
  Plus, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  Copy,
  Edit,
  DollarSign,
  Percent,
  Package
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import IconButton from '@/components/ui/custom/IconButton';

const products = [
  { 
    id: 1, 
    name: 'Cabo Lightning', 
    description: 'Cabo para iPhone com conector Lightning',
    category: 'Cabos',
    brand: 'Generic',
    price: 29.90,
    stock: 45,
    image: '/placeholder.svg'
  },
  { 
    id: 2, 
    name: 'Capa iPhone 13', 
    description: 'Capa transparente para iPhone 13',
    category: 'Capas',
    brand: 'Apple',
    price: 79.90,
    stock: 23,
    image: '/placeholder.svg'
  },
  { 
    id: 3, 
    name: 'Fone de Ouvido Bluetooth', 
    description: 'Fone sem fio com cancelamento de ruído',
    category: 'Áudio',
    brand: 'JBL',
    price: 149.90,
    stock: 12,
    image: '/placeholder.svg'
  },
  { 
    id: 4, 
    name: 'Carregador 20W', 
    description: 'Carregador rápido USB-C',
    category: 'Carregadores',
    brand: 'Anker',
    price: 89.90,
    stock: 18,
    image: '/placeholder.svg'
  },
  { 
    id: 5, 
    name: 'Película de Vidro', 
    description: 'Película de vidro temperado para Samsung',
    category: 'Proteção',
    brand: 'Generic', 
    price: 19.90,
    stock: 56,
    image: '/placeholder.svg'
  },
  { 
    id: 6, 
    name: 'Suporte para Carro', 
    description: 'Suporte veicular magnético',
    category: 'Acessórios',
    brand: 'Generic',
    price: 49.90,
    stock: 9,
    image: '/placeholder.svg'
  },
];

const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
const brands = ['Todas', 'Apple', 'Samsung', 'Anker', 'JBL', 'Generic'];

const Products = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editType, setEditType] = useState<'price' | 'profit' | 'stock'>('price');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'Todas' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  const handleAddProduct = () => {
    navigate('/products/add');
  };

  const openEditDialog = (product: any, type: 'price' | 'profit' | 'stock') => {
    setSelectedProduct(product);
    setEditType(type);
    
    if (type === 'price') {
      setEditValue(product.price.toString());
    } else if (type === 'stock') {
      setEditValue(product.stock.toString());
    } else if (type === 'profit') {
      // Calculate profit percentage if cost exists
      if (product.cost) {
        const profitMargin = ((product.price - product.cost) / product.cost) * 100;
        setEditValue(profitMargin.toFixed(2));
      } else {
        setEditValue('0');
      }
    }
    
    setEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedProduct) return;
    
    try {
      const numericValue = parseFloat(editValue);
      
      if (isNaN(numericValue)) {
        toast.error("O valor inserido não é válido");
        return;
      }
      
      // Create a copy of the products array
      const updatedProducts = [...products];
      const productIndex = updatedProducts.findIndex(p => p.id === selectedProduct.id);
      
      if (productIndex === -1) return;
      
      if (editType === 'price') {
        if (numericValue <= 0) {
          toast.error("O preço deve ser maior que zero");
          return;
        }
        updatedProducts[productIndex].price = numericValue;
        toast.success(`Preço do produto "${selectedProduct.name}" atualizado para R$ ${numericValue.toFixed(2)}`);
      } 
      else if (editType === 'stock') {
        if (numericValue < 0 || !Number.isInteger(numericValue)) {
          toast.error("A quantidade em estoque deve ser um número inteiro positivo");
          return;
        }
        updatedProducts[productIndex].stock = numericValue;
        toast.success(`Estoque do produto "${selectedProduct.name}" atualizado para ${numericValue} unidades`);
      } 
      else if (editType === 'profit') {
        if (!selectedProduct.cost) {
          toast.error("Não é possível definir margem de lucro sem o custo do produto");
          return;
        }
        
        // Calculate new price based on cost and profit margin
        const newPrice = selectedProduct.cost * (1 + numericValue / 100);
        updatedProducts[productIndex].price = newPrice;
        toast.success(`Margem de lucro do produto "${selectedProduct.name}" definida para ${numericValue}%`);
      }
      
      // In a real app, you would update the database here
      
      setEditDialogOpen(false);
    } catch (error) {
      toast.error("Ocorreu um erro ao salvar as alterações");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen lg:pl-64 pt-16">
        <div className="container mx-auto px-4 pb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
              <p className="text-muted-foreground mt-1">Gerencie seu catálogo de produtos</p>
            </div>

            <Button onClick={handleAddProduct} className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar produtos..." 
                className="pl-9"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Categoria" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    <SelectValue placeholder="Marca" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-soft overflow-hidden animate-scale-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Produto</th>
                    <th className="text-left p-4 hidden md:table-cell">Categoria</th>
                    <th className="text-left p-4 hidden md:table-cell">Marca</th>
                    <th className="text-right p-4">Preço</th>
                    <th className="text-right p-4">Estoque</th>
                    <th className="text-center p-4 w-16">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-secondary flex-shrink-0 overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">{product.brand}</td>
                        <td className="p-4 text-right font-medium">R$ {product.price.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock <= 5 ? 'bg-red-100 text-red-800' : 
                            product.stock <= 15 ? 'bg-amber-100 text-amber-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.stock} unidades
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <IconButton variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </IconButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => navigate(`/products/edit/${product.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar produto
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(product, 'price')}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Alterar preço
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(product, 'profit')}>
                                <Percent className="mr-2 h-4 w-4" />
                                Definir margem de lucro
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(product, 'stock')}>
                                <Package className="mr-2 h-4 w-4" />
                                Atualizar estoque
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicar produto
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Excluir produto
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Nenhum produto encontrado. Tente ajustar os filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredProducts.length} de {products.length} produtos
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para editar preço, lucro ou estoque */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editType === 'price' && 'Alterar Preço'}
              {editType === 'profit' && 'Definir Margem de Lucro'}
              {editType === 'stock' && 'Atualizar Estoque'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <span>Produto: {selectedProduct.name}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-value" className="text-right">
                {editType === 'price' && 'Preço (R$)'}
                {editType === 'profit' && 'Margem (%)'}
                {editType === 'stock' && 'Quantidade'}
              </Label>
              <Input
                id="edit-value"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="col-span-3"
                type="number"
                step={editType === 'stock' ? "1" : "0.01"}
                min={editType === 'stock' ? "0" : undefined}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Products;
