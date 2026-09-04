import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { WishlistClient } from "@/components/product/WishlistClient";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Os produtos que guardou para mais tarde na Luxury Hair Portugal.",
};

export default function FavoritosPage() {
  return (
    <>
      <PageHeader eyebrow="A Sua Seleção" title="Favoritos" />
      <Container className="py-12">
        <WishlistClient />
      </Container>
    </>
  );
}
