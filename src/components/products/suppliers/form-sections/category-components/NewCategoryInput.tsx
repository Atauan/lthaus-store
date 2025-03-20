
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NewCategoryInputProps {
  onAddCategory: (category: string) => Promise<boolean>;
}

const NewCategoryInput: React.FC<NewCategoryInputProps> = ({ onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const success = await onAddCategory(newCategory);
    if (success) {
      setNewCategory('');
    }
  };

  return (
    <div className="relative flex-1">
      <Input
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Nova categoria..."
        className="pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        onClick={handleAddCategory}
        disabled={!newCategory.trim()}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NewCategoryInput;
