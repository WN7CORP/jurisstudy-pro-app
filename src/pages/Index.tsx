
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import FeaturesCarousel from "@/components/home/FeaturesCarousel";
import RecentActivity from "@/components/home/RecentActivity";
import StudyProgress from "@/components/home/StudyProgress";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import { mainFeatures, practiceFeatures } from "@/components/home/HomeFeatures";

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
          <div className="xl:col-span-4 col-span-full grid md:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4">
            <WelcomeBanner />
            
            {/* Section: Estudo */}
            <div className="md:col-span-4 col-span-full">
              <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Estudo</h2>
              <FeaturesCarousel features={mainFeatures} />
            </div>
            
            {/* Section: Prática e Treinamento */}
            <div className="md:col-span-4 col-span-full">
              <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">
                Prática e Treinamento
              </h2>
              <FeaturesCarousel features={practiceFeatures} />
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
