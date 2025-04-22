
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

interface Feature {
  id: string;
  title: string;
  icon: React.ReactNode;
  href: string;
  isFavorite?: boolean;
}

interface FeaturesCarouselProps {
  features: Feature[];
  onToggleFavorite?: (id: string) => void;
}

const FeaturesCarousel: React.FC<FeaturesCarouselProps> = ({ 
  features,
  onToggleFavorite 
}) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.id} className="md:basis-1/4 lg:basis-1/5">
            <Card className="p-4 relative group">
              <div className="flex flex-col items-center">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-sm font-medium text-center">{feature.title}</h3>
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
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default FeaturesCarousel;
