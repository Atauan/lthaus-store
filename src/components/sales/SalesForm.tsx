
import React from 'react';
import { SaleDetails } from '@/hooks/sales/types';
import SaleFormContainer from './form/SaleFormContainer';

interface SalesFormProps {
  initialData?: SaleDetails | null;
}

const SalesForm: React.FC<SalesFormProps> = ({ initialData }) => {
  return (
    <SaleFormContainer initialData={initialData} />
  );
};

export default SalesForm;
