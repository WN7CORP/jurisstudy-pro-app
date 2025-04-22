
import React from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Map, BookText, Brain, FileText, Newspaper, Video, Gamepad } from "lucide-react";

interface CommandOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: string;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (action: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, onSelect }) => {
  const commandOptions: CommandOption[] = [
    { 
      id: 'mapa', 
      name: 'Mapa Mental', 
      description: 'Gerar um mapa mental sobre um tema jurídico', 
      icon: <Map className="h-5 w-5" />, 
      action: '/mapa' 
    },
    { 
      id: 'resumo', 
      name: 'Resumo', 
      description: 'Criar um resumo sobre um tema jurídico', 
      icon: <BookText className="h-5 w-5" />, 
      action: '/resumo' 
    },
    { 
      id: 'questao', 
      name: 'Questões', 
      description: 'Gerar questões sobre um tema jurídico', 
      icon: <Brain className="h-5 w-5" />, 
      action: '/questao' 
    },
    { 
      id: 'artigo', 
      name: 'Artigo Jurídico', 
      description: 'Escrever um artigo jurídico para o blog', 
      icon: <FileText className="h-5 w-5" />, 
      action: '/artigo' 
    },
    { 
      id: 'noticias', 
      name: 'Notícias', 
      description: 'Buscar notícias jurídicas recentes', 
      icon: <Newspaper className="h-5 w-5" />, 
      action: '/noticias' 
    },
    { 
      id: 'jurisflix', 
      name: 'JurisFlix', 
      description: 'Recomendar conteúdo audiovisual jurídico', 
      icon: <Video className="h-5 w-5" />, 
      action: '/jurisflix' 
    },
    { 
      id: 'jogos', 
      name: 'Jogos Jurídicos', 
      description: 'Sugerir jogos jurídicos interativos', 
      icon: <Gamepad className="h-5 w-5" />, 
      action: '/jogos' 
    },
    { 
      id: 'peticao', 
      name: 'Peticionário', 
      description: 'Criar uma petição jurídica', 
      icon: <FileText className="h-5 w-5" />, 
      action: '/peticao' 
    },
  ];

  if (!isOpen) return null;

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Digite um comando..." />
      <CommandList>
        <CommandEmpty>Nenhum comando encontrado.</CommandEmpty>
        <CommandGroup heading="Comandos disponíveis">
          {commandOptions.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.action);
                onClose();
              }}
            >
              <div className="mr-2">
                {option.icon}
              </div>
              <div>
                <div className="font-medium">{option.name}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
