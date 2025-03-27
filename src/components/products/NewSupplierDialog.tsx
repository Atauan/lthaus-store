import React from 'react';
import SupplierFormContainer from './suppliers/SupplierFormContainer';

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  categories?: string[];
}

interface NewSupplierDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSupplier: (supplierData: SupplierFormData) => void;
}

const NewSupplierDialog: React.FC<NewSupplierDialogProps> = ({
  open,
  onOpenChange,
  onAddSupplier,
}) => {
  return (
    <SupplierFormContainer
      open={open}
      onOpenChange={onOpenChange}
      onAddSupplier={onAddSupplier}
    />
  );
};

export default NewSupplierDialog;
