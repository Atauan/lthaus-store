import React from 'react';
import { Check, Tag, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { toast } from 'sonner';
import { useCategoriesAndBrands } from '@/hooks/products/useCategoriesAndBrands';

interface CategorySelectorProps {
  selectedCategories: string[];
  allCategories: string[];
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  allCategories,
  onSelectCategory
}) => {
  // Count how many categories are selected
  const selectedCount = selectedCategories.length;
  const { deleteCategory } = useCategoriesAndBrands();
  
  const handleDeleteCategory = async (category: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (confirm(`Deseja realmente excluir a categoria "${category}"?`)) {
      const success = await deleteCategory(category);
      if (success) {
        toast.success(`Categoria "${category}" excluída com sucesso!`);
      }
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          type="button"
          className="justify-start flex-1"
        >
          <Tag className="mr-2 h-4 w-4" />
          {selectedCount > 0 
            ? `${selectedCount} ${selectedCount === 1 ? 'categoria selecionada' : 'categorias selecionadas'}`
            : 'Selecionar categorias'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar categoria..." />
          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
          <CommandGroup heading="Categorias disponíveis">
            {allCategories.map((category) => (
              <CommandItem
                key={category}
                onSelect={() => onSelectCategory(category)}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedCategories.includes(category) ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    {selectedCategories.includes(category) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span>{category}</span>
                </div>
                <button 
                  onClick={(e) => handleDeleteCategory(category, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                >
                  <X className="h-4 w-4 text-red-500 hover:text-red-700" />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
