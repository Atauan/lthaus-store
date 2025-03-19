
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WandSparkles, Upload, Search } from 'lucide-react';
import { useProductAutoFill } from '@/hooks/useProductAutoFill';

interface ProductAutoFillProps {
  onAutoFill: (productData: any) => void;
}

const ProductAutoFill = ({ onAutoFill }: ProductAutoFillProps) => {
  const { loading, analyzeProductImage, analyzeProductName } = useProductAutoFill();
  const [productName, setProductName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido');
      return;
    }
    
    toast.info("Analisando imagem do produto usando DeepSeek...", { duration: 3000 });
    
    const result = await analyzeProductImage(file);
    
    if (result.success && result.data) {
      toast.success("Produto preenchido automaticamente!");
      onAutoFill(result.data);
    } else {
      toast.error(result.error || "Erro ao analisar imagem");
    }
  };
  
  const handleProductNameAnalysis = async () => {
    if (!productName.trim()) {
      toast.error('Por favor, digite o nome do produto');
      return;
    }
    
    toast.info("Analisando nome do produto usando DeepSeek...", { duration: 3000 });
    
    const result = await analyzeProductName(productName);
    
    if (result.success && result.data) {
      toast.success("Produto preenchido automaticamente!");
      onAutoFill(result.data);
      setShowNameInput(false);
      setProductName('');
    } else {
      toast.error(result.error || "Erro ao analisar nome do produto");
    }
  };
  
  return (
    <div className="space-y-4">
      {showNameInput ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o nome do produto..."
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              disabled={loading}
            />
            <Button 
              type="button" 
              variant="default" 
              onClick={handleProductNameAnalysis}
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" />
              Analisar
            </Button>
          </div>
          <Button 
            type="button" 
            variant="link" 
            onClick={() => setShowNameInput(false)}
            className="self-start text-xs"
          >
            Voltar
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full border-blue-200 hover:bg-blue-100/50"
            onClick={() => setShowNameInput(true)}
            disabled={loading}
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            Auto Preencher por Nome
          </Button>
          
          <div className="relative">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-blue-200 hover:bg-blue-100/50"
              disabled={loading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Auto Preencher por Imagem
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleImageUpload}
                disabled={loading}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAutoFill;
