
import React, { useState } from 'react';
import { Tag, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

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
  const [newCategory, setNewCategory] = useState('');

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    const success = await onAddCategory(newCategory);
    if (success) {
      setNewCategory('');
    }
  };

  return (
    <div>
      <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
        <Tag className="h-4 w-4" />
        Categorias
      </label>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedCategories.map((category) => (
          <Badge 
            key={category} 
            variant="secondary"
            className="flex items-center gap-1"
          >
            {category}
            <button 
              type="button" 
              className="ml-1 text-xs rounded-full hover:bg-muted p-0.5"
              onClick={() => handleRemoveCategory(category)}
            >
              ×
            </button>
          </Badge>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              type="button"
              className="justify-start flex-1"
            >
              Selecionar categorias
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar categoria..." />
              <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
              <CommandGroup>
                {allCategories.map((category) => (
                  <CommandItem
                    key={category}
                    onSelect={() => {
                      setSelectedCategories(prev => 
                        prev.includes(category) 
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      );
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCategories.includes(category) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {category}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
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
      </div>
    </div>
  );
};

export default CategoriesSection;
