
import React from "react";
import Layout from "@/components/layout/Layout";

const Bloger: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Bloger</h1>
            <p className="text-muted-foreground">
              Seu espaço para criar e publicar artigos jurídicos
            </p>
          </div>
          
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Conteúdo em desenvolvimento. Em breve você poderá escrever e publicar seus próprios artigos.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bloger;
