
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Filter, Search } from "lucide-react";

// Dados de exemplo para demonstração
const questionsData = [
  { 
    id: 1, 
    title: "Direito Constitucional - Princípios Fundamentais", 
    questions: 25, 
    completed: 18, 
    correctAnswers: 15,
    banca: "CESPE",
    difficulty: "Médio"
  },
  { 
    id: 2, 
    title: "Direito Administrativo - Licitações", 
    questions: 30, 
    completed: 30, 
    correctAnswers: 22,
    banca: "FCC",
    difficulty: "Difícil"
  },
  { 
    id: 3, 
    title: "Direito Civil - Contratos", 
    questions: 20, 
    completed: 10, 
    correctAnswers: 8,
    banca: "FGV",
    difficulty: "Médio"
  },
  { 
    id: 4, 
    title: "Direito Penal - Crimes contra a pessoa", 
    questions: 35, 
    completed: 0, 
    correctAnswers: 0,
    banca: "VUNESP",
    difficulty: "Difícil"
  },
  { 
    id: 5, 
    title: "Direito do Trabalho - CLT", 
    questions: 28, 
    completed: 28, 
    correctAnswers: 25,
    banca: "CESPE",
    difficulty: "Fácil"
  },
];

const Questoes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Questões</h1>
            <p className="text-muted-foreground">
              Pratique com questões de concursos e exames da OAB.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Questões Respondidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">86</div>
                <p className="text-sm text-muted-foreground">de 138 questões</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Taxa de Acerto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">81%</div>
                <p className="text-sm text-muted-foreground">70/86 questões</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-sm text-muted-foreground">categorias acessadas</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tempo Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1:42</div>
                <p className="text-sm text-muted-foreground">min por questão</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar questões..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Banca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="cespe">CESPE</SelectItem>
                  <SelectItem value="fcc">FCC</SelectItem>
                  <SelectItem value="fgv">FGV</SelectItem>
                  <SelectItem value="vunesp">VUNESP</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="easy">Fácil</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="hard">Difícil</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {questionsData.map((category) => (
              <Card key={category.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <h3 className="text-xl font-medium mb-2">{category.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline">{category.banca}</Badge>
                        <Badge variant="outline">{category.difficulty}</Badge>
                        <Badge variant="outline">{category.questions} questões</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        {category.completed > 0 ? (
                          <>
                            <span className="font-medium">{category.completed}/{category.questions}</span> questões respondidas
                            <span className="mx-2">•</span>
                            <span className="font-medium">{category.correctAnswers}</span> acertos 
                            <span className="mx-2">•</span>
                            <span className="font-medium">{Math.round((category.correctAnswers / category.completed) * 100)}%</span> de aproveitamento
                          </>
                        ) : (
                          <>
                            <span className="font-medium">0/{category.questions}</span> questões respondidas
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-4 md:mt-0">
                      <Button className="bg-netflix-red hover:bg-netflix-red/90">
                        {category.completed === 0 ? "Iniciar" : "Continuar"}
                      </Button>
                    </div>
                  </div>
                  
                  {category.completed > 0 && (
                    <div className="w-full bg-secondary/30 h-2 rounded-full mt-4">
                      <div 
                        className="bg-netflix-red h-2 rounded-full" 
                        style={{ width: `${(category.completed / category.questions) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Questoes;
