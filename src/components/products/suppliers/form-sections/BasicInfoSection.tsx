import React from 'react';
import { Building, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  address: string;
  setAddress: (address: string) => void;
  error: string;
  setError: (error: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  setName,
  address,
  setAddress,
  error,
  setError
}) => {
  return (
    <>
      <div>
        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
          <Building className="h-4 w-4" />
          Nome da Empresa
        </label>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Nome da empresa"
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div>
        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
          <MapPin className="h-4 w-4" />
          Endereço
        </label>
        <Textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Endereço completo"
          rows={3}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
