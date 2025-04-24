
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * Tabela de Funções - SearchBar.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | SearchBar               | Componente que renderiza uma barra de pesquisa para filtrar         |
 * | (Componente)            | vídeo-aulas por título ou descrição                                 |
 * | handleSearchChange      | Função que processa mudanças no campo de busca com debounce         |
 * | (Função)                | para melhorar performance                                           |
 * -------------------------------------------------------------------------------------------------
 */

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // Implementação de debounce para evitar muitas requisições durante a digitação
  const [searchTerm, setSearchTerm] = React.useState('');
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="pl-10 w-full"
        placeholder="Pesquisar vídeo aulas..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  );
};
