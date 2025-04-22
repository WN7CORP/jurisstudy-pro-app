
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface Category {
  area: string;
  count: number;
}

interface CategoriesCarouselProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {categories.map((category, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
            <Card 
              className={`h-24 cursor-pointer transition-colors ${
                selectedCategory === category.area ? 'border-netflix-red' : 'hover:border-netflix-red/70'
              }`}
              onClick={() => onSelectCategory(selectedCategory === category.area ? null : category.area)}
            >
              <CardContent className="flex flex-col justify-center items-center h-full p-4">
                <h3 className="font-medium text-center">{category.area}</h3>
                <p className="text-sm text-muted-foreground">{category.count} cards</p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );
};
