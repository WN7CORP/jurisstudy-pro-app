
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscriptionStatusProps {
  isSubscribed: boolean;
  subscriptionTier?: string | null;
  subscriptionEnd?: string | null;
  onRefresh?: () => void;
}

export function SubscriptionStatus({ 
  isSubscribed, 
  subscriptionTier, 
  subscriptionEnd,
  onRefresh 
}: SubscriptionStatusProps) {
  const navigate = useNavigate();
  
  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      if (!data?.url) throw new Error('URL do portal não encontrada');
      
      window.location.href = data.url;
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error("Erro ao abrir portal de gerenciamento", {
        description: "Tente novamente mais tarde"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status da Assinatura</CardTitle>
          <CardDescription>Você ainda não é um assinante</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={() => navigate("/assinatura")}>
            Ver Planos
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Status da Assinatura</CardTitle>
            <CardDescription>Seu plano atual</CardDescription>
          </div>
          <Badge variant="success">Ativo</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Plano</p>
          <p className="font-medium">{subscriptionTier || 'Premium'}</p>
        </div>
        {subscriptionEnd && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Próxima renovação</p>
            <p className="font-medium">{formatDate(subscriptionEnd)}</p>
          </div>
        )}
        <div className="flex gap-2">
          <Button onClick={handleManageSubscription} variant="outline" className="flex-1">
            Gerenciar Assinatura
          </Button>
          {onRefresh && (
            <Button onClick={onRefresh} variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0v2.43l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
