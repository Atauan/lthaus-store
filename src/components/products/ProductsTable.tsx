
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical,
  Copy,
  Edit,
  DollarSign,
  Percent,
  Package
} from 'lucide-react';
import IconButton from '@/components/ui/custom/IconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductsTableProps {
  filteredProducts: Product[];
  totalProducts: number;
  openEditDialog: (product: Product, type: 'price' | 'profit' | 'stock') => void;
}

const ProductsTable = ({ filteredProducts, totalProducts, openEditDialog }: ProductsTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card border-primary/20 border rounded-lg shadow-soft overflow-hidden animate-scale-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-primary/10">
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
                  className="border-b border-primary/10 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary flex-shrink-0 overflow-hidden">
                        <img 
                          src={product.image || '/placeholder.svg'} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">{product.brand}</td>
                  <td className="p-4 text-right font-medium">
                    <div>R$ {product.price.toFixed(2)}</div>
                    {product.cost && (
                      <div className="text-xs text-green-600">
                        Lucro: {(((product.price - product.cost) / product.cost) * 100).toFixed(0)}%
                      </div>
                    )}
                  </td>
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
      
      <div className="p-4 border-t border-primary/10 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredProducts.length} de {totalProducts} produtos
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="border-white">
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled className="border-white">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;
