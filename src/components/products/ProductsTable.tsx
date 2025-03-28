
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal, ExternalLink, Tag, Package2, DollarSign } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Product } from '@/hooks/products/types';

export interface ProductsTableProps {
  filteredProducts: Product[];
  totalProducts: number;
  openEditDialog: (product: Product, type: 'price' | 'stock' | 'cost' | 'profit' | 'full') => void;
  onDelete: (productId: number) => Promise<void>;
  hasMore: boolean;
  loadMore: () => void;
}

const ProductsTable = ({ 
  filteredProducts, 
  totalProducts, 
  openEditDialog, 
  onDelete,
  hasMore,
  loadMore
}: ProductsTableProps) => {
  // Handle editing a product
  const handleEdit = (product: Product, type: 'price' | 'stock' | 'cost' | 'profit' | 'full') => {
    openEditDialog(product, type);
  };

  // Handle deleting a product
  const handleDelete = async (productId: number) => {
    await onDelete(productId);
  };

  return (
    <div>
      <div className="p-4 border-b">
        <p className="text-sm text-muted-foreground">
          Exibindo {filteredProducts.length} de {totalProducts} produtos
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Custo</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell className="text-right font-medium">
                  R$ {product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  R$ {product.cost?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell className={`text-right ${product.stock <= (product.min_stock || 5) ? 'text-destructive font-medium' : ''}`}>
                  {product.stock}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product, 'full')}>
                        <Pencil className="mr-2 h-4 w-4" />
                        <span>Editar detalhes</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product, 'price')}>
                        <Tag className="mr-2 h-4 w-4" />
                        <span>Alterar preço</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product, 'stock')}>
                        <Package2 className="mr-2 h-4 w-4" />
                        <span>Ajustar estoque</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product, 'cost')}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Atualizar custo</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir produto</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {hasMore && (
        <div className="p-4 text-center">
          <Button
            onClick={loadMore}
            variant="outline"
          >
            Carregar mais produtos
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
