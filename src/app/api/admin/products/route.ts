import type { NextRequest } from "next/server";
import { ok, fail } from "@/backend/lib/response";
import { withAdmin } from "@/backend/middleware/withAdmin";
import { sanitizeString } from "@/backend/lib/validators";
import {
  listAllProductsForAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/backend/models/product.model";

export const GET = withAdmin(async () => {
  const products = await listAllProductsForAdmin();
  return ok(products);
});

export const POST = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const required = ["nome", "slug", "descricao", "preco", "categoriaId"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === "") return fail(`${field} é obrigatório.`);
    }

    const product = await createProduct({
      nome: sanitizeString(String(body.nome)),
      slug: String(body.slug).trim(),
      resumo: body.resumo ? sanitizeString(String(body.resumo)) : "",
      descricao: sanitizeString(String(body.descricao)),
      cuidados: body.cuidados ? sanitizeString(String(body.cuidados)) : "",
      ...(body.envio ? { envio: sanitizeString(String(body.envio)) } : {}),
      preco: Number(body.preco),
      precoPromocional: body.precoPromocional ? Number(body.precoPromocional) : undefined,
      stock: body.stock !== undefined ? Number(body.stock) : 0,
      imagemPrincipal: body.imagemPrincipal ? String(body.imagemPrincipal) : null,
      imagens: Array.isArray(body.imagens) ? body.imagens.map(String) : [],
      cores: Array.isArray(body.cores) ? body.cores.map(String) : [],
      comprimentos: Array.isArray(body.comprimentos) ? body.comprimentos.map(String) : [],
      densidades: Array.isArray(body.densidades) ? body.densidades.map(String) : [],
      texturas: Array.isArray(body.texturas) ? body.texturas.map(String) : [],
      badge: body.badge ? String(body.badge) : null,
      bestseller: Boolean(body.bestseller),
      destaque: Boolean(body.destaque),
      ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
      categoria: { connect: { id: String(body.categoriaId) } },
    });

    return ok(product, "Produto criado.", 201);
  } catch (error) {
    console.error("POST /api/admin/products", error);
    return fail("Não foi possível criar o produto.", 400);
  }
});

export const PUT = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");

    const { id: _omit, categoriaId, ...rest } = body;
    void _omit;

    const product = await updateProduct(id, {
      ...rest,
      ...(rest.nome ? { nome: sanitizeString(String(rest.nome)) } : {}),
      ...(rest.descricao ? { descricao: sanitizeString(String(rest.descricao)) } : {}),
      ...(categoriaId ? { categoria: { connect: { id: String(categoriaId) } } } : {}),
    });

    return ok(product, "Produto atualizado.");
  } catch (error) {
    console.error("PUT /api/admin/products", error);
    return fail("Não foi possível atualizar o produto.", 400);
  }
});

export const DELETE = withAdmin(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return fail("id é obrigatório.");

    await deleteProduct(id);
    return ok(null, "Produto eliminado.");
  } catch (error) {
    console.error("DELETE /api/admin/products", error);
    return fail("Não foi possível eliminar o produto.", 400);
  }
});
