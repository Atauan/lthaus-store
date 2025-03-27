import React from 'react';
import CategoryBadge from './CategoryBadge';

interface CategoryBadgeListProps {
  categories: string[];
  onRemoveCategory: (category: string) => void;
}

const CategoryBadgeList: React.FC<CategoryBadgeListProps> = ({ 
  categories, 
  onRemoveCategory 
}) => {
  if (categories.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {categories.map((category) => (
        <CategoryBadge 
          key={category} 
          category={category} 
          onRemove={onRemoveCategory}
        />
      ))}
    </div>
  );
};

export default CategoryBadgeList;
