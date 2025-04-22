
import React from "react";
import { Button } from "@/components/ui/button";

const WelcomeBanner = () => {
  return (
    <div className="md:col-span-4 col-span-full bg-gradient-to-r from-netflix-black to-netflix-red/50 rounded-lg relative overflow-hidden h-48">
      <div className="absolute inset-0 bg-[url('/law-pattern.png')] opacity-10"></div>
      <div className="p-6 flex flex-col h-full justify-center relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Bem-vindo ao JurisStudy Pro
        </h2>
        <p className="text-netflix-offWhite max-w-lg mb-4">
          O app jurídico que vai te levar da dúvida à aprovação. Domine a lei. Vença o edital.
        </p>
        <Button className="bg-netflix-red hover:bg-netflix-red/90 text-white w-fit">
          Comece agora
        </Button>
      </div>
    </div>
  );
};

export default WelcomeBanner;
