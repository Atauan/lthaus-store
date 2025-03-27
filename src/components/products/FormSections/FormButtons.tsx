import React from 'react';
import { Undo, RefreshCw, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductFormContext } from '@/contexts/ProductFormContext';

const FormButtons: React.FC = () => {
  const { 
    handleResetForm, 
    navigate, 
    isSubmitting, 
    isEditing 
  } = useProductFormContext();

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        <Undo className="mr-2 h-4 w-4" />
        {isEditing ? 'Voltar para Produtos' : 'Cancelar'}
      </Button>
      
      <Button 
        type="button" 
        variant="secondary" 
        onClick={handleResetForm}
        disabled={isSubmitting}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        {isEditing ? 'Restaurar Original' : 'Limpar Campos'}
      </Button>
      
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Produto' : 'Salvar Produto'}
      </Button>
    </div>
  );
};

export default FormButtons;
