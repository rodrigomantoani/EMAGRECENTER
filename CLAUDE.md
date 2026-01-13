# EMAGRECENTER Quiz Project

## Checkout Integration

When user clicks "Obter meu plano" buttons on the final screen, redirect to external checkout:

**Base URL:** `https://www.helixonlabs.com/checkout`

### Query Parameters

| Parameter | Description | Status | Quiz Field |
|-----------|-------------|--------|------------|
| product | Product ID (see table below) | TODO | preferenciaMedicacao |
| nome | First name | OK | primeiroNome |
| sobrenome | Last name | TODO | (extract from nome) |
| email | Email address | OK | email |
| telefone | Phone number | OK | whatsapp |
| cpf | CPF document | TODO | - |
| cep | Postal code | TODO | - |
| rua | Street name | TODO | - |
| numero | Street number | TODO | - |
| bairro | Neighborhood | TODO | - |
| cidade | City | TODO | - |
| estado | State (2 letters) | OK | estado |

### Products

| Product | ID | Price |
|---------|-----|-------|
| Semaglutida 5mg | semaglutida-5mg | R$ 399,99 |
| Tirzepatida 20mg | tirzepatida-20mg | R$ 799,99 |
| Tirzepatida 30mg | tirzepatida-30mg | R$ 999,99 |
| Tirzepatida 60mg | tirzepatida-60mg | R$ 1.799,99 |
| Retatrutida 20mg | retatrutida-20mg | R$ 1.299,99 |
| Retatrutida 30mg | retatrutida-30mg | R$ 1.499,99 |

### Quiz Data Available (from QuizData type)

```typescript
// Already collected:
nome?: string;              // Full name
primeiroNome?: string;      // First name
email?: string;
whatsapp?: string;          // Phone
estado?: string;            // State (SP, SC, PR, etc.)
preferenciaMedicacao?: 'mounjaro' | 'wegovy';

// Not collected yet:
// sobrenome, cpf, cep, rua, numero, bairro, cidade
```

### Example URL

```
https://www.helixonlabs.com/checkout?product=semaglutida-5mg&nome=Rodrigo&sobrenome=Mantoani&email=mantoanir@gmail.com&telefone=11920835004&cpf=03792863944&cep=86050070&rua=Rua Caracas&numero=350&bairro=Santa Rosa&cidade=Londrina&estado=PR
```

### Implementation Notes

1. Buttons "Obter meu plano" are in `src/components/quiz/ResultPage.tsx` (lines 278, 348, 572, 714, 797)
2. Need to map `preferenciaMedicacao` to product IDs
3. Need to extract `sobrenome` from `nome` field (split by space)
4. Missing fields (cpf, address) need to be collected OR sent empty

---

## HLX Tracker Integration

O quiz utiliza o HLX Tracker para analytics e tracking de eventos.

### Pixel Instalado

O pixel HLX está instalado no `src/app/layout.tsx`:

```tsx
<Script
  src="https://hlx-tracker.pages.dev/hlx.js"
  strategy="afterInteractive"
/>
```

### Eventos Trackados

| Evento | Quando | Dados |
|--------|--------|-------|
| `page_view` | Automático | URL, referrer, UTMs |
| `quiz_start` | Clique em "Começar" | - |
| `quiz_step` | Cada etapa | `step`, `from_step` |
| `quiz_complete` | Página de resultado | email, nome, estado, peso, altura, sexo, preferencia |
| `checkout_click` | Clique em "Obter meu plano" | product, email |

### Identificacao do Usuario

Quando o usuario completa o quiz, ele e identificado automaticamente pelo email:

```typescript
HLX.identify(email);
```

### Tracking Manual (se necessario)

```typescript
// Verificar se HLX esta disponivel
if (typeof window !== 'undefined' && window.HLX) {
  window.HLX.track('evento_customizado', { dados: 'aqui' });
}
```

### APIs do HLX

| Endpoint | URL |
|----------|-----|
| Pixel | `https://hlx-tracker.pages.dev/hlx.js` |
| Track API | `https://hotmpgchvpscizfyjbdq.supabase.co/functions/v1/track` |
| Lookup API | `https://hotmpgchvpscizfyjbdq.supabase.co/functions/v1/lookup` |

### Consultar Dados de um Visitante

```bash
# Por email
curl "https://hotmpgchvpscizfyjbdq.supabase.co/functions/v1/lookup?email=joao@email.com"

# Por hlx (ID do lead)
curl "https://hotmpgchvpscizfyjbdq.supabase.co/functions/v1/lookup?hlx=LEAD123"
```

### TypeScript

Os tipos do HLX estao em `src/types/hlx.d.ts`.

---

## Checkout Data Encryption

Os dados do checkout sao criptografados com AES-256-GCM antes de serem enviados na URL.

### Como Funciona

1. Quiz criptografa todos os dados do usuario
2. URL fica: `https://www.helixonlabs.com/checkout?data=<encrypted_base64>`
3. Checkout descriptografa usando a mesma chave

### Chave de Criptografia

A chave e derivada de um segredo compartilhado. Por padrao:

```
NEXT_PUBLIC_CHECKOUT_SECRET=emagrecenter-checkout-2024-secret-key
```

**IMPORTANTE:** Em producao, configure uma chave secreta via variavel de ambiente!

### Codigo para Descriptografar (usar no Checkout)

```typescript
// src/lib/crypto.ts - Copiar este arquivo para o projeto de checkout

const CHECKOUT_SECRET = process.env.CHECKOUT_SECRET || 'emagrecenter-checkout-2024-secret-key';

async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = encoder.encode('emagrecenter-salt-v1');

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function decryptCheckoutData(encryptedData: string): Promise<Record<string, string>> {
  const key = await deriveKey(CHECKOUT_SECRET);

  // Convert from base64url
  const base64 = encryptedData
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

  // Extract IV and encrypted data
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
```

### Uso no Checkout (Next.js)

```typescript
// app/checkout/page.tsx
import { decryptCheckoutData } from '@/lib/crypto';

export default async function CheckoutPage({
  searchParams
}: {
  searchParams: { data?: string }
}) {
  let checkoutData = {};

  if (searchParams.data) {
    try {
      checkoutData = await decryptCheckoutData(searchParams.data);
    } catch (error) {
      console.error('Failed to decrypt checkout data:', error);
    }
  }

  // checkoutData contem: product, nome, sobrenome, email, telefone, cpf, cep, rua, numero, bairro, cidade, estado
  return (
    <div>
      <p>Produto: {checkoutData.product}</p>
      <p>Nome: {checkoutData.nome} {checkoutData.sobrenome}</p>
      <p>Email: {checkoutData.email}</p>
      {/* ... */}
    </div>
  );
}
```

### Dados Criptografados

| Campo | Descricao |
|-------|-----------|
| product | ID do produto (semaglutida-5mg, tirzepatida-60mg, etc) |
| nome | Primeiro nome |
| sobrenome | Sobrenome |
| email | Email |
| telefone | WhatsApp |
| cpf | CPF (vazio por enquanto) |
| cep | CEP (vazio por enquanto) |
| rua | Rua (vazio por enquanto) |
| numero | Numero (vazio por enquanto) |
| bairro | Bairro (vazio por enquanto) |
| cidade | Cidade (vazio por enquanto) |
| estado | Estado (SP, PR, etc) |
