# Luxury Hair Portugal

E-commerce de luxo para a **Luxury Hair Portugal** — perucas de cabelo 100% humano, box braids e pestanas. Construído com Next.js (App Router), TypeScript, Tailwind CSS v4 e um backend real em Prisma + PostgreSQL.

> **Estado atual**: a loja está **inteiramente ligada à base de dados real** — catálogo, carrinho, favoritos, checkout, encomendas, clientes, categorias, cupões, mensagens de contacto, newsletter e definições da loja vivem todos em PostgreSQL e passam pela API em `src/app/api/`. Não há nenhum dado de loja em `localStorage`; a única exceção é o token JWT da sessão (cliente e admin), guardado em `localStorage` no browser, como é normal numa SPA. Ver a secção ["Backend"](#backend-prisma--postgresql) para a arquitetura completa.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — paleta de marca definida em `src/app/globals.css` (`--color-plum`, `--color-gold`, `--color-bordeaux`, `--color-cream`)
- **Prisma + PostgreSQL (Neon)** — schema, API e frontend todos ligados (`/prisma`, `src/backend/`, `src/app/api/`, `src/lib/mappers/`).
- Autenticação por JWT — sessão de cliente e de admin (`Authorization: Bearer <token>`), guardada em `localStorage` no browser.

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

- `src/app/(shop)/` — loja pública: homepage, `/loja`, `/loja/[slug]` (categoria **ou** produto), `/carrinho`, `/favoritos`, `/checkout`, `/conta` (área de cliente), `/encomenda-recebida/[orderId]`, páginas institucionais.
- `src/app/admin/` — painel de administração (`/admin/login`, `/admin/dashboard`, `/admin/produtos`, `/admin/encomendas`, `/admin/clientes`, `/admin/categorias`, `/admin/cupoes`, `/admin/mensagens`, `/admin/definicoes`).
- `src/app/api/` — a API (App Router route handlers) — ver ["Backend"](#backend-prisma--postgresql).
- `src/backend/` — lógica de servidor: acesso à base de dados, auth, validação, modelos por entidade (ver abaixo).
- `src/components/` — componentes reutilizáveis, organizados por domínio (`ui`, `product`, `layout`, `shop`, `checkout`, `admin`, `home`, `faq`, `contact`).
- `src/context/` — `CustomerAuthContext` (sessão de cliente), `AdminAuthContext` (sessão de admin), `CartContext`, `WishlistContext` e `AdminDataContext` (produtos, encomendas, clientes, categorias, cupões, mensagens, newsletter e definições) — todos ligados à API real.
- `src/lib/mappers/` — traduz entre o formato da API (nomes de campo em português, schema Prisma) e os tipos usados pelos componentes (`src/types/index.ts`), para que nenhum componente de apresentação precisasse de mudar durante a migração.
- `src/lib/data/` — só o que continua estático: categorias (usadas como estado inicial antes do primeiro fetch), definições por omissão e testemunhos.

## Catálogo

O catálogo vive na base de dados e é gerido inteiramente pelo administrador em `/admin/produtos`:

- Criar/editar/apagar produtos — aparecem de imediato na loja pública (mesma API).
- O badge **"Esgotado"** é sempre derivado do stock real (`getEffectiveBadge` em `src/lib/data/products.ts`) — um produto com stock 0 aparece esgotado na loja mesmo que a etiqueta não tenha sido alterada manualmente, e o botão de compra fica desativado.
- Ao finalizar uma compra, o checkout chama `/api/orders/checkout`: cria a encomenda, **baixa o stock** dos produtos vendidos e liga (ou cria) o cliente — tudo numa transação atómica no servidor.
- As páginas de produto (`/loja/[slug]`) geram metadata de SEO real no servidor (`generateMetadata` lê o produto diretamente da base de dados) — título, descrição e imagem Open Graph por produto.

## Funcionalidades

- **Catálogo** — filtros (categoria, cor, comprimento, textura, preço), ordenação, pesquisa por nome/descrição, estado "Esgotado" automático a partir do stock, reviews reais por produto.
- **Carrinho** — por sessão anónima (cookie) ou por conta, com variantes (cor/comprimento/densidade), junta-se automaticamente ao carrinho da conta no login.
- **Favoritos** — por conta (exige sessão iniciada), acessível pelo ícone de coração no cabeçalho e em `/favoritos`.
- **Área de cliente** (`/conta`) — registo/login com JWT, histórico real de encomendas.
- **Checkout** — exige sessão iniciada, validação de formulário, cupão de desconto validado e aplicado no servidor, resumo do pedido, ecrã Multibanco (Entidade/Referência/Valor gerados no servidor) ou simulação de MB WAY, registo real da encomenda.
- **Rastreio de encomenda** — indicador visual (`OrderTracker`) com os estados A aguardar pagamento → Pago → Enviado → Concluído, visível em `/encomenda-recebida/[orderId]`, na área de cliente e no admin.
- **Admin** — CRUD de produtos (incluindo imagens, variantes e reviews), gestão de encomendas/clientes/categorias/cupões/mensagens/newsletter/definições, dashboard com métricas, barra de admin e atalhos de edição visíveis na loja pública quando a sessão está ativa. Login por JWT contra a conta admin real.
- **Estados de UI** — `loading.tsx` (loja e admin), `error.tsx` e `not-found.tsx` globais, e ecrãs vazios em carrinho/favoritos/pesquisa/catálogo vazio.

## Imagens

- `public/assets/branding/` — banners/stories com a identidade e copy real da marca.
- `public/assets/produtos/{perucas,box-braids,pestanas}/` — fotografias reais de produto.
- `public/assets/modelos/` — fotografias lifestyle/retrato usadas em "Sobre Nós" e nas categorias.

Produtos e categorias têm um campo opcional `photos`/`photo` (caminho em `/public`). Quando definido,
`<ProductImage src="...">` mostra a fotografia real; caso contrário, gera automaticamente um
placeholder SVG determinístico na paleta da marca a partir do slug (`src/components/product/ProductImage.tsx`).
Novas fotos podem ser adicionadas por produto no admin (`/admin/produtos/[id]`, secção "Imagens").

### Acesso ao admin

```
URL:   /admin/login
Email: admin@luxuryhair.pt
Pass:  Admin123!
```

Conta real, criada pelo seed (ver ["Configurar a base de dados"](#configurar-a-base-de-dados)) — login por JWT contra `/api/auth/login`, com verificação de `role === "ADMIN"`.

## O que falta para produção

O backend é real (Prisma + PostgreSQL) e a loja está ligada a ele de ponta a ponta, mas ainda há peças propositadamente simuladas ou simplificadas:

1. **Pagamentos Multibanco/MB WAY** — `src/backend/lib/multibanco.ts` gera Entidade/Referência de forma simulada (hash determinístico), e a confirmação de pagamento (`/api/payment/webhook`) não tem verificação de assinatura — qualquer pedido a essa rota marca a encomenda como paga. Substituir por integração real com um fornecedor português (IfThenPay, Easypay ou SIBS/Multibanco direto), validando a assinatura do webhook antes de confiar nele.
2. **Emails/SMS de confirmação** — a encomenda é criada e a referência gerada, mas não há envio de email/SMS ao cliente. Adicionar um fornecedor (Resend, SendGrid, etc.) chamado a seguir ao checkout e à confirmação de pagamento.
3. **JWT_SECRET e segredos** — gerados localmente para desenvolvimento (`.env`, nunca commitado). Gerar segredos novos e fortes para produção, nunca reutilizar os de desenvolvimento.
4. **Estrutura `pages/api/`** — o pedido original especificava endpoints em Pages Router; optou-se por App Router route handlers (`src/app/api/**/route.ts`) para não obrigar a reescrever as páginas existentes. Funcionalmente equivalentes, mas é uma divergência consciente do pedido original a ter em conta.

## Backend (Prisma + PostgreSQL)

Estrutura do backend, em `src/backend/` e `src/app/api/` (App Router — os endpoints ficam em `route.ts`, não em `pages/api/`, para não obrigar a reescrever as páginas existentes):

```
prisma/
  schema.prisma        User, Category, Product, Review, Cart, Wishlist, Order, OrderItem,
                        Payment, OrderTracking, ContactMessage, NewsletterSubscriber, Coupon,
                        StoreSettings
  seed.ts               4 categorias, 12 produtos (com variantes e reviews), 1 admin, 1 cliente de teste

src/backend/
  lib/db.ts               singleton do Prisma Client
  lib/auth.ts              gerar/verificar JWT, extrair do header Authorization
  lib/multibanco.ts        gerador de referência (Entidade + 9 dígitos, check digit Módulo 97)
  lib/validators.ts        validação de email/password/checkout, sanitização de strings
  lib/response.ts          formato de resposta { success, data, message }
  lib/cartSession.ts       resolve dono do carrinho (utilizador autenticado ou sessão anónima por cookie)
  middleware/withAuth.ts   protege um route handler, injeta o utilizador do JWT
  middleware/withAdmin.ts  idem, mas exige role ADMIN
  models/                  funções Prisma por entidade (user, product, cart, wishlist, order, payment, coupon, message, settings)

src/app/api/
  auth/{register,login,me}
  products/{index,featured,[slug]}
  categories                     GET público, PUT 🔒👑
  cart/{index,add,[id],merge}
  wishlist/{index,[id]}
  orders/{index,checkout,[id]}
  payment/{generate,status,webhook}
  coupons/validate                validação server-side de um código de cupão
  contact                         POST público — formulário de contacto
  newsletter                      POST público — subscrição
  settings                        GET público — portes, marca, pagamentos
  admin/{products,orders,users,stats,coupons,messages,newsletter,settings}

src/lib/mappers/
  product.ts, order.ts, customer.ts, category.ts, coupon.ts, message.ts
  — traduzem entre o formato da API (schema Prisma, português) e os tipos do frontend
```

### Configurar a base de dados

1. Cria uma base de dados gratuita em [neon.tech](https://neon.tech) e copia o connection string.
2. Copia `.env.example` para `.env` e substitui `DATABASE_URL` (e opcionalmente `JWT_SECRET`, já vem preenchido com um valor aleatório de desenvolvimento).
3. Aplica as migrações já existentes e corre o seed:

```bash
npx prisma migrate dev
npm run prisma:seed
```

4. `npx prisma studio` abre uma interface visual para inspecionar os dados.

Contas criadas pelo seed:

| Papel | Email | Password |
|---|---|---|
| Admin | `admin@luxuryhair.pt` | `Admin123!` |
| Cliente | `cliente@teste.pt` | `Cliente123!` |

### Endpoints disponíveis

Todas as respostas seguem `{ success, data, message }`. Rotas marcadas 🔒 exigem `Authorization: Bearer <token>`; 🔒👑 exigem além disso que o utilizador seja `ADMIN`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Criar conta, devolve token JWT |
| POST | `/api/auth/login` | Iniciar sessão, devolve token JWT |
| GET 🔒 | `/api/auth/me` | Dados do utilizador autenticado |
| GET | `/api/products?categoria=&min=&max=&q=&cores=&comprimentos=&texturas=&densidades=&page=&limit=` | Listar produtos com filtros, rating e nº de reviews |
| GET | `/api/products/featured` | Produtos em destaque (máx. 8) |
| GET | `/api/products/:slug` | Produto por slug, reviews e relacionados |
| GET | `/api/categories` | Listar categorias |
| PUT 🔒👑 | `/api/categories` | Atualizar nome/descrição/imagem de uma categoria |
| GET | `/api/cart` | Carrinho (por utilizador ou cookie de sessão) |
| DELETE | `/api/cart` | Esvaziar carrinho |
| POST | `/api/cart/add` | Adicionar item `{ productId, quantidade, variante }` |
| PUT/DELETE | `/api/cart/:id` | Atualizar/remover item do carrinho |
| POST 🔒 | `/api/cart/merge` | Juntar o carrinho anónimo ao da conta, após login |
| GET/POST 🔒 | `/api/wishlist` | Listar / adicionar aos favoritos |
| DELETE 🔒 | `/api/wishlist/:id` | Remover dos favoritos |
| GET 🔒 | `/api/orders` | Histórico de encomendas do utilizador |
| POST | `/api/orders/checkout` | Criar encomenda a partir do carrinho (valida cupão no servidor, baixa stock, gera pagamento) |
| GET | `/api/orders/:id` | Detalhe da encomenda (verifica dono, se associada a conta) |
| POST | `/api/payment/generate` | (Re)gerar referência Multibanco de uma encomenda |
| GET | `/api/payment/status?orderId=` | Estado do pagamento |
| POST | `/api/payment/webhook` | Simula confirmação de pagamento (marca Pago) |
| POST | `/api/coupons/validate` | Validar um código de cupão contra o subtotal, sem o aplicar |
| POST | `/api/contact` | Submeter o formulário de contacto |
| POST | `/api/newsletter` | Subscrever a newsletter |
| GET | `/api/settings` | Definições da loja (portes, marca, pagamentos) |
| GET/POST/PUT/DELETE 🔒👑 | `/api/admin/products` | CRUD de produtos |
| GET/PUT 🔒👑 | `/api/admin/orders` | Listar encomendas, atualizar estado |
| GET 🔒👑 | `/api/admin/users` | Listar clientes (com nº de encomendas e total gasto) |
| GET 🔒👑 | `/api/admin/stats` | Vendas, encomendas por estado, top produtos, últimos 7 dias |
| GET/POST/PUT/DELETE 🔒👑 | `/api/admin/coupons` | CRUD de cupões |
| GET/PUT/DELETE 🔒👑 | `/api/admin/messages` | Listar/marcar como lida/eliminar mensagens de contacto |
| GET 🔒👑 | `/api/admin/newsletter` | Listar subscritores |
| PUT 🔒👑 | `/api/admin/settings` | Atualizar definições da loja |

### Deploy no Vercel

1. Importa o repositório em [vercel.com/new](https://vercel.com/new).
2. Define as variáveis de ambiente do `.env.example` nas definições do projeto (usa a mesma `DATABASE_URL` do Neon; gera um `JWT_SECRET` novo só para produção).
3. O `package.json` já tem `"postinstall": "prisma generate"`, por isso o Vercel gera o Prisma Client automaticamente a cada build.
4. Corre `npx prisma migrate deploy` manualmente (ou via um passo de deploy) para aplicar as migrações à base de dados de produção — `migrate dev` é só para desenvolvimento local.

## Paleta de marca

| Cor | Hex |
|---|---|
| Roxo ameixa (fundo) | `#4A1E3C` |
| Roxo/vinho claro | `#6E2A54` |
| Dourado / âmbar | `#E8A64C` |
| Bordô | `#6E1B2A` |
| Creme | `#FAF6F0` |
