
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

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
  return (
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
                onSelect={() => onSelectCategory(category)}
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
  );
};

export default CategorySelector;
