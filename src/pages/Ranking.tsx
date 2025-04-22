
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo para demonstração
const leaderboardData = [
  { id: 1, name: "Ana Silva", avatar: "/placeholder.svg", points: 2450, badge: "🥇" },
  { id: 2, name: "Carlos Oliveira", avatar: "/placeholder.svg", points: 2120, badge: "🥈" },
  { id: 3, name: "Juliana Santos", avatar: "/placeholder.svg", points: 1950, badge: "🥉" },
  { id: 4, name: "Roberto Almeida", avatar: "/placeholder.svg", points: 1840 },
  { id: 5, name: "Fernanda Costa", avatar: "/placeholder.svg", points: 1760 },
  { id: 6, name: "Marcelo Souza", avatar: "/placeholder.svg", points: 1620 },
  { id: 7, name: "Patricia Lima", avatar: "/placeholder.svg", points: 1580 },
  { id: 8, name: "Gustavo Pereira", avatar: "/placeholder.svg", points: 1490 },
  { id: 9, name: "Camila Ramos", avatar: "/placeholder.svg", points: 1350 },
  { id: 10, name: "Daniel Ferreira", avatar: "/placeholder.svg", points: 1280 },
];

const categoryPerformance = [
  { name: "Flashcards", points: 480, total: 600, percentage: 80 },
  { name: "Questões", points: 350, total: 500, percentage: 70 },
  { name: "Simulados", points: 290, total: 400, percentage: 73 },
  { name: "Vídeo-aulas", points: 420, total: 500, percentage: 84 },
  { name: "Resumos", points: 180, total: 300, percentage: 60 },
  { name: "Jurisprudência", points: 320, total: 400, percentage: 80 },
  { name: "Cursos", points: 410, total: 500, percentage: 82 },
];

const weeklyProgress = [
  { day: "Dom", points: 120 },
  { day: "Seg", points: 180 },
  { day: "Ter", points: 150 },
  { day: "Qua", points: 220 },
  { day: "Qui", points: 190 },
  { day: "Sex", points: 240 },
  { day: "Sáb", points: 160 },
];

const Ranking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("geral");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Ranking de Estudos</h1>
            <p className="text-muted-foreground">
              Acompanhe seu desempenho e veja como está em relação a outros estudantes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="col-span-1 md:col-span-2 shadow-md">
              <CardHeader>
                <CardTitle>Meu Desempenho</CardTitle>
                <CardDescription>
                  Estatísticas da última semana
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyProgress} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="points" stroke="#e50914" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Sua Posição</CardTitle>
                <CardDescription>
                  Ranking Geral
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center flex-col py-4">
                  <div className="text-6xl font-bold mb-2 text-netflix-red">4º</div>
                  <p className="text-lg font-medium">Roberto Almeida</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-netflix-red">1840 pontos</Badge>
                    <Badge variant="outline">Top 10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full shadow-md mb-6">
            <CardHeader>
              <CardTitle>Distribuição de Pontos por Categoria</CardTitle>
              <CardDescription>
                Veja seu desempenho em cada área
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="points" fill="#e50914" />
                  <Bar dataKey="total" fill="#221f1f" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-0">
              <CardTitle>Classificação</CardTitle>
              <CardDescription>
                Ranking dos melhores estudantes
              </CardDescription>
              <Tabs defaultValue="geral" className="mt-4" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:w-[600px]">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                  <TabsTrigger value="questoes">Questões</TabsTrigger>
                  <TabsTrigger value="simulados">Simulados</TabsTrigger>
                  <TabsTrigger value="videos">Vídeo-aulas</TabsTrigger>
                  <TabsTrigger value="resumos">Resumos</TabsTrigger>
                  <TabsTrigger value="jurisprudencia">Jurisprudência</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {leaderboardData.map((user, index) => (
                  <div 
                    key={user.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${index < 3 ? 'bg-secondary/50' : 'hover:bg-secondary/20'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-lg w-8 text-center">{index + 1}</span>
                      <Avatar className="h-10 w-10 border border-netflix-darkGray">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.points} pontos</p>
                      </div>
                    </div>
                    {user.badge && (
                      <span className="text-2xl">{user.badge}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Ranking;
