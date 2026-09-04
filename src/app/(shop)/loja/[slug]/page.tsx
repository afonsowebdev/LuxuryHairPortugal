import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ShopClient } from "@/components/shop/ShopClient";
import { ProductPageClient } from "@/components/product/ProductPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    return { title: category.name, description: category.description };
  }
  // O catálogo vive em localStorage (gerido pelo admin), por isso não está
  // disponível no servidor para gerar metadata específica do produto — o
  // título da página é ajustado no cliente assim que o produto carrega.
  return { title: "Produto" };
}

export default async function ShopSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (category) {
    return (
      <ShopClient
        lockedCategory={category.slug}
        title={category.name}
        description={category.description}
      />
    );
  }

  return <ProductPageClient slug={slug} />;
}
