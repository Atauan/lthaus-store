
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingDown } from 'lucide-react';
import { Product } from '@/hooks/products/useProductTypes';

interface StagnantProductsTableProps {
  stagnantProducts: Product[];
}

const StagnantProductsTable: React.FC<StagnantProductsTableProps> = ({ stagnantProducts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingDown className="mr-2 h-5 w-5 text-red-500" />
          Produtos Parados
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Estoque</TableHead>
                <TableHead className="text-right">Dias Parado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stagnantProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">{30 + index * 5}</TableCell>
                </TableRow>
              ))}
              
              {stagnantProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Não há produtos parados no estoque.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StagnantProductsTable;
