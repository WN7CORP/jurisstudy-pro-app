
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Share2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Tabela de Funções - MapaMentalViewer.tsx
 * -------------------------------------------------------------------------------------------------
 * | Função                  | Descrição                                                           |
 * |-------------------------|---------------------------------------------------------------------|
 * | MapaMentalViewer        | Componente para visualização de mapas mentais                       |
 * | (Componente)            | com suporte a zoom e exportação                                     |
 * | zoomIn/zoomOut          | Funções para aumentar ou diminuir o zoom do mapa mental             |
 * | (Funções)               | ajustando a escala de visualização                                  |
 * | downloadAsImage         | Exporta o mapa mental como imagem PNG                               |
 * | (Função)                | usando HTML2Canvas para converter para imagem                       |
 * | renderNode             | Renderiza um nó individual do mapa mental                           |
 * | (Função)                | com seus filhos de forma recursiva                                  |
 * -------------------------------------------------------------------------------------------------
 */

interface MapNode {
  nome: string;
  descricao?: string;
  filhos?: MapNode[];
}

interface MapaMentalData {
  central: string;
  filhos: MapNode[];
}

interface MapaMentalViewerProps {
  data: MapaMentalData;
  title: string;
  area: string;
}

export const MapaMentalViewer: React.FC<MapaMentalViewerProps> = ({ data, title, area }) => {
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  const downloadAsImage = () => {
    // Esta função seria implementada com HTML2Canvas ou biblioteca similar
    // para exportar o mapa visual como imagem
    toast.info("Exportação como imagem", { 
      description: "Esta funcionalidade será implementada em breve." 
    });
  };
  
  const shareMap = () => {
    // Lógica para compartilhar o mapa
    toast.info("Compartilhamento", { 
      description: "Esta funcionalidade será implementada em breve." 
    });
  };

  const renderNode = (node: MapNode, level: number = 0) => {
    return (
      <div 
        key={node.nome} 
        className={`map-node level-${level} ${level === 0 ? 'root-node' : ''}`}
      >
        <div className={`node-content bg-primary/10 p-3 rounded-lg border border-primary/20 mb-2`}>
          <h4 className="font-medium">{node.nome}</h4>
          {node.descricao && <p className="text-sm text-muted-foreground">{node.descricao}</p>}
        </div>
        
        {node.filhos && node.filhos.length > 0 && (
          <div className={`children-container ml-8`}>
            {node.filhos.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{area}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-auto">
        <div 
          ref={mapRef} 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}
          className="map-container p-2"
        >
          <div className="root-node-container">
            <div className="central-node bg-primary text-primary-foreground p-4 rounded-lg text-center font-bold mb-6">
              {data.central}
            </div>
            <div className="children-container flex flex-col gap-4">
              {data.filhos.map((node) => renderNode(node))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="icon" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={shareMap}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
          <Button variant="secondary" onClick={downloadAsImage}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
