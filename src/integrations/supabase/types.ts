export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bloger: {
        Row: {
          autor_id: string | null
          conteudo: string
          created_at: string | null
          id: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          autor_id?: string | null
          conteudo: string
          created_at?: string | null
          id?: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          autor_id?: string | null
          conteudo?: string
          created_at?: string | null
          id?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cakto_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      configuracoes_usuarios: {
        Row: {
          backup_pdf_url: string | null
          configuracoes: Json | null
          created_at: string | null
          historico_sessoes: Json | null
          id: string
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          backup_pdf_url?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          historico_sessoes?: Json | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          backup_pdf_url?: string | null
          configuracoes?: Json | null
          created_at?: string | null
          historico_sessoes?: Json | null
          id?: string
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "configuracoes_usuarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cronogramas: {
        Row: {
          created_at: string | null
          disciplina: string | null
          id: string
          metas: Json | null
          semana: number | null
          topicos: string[] | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          disciplina?: string | null
          id?: string
          metas?: Json | null
          semana?: number | null
          topicos?: string[] | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          disciplina?: string | null
          id?: string
          metas?: Json | null
          semana?: number | null
          topicos?: string[] | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cronogramas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          anotacoes: string | null
          area: string | null
          checklist: Json | null
          created_at: string | null
          id: string
          nome: string | null
          objetivo: string | null
          pdfs: string[] | null
          updated_at: string | null
          video_aulas: string[] | null
        }
        Insert: {
          anotacoes?: string | null
          area?: string | null
          checklist?: Json | null
          created_at?: string | null
          id?: string
          nome?: string | null
          objetivo?: string | null
          pdfs?: string[] | null
          updated_at?: string | null
          video_aulas?: string[] | null
        }
        Update: {
          anotacoes?: string | null
          area?: string | null
          checklist?: Json | null
          created_at?: string | null
          id?: string
          nome?: string | null
          objetivo?: string | null
          pdfs?: string[] | null
          updated_at?: string | null
          video_aulas?: string[] | null
        }
        Relationships: []
      }
      cursos_narrados: {
        Row: {
          area: string | null
          capa: string | null
          created_at: string
          download: string | null
          id: number
          link: string | null
          materia: string | null
          sequencia: string | null
          sobre: string | null
        }
        Insert: {
          area?: string | null
          capa?: string | null
          created_at?: string
          download?: string | null
          id?: number
          link?: string | null
          materia?: string | null
          sequencia?: string | null
          sobre?: string | null
        }
        Update: {
          area?: string | null
          capa?: string | null
          created_at?: string
          download?: string | null
          id?: number
          link?: string | null
          materia?: string | null
          sequencia?: string | null
          sobre?: string | null
        }
        Relationships: []
      }
      estatisticas_usuario: {
        Row: {
          created_at: string | null
          id: string
          total_cursos_concluidos: number | null
          total_materiais_baixados: number | null
          total_tempo_estudo: unknown | null
          ultima_atividade: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          total_cursos_concluidos?: number | null
          total_materiais_baixados?: number | null
          total_tempo_estudo?: unknown | null
          ultima_atividade?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          total_cursos_concluidos?: number | null
          total_materiais_baixados?: number | null
          total_tempo_estudo?: unknown | null
          ultima_atividade?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      filmes_juridicos: {
        Row: {
          created_at: string | null
          id: string
          onde_assistir: string | null
          sinopse: string | null
          tema: string | null
          titulo: string | null
          updated_at: string | null
          url_trailer: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          onde_assistir?: string | null
          sinopse?: string | null
          tema?: string | null
          titulo?: string | null
          updated_at?: string | null
          url_trailer?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          onde_assistir?: string | null
          sinopse?: string | null
          tema?: string | null
          titulo?: string | null
          updated_at?: string | null
          url_trailer?: string | null
        }
        Relationships: []
      }
      flash_cards: {
        Row: {
          area: string | null
          created_at: string | null
          explicacao: string | null
          id: number
          pergunta: string | null
          resposta: string | null
          tema: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          explicacao?: string | null
          id: number
          pergunta?: string | null
          resposta?: string | null
          tema?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string | null
          explicacao?: string | null
          id?: number
          pergunta?: string | null
          resposta?: string | null
          tema?: string | null
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          area: string | null
          created_at: string | null
          frente: string
          id: string
          tema: string | null
          updated_at: string | null
          usuario_id: string | null
          verso: string
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          frente: string
          id?: string
          tema?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          verso: string
        }
        Update: {
          area?: string | null
          created_at?: string | null
          frente?: string
          id?: string
          tema?: string | null
          updated_at?: string | null
          usuario_id?: string | null
          verso?: string
        }
        Relationships: []
      }
      interacoes_ia: {
        Row: {
          conteudo: string | null
          created_at: string | null
          id: string
          resposta: string | null
          tipo_interacao: string | null
          updated_at: string | null
          usuario_id: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string | null
          id?: string
          resposta?: string | null
          tipo_interacao?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string | null
          id?: string
          resposta?: string | null
          tipo_interacao?: string | null
          updated_at?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_ia_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      jogos: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string | null
          regras: string | null
          tipo: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string | null
          regras?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string | null
          regras?: string | null
          tipo?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jogos_juridicos: {
        Row: {
          created_at: string | null
          dados: Json
          id: string
          materia: string
          nivel_dificuldade: string
          nome: string
          tema: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dados: Json
          id?: string
          materia: string
          nivel_dificuldade: string
          nome: string
          tema: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dados?: Json
          id?: string
          materia?: string
          nivel_dificuldade?: string
          nome?: string
          tema?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jurisflix_conteudos: {
        Row: {
          ano: number
          created_at: string
          id: string
          onde_assistir: string[] | null
          poster_url: string | null
          rating: number | null
          sinopse: string
          temas_juridicos: string[] | null
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ano: number
          created_at?: string
          id?: string
          onde_assistir?: string[] | null
          poster_url?: string | null
          rating?: number | null
          sinopse: string
          temas_juridicos?: string[] | null
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          ano?: number
          created_at?: string
          id?: string
          onde_assistir?: string[] | null
          poster_url?: string | null
          rating?: number | null
          sinopse?: string
          temas_juridicos?: string[] | null
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      jurisprudencias: {
        Row: {
          anotacoes: string | null
          created_at: string | null
          data_julgamento: string | null
          decisao: string | null
          id: string
          resumo: string | null
          tags: string[] | null
          titulo: string | null
          tribunal: string | null
          updated_at: string | null
        }
        Insert: {
          anotacoes?: string | null
          created_at?: string | null
          data_julgamento?: string | null
          decisao?: string | null
          id?: string
          resumo?: string | null
          tags?: string[] | null
          titulo?: string | null
          tribunal?: string | null
          updated_at?: string | null
        }
        Update: {
          anotacoes?: string | null
          created_at?: string | null
          data_julgamento?: string | null
          decisao?: string | null
          id?: string
          resumo?: string | null
          tags?: string[] | null
          titulo?: string | null
          tribunal?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kiwify_payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          product_id: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          product_id?: string | null
          status: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          product_id?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      legislacao: {
        Row: {
          artigo: string | null
          codigo: string
          created_at: string | null
          data_publicacao: string | null
          descricao: string | null
          id: string
          texto_integral: string | null
          updated_at: string | null
          versao: string | null
        }
        Insert: {
          artigo?: string | null
          codigo: string
          created_at?: string | null
          data_publicacao?: string | null
          descricao?: string | null
          id?: string
          texto_integral?: string | null
          updated_at?: string | null
          versao?: string | null
        }
        Update: {
          artigo?: string | null
          codigo?: string
          created_at?: string | null
          data_publicacao?: string | null
          descricao?: string | null
          id?: string
          texto_integral?: string | null
          updated_at?: string | null
          versao?: string | null
        }
        Relationships: []
      }
      livros: {
        Row: {
          area_direito: string | null
          autor: string | null
          created_at: string | null
          id: string
          tags: string[] | null
          titulo: string
          updated_at: string | null
          url_pdf: string | null
        }
        Insert: {
          area_direito?: string | null
          autor?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          titulo: string
          updated_at?: string | null
          url_pdf?: string | null
        }
        Update: {
          area_direito?: string | null
          autor?: string | null
          created_at?: string | null
          id?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string | null
          url_pdf?: string | null
        }
        Relationships: []
      }
      mapas_mentais: {
        Row: {
          area_direito: string
          created_at: string
          criado_por: string | null
          criado_por_ia: boolean | null
          estrutura: Json
          id: string
          publico: boolean | null
          titulo: string
        }
        Insert: {
          area_direito: string
          created_at?: string
          criado_por?: string | null
          criado_por_ia?: boolean | null
          estrutura: Json
          id?: string
          publico?: boolean | null
          titulo: string
        }
        Update: {
          area_direito?: string
          created_at?: string
          criado_por?: string | null
          criado_por_ia?: boolean | null
          estrutura?: Json
          id?: string
          publico?: boolean | null
          titulo?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      noticias_juridicas: {
        Row: {
          conteudo: string | null
          created_at: string | null
          fonte: string | null
          id: string
          publicada_em: string | null
          titulo: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string | null
          fonte?: string | null
          id?: string
          publicada_em?: string | null
          titulo: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string | null
          fonte?: string | null
          id?: string
          publicada_em?: string | null
          titulo?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      oab: {
        Row: {
          conteudo: string | null
          created_at: string | null
          data: string | null
          fonte: string | null
          id: string
          tipo: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          conteudo?: string | null
          created_at?: string | null
          data?: string | null
          fonte?: string | null
          id?: string
          tipo: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          conteudo?: string | null
          created_at?: string | null
          data?: string | null
          fonte?: string | null
          id?: string
          tipo?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      parametros_avancados: {
        Row: {
          categoria: string
          created_at: string | null
          criado_por: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
          updated_at: string | null
          valor: string
        }
        Insert: {
          categoria: string
          created_at?: string | null
          criado_por?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
          updated_at?: string | null
          valor: string
        }
        Update: {
          categoria?: string
          created_at?: string | null
          criado_por?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
          updated_at?: string | null
          valor?: string
        }
        Relationships: []
      }
      peticoes_modelo: {
        Row: {
          conteudo_exemplo: string | null
          created_at: string | null
          criado_por: string | null
          estrutura: string | null
          id: string
          tema: string | null
          updated_at: string | null
        }
        Insert: {
          conteudo_exemplo?: string | null
          created_at?: string | null
          criado_por?: string | null
          estrutura?: string | null
          id?: string
          tema?: string | null
          updated_at?: string | null
        }
        Update: {
          conteudo_exemplo?: string | null
          created_at?: string | null
          criado_por?: string | null
          estrutura?: string | null
          id?: string
          tema?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peticoes_modelo_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_type: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          user_type?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      progresso_cursos: {
        Row: {
          concluido: boolean | null
          created_at: string | null
          curso_id: number
          id: string
          iniciado: boolean | null
          progresso: number | null
          ultima_visualizacao: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          concluido?: boolean | null
          created_at?: string | null
          curso_id: number
          id?: string
          iniciado?: boolean | null
          progresso?: number | null
          ultima_visualizacao?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          concluido?: boolean | null
          created_at?: string | null
          curso_id?: number
          id?: string
          iniciado?: boolean | null
          progresso?: number | null
          ultima_visualizacao?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_cursos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos_narrados"
            referencedColumns: ["id"]
          },
        ]
      }
      progresso_jogos: {
        Row: {
          completado: boolean | null
          created_at: string | null
          dados_progresso: Json | null
          id: string
          jogo_id: string
          pontuacao: number | null
          tentativas: number | null
          ultima_jogada: string | null
          updated_at: string | null
          usuario_id: string
        }
        Insert: {
          completado?: boolean | null
          created_at?: string | null
          dados_progresso?: Json | null
          id?: string
          jogo_id: string
          pontuacao?: number | null
          tentativas?: number | null
          ultima_jogada?: string | null
          updated_at?: string | null
          usuario_id: string
        }
        Update: {
          completado?: boolean | null
          created_at?: string | null
          dados_progresso?: Json | null
          id?: string
          jogo_id?: string
          pontuacao?: number | null
          tentativas?: number | null
          ultima_jogada?: string | null
          updated_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "progresso_jogos_jogo_id_fkey"
            columns: ["jogo_id"]
            isOneToOne: false
            referencedRelation: "jogos_juridicos"
            referencedColumns: ["id"]
          },
        ]
      }
      questoes: {
        Row: {
          alternativas: Json | null
          banca: string | null
          created_at: string | null
          disciplina: string | null
          enunciado: string | null
          gabarito: string | null
          id: string
          nivel: string | null
          tipo_prova: string | null
          updated_at: string | null
        }
        Insert: {
          alternativas?: Json | null
          banca?: string | null
          created_at?: string | null
          disciplina?: string | null
          enunciado?: string | null
          gabarito?: string | null
          id?: string
          nivel?: string | null
          tipo_prova?: string | null
          updated_at?: string | null
        }
        Update: {
          alternativas?: Json | null
          banca?: string | null
          created_at?: string | null
          disciplina?: string | null
          enunciado?: string | null
          gabarito?: string | null
          id?: string
          nivel?: string | null
          tipo_prova?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ranking: {
        Row: {
          created_at: string
          id: string
          pontuacao_biblioteca: number
          pontuacao_dicionario: number
          pontuacao_questoes: number
          pontuacao_resumos: number
          pontuacao_total: number
          pontuacao_vademeco: number
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pontuacao_biblioteca?: number
          pontuacao_dicionario?: number
          pontuacao_questoes?: number
          pontuacao_resumos?: number
          pontuacao_total?: number
          pontuacao_vademeco?: number
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pontuacao_biblioteca?: number
          pontuacao_dicionario?: number
          pontuacao_questoes?: number
          pontuacao_resumos?: number
          pontuacao_total?: number
          pontuacao_vademeco?: number
          usuario_id?: string
        }
        Relationships: []
      }
      resumos: {
        Row: {
          conteudo: string
          created_at: string | null
          criado_por: string | null
          disciplina: string
          id: string
          topico: string
          updated_at: string | null
        }
        Insert: {
          conteudo: string
          created_at?: string | null
          criado_por?: string | null
          disciplina: string
          id?: string
          topico: string
          updated_at?: string | null
        }
        Update: {
          conteudo?: string
          created_at?: string | null
          criado_por?: string | null
          disciplina?: string
          id?: string
          topico?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resumos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      simulados: {
        Row: {
          created_at: string | null
          criado_por: string | null
          data: string | null
          descricao: string | null
          id: string
          nome: string | null
          questoes: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criado_por?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          nome?: string | null
          questoes?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criado_por?: string | null
          data?: string | null
          descricao?: string | null
          id?: string
          nome?: string | null
          questoes?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulados_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          cakto_customer_id: string | null
          created_at: string
          current_period_end: string | null
          email: string
          id: string
          kiwify_customer_id: string | null
          kiwify_subscription_id: string | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cakto_customer_id?: string | null
          created_at?: string
          current_period_end?: string | null
          email: string
          id?: string
          kiwify_customer_id?: string | null
          kiwify_subscription_id?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cakto_customer_id?: string | null
          created_at?: string
          current_period_end?: string | null
          email?: string
          id?: string
          kiwify_customer_id?: string | null
          kiwify_subscription_id?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      termos_juridicos: {
        Row: {
          citacao_legal: string | null
          created_at: string | null
          definicao: string | null
          exemplo: string | null
          id: number
          termo: string
          updated_at: string | null
          url_audio: string | null
        }
        Insert: {
          citacao_legal?: string | null
          created_at?: string | null
          definicao?: string | null
          exemplo?: string | null
          id?: number
          termo: string
          updated_at?: string | null
          url_audio?: string | null
        }
        Update: {
          citacao_legal?: string | null
          created_at?: string | null
          definicao?: string | null
          exemplo?: string | null
          id?: number
          termo?: string
          updated_at?: string | null
          url_audio?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          configuracoes: Json | null
          created_at: string | null
          data_cadastro: string | null
          email: string
          foto_perfil_url: string | null
          id: string
          nivel: number | null
          nome_completo: string
          progresso_estudo: number | null
          senha_hash: string
          tipo_usuario: string
          updated_at: string | null
        }
        Insert: {
          configuracoes?: Json | null
          created_at?: string | null
          data_cadastro?: string | null
          email: string
          foto_perfil_url?: string | null
          id?: string
          nivel?: number | null
          nome_completo: string
          progresso_estudo?: number | null
          senha_hash: string
          tipo_usuario: string
          updated_at?: string | null
        }
        Update: {
          configuracoes?: Json | null
          created_at?: string | null
          data_cadastro?: string | null
          email?: string
          foto_perfil_url?: string | null
          id?: string
          nivel?: number | null
          nome_completo?: string
          progresso_estudo?: number | null
          senha_hash?: string
          tipo_usuario?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      video_aulas: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          titulo: string
          updated_at: string | null
          url_video: string | null
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          titulo: string
          updated_at?: string | null
          url_video?: string | null
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          titulo?: string
          updated_at?: string | null
          url_video?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      video_aulas_categorias: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      video_aulas_playlists: {
        Row: {
          categoria_id: string
          created_at: string
          descricao: string | null
          id: string
          thumbnail: string | null
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria_id: string
          created_at?: string
          descricao?: string | null
          id?: string
          thumbnail?: string | null
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria_id?: string
          created_at?: string
          descricao?: string | null
          id?: string
          thumbnail?: string | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_aulas_playlists_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "video_aulas_categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      video_aulas_videos: {
        Row: {
          created_at: string
          descricao: string | null
          duracao: string | null
          id: string
          ordem: number | null
          playlist_id: string
          thumbnail: string | null
          titulo: string
          updated_at: string
          url_video: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          duracao?: string | null
          id?: string
          ordem?: number | null
          playlist_id: string
          thumbnail?: string | null
          titulo: string
          updated_at?: string
          url_video: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          duracao?: string | null
          id?: string
          ordem?: number | null
          playlist_id?: string
          thumbnail?: string | null
          titulo?: string
          updated_at?: string
          url_video?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_aulas_videos_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "video_aulas_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      video_transcricoes: {
        Row: {
          created_at: string
          duracao: number | null
          id: string
          palavras_chave: string[] | null
          pontos_chave: Json | null
          resumo_ai: string | null
          transcricao: string
          video_id: string
        }
        Insert: {
          created_at?: string
          duracao?: number | null
          id?: string
          palavras_chave?: string[] | null
          pontos_chave?: Json | null
          resumo_ai?: string | null
          transcricao: string
          video_id: string
        }
        Update: {
          created_at?: string
          duracao?: number | null
          id?: string
          palavras_chave?: string[] | null
          pontos_chave?: Json | null
          resumo_ai?: string | null
          transcricao?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          area: string | null
          created_at: string | null
          descricao: string | null
          id: string
          pode_flashcards: boolean | null
          pode_offline: boolean | null
          resumo: string | null
          titulo: string | null
          updated_at: string | null
          url_video: string | null
        }
        Insert: {
          area?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          pode_flashcards?: boolean | null
          pode_offline?: boolean | null
          resumo?: string | null
          titulo?: string | null
          updated_at?: string | null
          url_video?: string | null
        }
        Update: {
          area?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          pode_flashcards?: boolean | null
          pode_offline?: boolean | null
          resumo?: string | null
          titulo?: string | null
          updated_at?: string | null
          url_video?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
