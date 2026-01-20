import type { QuizStep } from '@/types/quiz';

// Lista de estados brasileiros para dropdown
const ESTADOS_BRASIL = [
  { value: 'AC', label: 'Acre (AC)' },
  { value: 'AL', label: 'Alagoas (AL)' },
  { value: 'AP', label: 'Amapá (AP)' },
  { value: 'AM', label: 'Amazonas (AM)' },
  { value: 'BA', label: 'Bahia (BA)' },
  { value: 'CE', label: 'Ceará (CE)' },
  { value: 'DF', label: 'Distrito Federal (DF)' },
  { value: 'ES', label: 'Espírito Santo (ES)' },
  { value: 'GO', label: 'Goiás (GO)' },
  { value: 'MA', label: 'Maranhão (MA)' },
  { value: 'MT', label: 'Mato Grosso (MT)' },
  { value: 'MS', label: 'Mato Grosso do Sul (MS)' },
  { value: 'MG', label: 'Minas Gerais (MG)' },
  { value: 'PA', label: 'Pará (PA)' },
  { value: 'PB', label: 'Paraíba (PB)' },
  { value: 'PR', label: 'Paraná (PR)' },
  { value: 'PE', label: 'Pernambuco (PE)' },
  { value: 'PI', label: 'Piauí (PI)' },
  { value: 'RJ', label: 'Rio de Janeiro (RJ)' },
  { value: 'RN', label: 'Rio Grande do Norte (RN)' },
  { value: 'RS', label: 'Rio Grande do Sul (RS)' },
  { value: 'RO', label: 'Rondônia (RO)' },
  { value: 'RR', label: 'Roraima (RR)' },
  { value: 'SC', label: 'Santa Catarina (SC)' },
  { value: 'SP', label: 'São Paulo (SP)' },
  { value: 'SE', label: 'Sergipe (SE)' },
  { value: 'TO', label: 'Tocantins (TO)' },
];

export const quizSteps: QuizStep[] = [
  // ============================================
  // 1. BOAS-VINDAS - Hook emocional forte
  // ============================================
  {
    id: 'welcome',
    phase: 'onboarding',
    question: {
      id: 'welcome',
      type: 'welcome',
      profileImage: '/images/nutri.png',
      subtitle: 'Time clínico EmagreCENTER',
      title: 'Você está a 2 minutos de descobrir o tratamento que vai mudar sua vida',
      description: 'Responda algumas perguntas rápidas e um médico especialista vai analisar se você é elegível para o tratamento que já transformou a vida de milhares de pessoas.',
      socialProof: {
        rating: '4.9 estrelas',
        text: 'que já alcançaram o peso dos sonhos com a EmagreCENTER.',
        highlight: '78.000 pessoas',
      },
      buttonText: 'Quero descobrir meu tratamento →',
    },
  },

  // ============================================
  // 2. SEXO - Personalização imediata
  // ============================================
  {
    id: 'sexo',
    phase: 'onboarding',
    question: {
      id: 'sexo',
      type: 'single-choice',
      title: 'Primeiro, me conta: você é...',
      options: [
        { id: 'masculino', label: 'Homem', icon: '👨' },
        { id: 'feminino', label: 'Mulher', icon: '👩' },
      ],
      autoAdvance: true,
    },
  },

  // ============================================
  // 2.1. GRAVIDEZ - Apenas para mulheres
  // ============================================
  {
    id: 'gravidez',
    phase: 'onboarding',
    question: {
      id: 'gravidezAmamentacao',
      type: 'pregnancy-check',
      title: 'Você está grávida, amamentando ou tentando engravidar?',
      helperText: 'O plano pode incluir medicamentos contraindicados para gravidez. Por isso, recomendamos métodos contraceptivos.',
    },
  },

  // ============================================
  // 3. USO DE MEDICAMENTOS - Qualificação + Autoridade
  // ============================================
  {
    id: 'medicamentos-usados',
    phase: 'preferencias',
    question: {
      id: 'medicamentosUsados',
      type: 'multiple-choice',
      title: 'Você já tentou alguma dessas medicações de emagrecimento?',
      helperText: 'Milhões de pessoas estão usando. Se você ainda não experimentou, pode estar perdendo resultados incríveis.',
      options: [
        { id: 'nunca-usei', label: 'Ainda não tive acesso', exclusive: true },
        { id: 'wegovy', label: 'Wegovy', description: 'Semaglutida' },
        { id: 'mounjaro', label: 'Mounjaro', description: 'Tirzepatida - o mais potente' },
        { id: 'ozempic', label: 'Ozempic', description: 'Semaglutida' },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 4. LOCALIZAÇÃO - Escassez geográfica
  // ============================================
  {
    id: 'localizacao',
    phase: 'preferencias',
    question: {
      id: 'estado',
      type: 'dropdown',
      title: 'Em qual estado você mora?',
      helperText: 'Entregamos em todo o Brasil, direto na sua casa, com frete grátis. Mas precisamos confirmar a disponibilidade na sua região.',
      dropdownOptions: ESTADOS_BRASIL,
      buttonText: 'Verificar disponibilidade',
    },
  },

  // ============================================
  // 5. ESCOLHA DE PLANO - Ancoragem de valor
  // ============================================
  {
    id: 'preferencia-plano',
    phase: 'preferencias',
    question: {
      id: 'preferenciaPlano',
      type: 'single-choice',
      title: 'O que faz mais sentido pra você?',
      subtitle: 'Escolha o que combina com seu momento',
      options: [
        {
          id: 'medicacao-time',
          label: '🏆 Tratamento Completo (mais escolhido)',
          description: 'Medicação + Médico endocrinologista + Nutricionista + Suporte diário no WhatsApp. Tudo que você precisa pra não desistir.',
        },
        {
          id: 'somente-medicacao',
          label: 'Só a medicação',
          description: 'Avaliação médica + Medicamento entregue em casa. Sem acompanhamento.',
        },
        {
          id: 'nao-sei',
          label: 'Me ajuda a decidir depois',
        },
      ],
      autoAdvance: true,
    },
  },

  // ============================================
  // 6. BENEFÍCIO 1 - Conveniência (dor principal)
  // ============================================
  {
    id: 'beneficio-gestao',
    phase: 'beneficios',
    question: {
      id: 'beneficio-gestao',
      type: 'benefit',
      tag: '🎯 ZERO BUROCRACIA',
      image: '/images/benefit-management.svg',
      title: 'Esqueça filas, receitas e farmácias',
      description: 'A gente cuida de TUDO: consulta online, receita digital, compra do medicamento e entrega na sua porta. Você só precisa tomar o remédio e ver os resultados aparecerem.',
      disclaimer: '*Medicação enviada apenas após prescrição médica',
      buttonText: 'Isso é pra mim →',
    },
  },

  // ============================================
  // 7. BENEFÍCIO 2 - Consistência (medo de falhar)
  // ============================================
  {
    id: 'beneficio-entrega',
    phase: 'beneficios',
    question: {
      id: 'beneficio-entrega',
      type: 'benefit',
      tag: '📦 ENTREGA AUTOMÁTICA',
      image: '/images/benefit-delivery.svg',
      title: 'Nunca mais fique sem remédio',
      bulletPoints: [
        { text: 'Renovação automática da receita', icon: 'check' },
        { text: 'Entrega mensal sem você precisar pedir', icon: 'check' },
        { text: 'Frete grátis em todo o Brasil', icon: 'check' },
        { text: 'Aviso antes de cada envio', icon: 'check' },
      ],
      buttonText: 'Perfeito, continuar →',
    },
  },

  // ============================================
  // 8. BENEFÍCIO 3 - Suporte (medo de estar sozinho)
  // ============================================
  {
    id: 'beneficio-suporte',
    phase: 'beneficios',
    question: {
      id: 'beneficio-suporte',
      type: 'benefit',
      tag: '💬 TIME DEDICADO A VOCÊ',
      image: '/images/benefit-support.svg',
      title: 'Você não vai estar sozinho nessa jornada',
      bulletPoints: [
        { text: 'Médico endocrinologista te acompanhando', icon: 'check' },
        { text: 'Nutricionista pra ajustar sua alimentação', icon: 'check' },
        { text: 'Suporte pelo WhatsApp quando precisar', icon: 'check' },
        { text: 'Respostas em até 24 horas', icon: 'check' },
      ],
      buttonText: 'Quero esse suporte →',
    },
  },

  // ============================================
  // 9. PREFERÊNCIA DE MEDICAÇÃO - Escolha informada
  // ============================================
  {
    id: 'preferencia-medicacao',
    phase: 'preferencias',
    question: {
      id: 'preferenciaMedicacao',
      type: 'radio-card',
      title: 'Se for indicado injetável, qual você prefere?',
      helperText: 'O médico vai avaliar o melhor pro seu caso, mas sua preferência conta muito.',
      radioCardOptions: [
        {
          id: 'mounjaro',
          title: 'Tirzepatida (Mounjaro)',
          subtitle: '⭐ Mais potente do mercado',
          price: 'R$ 1.799,99',
          priceNote: 'Perda média: 20-25% do peso',
          image: '/images/glp-injections-n.png',
          imageAlt: 'Caneta de aplicação de Tirzepatida (Mounjaro)',
          imageWidth: 80,
          imageHeight: 160,
        },
        {
          id: 'wegovy',
          title: 'Semaglutida (Wegovy/Ozempic)',
          subtitle: 'O mais popular',
          price: 'R$ 399,99',
          priceNote: 'Perda média: 15-17% do peso',
          image: '/images/glp-tablets-n.png',
          imageAlt: 'Caneta de aplicação de Semaglutida (Wegovy)',
          imageWidth: 80,
          imageHeight: 160,
        },
      ],
    },
  },

  // ============================================
  // 10. REEMBOLSO - Redução de objeção de preço
  // ============================================
  {
    id: 'reembolso',
    phase: 'beneficios',
    question: {
      id: 'reembolso',
      type: 'benefit',
      tag: '💰 ECONOMIZE COM SEU PLANO',
      image: '/images/team-photo.png',
      badge: 'Dica: muita gente não sabe disso',
      title: 'Você pode pedir reembolso das consultas',
      description: 'As consultas médicas da EmagreCENTER podem ser reembolsadas pelo seu plano de saúde. Muitos pacientes recuperam até R$100 por mês. A gente te envia a nota fiscal certinha.',
      disclaimer: '*Reembolso depende da cobertura do seu plano',
      buttonText: 'Boa! Continuar →',
    },
  },

  // ============================================
  // 11. OVERVIEW - Preparação psicológica
  // ============================================
  {
    id: 'questionario-overview',
    phase: 'dados-pessoais',
    question: {
      id: 'questionario-overview',
      type: 'overview',
      title: 'Falta pouco pra você descobrir seu plano ideal',
      subtitle: 'Só mais algumas perguntas rápidas pra o médico te conhecer',
      tag: 'Como vai funcionar:',
      overviewSections: [
        {
          id: 'dados-pessoais',
          status: 'active',
          icon: 'user',
          image: '/images/human.svg',
          title: 'Seus dados',
          description: 'Nome, idade, peso e altura',
          duration: '1 minuto',
        },
        {
          id: 'triagem-medica',
          status: 'pending',
          icon: 'heart',
          image: '/images/medical-assessment.png',
          title: 'Sua saúde',
          description: 'Histórico médico básico',
          duration: '2 minutos',
        },
      ],
      buttonText: 'Vamos lá →',
    },
  },

  // ============================================
  // 12. NOME - Conexão pessoal
  // ============================================
  {
    id: 'nome',
    phase: 'dados-pessoais',
    question: {
      id: 'nome',
      type: 'input-text',
      title: 'Como posso te chamar?',
      subtitle: 'Vamos deixar isso mais pessoal',
      fields: [
        {
          id: 'nome',
          label: 'Seu nome completo',
          type: 'text',
          placeholder: 'Digite seu nome completo',
          required: true,
        },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 13. DATA DE NASCIMENTO
  // ============================================
  {
    id: 'dados-nascimento',
    phase: 'dados-pessoais',
    question: {
      id: 'dados-nascimento',
      type: 'birth-date',
      title: 'Qual sua data de nascimento?',
      helperText: 'O tratamento é personalizado pra sua idade',
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 14. MEDIDAS - Altura e Peso (Wheel Picker)
  // ============================================
  {
    id: 'medidas',
    phase: 'dados-pessoais',
    question: {
      id: 'medidas',
      type: 'measures',
      title: 'Qual seu peso e altura?',
      helperText: 'Arraste pra cima ou pra baixo pra selecionar.',
      buttonText: 'Calcular meu IMC',
    },
  },

  // ============================================
  // 15. IMC RESULTADO - Feedback direto
  // ============================================
  {
    id: 'imc-resultado',
    phase: 'dados-pessoais',
    question: {
      id: 'imc-resultado',
      type: 'imc-result',
      title: 'Esse é o seu IMC atual',
      buttonText: 'Entendi, continuar',
    },
  },

  // ============================================
  // 16. PESO META - Roletinha
  // ============================================
  {
    id: 'peso-meta',
    phase: 'dados-pessoais',
    question: {
      id: 'peso-meta',
      type: 'goal-weight',
      title: 'Qual peso você quer alcançar?',
      helperText: 'Seja ambicioso, mas realista. A gente te ajuda a chegar lá.',
    },
  },

  // ============================================
  // 17. DATA DO EVENTO - Opcional
  // ============================================
  {
    id: 'data-evento',
    phase: 'dados-pessoais',
    question: {
      id: 'data-evento',
      type: 'goal-date',
      title: 'Tem algum evento importante?',
      helperText: 'Casamento, formatura, viagem... Uma data ajuda a manter o foco.',
    },
  },

  // ============================================
  // 16. CONTATO - Urgência + Exclusividade
  // ============================================
  {
    id: 'contato',
    phase: 'dados-pessoais',
    question: {
      id: 'contato',
      type: 'input-contact',
      title: 'Onde você quer receber seu resultado?',
      helperText: 'Vamos te enviar seu plano personalizado com os próximos passos.',
      fields: [
        {
          id: 'whatsapp',
          label: 'WhatsApp',
          type: 'tel',
          placeholder: '(11) 99999-9999',
          helper: 'Onde vamos te mandar as atualizações',
          required: true,
        },
        {
          id: 'email',
          label: 'E-mail',
          type: 'email',
          placeholder: 'seu@email.com',
          helper: 'Pra enviar seu plano em PDF',
          required: true,
        },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 17. INTRO TRIAGEM - Legitimidade médica
  // ============================================
  {
    id: 'triagem-intro',
    phase: 'triagem-medica',
    question: {
      id: 'triagem-intro',
      type: 'interstitial',
      tag: '🩺 AVALIAÇÃO MÉDICA',
      title: 'Agora o médico precisa te conhecer melhor',
      bulletPoints: [
        {
          text: 'Isso é sério: Nossos médicos só prescrevem quando é seguro pra você. Nada de automedicação.',
          highlight: true,
        },
        {
          text: 'Suas respostas são confidenciais e vão direto pro médico que vai te atender.',
        },
        {
          text: 'Seja 100% honesto - isso é pro seu bem.',
        },
      ],
      buttonText: 'Entendi, vamos lá →',
    },
  },

  // ============================================
  // 18. DIAGNÓSTICOS MÉDICOS
  // ============================================
  {
    id: 'diagnosticos',
    phase: 'triagem-medica',
    question: {
      id: 'diagnosticos',
      type: 'multiple-choice',
      title: 'Você tem ou já teve algum desses diagnósticos?',
      helperText: 'Marque tudo que se aplicar. Isso ajuda o médico a escolher o tratamento mais seguro.',
      groups: [
        {
          title: 'METABÓLICOS',
          options: [
            { id: 'diabetes-tipo-1', label: 'Diabetes tipo 1 ou retinopatia diabética' },
            { id: 'diabetes-tipo-2', label: 'Diabetes tipo 2' },
          ],
        },
        {
          title: 'ALIMENTARES / PSICOLÓGICOS',
          options: [
            { id: 'anorexia', label: 'Anorexia' },
            { id: 'bulimia', label: 'Bulimia' },
            { id: 'psicoses', label: 'Psicoses' },
            { id: 'esquizofrenia', label: 'Esquizofrenia' },
          ],
        },
        {
          title: 'ABDOMINAIS',
          options: [
            { id: 'pancreatite', label: 'Pancreatite' },
            { id: 'insuficiencia-renal', label: 'Insuficiência renal ou hepática' },
            { id: 'vesicula-biliar', label: 'Problema na vesícula biliar (sem cirurgia)' },
            { id: 'intestino-estomago', label: 'Problemas graves no intestino/estômago' },
          ],
        },
        {
          title: 'OUTROS',
          options: [
            { id: 'cancer', label: 'Câncer (em tratamento atual)' },
            { id: 'cancer-medular', label: 'Câncer medular de tireoide (pessoal ou familiar)' },
            { id: 'nem-2', label: 'Síndrome NEM 2' },
            { id: 'fibrose-cistica', label: 'Fibrose Cística' },
          ],
        },
      ],
      options: [
        { id: 'nenhuma', label: 'Nenhum desses - sou saudável', exclusive: true },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 19. CIRURGIAS BARIÁTRICAS
  // ============================================
  {
    id: 'cirurgias',
    phase: 'triagem-medica',
    question: {
      id: 'cirurgiaBariatrica',
      type: 'multiple-choice',
      title: 'Já fez alguma cirurgia bariátrica?',
      helperText: 'Isso influencia qual medicação é mais indicada pra você.',
      options: [
        { id: 'balao-gastrico', label: 'Balão gástrico' },
        { id: 'bypass-gastrico', label: 'Bypass gástrico' },
        { id: 'lap-band', label: 'Banda gástrica (Lap-Band)' },
        { id: 'gastrectomia', label: 'Gastrectomia vertical (sleeve)' },
        { id: 'outro', label: 'Outro procedimento' },
        { id: 'nenhuma', label: 'Nunca fiz cirurgia bariátrica', exclusive: true },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 20. MEDICAMENTOS REGULARES
  // ============================================
  {
    id: 'medicamentos-regulares',
    phase: 'triagem-medica',
    question: {
      id: 'tomaMedicamentoRegular',
      type: 'single-choice',
      title: 'Você toma algum medicamento ou suplemento regularmente?',
      helperText: 'Nos últimos 30 dias',
      options: [
        { id: 'sim', label: 'Sim, tomo' },
        { id: 'nao', label: 'Não tomo nada' },
      ],
      autoAdvance: true,
    },
  },

  // ============================================
  // 21. QUAIS MEDICAMENTOS (condicional - só se respondeu "sim")
  // ============================================
  {
    id: 'quais-medicamentos',
    phase: 'triagem-medica',
    question: {
      id: 'medicamentosRegulares',
      type: 'textarea',
      title: 'Quais medicamentos ou suplementos você toma?',
      helperText: 'Liste todos, incluindo dose e modo de uso.',
      fields: [
        {
          id: 'medicamentosRegulares',
          label: 'Seus medicamentos/suplementos',
          type: 'textarea',
          placeholder: 'Ex: Losartana 50mg (1x ao dia), Vitamina D 2000UI (1x ao dia)...',
          rows: 4,
          required: true,
          resizable: true,
        },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 22. ALERGIAS
  // ============================================
  {
    id: 'alergias-medicamentos',
    phase: 'triagem-medica',
    question: {
      id: 'alergiasMedicamentos',
      type: 'multiple-choice',
      title: 'Tem alergia a algum desses medicamentos?',
      helperText: 'Importante pra sua segurança',
      options: [
        { id: 'tirzepatida', label: 'Mounjaro (Tirzepatida)' },
        { id: 'liraglutida', label: 'Saxenda (Liraglutida)' },
        { id: 'semaglutida', label: 'Ozempic/Wegovy (Semaglutida)' },
        { id: 'contrave', label: 'Contrave (Bupropiona + Naltrexona)' },
        { id: 'nenhum', label: 'Não tenho alergia a nenhum desses', exclusive: true },
      ],
      buttonText: 'Continuar',
    },
  },

  // ============================================
  // 22. DÚVIDAS - Campo aberto
  // ============================================
  {
    id: 'duvidas',
    phase: 'triagem-medica',
    question: {
      id: 'duvidasAdicionais',
      type: 'textarea',
      title: 'Quer contar mais alguma coisa pro médico?',
      helperText: 'Qualquer informação extra que você acha importante. Se não tiver nada, só clicar em continuar.',
      fields: [
        {
          id: 'duvidasAdicionais',
          label: 'Suas observações (opcional)',
          type: 'textarea',
          placeholder: 'Ex: Tenho dificuldade de emagrecer desde os 20 anos, já tentei várias dietas...',
          rows: 4,
          required: false,
        },
      ],
      buttonText: 'Finalizar e ver meu plano →',
    },
  },

  // ============================================
  // 23. LOADING - Antecipação
  // ============================================
  {
    id: 'processando',
    phase: 'resultado',
    question: {
      id: 'processando',
      type: 'loading',
      title: 'Preparando seu plano personalizado...',
      description: 'O médico está analisando suas respostas pra montar a melhor recomendação pra você.',
    },
  },

  // ============================================
  // 24. RESULTADO - Página de conversão
  // ============================================
  {
    id: 'resultado',
    phase: 'resultado',
    question: {
      id: 'resultado',
      type: 'result',
      title: 'Seu plano EmagreCENTER',
    },
  },
];

export const TOTAL_STEPS = quizSteps.length;
