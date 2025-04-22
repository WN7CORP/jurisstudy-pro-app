
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
            
            {/* Seção: Estudo Rápido */}
            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={quickStudyFeatures} 
                categoryTitle="Estudo Rápido"
              />
            </div>
            
            {/* Seção: Prática e Treinamento */}
            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={practiceFeatures} 
                categoryTitle="Prática e Treinamento"
              />
            </div>

            {/* Seção: Ferramentas Jurídicas */}
            <div className="md:col-span-4 col-span-full">
              <FeaturesCarousel 
                features={legalToolsFeatures} 
                categoryTitle="Ferramentas Jurídicas"
              />
            </div>

            {/* Seção: Extra e Inteligência */}
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
