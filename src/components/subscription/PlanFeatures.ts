
export type PlanFeature = {
  name: string;
  included: boolean;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  features: PlanFeature[];
  kiwifyUrl: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "estudante_mensal",
    name: "Estudante",
    price: 11.99,
    kiwifyUrl: "https://kiwify.app/k9BdT6f",
    features: [
      { name: "Acesso a flashcards", included: true },
      { name: "Acesso a questões", included: true },
      { name: "Acesso a resumos", included: true },
      { name: "Acesso a biblioteca", included: false },
      { name: "Acesso a vídeo aulas", included: false },
      { name: "Acesso ao assistente IA", included: false },
    ],
  },
  {
    id: "platina_mensal",
    name: "Platina",
    price: 19.99,
    kiwifyUrl: "https://kiwify.app/ATAIbuB",
    features: [
      { name: "Acesso a flashcards", included: true },
      { name: "Acesso a questões", included: true },
      { name: "Acesso a resumos", included: true },
      { name: "Acesso a biblioteca", included: false },
      { name: "Acesso a vídeo aulas", included: true },
      { name: "Acesso ao assistente IA", included: true },
    ],
  },
  {
    id: "magistral_mensal",
    name: "Magistral",
    price: 29.99,
    kiwifyUrl: "https://kiwify.app/Ne3vy2c",
    features: [
      { name: "Acesso a flashcards", included: true },
      { name: "Acesso a questões", included: true },
      { name: "Acesso a resumos", included: true },
      { name: "Acesso a biblioteca", included: true },
      { name: "Acesso a vídeo aulas", included: true },
      { name: "Acesso ao assistente IA", included: true },
    ],
  },
];
