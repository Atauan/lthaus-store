
import React from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';

type SaleItem = {
  name: string;
  quantity: number;
  price: number;
};

type Sale = {
  id: number;
  date: string;
  customer: string;
  items: SaleItem[];
  paymentMethod: string;
  total: number;
};

interface SalesTableProps {
  sales: Sale[];
  formatDate: (dateString: string) => string;
}

const SalesTable: React.FC<SalesTableProps> = ({ sales, formatDate }) => {
  const paymentIcons = {
    cartao: <CreditCard className="h-4 w-4" />,
    dinheiro: <Banknote className="h-4 w-4" />,
    pix: <Smartphone className="h-4 w-4" />,
  };

  const paymentNames = {
    cartao: 'Cartão',
    dinheiro: 'Dinheiro',
    pix: 'PIX',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/30">
            <th className="text-left py-3 px-4">Venda</th>
            <th className="text-left py-3 px-4">Data</th>
            <th className="text-left py-3 px-4 hidden md:table-cell">Cliente</th>
            <th className="text-left py-3 px-4">Itens</th>
            <th className="text-left py-3 px-4 hidden md:table-cell">Pagamento</th>
            <th className="text-right py-3 px-4">Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <tr key={sale.id} className="border-b hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-medium">#{sale.id.toString().padStart(4, '0')}</td>
                <td className="py-3 px-4 text-muted-foreground">{formatDate(sale.date)}</td>
                <td className="py-3 px-4 hidden md:table-cell">{sale.customer}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    {sale.items.map((item, idx) => (
                      <span key={idx} className="text-sm">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-secondary">
                    {paymentIcons[sale.paymentMethod as keyof typeof paymentIcons]}
                    {paymentNames[sale.paymentMethod as keyof typeof paymentNames]}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-semibold">
                  R$ {sale.total.toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-8 text-center text-muted-foreground">
                Nenhuma venda encontrada. Tente ajustar os filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
