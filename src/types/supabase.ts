export interface MapaMental {
  id: string;
  titulo: string;
  area_direito: string;
  estrutura: {
    central: string;
    filhos: MapNode[];
  };
  criado_por?: string | null;
  criado_por_ia?: boolean;
  publico?: boolean;
  created_at: string;
}

export interface MapNode {
  nome: string;
  descricao?: string;
  filhos?: MapNode[];
}

export interface JurisflixContent {
  id: string;
  titulo: string;
  tipo: 'filme' | 'série' | 'documentário';
  ano: number;
  sinopse: string;
  temas_juridicos?: string[];
  onde_assistir?: string[];
  poster_url?: string | null;
  rating?: number | null;
  created_at: string;
  updated_at: string;
}

export interface VideoTranscription {
  id: string;
  video_id: string;
  transcricao: string;
  resumo_ai?: string | null;
  pontos_chave?: {
    ponto: string;
    descricao?: string;
  }[] | null;
  palavras_chave?: string[] | null;
  duracao?: number | null;
  created_at: string;
}

export interface GeminiRequestOptions {
  module?: string;
  systemPrompt?: string;
  metadata?: Record<string, any>;
  responseFormat?: "text" | "json";
}
