
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

// Tabela para referência de funções e métodos relacionados a jogos
/**
 * | Função                 | Descrição                                                    |
 * |------------------------|------------------------------------------------------------|
 * | validarTipoJogo        | Verifica se o tipo de jogo é válido                        |
 * | converterParaJogoJuridico | Converte dados brutos para o formato JogoJuridico       |
 * | salvarProgressoJogo    | Salva o progresso de um jogo no banco de dados             |
 * | obterProgressoJogo     | Recupera o progresso de um usuário em um jogo específico   |
 * | atualizarPontuacao     | Atualiza a pontuação de um usuário em um jogo              |
 */
