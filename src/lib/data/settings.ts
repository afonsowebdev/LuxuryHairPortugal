export const defaultStoreSettings = {
  brand: {
    name: "Luxury Hair Portugal",
    instagram: "@luxury_hairpt",
    instagramUrl: "https://instagram.com/luxury_hairpt",
    phones: ["+351 934 762 839", "+258 857 625 874"],
    email: "geral@luxuryhairportugal.pt",
    tagline: "Saúde, amor e cabelos arrumados todos os dias.",
  },
  shipping: {
    portugalContinental: { label: "Portugal Continental", price: 7.99, etaDays: "1" },
    portugalIlhas: { label: "Açores & Madeira", price: 7.99, etaDays: "3" },
    mocambique: { label: "Moçambique", price: 15, etaDays: "5-10" },
    freeShippingThreshold: 250,
    carrier: "CTT / CTT Expresso",
    returnsPhone: "934762839",
  },
  payments: {
    multibancoEntity: "11249",
    methods: ["Multibanco", "MB WAY", "Transferência Bancária", "Cartão de Crédito"],
    referenceValidityHours: 48,
  },
};

export type StoreSettings = typeof defaultStoreSettings;
