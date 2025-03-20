
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SimpleEditFormProps {
  editType: 'price' | 'profit' | 'stock' | 'cost';
  editValue: string;
  setEditValue: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const SimpleEditForm: React.FC<SimpleEditFormProps> = ({
  editType,
  editValue,
  setEditValue,
  onSave,
  onCancel
}) => {
  const getLabel = () => {
    switch (editType) {
      case 'price': return 'Preço (R$)';
      case 'profit': return 'Margem (%)';
      case 'stock': return 'Quantidade';
      case 'cost': return 'Custo (R$)';
      default: return '';
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="edit-value" className="text-right">
            {getLabel()}
          </Label>
          <Input
            id="edit-value"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="col-span-3 border-white"
            type="number"
            step={editType === 'stock' ? "1" : "0.01"}
            min={editType === 'stock' ? "0" : undefined}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="border-white">Cancelar</Button>
        <Button onClick={onSave}>Salvar</Button>
      </DialogFooter>
    </>
  );
};

export default SimpleEditForm;
