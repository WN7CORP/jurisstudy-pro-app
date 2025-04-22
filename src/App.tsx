
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Biblioteca from "./pages/Biblioteca";
import VadeMecum from "./pages/VadeMecum";
import NotFound from "./pages/NotFound";
import Resumos from "./pages/Resumos";
import Flashcards from "./pages/Flashcards";
import Questoes from "./pages/Questoes";
import Simulados from "./pages/Simulados";
import Ranking from "./pages/Ranking";
import Cursos from "./pages/Cursos";
import MapasMentais from "./pages/MapasMentais";
import Dicionario from "./pages/Dicionario";
import VideoAulas from "./pages/VideoAulas";
import Jurisflix from "./pages/Jurisflix";
import Jogos from "./pages/Jogos";
import Noticias from "./pages/Noticias";
import Bloger from "./pages/Bloger";
import Peticionario from "./pages/Peticionario";
import Desktop from "./pages/Desktop";
import Assistente from "./pages/Assistente";
import Explorar from "./pages/Explorar";
import EstudoFlashcards from "./pages/EstudoFlashcards";
import Assinatura from "./pages/Assinatura";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/biblioteca" element={<Biblioteca />} />
            <Route path="/vade-mecum" element={<VadeMecum />} />
            <Route path="/resumos" element={<Resumos />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/estudo-flashcards" element={<EstudoFlashcards />} />
            <Route path="/questoes" element={<Questoes />} />
            <Route path="/simulados" element={<Simulados />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/mapas-mentais" element={<MapasMentais />} />
            <Route path="/dicionario" element={<Dicionario />} />
            <Route path="/video-aulas" element={<VideoAulas />} />
            <Route path="/jurisflix" element={<Jurisflix />} />
            <Route path="/jogos" element={<Jogos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/bloger" element={<Bloger />} />
            <Route path="/peticionario" element={<Peticionario />} />
            <Route path="/desktop" element={<Desktop />} />
            <Route path="/assistente" element={<Assistente />} />
            <Route path="/explorar" element={<Explorar />} />
            <Route path="/assinatura" element={<Assinatura />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
