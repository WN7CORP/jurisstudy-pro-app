
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const WelcomeBanner = () => {
  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      return data;
    }
  });

  return (
    <Card className="col-span-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Bem-vindo ao JurisStudyPro</h2>
            <p className="text-muted-foreground mt-1">
              {subscriptionData?.subscribed 
                ? `Seu plano atual: ${subscriptionData.subscription_tier}`
                : 'Comece sua jornada de estudos jurídicos'}
            </p>
          </div>

          {!subscriptionData?.subscribed && (
            <Button asChild>
              <Link to="/assinatura">
                Assinar Agora
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
