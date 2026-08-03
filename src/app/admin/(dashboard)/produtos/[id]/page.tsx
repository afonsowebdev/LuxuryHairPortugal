"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAdminData } from "@/context/AdminDataContext";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { products, updateProduct } = useAdminData();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  function handleSubmit(updated: Product) {
    updateProduct(id, updated);
    router.push("/admin/produtos");
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="font-serif text-xl text-plum-dark">Produto não encontrado</p>
        <Button href="/admin/produtos" variant="primary" size="md">
          Voltar aos Produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Editar Produto
        </h1>
        <p className="text-sm text-plum-dark/50">{product.name}</p>
      </div>
      <ProductForm initial={product} onSubmit={handleSubmit} />
    </div>
  );
}
