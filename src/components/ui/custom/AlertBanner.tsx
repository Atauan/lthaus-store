import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export interface AlertBannerProps {
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'success' | 'error';
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  title,
  message,
  type = 'info',
  onDismiss,
  actionText,
  onAction
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 border-amber-300 text-amber-800';
      case 'success':
        return 'bg-green-50 border-green-300 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-300 text-red-800';
      default:
        return 'bg-blue-50 border-blue-300 text-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      <Alert className={getAlertStyles()}>
        {getIcon()}
        <div className="flex-1">
          <AlertTitle className="font-medium">{title}</AlertTitle>
          <AlertDescription className="mt-1 text-sm">{message}</AlertDescription>
        </div>
        <div className="flex gap-2 ml-auto">
          {actionText && onAction && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAction}
              className="bg-white border-current text-current hover:bg-gray-50 hover:text-current"
            >
              {actionText}
            </Button>
          )}
          {onDismiss && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDismiss}
              className="bg-white border-current text-current hover:bg-gray-50 hover:text-current"
            >
              Fechar
            </Button>
          )}
        </div>
      </Alert>
    </motion.div>
  );
};

export default AlertBanner;
