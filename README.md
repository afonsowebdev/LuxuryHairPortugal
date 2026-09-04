# Luxury Hair Portugal

Protótipo de e-commerce de luxo para a **Luxury Hair Portugal** — perucas de cabelo 100% humano, box braids e pestanas. Construído com Next.js (App Router), TypeScript e Tailwind CSS v4.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — paleta de marca definida em `src/app/globals.css` (`--color-plum`, `--color-gold`, `--color-bordeaux`, `--color-cream`)
- Sem backend: **catálogo vazio por definição** — o admin cria os produtos, que ficam em `localStorage` e são partilhados entre o admin e a loja pública via `AdminDataContext` (`src/context/AdminDataContext.tsx`). Carrinho e favoritos também em `localStorage`, sessão de admin em `sessionStorage`.

## Como correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de produção
npm run lint    # eslint
```

## Estrutura

- `src/app/(shop)/` — loja pública: homepage, `/loja`, `/loja/[slug]` (categoria **ou** produto), `/carrinho`, `/favoritos`, `/checkout`, `/encomenda-recebida/[orderId]`, páginas institucionais.
- `src/app/admin/` — painel de administração (`/admin/login`, `/admin/dashboard`, `/admin/produtos`, `/admin/encomendas`, `/admin/clientes`, `/admin/definicoes`).
- `src/components/` — componentes reutilizáveis, organizados por domínio (`ui`, `product`, `layout`, `shop`, `checkout`, `admin`, `home`, `faq`, `contact`).
- `src/context/` — `CartContext` (carrinho), `WishlistContext` (favoritos), `AdminAuthContext` (sessão de admin) e `AdminDataContext` (**fonte única** de produtos/encomendas/clientes, partilhada por toda a app a partir do layout raiz).
- `src/lib/data/` — apenas categorias, definições de loja e testemunhos são estáticos; `products.ts`, `orders.ts` e `customers.ts` exportam arrays **vazios** (o estado real vive em `AdminDataContext`/`localStorage`).

## Catálogo gerido pelo admin

Não há produtos de exemplo. O catálogo começa vazio e é **inteiramente gerido pelo administrador**:

- Criar/editar/apagar produtos em `/admin/produtos` — aparecem de imediato na loja pública (mesma fonte de dados, `AdminDataContext`).
- O badge **"Esgotado"** é sempre derivado do stock real (`getEffectiveBadge` em `src/lib/data/products.ts`) — um produto com stock 0 aparece esgotado na loja mesmo que a etiqueta não tenha sido alterada manualmente, e o botão de compra fica desativado.
- Ao finalizar uma compra, o checkout chama `placeOrder`: regista a encomenda no admin, **baixa o stock** dos produtos vendidos e cria/atualiza o cliente correspondente — por isso "Encomendas" e "Clientes" no admin refletem a atividade real da loja, não dados fictícios.
- Como o catálogo só existe no browser (sem base de dados), as páginas de produto (`/loja/[slug]`) resolvem o produto no cliente: mostram um esqueleto de carregamento breve e, se o produto não existir, a página 404. Isto também significa que **não há metadata de SEO específica por produto** gerada no servidor — uma limitação inerente a não ter backend, a resolver quando houver API real.

## Funcionalidades

- **Catálogo** — filtros (categoria, cor, comprimento, textura, preço), ordenação, pesquisa por nome/descrição, estado "Esgotado" automático a partir do stock.
- **Carrinho** — persistente em `localStorage`, atualização de quantidades, subtotal/portes/total.
- **Favoritos** — persistente em `localStorage` (`WishlistContext`), acessível pelo ícone de coração no cabeçalho e em `/favoritos`.
- **Checkout** — validação de formulário, resumo do pedido, ecrã Multibanco simulado (Entidade/Referência/Valor), e registo real da encomenda no admin.
- **Rastreio de encomenda** — indicador visual (`OrderTracker`) com os estados A aguardar pagamento → Pago → Enviado → Concluído, visível em `/encomenda-recebida/[orderId]` e no admin.
- **Admin** — CRUD de produtos (incluindo imagens), gestão de encomendas/clientes/definições, dashboard com métricas, barra de admin e atalhos de edição visíveis na loja pública quando a sessão está ativa.
- **Estados de UI** — `loading.tsx` (loja e admin), `error.tsx` e `not-found.tsx` globais, e ecrãs vazios em carrinho/favoritos/pesquisa/catálogo vazio.

## Imagens

- `public/assets/branding/` — banners/stories com a identidade e copy real da marca.
- `public/assets/produtos/{perucas,box-braids,pestanas}/` — fotografias reais de produto.
- `public/assets/modelos/` — fotografias lifestyle/retrato usadas em "Sobre Nós" e nas categorias.

Produtos e categorias têm um campo opcional `photos`/`photo` (caminho em `/public`). Quando definido,
`<ProductImage src="...">` mostra a fotografia real; caso contrário, gera automaticamente um
placeholder SVG determinístico na paleta da marca a partir do slug (`src/components/product/ProductImage.tsx`).
Novas fotos podem ser adicionadas por produto no admin (`/admin/produtos/[id]`, secção "Imagens").

### Acesso ao admin (protótipo)

```
URL:   /admin/login
Email: admin@luxuryhairportugal.pt
Pass:  luxury2026
```

Credenciais fixas no código apenas para demonstração — ver nota abaixo.

## O que falta para produção (notas para o backend)

Este é um protótipo **apenas de front-end**. Antes de lançar em produção:

1. **Pagamentos Multibanco** — `src/lib/multibanco.ts` gera Entidade/Referência de forma simulada (hash determinístico). Substituir por integração real com um fornecedor português (IfThenPay, Easypay ou SIBS/Multibanco direto), gerando a referência no servidor e nunca confiando num valor gerado no cliente.
2. **Autenticação do admin** — `src/context/AdminAuthContext.tsx` usa credenciais fixas e uma flag em `sessionStorage`. Substituir por autenticação real (NextAuth, sessão de servidor, etc.) com hashing de password.
3. **Persistência de dados** — produtos, encomendas e clientes vivem em `localStorage` (`AdminDataContext`), o carrinho e os favoritos em `localStorage` (`CartContext`/`WishlistContext`). Substituir por chamadas a uma API real ligada a uma base de dados — isto também resolve a falta de SEO por produto (ver secção "Catálogo gerido pelo admin") e a ausência de sincronização entre dispositivos/browsers (cada browser tem o seu próprio catálogo).
4. **Encomendas do checkout** — ao finalizar compra, a encomenda é guardada em `sessionStorage` (`src/lib/orderStore.ts`, só para a página de confirmação) e em `localStorage` via `AdminDataContext.placeOrder` (para o admin). Um backend real deve persistir a encomenda no servidor e enviar email/SMS de confirmação.
5. **Formulários de newsletter/contacto** — atualmente só mostram feedback visual, sem submissão real.

## Paleta de marca

| Cor | Hex |
|---|---|
| Roxo ameixa (fundo) | `#4A1E3C` |
| Roxo/vinho claro | `#6E2A54` |
| Dourado / âmbar | `#E8A64C` |
| Bordô | `#6E1B2A` |
| Creme | `#FAF6F0` |
