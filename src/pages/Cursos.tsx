
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { CursoCard } from "@/components/cursos/CursoCard";
import { CursoViewer } from "@/components/cursos/CursoViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CursoNarrado, CursosAgrupados } from "@/types/cursos";
import { useIsMobile } from "@/hooks/use-mobile";

const Cursos: React.FC = () => {
  const [selectedCurso, setSelectedCurso] = useState<CursoNarrado | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const { data: cursos, isLoading } = useQuery({
    queryKey: ['cursos-narrados'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cursos_narrados')
        .select('*')
        .order('sequencia');

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os cursos.",
        });
        throw error;
      }

      return data as CursoNarrado[];
    }
  });

  const cursosAgrupados = React.useMemo(() => {
    if (!cursos) return {};
    return cursos.reduce<CursosAgrupados>((acc, curso) => {
      const area = curso.sequencia?.split('.')[0] || 'Outros';
      if (!acc[area]) {
        acc[area] = [];
      }
      acc[area].push(curso);
      return acc;
    }, {});
  }, [cursos]);

  if (selectedCurso?.link) {
    return (
      <CursoViewer
        link={selectedCurso.link}
        onBack={() => setSelectedCurso(null)}
        cursoId={selectedCurso.id}
      />
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Cursos</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Aprendizado estruturado para sua jornada jurídica
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {Object.entries(cursosAgrupados).map(([area, cursosDaArea]) => (
                <div key={area} className="space-y-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Área {area}</h2>
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {cursosDaArea.map((curso) => (
                      <CursoCard
                        key={curso.id}
                        id={curso.id}
                        materia={curso.materia || ''}
                        sobre={curso.sobre}
                        capa={curso.capa}
                        download={curso.download}
                        onClick={() => setSelectedCurso(curso)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cursos;
