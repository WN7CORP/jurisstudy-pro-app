
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
