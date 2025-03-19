
export type SaleItem = {
  name: string;
  quantity: number;
  price: number;
};

export type Sale = {
  id: number;
  date: string;
  customer: string;
  items: SaleItem[];
  paymentMethod: 'cartao' | 'dinheiro' | 'pix';
  total: number;
};

export const salesData: Sale[] = [
  { 
    id: 1, 
    date: '2023-07-15T14:30:00',
    customer: 'Venda Balcão',
    items: [
      { name: 'Capa iPhone 13', quantity: 1, price: 79.90 },
      { name: 'Película de Vidro', quantity: 1, price: 19.90 }
    ],
    paymentMethod: 'pix',
    total: 99.80
  },
  { 
    id: 2, 
    date: '2023-07-15T10:45:00',
    customer: 'Maria Silva',
    items: [
      { name: 'Cabo Lightning', quantity: 1, price: 29.90 },
      { name: 'Carregador 20W', quantity: 1, price: 89.90 }
    ],
    paymentMethod: 'cartao',
    total: 119.80
  },
  { 
    id: 3, 
    date: '2023-07-14T16:20:00',
    customer: 'João Santos',
    items: [
      { name: 'Fone de Ouvido Bluetooth', quantity: 1, price: 149.90 }
    ],
    paymentMethod: 'dinheiro',
    total: 149.90
  },
  { 
    id: 4, 
    date: '2023-07-14T09:15:00',
    customer: 'Venda Balcão',
    items: [
      { name: 'Suporte para Carro', quantity: 1, price: 49.90 },
      { name: 'Cabo Lightning', quantity: 1, price: 29.90 }
    ],
    paymentMethod: 'cartao',
    total: 79.80
  },
  { 
    id: 5, 
    date: '2023-07-13T11:30:00',
    customer: 'Ana Oliveira',
    items: [
      { name: 'Película de Vidro', quantity: 2, price: 19.90 },
      { name: 'Capa Samsung S21', quantity: 1, price: 69.90 }
    ],
    paymentMethod: 'pix',
    total: 109.70
  },
  { 
    id: 6, 
    date: '2023-07-12T15:40:00',
    customer: 'Carlos Mendes',
    items: [
      { name: 'Carregador Sem Fio', quantity: 1, price: 129.90 }
    ],
    paymentMethod: 'cartao',
    total: 129.90
  },
];

export const categories = ['Todas', 'Cabos', 'Capas', 'Áudio', 'Carregadores', 'Proteção', 'Acessórios'];
