
import React from 'react';
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
import { Package, MoreHorizontal, Edit, Trash2, Clipboard, Pencil, DollarSign } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductsTableProps {
  filteredProducts: Product[];
  totalProducts: number;
  openEditDialog: (product: Product, type: 'price' | 'profit' | 'stock' | 'cost' | 'full') => void;
  onDelete: (id: number) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  filteredProducts, 
  totalProducts,
  openEditDialog,
  onDelete
}) => {
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => {
                // Calcular o lucro
                const profit = product.cost ? product.price - product.cost : null;
                const profitMargin = product.cost ? ((product.price - product.cost) / product.cost) * 100 : null;
                
                return (
                  <TableRow key={product.id} className="border-b border-primary/10 hover:bg-muted/30 transition-colors">
                    <TableCell className="hidden sm:table-cell text-center">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/5 flex items-center justify-center">
                          {product.image_url ? (
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="h-full w-full object-cover rounded-md" 
                            />
                          ) : (
                            <Package className="h-5 w-5 text-primary/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-[180px] md:max-w-[220px]">{product.name}</p>
                          <div className="md:hidden text-xs text-muted-foreground">
                            {product.category && <span className="mr-2">{product.category}</span>}
                            {product.brand && <span>{product.brand}</span>}
                          </div>
                          {product.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-[180px] md:max-w-[220px] hidden sm:block">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                      {product.cost ? `R$ ${product.cost.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right">
                      {profit ? (
                        <div>
                          <p>R$ {profit.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {profitMargin!.toFixed(0)}%
                          </p>
                        </div>
                      ) : "-"}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${product.stock < 5 ? 'text-destructive' : ''}`}>
                      {product.stock} un
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Mais opções</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            
                            <DropdownMenuItem onClick={() => openEditDialog(product, 'full')}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edição Rápida
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => openEditDialog(product, 'price')}>
                              <DollarSign className="h-4 w-4 mr-2" />
                              Editar Preço
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => openEditDialog(product, 'cost')}>
                              <Clipboard className="h-4 w-4 mr-2" />
                              Editar Custo
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => openEditDialog(product, 'stock')}>
                              <Package className="h-4 w-4 mr-2" />
                              Editar Estoque
                            </DropdownMenuItem>
                            
                            {product.cost && (
                              <DropdownMenuItem onClick={() => openEditDialog(product, 'profit')}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Definir Margem
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => onDelete(product.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsTable;
