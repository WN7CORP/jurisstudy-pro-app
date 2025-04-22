
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Feature } from "./HomeFeatures";

interface FeaturesCarouselProps {
  features: Feature[];
  onToggleFavorite?: (id: string) => void;
  categoryTitle?: string;
}

const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({ 
  features,
  onToggleFavorite,
  categoryTitle
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-3">
      {categoryTitle && (
        <h2 className="text-xl font-semibold text-netflix-offWhite">
          {categoryTitle}
        </h2>
      )}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {features.map((feature) => (
            <CarouselItem 
              key={feature.id} 
              // No mobile: 2 cards por linha (um inteiro e um pela metade)
              // No tablet: 3 cards
              // No desktop: 4-5 cards dependendo da largura
              className="pl-2 md:pl-4 basis-[47%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <Card className={`
                p-4 relative group bg-netflix-darkGray border-netflix-darkGray 
                hover:shadow-md hover:bg-netflix-darkGray/80 transition-all duration-300 h-full
                ${isMobile ? 'min-h-[160px]' : 'min-h-[220px]'}
              `}>
                <div className="flex flex-col items-center h-full">
                  <div className="w-12 h-12 rounded-full bg-netflix-red/10 flex items-center justify-center mb-3">
                    {React.createElement(feature.icon, { size: isMobile ? 20 : 24, className: "text-netflix-red" })}
                  </div>
                  <h3 className="text-lg font-medium text-netflix-offWhite text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className={`
                    text-sm text-muted-foreground text-center mb-4 flex-grow
                    ${isMobile ? 'line-clamp-2' : 'line-clamp-3'}
                  `}>
                    {feature.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="text-netflix-red hover:text-netflix-red/80" 
                    asChild
                  >
                    <Link to={feature.href}>Acessar</Link>
                  </Button>
                </div>
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onToggleFavorite(feature.id)}
                  >
                    <Star
                      className={feature.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}
                      size={16}
                    />
                  </Button>
                )}
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 lg:-left-4" />
        <CarouselNext className="hidden md:flex right-0 lg:-right-4" />
      </Carousel>
    </div>
  );
};

export default FeaturesCarousel;
