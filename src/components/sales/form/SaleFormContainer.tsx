
import React from 'react';
import { Form } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { SalesFormValues } from '../types/salesTypes';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface SaleFormContainerProps {
  form: UseFormReturn<SalesFormValues>;
  onSubmit: () => void;
  children?: React.ReactNode;
  initialData?: any;
}

const SaleFormContainer: React.FC<SaleFormContainerProps> = ({
  form,
  onSubmit,
  children
}) => {
  const navigate = useNavigate();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {children}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações (opcional)</label>
          <Textarea 
            placeholder="Observações sobre a venda..." 
            className="resize-none" 
            {...form.register('notes')} 
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={() => navigate('/sales')}>
            Cancelar
          </Button>
          <Button type="submit">
            <CheckCircle className="mr-2 h-4 w-4" />
            Finalizar Venda
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SaleFormContainer;
