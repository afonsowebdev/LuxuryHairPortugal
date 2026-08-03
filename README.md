# Luxury Hair Portugal

Protótipo de e-commerce de luxo para a **Luxury Hair Portugal** — perucas de cabelo 100% humano, box braids e pestanas. Construído com Next.js (App Router), TypeScript e Tailwind CSS v4.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** — paleta de marca definida em `src/app/globals.css` (`--color-plum`, `--color-gold`, `--color-bordeaux`, `--color-cream`)
- Sem backend: dados de exemplo em `src/lib/data/`, carrinho em `localStorage`, admin em `localStorage`/`sessionStorage`

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

- `src/app/(shop)/` — loja pública: homepage, `/loja`, `/loja/[slug]` (categoria **ou** produto), `/carrinho`, `/checkout`, `/encomenda-recebida/[orderId]`, páginas institucionais.
- `src/app/admin/` — painel de administração (`/admin/login`, `/admin/dashboard`, `/admin/produtos`, `/admin/encomendas`, `/admin/clientes`, `/admin/definicoes`).
- `src/components/` — componentes reutilizáveis, organizados por domínio (`ui`, `product`, `layout`, `shop`, `checkout`, `admin`, `home`, `faq`, `contact`).
- `src/context/` — `CartContext` (carrinho), `AdminAuthContext` e `AdminDataContext` (protótipo do admin).
- `src/lib/data/` — catálogo, encomendas, clientes e definições de loja fictícios.

### Acesso ao admin (protótipo)

```
URL:   /admin/login
Email: admin@luxuryhairportugal.pt
Pass:  luxury2026
```

Credenciais fixas no código apenas para demonstração — ver nota abaixo.

### Imagens de produto

Sem fotografia real disponível, as imagens de produto/categoria são geradas como SVG (gradientes na paleta da marca + traçados decorativos), de forma determinística a partir do slug do produto (`ProductImage`). Substituir por fotografia real é o único passo necessário para produção — basta trocar `<ProductImage>` por `<Image>` apontando para os ficheiros reais.

## O que falta para produção (notas para o backend)

Este é um protótipo **apenas de front-end**. Antes de lançar em produção:

1. **Pagamentos Multibanco** — `src/lib/multibanco.ts` gera Entidade/Referência de forma simulada (hash determinístico). Substituir por integração real com um fornecedor português (IfThenPay, Easypay ou SIBS/Multibanco direto), gerando a referência no servidor e nunca confiando num valor gerado no cliente.
2. **Autenticação do admin** — `src/context/AdminAuthContext.tsx` usa credenciais fixas e uma flag em `sessionStorage`. Substituir por autenticação real (NextAuth, sessão de servidor, etc.) com hashing de password.
3. **Persistência de dados** — produtos, encomendas e clientes vivem em `localStorage` (`AdminDataContext`) e dados de catálogo estáticos em `src/lib/data/`. Substituir por chamadas a uma API real ligada a uma base de dados.
4. **Encomendas do checkout** — ao finalizar compra, a encomenda é guardada em `sessionStorage` (`src/lib/orderStore.ts`) só para alimentar a página de confirmação. Um backend real deve persistir a encomenda e enviar email/SMS de confirmação.
5. **Formulários de newsletter/contacto** — atualmente só mostram feedback visual, sem submissão real.

## Paleta de marca

| Cor | Hex |
|---|---|
| Roxo ameixa (fundo) | `#4A1E3C` |
| Roxo/vinho claro | `#6E2A54` |
| Dourado / âmbar | `#E8A64C` |
| Bordô | `#6E1B2A` |
| Creme | `#FAF6F0` |
