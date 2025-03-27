import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Package, MoreHorizontal, Edit, Trash2, Clipboard, Pencil, DollarSign, FileEdit } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductsTableProps {
  filteredProducts: Product[];
  totalProducts: number;
  openEditDialog: (product: Product, type: 'price' | 'profit' | 'stock' | 'cost' | 'full') => void;
  onDelete: (id: number) => void;
  hasMore: boolean;
  loadMore: () => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  filteredProducts, 
  totalProducts,
  openEditDialog,
  onDelete,
  hasMore,
  loadMore
}) => {
  const navigate = useNavigate();

  const handleFullEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  return (
    <div className="bg-card border-primary/20 border rounded-lg shadow-soft overflow-hidden animate-scale-in">
      <div className="p-4 bg-muted/20 border-b border-primary/10">
        <h3 className="text-lg font-medium">Lista de Produtos</h3>
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredProducts.length} de {totalProducts} produtos
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-primary/10">
              <TableHead className="hidden sm:table-cell w-[50px] text-center">#</TableHead>
              <TableHead className="min-w-[200px]">Produto</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">Categoria</TableHead>
              <TableHead className="hidden md:table-cell min-w-[100px]">Marca</TableHead>
              <TableHead className="min-w-[80px] text-right">Preço</TableHead>
              <TableHead className="hidden sm:table-cell min-w-[80px] text-right">Custo</TableHead>
              <TableHead className="hidden lg:table-cell min-w-[90px] text-right">Lucro</TableHead>
              <TableHead className="min-w-[70px] text-right">Estoque</TableHead>
              <TableHead className="w-[70px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => {
              // ... (rest of the product row rendering code remains the same)
            })}
          </TableBody>
        </Table>
      </div>
      
      {hasMore && (
        <div className="p-4 text-center">
          <Button onClick={loadMore} variant="outline">
            Carregar Mais
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
