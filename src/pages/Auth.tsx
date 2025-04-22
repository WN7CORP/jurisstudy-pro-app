
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from "@/components/ui/carousel";

const Auth: React.FC = () => {
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });

    if (error) {
      toast.error('Erro ao fazer login com Google', {
        description: error.message
      });
    }
  };

  const handleEmailSignUp = async () => {
    if (!fullName || !email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      toast.error('Erro ao criar conta', {
        description: error.message
      });
    } else {
      toast.success('Conta criada com sucesso! Verifique seu e-mail.');
      setFormType('login');
    }
  };

  const handleEmailSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error('Erro ao fazer login', {
        description: error.message
      });
    } else {
      navigate('/');
    }
  };

  const authFeatures = [
    {
      title: "Estude em qualquer lugar",
      description: "Acesso ilimitado ao conteúdo jurídico"
    },
    {
      title: "Simulados personalizados",
      description: "Prepare-se para concursos e OAB"
    },
    {
      title: "Inteligência Artificial",
      description: "Assistente jurídico 24h por dia"
    }
  ];

  return (
    <div 
      className="min-h-screen bg-netflix-black flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url("/bg-law.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="m18 7 4-2v18l-4-2"/>
              <path d="m2 7 4-2v18l-4-2"/>
              <path d="M12 7V5c0-1.1-.9-2-2-2H7"/>
              <path d="M12 7V5c0-1.1.9-2 2-2h3"/>
              <path d="M12 22v-5"/>
              <path d="M9 22V12"/>
              <path d="M15 22V12"/>
              <path d="M12 7v3"/>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white">JurisStudy<span className="text-netflix-red">Pro</span></h1>
          <p className="text-netflix-red mt-2 font-medium">
            O app jurídico que vai te levar da dúvida à aprovação. Domine a lei. Vença o edital.
          </p>
        </div>
        
        {/* Carousel de Funcionalidades (Mobile) */}
        <Carousel className="w-full mb-6 md:hidden">
          <CarouselContent>
            {authFeatures.map((feature, index) => (
              <CarouselItem key={index} className="bg-netflix-darkGray/80 p-4 rounded-lg">
                <h3 className="text-netflix-offWhite font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 text-white" />
          <CarouselNext className="right-2 text-white" />
        </CarouselContent>
        </Carousel>

        {/* Funcionalidades Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          {authFeatures.map((feature, index) => (
            <div key={index} className="bg-netflix-darkGray/80 p-4 rounded-lg">
              <h3 className="text-netflix-offWhite font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-netflix-darkGray/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-netflix-darkGray">
          <h2 className="text-xl font-bold text-white mb-6">
            {formType === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            formType === 'login' ? handleEmailSignIn() : handleEmailSignUp();
          }}>
            {formType === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm text-netflix-offWhite">
                  Nome Completo
                </Label>
                <Input 
                  id="fullName" 
                  placeholder="Digite seu nome completo" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-secondary/50 border-secondary/70"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-netflix-offWhite">
                E-mail
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Digite seu e-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-secondary/70" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-netflix-offWhite">
                Senha
              </Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Digite sua senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-secondary/70 pr-10" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {formType === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-netflix-offWhite">
                    Lembrar de mim
                  </Label>
                </div>
                <Link to="/esqueci-senha" className="text-netflix-offWhite hover:text-netflix-red">
                  Esqueci minha senha
                </Link>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-netflix-red hover:bg-netflix-red/90 text-white"
            >
              {formType === 'login' ? 'Entrar' : 'Criar Conta'}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-netflix-darkGray"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-netflix-darkGray px-2 text-netflix-offWhite">
                  Ou continue com
                </span>
              </div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleSignIn}
              variant="outline" 
              className="w-full bg-transparent border border-netflix-offWhite/30 text-netflix-offWhite hover:bg-secondary/20"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-netflix-offWhite">
            {formType === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button 
                  onClick={() => setFormType('register')} 
                  className="text-netflix-red hover:underline"
                >
                  Criar agora
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button 
                  onClick={() => setFormType('login')} 
                  className="text-netflix-red hover:underline"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
          
          <div className="mt-6 text-center text-xs text-netflix-offWhite/70">
            <p>
              Ao continuar, você concorda com nossos{' '}
              <Link to="/termos" className="text-netflix-red hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link to="/privacidade" className="text-netflix-red hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
