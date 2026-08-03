import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/data/categories";
import {
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
} from "@/lib/data/products";
import { ShopClient } from "@/components/shop/ShopClient";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (category) {
    return { title: category.name, description: category.description };
  }
  const product = getProductBySlug(slug);
  if (product) {
    return { title: product.name, description: product.shortDescription };
  }
  return { title: "Loja" };
}

export default async function ShopSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const category = getCategoryBySlug(slug);
  if (category) {
    const categoryProducts = getProductsByCategory(category.slug);
    const colors = Array.from(new Set(categoryProducts.flatMap((p) => p.variants.cores ?? [])));
    const lengths = Array.from(
      new Set(categoryProducts.flatMap((p) => p.variants.comprimentos ?? []))
    );
    const textures = Array.from(
      new Set(categoryProducts.flatMap((p) => p.variants.texturas ?? []))
    );

    return (
      <ShopClient
        products={categoryProducts}
        lockedCategory={category.slug}
        colors={colors}
        lengths={lengths}
        textures={textures}
        title={category.name}
        description={category.description}
      />
    );
  }

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          slug={product.slug}
          category={product.category}
          images={product.images}
          badge={product.badge}
        />
        <ProductDetailClient product={product} />
      </div>
      <RelatedProducts products={related} />
    </Container>
  );
}
