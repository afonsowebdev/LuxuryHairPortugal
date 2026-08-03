export const storeSettings = {
  brand: {
    name: "Luxury Hair Portugal",
    instagram: "@luxury_hairpt",
    instagramUrl: "https://instagram.com/luxury_hairpt",
    phones: ["+351 934 762 839", "+258 857 625 874"],
    email: "geral@luxuryhairportugal.pt",
    tagline: "Saúde, amor e cabelos arrumados todos os dias.",
  },
  shipping: {
    portugalContinental: { label: "Portugal Continental", price: 5, etaDays: "1-2" },
    portugalIlhas: { label: "Açores & Madeira", price: 9, etaDays: "3-5" },
    mocambique: { label: "Moçambique", price: 15, etaDays: "5-10" },
    freeShippingThreshold: 200,
  },
  payments: {
    multibancoEntity: "11249",
    methods: ["Multibanco", "MB WAY", "Cartão de Crédito"],
    referenceValidityHours: 48,
  },
};
