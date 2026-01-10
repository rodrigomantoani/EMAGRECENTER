# Emagrecenter Quiz

Quiz de qualificação para tratamento de emagrecimento com medicamentos GLP-1 (Wegovy/Mounjaro).

## Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Animações:** GSAP
- **State:** Zustand
- **UI Components:** shadcn/ui

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção localmente
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Estrutura de Pastas

```
quiz/
├── public/
│   ├── fonts/          # Fontes customizadas (TTNorms, P22MackinacPro)
│   └── images/         # Imagens e ícones
├── src/
│   ├── app/            # App Router (Next.js)
│   ├── components/
│   │   ├── charts/     # Gráficos animados (WeightLossChart)
│   │   ├── quiz/       # Componentes do quiz
│   │   └── ui/         # Componentes base (shadcn)
│   ├── data/           # Configuração das perguntas (quiz-steps.ts)
│   ├── store/          # Estado global (Zustand)
│   └── types/          # TypeScript types
```

## Fontes Necessárias

Coloque os arquivos de fonte em `/public/fonts/`:

- `TTNorms-Regular.woff2`
- `TTNorms-Bold.woff2`
- `P22-Mackinac-Pro-Bold.woff2`

## Imagens

Todas as imagens ficam em `/public/images/`. Veja o arquivo `Sugestão de imagens.md` para prompts de geração de imagens com IA.

## Configuração das Perguntas

O fluxo do quiz é definido em `src/data/quiz-steps.ts`. Cada step tem:

- `id`: Identificador único
- `type`: Tipo do componente (welcome, single-choice, input, etc.)
- `title`: Título da pergunta
- `options`: Opções de resposta (quando aplicável)
- `field`: Campo onde a resposta é salva

## Deploy

### Vercel (Recomendado)

```bash
npm i -g vercel
vercel
```

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy .next
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Variáveis de Ambiente

Nenhuma variável de ambiente é necessária para o funcionamento básico. O quiz é 100% client-side.

Para integrações futuras (analytics, CRM, etc.), adicione em `.env.local`:

```env
# Exemplo
NEXT_PUBLIC_GTM_ID=GTM-XXXXX
NEXT_PUBLIC_PIXEL_ID=123456789
```

## Cores da Marca

```css
--charcoal: #38312c      /* Texto principal */
--evergreen: #779d7c     /* CTAs, destaques verdes */
--wood: #c6a673          /* Destaques dourados */
--brown-stone: #f7f4f0   /* Background */
--mint-light: #f1f5e9    /* Badges */
```

## Contato

Dúvidas? Fale com o time de desenvolvimento.
