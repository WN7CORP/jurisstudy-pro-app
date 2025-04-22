
export type PlanFeature = {
  name: string;
  included: boolean;
};

export type SubscriptionPlan = {
  id: string;
  priceId: string; // Adicionando campo para o ID do preço
  name: string;
  price: number;
  features: PlanFeature[];
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "estudante",
    priceId: "prod_SAxMvIaGX6rdjv",
    name: "Estudante",
    price: 11.99,
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
    id: "platina",
    priceId: "prod_SAxNWVgnpM84jW",
    name: "Platina",
    price: 19.99,
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
    id: "magistral",
    priceId: "prod_SAxO5nw5rdgEaq",
    name: "Magistral",
    price: 29.99,
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
