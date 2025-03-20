
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
  onRemove: (category: string) => void;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, onRemove }) => {
  return (
    <Badge 
      key={category} 
      variant="secondary"
      className="flex items-center gap-1"
    >
      {category}
      <button 
        type="button" 
        className="ml-1 text-xs rounded-full hover:bg-muted p-0.5"
        onClick={() => onRemove(category)}
      >
        ×
      </button>
    </Badge>
  );
};

export default CategoryBadge;
