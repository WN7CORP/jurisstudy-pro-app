
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import type { SubscriptionPlan } from './PlanFeatures';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
}

export function SubscriptionCard({ plan, isPopular }: SubscriptionCardProps) {
  const handleSubscribe = () => {
    window.location.href = plan.kiwifyUrl;
  };

  return (
    <Card className={`w-full h-full ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
          Mais Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-3xl font-bold text-center">
          R$ {plan.price.toFixed(2)}<span className="text-sm font-normal">/mês</span>
        </p>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <X className="h-4 w-4 text-red-500 shrink-0" />
              )}
              <span>{feature.name}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubscribe} 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
        >
          Assinar agora
        </Button>
      </CardFooter>
    </Card>
  );
}
