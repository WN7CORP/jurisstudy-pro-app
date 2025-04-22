
export interface FlashCard {
  id: number;
  area: string | null;
  tema: string | null;
  pergunta: string | null;
  resposta: string | null;
  explicacao: string | null;
  created_at?: string | null;
}

export interface UserProgress {
  id?: string;
  user_id: string;
  flashcard_id: number;
  correct_count: number;
  incorrect_count: number;
  confidence_level: number;
  last_reviewed: string;
  created_at?: string;
  updated_at?: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PlaylistItem {
  playlist_id: string;
  flashcard_id: number;
  position: number;
}

/**
 * Tabela de funções utilizadas nos flashcards
 * 
 * | Função | Descrição |
 * |--------|-----------|
 * | updateProgress | Atualiza o progresso do usuário em um flashcard |
 * | createPlaylist | Cria uma nova playlist de flashcards |
 * | addFlashcardToPlaylist | Adiciona um flashcard a uma playlist |
 * | getFlashcardsByArea | Busca flashcards por área |
 * | getFlashcardsByTema | Busca flashcards por tema |
 * | getUserProgress | Busca o progresso do usuário em um flashcard |
 * | getPlaylistsByUser | Busca playlists criadas por um usuário |
 * | fetchFlashcards | Busca todos os flashcards disponíveis |
 * | handleSave | Salva uma nova playlist no banco de dados |
 * | toggleFlashcard | Marca/desmarca um flashcard para a playlist |
 * | getUniqueAreas | Obtém áreas únicas para os filtros |
 */
