
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

/**
 * Tabela de Funções - CategoryList.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | CategoryList            | Componente que renderiza uma lista de categorias de vídeo-aulas     |
 * | (Componente)            | com suporte a seleção e filtragem                                   |
 * -------------------------------------------------------------------------------------------------
 */

interface Category {
  id: string;
  nome: string;
}

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-2">
      <div className="flex space-x-2 p-1">
        <Button
          variant={selectedCategory === null ? "secondary" : "ghost"}
          onClick={() => onSelectCategory(null)}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "secondary" : "ghost"}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.nome}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
