
import React from "react";
import { Scale, FileText, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecentActivity = () => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4 mb-4">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <Scale className="mr-2 h-5 w-5 text-netflix-red" />
        Atividade Recente
      </h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">Resumo: Direito Constitucional</span>
          </div>
          <span className="text-xs text-muted-foreground">hoje</span>
        </div>
        <div className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
          <div className="flex items-center">
            <BrainCircuit className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">Simulado: OAB 2ª fase</span>
          </div>
          <span className="text-xs text-muted-foreground">ontem</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-xs mt-2 w-full text-muted-foreground hover:text-foreground">
        Ver tudo
      </Button>
    </div>
  );
};

export default RecentActivity;
