
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalesHeaderProps {
  title: string;
  description: string;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  
  const handleNewSale = () => {
    navigate('/sales/new');
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <Button onClick={handleNewSale}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nova Venda
      </Button>
    </div>
  );
};

export default SalesHeader;
