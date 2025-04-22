
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, FileText } from "lucide-react";

const Resumos: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resumos</h1>
              <p className="text-muted-foreground">
                Seus resumos de estudo organizados por matéria
              </p>
            </div>
            <Button className="bg-netflix-red hover:bg-netflix-red/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Resumo
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Buscar nos resumos..." 
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Direito Civil - Contratos</CardTitle>
                <CardDescription>Atualizado há 3 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm mb-4">
                  Este resumo aborda os conceitos fundamentais dos contratos no direito civil brasileiro, incluindo formação, validade, eficácia e extinção. Também são abordados os principais tipos de contratos...
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">4 páginas</div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" /> Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Direito Constitucional - Organização do Estado</CardTitle>
                <CardDescription>Atualizado há 1 semana</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm mb-4">
                  Este resumo aborda a organização política-administrativa do Estado brasileiro, tratando sobre a União, Estados, Municípios e Distrito Federal, bem como suas competências...
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">6 páginas</div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" /> Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Direito Administrativo - Licitações</CardTitle>
                <CardDescription>Atualizado há 2 semanas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm mb-4">
                  Este resumo trata sobre o processo licitatório, modalidades de licitação, dispensa e inexigibilidade. Também inclui referências à nova Lei de Licitações (Lei nº 14.133/2021)...
                </p>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground">8 páginas</div>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" /> Abrir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Adicione mais cards conforme necessário */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resumos;
