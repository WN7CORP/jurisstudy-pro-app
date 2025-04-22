
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Feature {
  id: string;
  title: string;
  description: string;
  category: string;
  isFavorite: boolean;
  showInHome: boolean;
}

const Explorar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: "1",
      title: "Vídeo-aulas",
      description: "Aprenda com professores especialistas",
      category: "Estudo",
      isFavorite: false,
      showInHome: false,
    },
    // ... Adicione mais features aqui
  ]);

  const toggleFavorite = (id: string) => {
    setFeatures(features.map(feature => 
      feature.id === id 
        ? { ...feature, isFavorite: !feature.isFavorite }
        : feature
    ));
  };

  const toggleShowInHome = (id: string) => {
    const favoriteCount = features.filter(f => f.isFavorite && f.showInHome).length;
    const feature = features.find(f => f.id === id);
    
    if (!feature?.isFavorite) {
      return; // Só pode mostrar na home se for favorito
    }
    
    if (!feature.showInHome && favoriteCount >= 3) {
      return; // Máximo de 3 itens na home
    }
    
    setFeatures(features.map(feature => 
      feature.id === id 
        ? { ...feature, showInHome: !feature.showInHome }
        : feature
    ));
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Explorar</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar recursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Favorito</TableHead>
              <TableHead>Mostrar na Home</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{feature.category}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(feature.id)}
                  >
                    <Star 
                      className={feature.isFavorite ? "fill-yellow-400 text-yellow-400" : ""} 
                      size={16} 
                    />
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!feature.isFavorite}
                    onClick={() => toggleShowInHome(feature.id)}
                  >
                    {feature.showInHome ? "Remover" : "Adicionar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default Explorar;
