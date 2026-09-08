import type { ContactMessage, NewsletterSubscriber } from "@/types";

export interface ApiContactMessage {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  lida: boolean;
  createdAt: string;
}

export interface ApiNewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export function mapApiMessage(api: ApiContactMessage): ContactMessage {
  return {
    id: api.id,
    name: api.nome,
    email: api.email,
    subject: api.assunto,
    message: api.mensagem,
    read: api.lida,
    createdAt: api.createdAt,
  };
}

export function mapApiSubscriber(api: ApiNewsletterSubscriber): NewsletterSubscriber {
  return { id: api.id, email: api.email, createdAt: api.createdAt };
}
