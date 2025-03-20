
import React from 'react';
import { User, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ContactInfoSectionProps {
  contactName: string;
  setContactName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  contactName,
  setContactName,
  phone,
  setPhone,
  email,
  setEmail
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
            <User className="h-4 w-4" />
            Pessoa de Contato
          </label>
          <Input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Nome do contato"
          />
        </div>

        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
            <Phone className="h-4 w-4" />
            Telefone
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
          <Mail className="h-4 w-4" />
          E-mail
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@empresa.com"
        />
      </div>
    </>
  );
};

export default ContactInfoSection;
