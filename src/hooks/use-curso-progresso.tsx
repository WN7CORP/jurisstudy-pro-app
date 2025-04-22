
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCursoProgresso = (cursoId: number) => {
  const queryClient = useQueryClient();

  const { data: progresso, isLoading } = useQuery({
    queryKey: ['curso-progresso', cursoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progresso_cursos')
        .select('*')
        .eq('curso_id', cursoId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (dados: { iniciado?: boolean; concluido?: boolean; progresso?: number }) => {
      const { data, error } = await supabase
        .from('progresso_cursos')
        .upsert({
          curso_id: cursoId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...dados,
          ultima_visualizacao: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curso-progresso', cursoId] });
    },
  });

  return {
    progresso,
    isLoading,
    atualizarProgresso: mutation.mutate,
  };
};
