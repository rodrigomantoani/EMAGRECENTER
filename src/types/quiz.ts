// Tipos de perguntas do quiz
export type QuestionType =
  | 'welcome'
  | 'overview'
  | 'single-choice'
  | 'multiple-choice'
  | 'dropdown'
  | 'radio-card'
  | 'input-text'
  | 'input-number'
  | 'input-date'
  | 'input-contact'
  | 'textarea'
  | 'interstitial'
  | 'benefit'
  | 'loading'
  | 'result'
  | 'measures'
  | 'imc-result'
  | 'goal-weight'
  | 'goal-date'
  | 'birth-date'
  | 'pregnancy-check';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  helper?: string;
  icon?: string;
  value?: string;
  exclusive?: boolean; // Para opções tipo "Nenhuma"
}

export interface RadioCardOption {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  price?: string;
  priceNote?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  icon?: string;
}

export interface QuestionGroup {
  title: string;
  options: QuestionOption[];
}

export interface DropdownOption {
  value: string;
  label: string;
}

export interface BulletPoint {
  icon?: string;
  text: string;
  highlight?: boolean;
}

export interface OverviewSection {
  id: string;
  status: 'active' | 'pending' | 'completed';
  icon?: string;
  image?: string;
  title: string;
  description: string;
  duration?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title?: string;
  subtitle?: string;
  description?: string;
  helperText?: string;
  tag?: string; // Ex: "GESTÃO COMPLETA DO SEU TRATAMENTO"
  options?: QuestionOption[];
  radioCardOptions?: RadioCardOption[];
  dropdownOptions?: DropdownOption[];
  groups?: QuestionGroup[];
  fields?: InputField[];
  bulletPoints?: BulletPoint[];
  overviewSections?: OverviewSection[];
  buttonText?: string;
  image?: string;
  profileImage?: string;
  badge?: string;
  disclaimer?: string;
  footer?: string;
  autoAdvance?: boolean;
  validation?: ValidationRule;
  // Welcome page specific
  socialProof?: {
    rating?: string;
    text: string;
    highlight?: string;
  };
  // Benefit page specific
  benefits?: BulletPoint[];
}

export interface InputField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  suffix?: string;
  helper?: string;
  required?: boolean;
  rows?: number; // Para textarea
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// Estado do quiz
export interface QuizState {
  currentStep: number;
  answers: QuizData;
  isLoading: boolean;
  isComplete: boolean;
}

// Dados coletados
export interface QuizData {
  // Página 1 - Uso de medicamentos
  medicamentosUsados?: string[];

  // Página 2 - Localização
  estado?: string;

  // Página 3 - Preferência de plano
  preferenciaPlano?: 'medicacao-time' | 'somente-medicacao' | 'nao-sei';

  // Página 7 - Preferência de medicação injetável
  preferenciaMedicacao?: 'mounjaro' | 'wegovy';

  // Dados Pessoais
  nome?: string;
  primeiroNome?: string;
  dataNascimento?: string;
  sexo?: 'masculino' | 'feminino';
  gravidezAmamentacao?: 'sim' | 'nao';
  altura?: number;
  peso?: number;
  maiorPeso?: number;
  pesoMeta?: number;
  temEventoMeta?: boolean;
  dataEventoMeta?: string;
  nomeEventoMeta?: string;
  whatsapp?: string;
  email?: string;
  concordaPrivacidade?: boolean;

  // Triagem Médica
  diagnosticos?: string[];
  cirurgiaBariatrica?: string[];
  tomaMedicamentoRegular?: 'sim' | 'nao';
  medicamentosRegulares?: string;
  alergiasMedicamentos?: string[];
  duvidasAdicionais?: string;

  // Campos extras para compatibilidade
  [key: string]: unknown;
}

export interface QuizStep {
  id: string;
  phase: 'onboarding' | 'preferencias' | 'beneficios' | 'dados-pessoais' | 'triagem-medica' | 'resultado';
  question: Question;
}
