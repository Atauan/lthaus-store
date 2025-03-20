
import React from 'react';
import { Undo, RefreshCw, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormButtonsProps {
  onCancel: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  onCancel,
  onReset,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        <Undo className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onReset}
        disabled={isLoading}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Clear Fields
      </Button>
      
      <Button 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Saving...' : 'Save Product'}
      </Button>
    </div>
  );
};

export default FormButtons;
