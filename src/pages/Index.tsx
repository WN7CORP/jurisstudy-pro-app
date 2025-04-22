import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import FeaturesCarousel from "@/components/home/FeaturesCarousel";
import RecentActivity from "@/components/home/RecentActivity";
import StudyProgress from "@/components/home/StudyProgress";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import { 
  quickStudyFeatures, 
  practiceFeatures, 
  legalToolsFeatures, 
  extraFeatures 
} from "@/components/home/HomeFeatures";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-netflix-offWhite">Dashboard</h1>
          <Button variant="outline" className="text-xs h-8">
            Personalizar
          </Button>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-4 col-span-full grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-6">
            <WelcomeBanner />
            
            {/* Seções existentes */}
            <div className="md:col-span-4 col-span-full bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg border border-primary/20 shadow-lg">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl font-bold">Desbloqueie Todo o Potencial</h2>
                  <p className="text-muted-foreground max-w-lg">
                    Acesse conteúdo exclusivo, videoaulas, materiais premium e muito mais com nossos planos de assinatura.
                  </p>
                </div>
                <Link to="/assinatura">
                  <Button size="lg" className="font-semibold">
                    <Crown className="mr-2" />
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={quickStudyFeatures} 
                categoryTitle="Estudo Rápido"
              />
            </div>
            
            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={practiceFeatures} 
                categoryTitle="Prática e Treinamento"
              />
            </div>

            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={legalToolsFeatures} 
                categoryTitle="Ferramentas Jurídicas"
              />
            </div>

            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={extraFeatures} 
                categoryTitle="Extra e Inteligência"
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="xl:col-span-1 col-span-full">
            <RecentActivity />
            <StudyProgress />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
