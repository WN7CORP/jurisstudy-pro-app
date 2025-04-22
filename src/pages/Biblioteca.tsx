
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookMarked, BookText, BookOpen, HeartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BookCardProps {
  title: string;
  author: string;
  cover: string;
  category: string;
  categoryColor: string;
  pages: number;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  cover,
  category,
  categoryColor,
  pages
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col bg-netflix-darkGray border-netflix-darkGray hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-netflix-red/20 to-netflix-black"
          style={{ backgroundImage: `url(${cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        <div className="absolute top-2 left-2">
          <Badge className={`${categoryColor} text-xs`}>{category}</Badge>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/30 text-white hover:bg-black/50"
        >
          <HeartIcon className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-netflix-offWhite">{title}</CardTitle>
        <CardDescription>{author}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{pages} páginas</span>
          <span className="text-xs">PDF</span>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-2">
        <div className="flex justify-between w-full">
          <Button size="sm" variant="ghost" className="text-xs">
            <BookOpen className="h-4 w-4 mr-1" />
            Ler
          </Button>
          <Button size="sm" variant="ghost" className="text-xs">
            <Download className="h-4 w-4 mr-1" />
            Baixar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const books = [
  {
    title: "Manual de Direito Civil",
    author: "Pablo Stolze",
    cover: "/book-cover-1.jpg",
    category: "Civil",
    categoryColor: "bg-blue-500",
    pages: 850
  },
  {
    title: "Curso de Direito Constitucional",
    author: "Gilmar Mendes",
    cover: "/book-cover-2.jpg",
    category: "Constitucional",
    categoryColor: "bg-green-500",
    pages: 720
  },
  {
    title: "Direito Penal Esquematizado",
    author: "Cleber Masson",
    cover: "/book-cover-3.jpg",
    category: "Penal",
    categoryColor: "bg-red-500",
    pages: 912
  },
  {
    title: "Manual de Direito Administrativo",
    author: "Rafael Carvalho",
    cover: "/book-cover-4.jpg",
    category: "Administrativo",
    categoryColor: "bg-yellow-500",
    pages: 688
  },
  {
    title: "Direito Processual Civil",
    author: "Fredie Didier Jr.",
    cover: "/book-cover-5.jpg",
    category: "Processual",
    categoryColor: "bg-purple-500",
    pages: 798
  },
  {
    title: "Direito Tributário",
    author: "Eduardo Sabbag",
    cover: "/book-cover-6.jpg",
    category: "Tributário",
    categoryColor: "bg-orange-500",
    pages: 654
  }
];

const categories = [
  { id: "all", label: "Todos" },
  { id: "civil", label: "Civil" },
  { id: "constitucional", label: "Constitucional" },
  { id: "penal", label: "Penal" },
  { id: "administrativo", label: "Administrativo" },
  { id: "processual", label: "Processual" }
];

const Biblioteca = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-netflix-offWhite">Biblioteca Digital</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <BookMarked className="h-4 w-4 mr-1" />
              Meus Favoritos
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <BookText className="h-4 w-4 mr-1" />
              Minhas Anotações
            </Button>
          </div>
        </div>

        <div className="bg-netflix-darkGray/50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-medium mb-3">Encontre seu material de estudo</h2>
          <Tabs defaultValue="all">
            <TabsList className="mb-4 bg-secondary/20">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {books.map((book) => (
                  <BookCard
                    key={book.title}
                    title={book.title}
                    author={book.author}
                    cover={book.cover}
                    category={book.category}
                    categoryColor={book.categoryColor}
                    pages={book.pages}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="civil" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {books
                  .filter((book) => book.category === "Civil")
                  .map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      cover={book.cover}
                      category={book.category}
                      categoryColor={book.categoryColor}
                      pages={book.pages}
                    />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="constitucional" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {books
                  .filter((book) => book.category === "Constitucional")
                  .map((book) => (
                    <BookCard
                      key={book.title}
                      title={book.title}
                      author={book.author}
                      cover={book.cover}
                      category={book.category}
                      categoryColor={book.categoryColor}
                      pages={book.pages}
                    />
                  ))}
              </div>
            </TabsContent>
            {/* Outras tabs seguiriam a mesma estrutura */}
          </Tabs>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Recentemente Adicionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.slice(0, 3).map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                author={book.author}
                cover={book.cover}
                category={book.category}
                categoryColor={book.categoryColor}
                pages={book.pages}
              />
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-netflix-offWhite mb-4">Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.slice(3, 6).map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                author={book.author}
                cover={book.cover}
                category={book.category}
                categoryColor={book.categoryColor}
                pages={book.pages}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Biblioteca;
