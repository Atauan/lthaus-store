
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  Send, 
  CheckCircle, 
  RotateCw, 
  Store,
  Smartphone,
  Instagram,
  ShoppingBag,
  FileText,
  CreditCard,
  Banknote,
  Loader2
} from 'lucide-react';

interface SaleReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: any;
  onNewSale: () => void;
  onFinish: () => void;
  savingInProgress?: boolean;
}

const SaleReceiptModal: React.FC<SaleReceiptModalProps> = ({
  isOpen,
  onClose,
  saleData,
  onNewSale,
  onFinish,
  savingInProgress = false
}) => {
  if (!saleData) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getSaleChannelIcon = (channel: string) => {
    switch(channel) {
      case 'store': return <Store className="h-4 w-4" />;
      case 'whatsapp': return <Smartphone className="h-4 w-4" />;
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'marketplace': return <ShoppingBag className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  const getSaleChannelName = (channel: string) => {
    switch(channel) {
      case 'store': return 'Loja física';
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'marketplace': return 'Marketplace';
      case 'other': return saleData.otherChannel || 'Outro';
      default: return 'Outro';
    }
  };
  
  const getPaymentMethodIcon = (method: string) => {
    switch(method) {
      case 'pix': return <Smartphone className="h-4 w-4" />;
      case 'debito': return <CreditCard className="h-4 w-4" />;
      case 'credito': return <CreditCard className="h-4 w-4" />;
      case 'dinheiro': return <Banknote className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  const getPaymentMethodName = (method: string) => {
    switch(method) {
      case 'pix': return 'PIX';
      case 'debito': return 'Cartão de Débito';
      case 'credito': return 'Cartão de Crédito';
      case 'dinheiro': return 'Dinheiro';
      default: return 'Outro';
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSendWhatsApp = () => {
    if (!saleData.customerContact) {
      alert('Contato do cliente não informado!');
      return;
    }
    
    let phone = saleData.customerContact.replace(/\D/g, '');
    if (!phone.startsWith('55')) {
      phone = '55' + phone;
    }
    
    let items = saleData.items.map((item: any) => 
      `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = encodeURIComponent(
      `*Comprovante de Compra - Lthaus Imports*\n\n` +
      `*Venda #${saleData.saleNumber}*\n` +
      `Data: ${formatDate(saleData.date)}\n\n` +
      `*Itens:*\n${items}\n\n` +
      `*Subtotal:* R$ ${saleData.subtotal.toFixed(2)}\n` +
      `*Desconto:* R$ ${(saleData.subtotal - saleData.finalTotal).toFixed(2)}\n` +
      `*Total:* R$ ${saleData.finalTotal.toFixed(2)}\n\n` +
      `Agradecemos pela preferência!`
    );
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Comprovante de Venda</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-center mb-4">
            <h2 className="font-bold text-xl">Lthaus Imports</h2>
            <p className="text-muted-foreground text-sm">Comprovante de Venda</p>
          </div>
          
          <div className="border-t border-b py-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Venda #:</span>
              <span className="font-medium">{saleData.saleNumber}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{formatDate(saleData.date)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Método de Venda:</span>
              <span className="flex items-center gap-1">
                {getSaleChannelIcon(saleData.saleChannel)}
                {getSaleChannelName(saleData.saleChannel)}
              </span>
            </div>
            
            {saleData.customerName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cliente:</span>
                <span>{saleData.customerName}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Itens</h3>
            <div className="space-y-2">
              {saleData.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {saleData.subtotal.toFixed(2)}</span>
            </div>
            
            {(saleData.subtotal - saleData.finalTotal) > 0 && (
              <div className="flex justify-between">
                <span>Desconto:</span>
                <span>R$ {(saleData.subtotal - saleData.finalTotal).toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>R$ {saleData.finalTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t">
            <h3 className="font-medium">Pagamento</h3>
            {saleData.paymentMethods.map((payment: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  {getPaymentMethodIcon(payment.method)}
                  {getPaymentMethodName(payment.method)}:
                </span>
                <span>R$ {payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {saleData.notes && (
            <div className="pt-2 border-t">
              <h3 className="font-medium">Observações:</h3>
              <p className="text-sm text-muted-foreground">{saleData.notes}</p>
            </div>
          )}
          
          <p className="text-center text-xs text-muted-foreground pt-4">
            Agradecemos pela preferência!
          </p>
        </div>
        
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleSendWhatsApp}
              disabled={!saleData.customerContact}
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar WhatsApp
            </Button>
          </div>
          
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={onNewSale}>
              <RotateCw className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
            
            <Button 
              className="flex-1" 
              onClick={onFinish}
              disabled={savingInProgress}
            >
              {savingInProgress ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Finalizar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaleReceiptModal;
