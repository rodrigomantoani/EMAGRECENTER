# Estudo Completo do Quiz Voy Saude - Funnel de Emagrecimento

## Resumo do Flow

O quiz da Voy Saude é um funnel de qualificacao medica para um programa de emagrecimento com prescricao de medicamentos. Total de **37 steps** ate a pagina de pagamento.

---

## Estrutura Completa do Quiz

### FASE 1: LANDING PAGE E INTRODUCAO (Steps 1-8)

#### Step 1 - Landing Page Inicial
- **URL**: `/questionario/v2`
- **Tipo**: Landing page
- **Elementos**: Introducao ao programa Voy

#### Steps 2-6 - Onboarding/Interstitials
- **URL**: `/questionario/v2?stepIndex=6`
- **Tipo**: Telas informativas
- **Conteudo**:
  - Medicamentos aprovados pela ANVISA
  - Consulta online com medicos especializados
  - Entrega em casa
  - Suporte por WhatsApp

#### Step 7 - Interstitial "Tratamento Pratico"
- **URL**: `?stepIndex=7`
- **Conteudo**:
  - "Pratico": Entrega na sua casa, sem farmacia
  - "Tratamento": Medicamentos aprovados pela ANVISA
  - "Suporte": Equipe de medicos e enfermeiros

#### Step 8 - Selecao de Tratamento
- **URL**: `?stepIndex=9`
- **Tipo**: Selecao
- **Opcoes**:
  - Medicacao injetavel (mais efetiva)
  - Medicacao oral (mais acessivel)
  - Nao sei ainda

---

### FASE 2: DADOS PESSOAIS E PREFERENCIAS (Steps 10-20)

#### Steps 10-12 - Interstitials Informativos
- **URL**: `?stepIndex=9`
- **Conteudo**:
  - Informacoes sobre medicamentos
  - Imagens de canetas injetaveis
  - Comparativo de medicacoes

#### Step 13 - Reembolso
- **URL**: `?stepIndex=10`
- **Tipo**: Informativo
- **Headline**: "Economize ate R$ 100 no seu plano Voy com reembolsos"
- **Texto**: Informacoes sobre reembolso pelo plano de saude

#### Step 15 - Inicio do Questionario
- **URL**: `?stepIndex=10`
- **Tipo**: Introducao
- **Elementos**:
  - "Questionario Voy"
  - "Dados Pessoais"
  - "Triagem Medica"
  - Botao "Responder"

#### Step 16 - Data de Nascimento e Sexo
- **URL**: `?stepIndex=10`
- **Tipo**: Input + Radio
- **Campos**:
  - Data de nascimento (DD/MM/AAAA)
  - Sexo atribuido ao nascer (Masculino/Feminino)
- **Helper text**: "Essa informacao nos ajuda a entender melhor seus hormonios e metabolismo."

#### Step 17 - Altura e Peso
- **URL**: `?stepIndex=12`
- **Tipo**: Input numerico
- **Campos**:
  - Altura (cm)
  - Peso (kg)

#### Step 19 - Maior Peso e Peso Meta
- **URL**: `?stepIndex=13`
- **Tipo**: Input numerico
- **Campos**:
  - Maior peso que voce ja teve
  - Peso que voce quer alcancar
- **Helper**: "Desconsiderando periodos de gravidez"
- **Link**: "Mudar para pedras/lbs"

#### Step 20 - Contato
- **URL**: `?stepIndex=14`
- **Tipo**: Input
- **Campos**:
  - WhatsApp
  - E-mail
  - Checkbox: "Concordo com a Politica de Privacidade"

---

### FASE 3: TRIAGEM MEDICA (Steps 21-34)

#### Step 21 - Transicao
- **URL**: `?stepIndex=18`
- **Tipo**: Interstitial
- **Headline**: "Muito obrigada!"
- **Texto**:
  - "Agora, papo serio: vamos falar sobre saude."
  - "Ah, essa parte dura 3 minutos (eu cronometrei)."

#### Step 22 - Avisos Importantes
- **URL**: `?stepIndex=18`
- **Tipo**: Informativo com checklist
- **Headlines**:
  - "Alguns avisos importantes"
  - "Evite automedicacao!"
  - "Triagem medica"
- **Conteudo**:
  - "ANTES DE COMECARMOS"
  - "Os medicamentos sao prescritos por medicos credenciados apenas quando eles entendem que e indicado."
  - "Sao algumas perguntas rapidas para entender melhor a sua saude e indicar o tratamento ideal."
- **Botao**: "Iniciar triagem medica"

#### Step 23 - Condicoes de Saude (Multipla escolha)
- **URL**: `?stepIndex=18`
- **Tipo**: Checkbox multiplo (agrupado)
- **Grupos**:

**METABOLICOS:**
- Diabetes tipo 1 ou retinopatia diabetica
- Diabetes tipo 2

**ALIMENTARES E/OU PSICOLOGICOS:**
- Anorexia
- Bulimia
- Psicoses
- Esquizofrenia

**DISTURBIOS ABDOMINAIS GRAVES:**
- Pancreatite
- Insuficiencia renal ou hepatica
- Problema atual na vesicula biliar
- Problemas GRAVES no intestino ou estomago

**OUTROS:**
- Cancer
- Cancer medular de tireoide
- Sindrome de neoplasia endocrina multipla tipo 2 (NEM 2)
- Fibrose Cistica

**Opcao de escape:**
- "Nao, eu nao fui diagnosticado com nenhuma dessas condicoes"

#### Step 24 - Cirurgias Bariatricas
- **URL**: `?stepIndex=22`
- **Tipo**: Checkbox
- **Opcoes**:
  - Balao gastrico
  - Bypass gastrico em Y de Roux
  - Banda gastrica ajustavel laparoscopica (Lap-Band)
  - Gastrectomia vertical
  - Outro procedimento
  - Nao, nenhuma cirurgia

#### Step 30 - Pergunta Sim/Nao
- **URL**: `?stepIndex=23`
- **Tipo**: Radio buttons
- **Opcoes**: Sim / Nao

#### Step 31 - Campo de Texto Livre
- **URL**: `?stepIndex=24`
- **Tipo**: Textarea
- **Botao**: Continuar

#### Step 32 - Medicamentos Anteriores
- **URL**: `?stepIndex=25`
- **Tipo**: Checkbox
- **Opcoes**:
  - Mounjaro (Tirzepatida)
  - Saxenda (Liraglutida)
  - Ozempic ou Wegovy (Semaglutida)
  - Contrave (Bupropiona + Naltrexona)
  - Nenhum desses medicamentos

#### Step 33 - Campo de Texto Adicional
- **URL**: `?stepIndex=26`
- **Tipo**: Textarea
- **Botao**: Continuar

#### Step 34 - Loading/Processando
- **URL**: `?stepIndex=26`
- **Tipo**: Loading state
- **Elemento**: loader_button.svg (animacao de carregamento)

---

### FASE 4: RESULTADO E PAGAMENTO (Steps 35-37)

#### Step 35-36 - Recomendacao
- **URL**: `/questionario/recomendacao`
- **Tipo**: Resultado do quiz
- **Conteudo**: Plano recomendado baseado nas respostas

#### Step 37 - Pagamento
- **URL**: `/pagamento`
- **Tipo**: Checkout page

---

## Design System

### Cores
```css
--color-primary: #290852 (roxo escuro - texto principal)
--color-accent: #ff781f (laranja - CTAs)
--color-bias-success: #69b27d (verde - sucesso)
--color-surface-neutral: #e8e5e1 (cinza claro)
--color-white: #fff
--gradient-secondary-top-left: linear-gradient(135deg, #fff2d4, #f5e9ff)
```

### Tipografia
**Fontes:**
- P22-Mackinac-Pro-Bold (headlines)
- TTNorms-Bold (botoes)
- TTNorms-Regular (corpo)

**Tamanhos:**
- Headlines: 24px-28px
- Body: 16px-18px
- Small: 12px-14px

### Espacamentos
- Padding padrao: 24px
- Border radius: 8px (cards), 2px (inputs)

---

## Tipos de Componentes Necessarios

### 1. QuestionCard
- Pergunta com opcoes de resposta
- Tipos: radio, checkbox, input

### 2. InterstitialCard
- Tela informativa com ilustracao
- Headline + texto + botao

### 3. InputField
- Text input
- Number input (altura, peso)
- Date input

### 4. RadioGroup
- Opcao unica (Masculino/Feminino, Sim/Nao)

### 5. CheckboxGroup
- Multipla escolha
- Com categorias/grupos

### 6. LoadingState
- Animacao de carregamento

### 7. ProgressBar
- Indicador de progresso no quiz

### 8. Button
- Primary (laranja)
- Texto: "Continuar", "Responder", etc.

---

## Fluxo de Dados a Coletar

```typescript
interface QuizData {
  // Preferencias
  tipoTratamento: 'injetavel' | 'oral' | 'nao_sei';

  // Dados Pessoais
  dataNascimento: string;
  sexo: 'masculino' | 'feminino';
  altura: number; // cm
  peso: number; // kg
  maiorPeso: number; // kg
  pesoMeta: number; // kg
  whatsapp: string;
  email: string;
  concordaPrivacidade: boolean;

  // Triagem Medica
  condicoesSaude: string[];
  cirurgiaBariatrica: string[];
  usouMedicamentos: string[];
  outrasInformacoes: string;
}
```

---

## Proximos Passos

- [ ] Criar projeto Next.js
- [ ] Implementar design system (cores, fontes, componentes)
- [ ] Criar componentes base (Button, Card, Input, etc.)
- [ ] Implementar fluxo do quiz com estado
- [ ] Criar cada step do questionario
- [ ] Adicionar validacoes
- [ ] Conectar com backend/Supabase
- [ ] Tela de resultado
- [ ] Integrar pagamento
