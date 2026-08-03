"use client";

import { useRouter } from "next/navigation";
import { useAdminData } from "@/context/AdminDataContext";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Product } from "@/types";

export default function NewProductPage() {
  const { addProduct } = useAdminData();
  const router = useRouter();

  function handleSubmit(product: Product) {
    addProduct(product);
    router.push("/admin/produtos");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-plum-dark sm:text-3xl">
          Novo Produto
        </h1>
        <p className="text-sm text-plum-dark/50">Adicione uma nova peça ao catálogo.</p>
      </div>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
