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
