
export interface JogoJuridico {
  id: string;
  tipo: 'forca' | 'caca_palavras' | 'memoria';
  nome: string;
  materia: string;
  tema: string;
  nivel_dificuldade: 'facil' | 'medio' | 'dificil';
  dados: any;
  created_at?: string;
  updated_at?: string;
}

export interface ProgressoJogo {
  id: string;
  jogo_id: string;
  pontuacao: number;
  tentativas: number;
  completado: boolean;
  ultima_jogada: string;
  dados_progresso: any;
}
