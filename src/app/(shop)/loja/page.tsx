import type { Metadata } from "next";
import { products, allColors, allLengths, allTextures } from "@/lib/data/products";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Loja",
  description: "Explore a coleção completa de perucas, box braids e pestanas Luxury Hair Portugal.",
};

export default function ShopPage() {
  return (
    <ShopClient
      products={products}
      colors={allColors}
      lengths={allLengths}
      textures={allTextures}
      title="A Nossa Loja"
      description="Perucas, box braids e pestanas de luxo — filtre por categoria, cor, comprimento e preço para encontrar a peça perfeita."
    />
  );
}
