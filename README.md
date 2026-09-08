# Luxury Hair Portugal

E-commerce de luxo para a **Luxury Hair Portugal** — perucas de cabelo 100% humano, box braids e pestanas. Construído com Next.js (App Router), TypeScript e Tailwind CSS v4.

> **Estado atual**: o site (loja, carrinho, checkout, admin) funciona hoje inteiramente em `localStorage`, sem backend — ver a secção ["O que falta para produção"](#o-que-falta-para-produção-notas-para-o-backend). Já existe, em paralelo, uma **API real com Prisma + PostgreSQL** pronta em `/prisma` e `src/app/api/` (ver ["Backend"](#backend-prisma--postgresql)), mas o frontend ainda não foi ligado a ela — essa ligação é o próximo passo.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — paleta de marca definida em `src/app/globals.css` (`--color-plum`, `--color-gold`, `--color-bordeaux`, `--color-cream`)
- **Prisma + PostgreSQL (Neon)** — schema e API já implementados (`/prisma`, `src/backend/`, `src/app/api/`); ainda não ligados ao frontend.
- Frontend atual sem backend: **catálogo vazio por definição** — o admin cria os produtos, que ficam em `localStorage` e são partilhados entre o admin e a loja pública via `AdminDataContext` (`src/context/AdminDataContext.tsx`). Carrinho e favoritos também em `localStorage`, sessão de admin em `sessionStorage`.

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

## Backend (Prisma + PostgreSQL)

Estrutura do backend, adicionada em `src/backend/` e `src/app/api/` (App Router — os endpoints ficam em `route.ts`, não em `pages/api/`, para não obrigar a reescrever as páginas existentes):

```
prisma/
  schema.prisma        modelos: User, Category, Product, Cart, Wishlist, Order, OrderItem, Payment, OrderTracking
  seed.ts               2 categorias, 10 produtos, 1 admin, 1 cliente de teste

src/backend/
  lib/db.ts              singleton do Prisma Client
  lib/auth.ts             gerar/verificar JWT, extrair do header Authorization
  lib/multibanco.ts       gerador de referência (Entidade + 9 dígitos, check digit Módulo 97)
  lib/validators.ts       validação de email/password/checkout, sanitização de strings
  lib/response.ts         formato de resposta { success, data, message }
  lib/cartSession.ts      resolve dono do carrinho (utilizador autenticado ou sessão anónima por cookie)
  middleware/withAuth.ts  protege um route handler, injeta o utilizador do JWT
  middleware/withAdmin.ts idem, mas exige role ADMIN
  models/                 funções Prisma por entidade (user, product, cart, wishlist, order, payment)

src/app/api/
  auth/{register,login,me}
  products/{index,featured,[slug]}
  cart/{index,add,[id]}
  wishlist/{index,[id]}
  orders/{index,checkout,[id]}
  payment/{generate,status,webhook}
  admin/{products,orders,users,stats}
```

### Configurar a base de dados

1. Cria uma base de dados gratuita em [neon.tech](https://neon.tech) e copia o connection string.
2. Copia `.env.example` para `.env` e substitui `DATABASE_URL` (e opcionalmente `JWT_SECRET`, já vem preenchido com um valor aleatório de desenvolvimento).
3. Corre as migrações e o seed:

```bash
npx prisma migrate dev --name init
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
| GET | `/api/products?categoria=&min=&max=&q=&page=&limit=` | Listar produtos com filtros |
| GET | `/api/products/featured` | Produtos em destaque (máx. 8) |
| GET | `/api/products/:slug` | Produto por slug + relacionados |
| GET | `/api/cart` | Carrinho (por utilizador ou cookie de sessão) |
| DELETE | `/api/cart` | Esvaziar carrinho |
| POST | `/api/cart/add` | Adicionar item `{ productId, quantidade }` |
| PUT/DELETE | `/api/cart/:id` | Atualizar/remover item do carrinho |
| GET/POST 🔒 | `/api/wishlist` | Listar / adicionar aos favoritos |
| DELETE 🔒 | `/api/wishlist/:id` | Remover dos favoritos |
| GET 🔒 | `/api/orders` | Histórico de encomendas do utilizador |
| POST | `/api/orders/checkout` | Criar encomenda a partir do carrinho + gerar referência Multibanco |
| GET | `/api/orders/:id` | Detalhe da encomenda (verifica dono, se associada a conta) |
| POST | `/api/payment/generate` | (Re)gerar referência Multibanco de uma encomenda |
| GET | `/api/payment/status?orderId=` | Estado do pagamento |
| POST | `/api/payment/webhook` | Simula confirmação de pagamento (marca Pago) |
| GET/POST/PUT/DELETE 🔒👑 | `/api/admin/products` | CRUD de produtos |
| GET/PUT 🔒👑 | `/api/admin/orders` | Listar encomendas, atualizar estado |
| GET 🔒👑 | `/api/admin/users` | Listar clientes |
| GET 🔒👑 | `/api/admin/stats` | Vendas, encomendas por estado, top produtos, últimos 7 dias |

### Próximo passo: ligar o frontend

O frontend atual (`AdminDataContext`, `CartContext`, `WishlistContext`, `CustomerAuthContext`) ainda lê e escreve em `localStorage`, não nestes endpoints. Ligar os dois é um trabalho à parte (criar `useApi`, trocar os contextos para chamarem a API, migrar a sessão de JWT em vez de flags locais) — deixado propositadamente para depois de validar que a base de dados liga bem.

### Deploy no Vercel

1. Importa o repositório em [vercel.com/new](https://vercel.com/new).
2. Define as variáveis de ambiente do `.env.example` nas definições do projeto (usa a mesma `DATABASE_URL` do Neon; gera um `JWT_SECRET` novo só para produção).
3. Em "Build Command", garante que corre `prisma generate` antes do build — adiciona ao `package.json`:
   ```json
   "postinstall": "prisma generate"
   ```
4. Corre `npx prisma migrate deploy` manualmente (ou via um passo de deploy) para aplicar as migrações à base de dados de produção — `migrate dev` é só para desenvolvimento local.

## Paleta de marca

| Cor | Hex |
|---|---|
| Roxo ameixa (fundo) | `#4A1E3C` |
| Roxo/vinho claro | `#6E2A54` |
| Dourado / âmbar | `#E8A64C` |
| Bordô | `#6E1B2A` |
| Creme | `#FAF6F0` |
