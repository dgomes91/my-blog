# my-blog

Blog de notícias em pt-BR com foco em **GTA 6**. Next.js (App Router) + Prismic (CMS headless), hospedado na Vercel.

## Stack

- **Next.js 16** · React 19 · TypeScript · Turbopack
- **Tailwind CSS v4** · Radix UI · lucide-react
- **Prismic** — `@prismicio/client` v7 / `@prismicio/next` v2 / `@prismicio/react` v3
- Fontes via `next/font/google` (Oswald, JetBrains Mono, Mulish), auto-hospedadas
- Vercel Analytics + Google Analytics

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencha os valores (ver abaixo)
npm run dev                   # http://localhost:3000
```

Scripts: `npm run dev` · `npm run build` · `npm run start` · `npm run lint`

## Variáveis de ambiente

Todas opcionais — sem elas, a funcionalidade correspondente simplesmente não é
carregada. Lista completa e comentada em [`.env.example`](./.env.example).

| Var | Para quê |
|---|---|
| `PRISMIC_ACCESS_TOKEN` | Ler conteúdo do Prismic |
| `NEXT_PUBLIC_SITE_URL` | URL canônica (SEO, Disqus) |
| `GOOGLE_ANALYTICS_ID` | Google Analytics 4 |
| `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` | Newsletter (Resend) |
| `NEXT_PUBLIC_DISQUS_SHORTNAME` | Comentários (Disqus) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense |
| `NEXT_PUBLIC_GOOGLE_FUNDING_CHOICES_ID` | Banner de consentimento (CMP do Google) |
| `NEXT_PUBLIC_RRM_PUBLICATION_ID` | Reader Revenue Manager (contribuições) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Verificação nos webmaster tools |

## Estrutura

```
app/
  page.tsx                 Home
  noticias/ reviews/ top-lista/   Listagens (server page + client)
  article/[uid]/           Página de artigo
  [uid]/                   Páginas genéricas (jurídicas, "anuncie", ...)
  about/                   Sobre
  robots.ts sitemap.ts news-sitemap.xml/  SEO
  opengraph-image.tsx      Card social padrão (next/og)
  api/                     Preview + webhook de revalidação
  lib/
    queries.ts             Todas as queries ao Prismic
    article-adapter.ts     ArticleDocument -> shape dos cards
    seo.ts                 metadata + JSON-LD helpers
    newsletter.ts          Server Action (Resend)
  components/              disqus, ads, consent, reader-revenue, json-ld, ...
customtypes/  slices/       Modelos do Prismic (versionados; ver skill `prismic`)
```

## Conteúdo (Prismic)

Os modelos de conteúdo ficam em `customtypes/` e `slices/`. Alterar modelos é
feito **pelo Prismic CLI**, não editando o JSON à mão:

```bash
npx prismic login            # autentica no navegador (uma vez)
npx prismic --help
npx prismic push             # envia modelos locais -> Prismic
```

Webhook do Prismic aponta para `POST /api/revalidate` (revalida a tag `prismic`).

## Deploy

Deploy automático na Vercel. Configure as mesmas variáveis de ambiente no painel
da Vercel (Production + Preview) e faça um redeploy após alterá-las.
