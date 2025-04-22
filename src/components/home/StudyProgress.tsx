
import React from "react";
import { BrainCircuit } from "lucide-react";

const StudyProgress = () => {
  return (
    <div className="bg-secondary/40 rounded-lg p-4">
      <h2 className="text-lg font-medium mb-3 flex items-center">
        <BrainCircuit className="mr-2 h-5 w-5 text-netflix-red" />
        Progresso de Estudo
      </h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Civil</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[65%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Penal</span>
            <span>40%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[40%]"></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Direito Constitucional</span>
            <span>80%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-netflix-red w-[80%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyProgress;
