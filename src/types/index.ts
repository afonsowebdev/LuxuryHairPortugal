export type CategorySlug =
  | "perucas-lisas"
  | "perucas-cacheadas"
  | "box-braids"
  | "pestanas";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export type ProductBadge = "Novo" | "Esgotado" | "Mais Vendido" | null;

export interface ProductVariantOptions {
  comprimentos?: string[];
  cores?: string[];
  densidades?: string[];
  texturas?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAtPrice?: number;
  images: string[];
  badge: ProductBadge;
  shortDescription: string;
  description: string;
  care: string;
  shipping: string;
  variants: ProductVariantOptions;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  stock: number;
  featured?: boolean;
  bestseller?: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

export type OrderStatus =
  | "A aguardar pagamento"
  | "Pago"
  | "Enviado"
  | "Concluído"
  | "Cancelado";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  reference: string;
  entity: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "Multibanco" | "MB WAY" | "Cartão";
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  ordersCount: number;
  totalSpent: number;
  since: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  variant: string;
  quantity: number;
  stock: number;
}
