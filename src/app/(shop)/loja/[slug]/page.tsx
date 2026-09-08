import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/data/categories";
import { ShopClient } from "@/components/shop/ShopClient";
import { ProductPageClient } from "@/components/product/ProductPageClient";
import { findProductBySlug } from "@/backend/models/product.model";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    return { title: category.name, description: category.description };
  }

  // O catálogo já vive na base de dados — vai lá diretamente (sem passar
  // pela API HTTP, já estamos no servidor) para gerar metadata real por
  // produto em vez do título genérico anterior.
  const result = await findProductBySlug(slug);
  if (!result) return { title: "Produto" };

  const { product } = result;
  const description = product.resumo || product.descricao.slice(0, 160);
  return {
    title: product.nome,
    description,
    openGraph: {
      title: product.nome,
      description,
      images: product.imagemPrincipal ? [{ url: product.imagemPrincipal }] : undefined,
    },
  };
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
