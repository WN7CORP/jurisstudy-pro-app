
import React from "react";
import Layout from "@/components/layout/Layout";

const Desktop: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Desktop</h1>
            <p className="text-muted-foreground">
              Acesse o JurisStudyPro pelo seu computador
            </p>
          </div>
          
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Conteúdo em desenvolvimento. Em breve você poderá baixar a versão desktop do JurisStudyPro.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Desktop;
