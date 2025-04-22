
import React from "react";
import Layout from "@/components/layout/Layout";

const Jogos: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Jogos Jurídicos</h1>
            <p className="text-muted-foreground">
              Aprenda direito de forma divertida e interativa
            </p>
          </div>
          
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              Conteúdo em desenvolvimento. Em breve você terá acesso aos jogos jurídicos.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jogos;
