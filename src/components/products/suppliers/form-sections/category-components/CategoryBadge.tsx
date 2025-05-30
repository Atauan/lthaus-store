
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  onRemove: (category: string) => void;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, onRemove }) => {
  return (
    <Badge 
      key={category} 
      variant="secondary"
      className="flex items-center gap-1 pr-1.5" // Adjusted padding for better button spacing
    >
      {category}
      <button 
        type="button" 
        className="ml-1 text-xs rounded-full hover:bg-destructive hover:text-destructive-foreground p-0.5 transition-colors"
        onClick={() => onRemove(category)}
        aria-label={`Remover categoria ${category}`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};

export default CategoryBadge;
