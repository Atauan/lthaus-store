
import React from 'react';
import { Tag } from 'lucide-react';
import CategoryBadgeList from './category-components/CategoryBadgeList';
import CategorySelector from './category-components/CategorySelector';
import NewCategoryInput from './category-components/NewCategoryInput';

interface CategoriesSectionProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  allCategories: string[];
  onAddCategory: (category: string) => Promise<boolean>;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  selectedCategories,
  setSelectedCategories,
  allCategories,
  onAddCategory
}) => {
  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories, category]
    );
  };

  const handleAddNewCategory = async (newCategory: string): Promise<boolean> => {
    if (!newCategory.trim()) return false;
    
    const success = await onAddCategory(newCategory);
    if (success) {
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      return true;
    }
    return false;
  };

  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
        <Tag className="h-4 w-4" />
        Categorias
      </label>
      
      <CategoryBadgeList 
        categories={selectedCategories} 
        onRemoveCategory={handleRemoveCategory}
      />
      
      <div className="flex gap-2">
        <CategorySelector 
          selectedCategories={selectedCategories}
          allCategories={allCategories}
          onSelectCategory={handleSelectCategory}
        />
        
        <NewCategoryInput onAddCategory={handleAddNewCategory} />
      </div>
    </div>
  );
};

export default CategoriesSection;
