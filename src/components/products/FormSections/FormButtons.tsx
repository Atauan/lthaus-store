
import React from 'react';
import { Undo, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormButtonsProps {
  onCancel: () => void;
  onReset: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  onReset
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        <Undo className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
      
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onReset}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Limpar Campos
      </Button>
      
      <Button type="submit">
        <Save className="mr-2 h-4 w-4" />
        Salvar Produto
      </Button>
    </div>
  );
};

export default FormButtons;
