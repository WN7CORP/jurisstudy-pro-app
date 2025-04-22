
export interface CursoNarrado {
  id: number;
  materia: string | null;
  sobre: string | null;
  capa: string | null;
  link: string | null;
  download: string | null;
  sequencia: string | null;
  created_at: string;
}

export interface CursosAgrupados {
  [key: string]: CursoNarrado[];
}
