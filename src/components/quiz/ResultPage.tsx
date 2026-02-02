'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useQuiz } from '@/store/quiz-store';
import type { Question } from '@/types/quiz';
import { ChevronDown, ChevronUp, Check, Play } from 'lucide-react';
import { WeightLossChart } from '@/components/charts/WeightLossChart';
import { encryptCheckoutData } from '@/lib/crypto';

interface ResultPageProps {
  question: Question;
}

export function ResultPage({ question }: ResultPageProps) {
  const { answers } = useQuiz();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [showFixedCta, setShowFixedCta] = useState(false);
  const whyChooseRef = useRef<HTMLElement>(null);

  // Mostrar CTA fixo quando chegar na seção "Por que escolher" ou passar dela
  // Esconder quando estiver acima da seção
  useEffect(() => {
    const handleScroll = () => {
      if (!whyChooseRef.current) return;

      const rect = whyChooseRef.current.getBoundingClientRect();
      // Mostrar quando o topo da seção atingir o topo da viewport (ou já passou)
      setShowFixedCta(rect.top <= 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificar estado inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track quiz completion and identify user
  useEffect(() => {
    if (typeof window !== 'undefined' && window.HLX) {
      // Identify user by email
      if (answers.email) {
        window.HLX.identify(answers.email);
      }

      // Track quiz completion with all answers
      window.HLX.track('quiz_complete', {
        email: answers.email,
        nome: answers.nome,
        estado: answers.estado,
        peso: answers.peso,
        altura: answers.altura,
        sexo: answers.sexo,
        preferencia: answers.preferenciaMedicacao,
      });
    }
  }, [answers]);

  // Determina a preferência de medicação do usuário
  // Default is tirzepatida (mounjaro), unless user explicitly chose wegovy/semaglutida
  const preferenciaMedicacao = answers.preferenciaMedicacao || 'mounjaro';
  const isSemaglutida = preferenciaMedicacao === 'wegovy';

  // Generate encrypted checkout URL
  const handleCheckout = async () => {
    const baseUrl = 'https://www.helixonlabs.shop/checkout-quiz';

    
    // Map medication preference to product ID
    const productId = preferenciaMedicacao === 'wegovy' ? 'semaglutida-5mg' : 'tirzepatida-60mg';

    // Extract first name and last name from full name
    const fullName = answers.nome || '';
    const nameParts = fullName.trim().split(' ');
    const firstName = answers.primeiroNome || nameParts[0] || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Track checkout click
    if (typeof window !== 'undefined' && window.HLX) {
      window.HLX.track('checkout_click', {
        product: productId,
        email: answers.email,
      });
    }

    // Encrypt all checkout data
    const checkoutData = {
      product: productId,
      nome: firstName,
      sobrenome: lastName,
      email: answers.email || '',
      telefone: answers.whatsapp || '',
      cpf: '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: answers.estado || '',
    };

    // Build URL with plain params + encrypted data + source identifier
    const params = new URLSearchParams(checkoutData);
    params.append('source', 'emagrecenter'); // Identifies traffic from quiz

    try {
      const encryptedData = await encryptCheckoutData(checkoutData);
      params.append('data', encryptedData);
    } catch {
      // Continue without encrypted data if encryption fails
    }

    window.location.href = `${baseUrl}?${params.toString()}`;
  };

  const medicationInfo = isSemaglutida
    ? {
        name: 'Semaglutida 5mg',
        subtitle: 'Do mesmo fabricante do Ozempic®',
        price: 'R$ 399,99',
      }
    : {
        name: 'Tirzepatida 60mg',
        subtitle: 'Até 22,5% de perda de peso em estudos clínicos',
        price: 'R$ 1.799,99',
      };

  const planBenefits = [
    { icon: '/images/microscope.png', text: 'Avaliação médica em até 1 dia útil' },
    { icon: '/images/shipment.png', text: 'Entrega garantida e discreta' },
    { icon: '/images/medical.png', text: 'Suporte clínico via WhatsApp 7x semana' },
    { icon: '/images/dish.png', text: 'Acompanhamento nutricional personalizado' },
  ];

  const nextSteps = [
    {
      step: 'QUESTIONÁRIO',
      status: 'completed',
      title: 'Você já preencheu o questionário médico',
      badge: '100% digital',
      icon: '/images/icons/mobile_purple.svg',
    },
    {
      step: 'PAGAMENTO',
      status: 'current',
      title: 'O valor é bloqueado no seu cartão, não é cobrado.',
      icon: '/images/icons/card_purple.svg',
    },
    {
      step: 'AVALIAÇÃO MÉDICA',
      status: 'pending',
      title: 'Um médico credenciado vai avaliar suas respostas.',
      badge: 'Em 1 dia útil',
      icon: '/images/icons/time_purple.svg',
    },
    {
      step: 'PRESCRIÇÃO',
      status: 'pending',
      title: 'Se houver prescrição, o pagamento é aprovado.',
      badge: '100% digital',
      icon: '/images/icons/mobile_purple.svg',
    },
    {
      step: 'RECEBA EM CASA',
      status: 'pending',
      title: 'Gerenciamos toda a compra e entrega.',
      badge: 'Frete grátis',
      icon: '/images/icons/correct_purple.svg',
    },
  ];

  const whyChoose = [
    { icon: '/images/house.png', title: 'Faça tudo sem sair de casa', badge: '100% digital' },
    { icon: '/images/bolt.png', title: 'Tratamento eficaz e seguro', badge: 'Até 12% menos peso em 5 meses' },
    { icon: '/images/dna.png', title: 'Satisfação comprovada', badge: '53% mais efetivo²' },
    { icon: '/images/heart.png', title: 'Quem assina, ama a EmagreCENTER', badge: 'Avaliação 9.2/10' },
  ];

  const howItWorks = [
    {
      image: '/images/medical-assessment.png',
      title: 'Avaliação médica',
      badge: 'Diagnóstico em 1 dia útil',
      description: 'Um médico faz a sua avaliação e, se indicado, faz a prescrição do medicamento.',
    },
    {
      image: '/images/prescription.png',
      title: 'Prescrição 100% online',
      badge: 'Tudo na palma da sua mão',
      description: 'Tendo medicação, gerenciamos a compra em farmácia parceira, retenção da receita e entrega.',
    },
    {
      image: '/images/online-chat.png',
      title: 'Canal saúde via WhatsApp',
      badge: 'Time disponível 7x por semana',
      description: 'Acesso ilimitado a profissionais de saúde: fale sobre o plano, dosagem, efeitos colaterais e mais.',
    },
    {
      image: '/images/nutrition.png',
      title: 'Nutrição realista',
      badge: 'Consulta a cada 2 meses',
      description: 'Nossos nutris te ajudam a criar novos hábitos alimentares, de forma leve e sem dietas radicais.',
    },
  ];

  const testimonials = [
    {
      name: 'Nathalie',
      achievement: 'Perdeu 8,5 kg em 2 meses',
      quote: 'Foi a melhor decisão que tomei. Cheguei a pesar 92,3 kg, vivia cansada, sem vontade de fazer nada e com dores. Agora me sinto disposta, durmo melhor e meu humor melhorou. E minhas calças jeans voltaram a servir! Mudanças que vou levar a longo prazo porque foram personalizadas pra mim!',
    },
    {
      name: 'Vera',
      achievement: 'Perdeu 19kg em 1 ano',
      quote: 'Minha nutri Renata é maravilhosa e minha jornada foi cheia de descobertas. Quase desanimei por não ver resultados imediatos, e ela sugeriu que eu me medisse. Ver os centímetros perdidos me motivou! Ganhei agilidade, autoestima e até consigo cruzar as pernas!',
    },
    {
      name: 'Keila',
      achievement: 'Perdeu 6,5kg em 1 mês',
      quote: 'Com duas filhas, era difícil manter hábitos saudáveis. A nutri montou um cardápio prático e ilustrado que facilitou muito! Hoje lido melhor com a compulsão, tenho mais disposição e nossa rotina em família melhorou.',
    },
  ];

  const faqs = [
    {
      question: 'Como funciona o medicamento?',
      answer: 'O medicamento contém substâncias que imitam os hormônios naturais GLP-1 e GIP, ajudando a controlar o apetite, o metabolismo e os níveis de açúcar no sangue. Com isso, você se sente satisfeito mais rapidamente – e por mais tempo – regulando seu apetite e retardando a digestão.',
      icon: '/images/human.svg',
    },
    {
      question: 'Como funciona a progressão de dosagem?',
      answer: 'A progressão de dosagem é gradual, começando com doses menores e aumentando conforme orientação médica. Isso permite que seu corpo se adapte ao medicamento e minimiza possíveis efeitos colaterais.',
      icon: '/images/set_weight.svg',
    },
    {
      question: 'Em quanto tempo verei os resultados?',
      answer: 'A medicação entra em ação desde os primeiros dias, mas é importante entender que quando o processo de emagrecimento é saudável e sustentável, ele leva tempo. A maioria dos pacientes começa a notar resultados significativos entre 8 a 12 semanas.',
      icon: '/images/food.svg',
    },
    {
      question: 'Quais são os efeitos colaterais?',
      answer: 'Qualquer medicamento pode causar efeitos colaterais. Os mais comuns incluem: enjoo, diarreia, constipação e diminuição do apetite. Esses sintomas costumam diminuir com o tempo, conforme o corpo se adapta.',
      icon: '/images/stomach.svg',
    },
    {
      question: 'Como tomar o medicamento?',
      answer: 'O medicamento é aplicado uma vez por semana, sempre no mesmo dia, por injeção subcutânea. Você pode escolher aplicar na barriga, coxa ou parte de trás do braço. A caneta vem pronta para uso com agulha já acoplada.',
      icon: '/images/side_effects.svg',
    },
    {
      question: 'Qual a diferença entre os medicamentos?',
      answer: 'Ozempic® e Wegovy® têm como princípio ativo a semaglutida, enquanto o Mounjaro® usa a tirzepatida, um agonista duplo que age nos receptores GLP-1 e GIP. O Wegovy® é indicado exclusivamente para perda de peso, já o Ozempic® e Mounjaro® são aprovados para tratar diabetes tipo 2.',
      icon: '/images/cancellation.svg',
    },
  ];

  const includedFeatures = [
    'Avaliação com um médico credenciado',
    'Medicação – sempre que prescrita',
    'Suporte clínico via WhatsApp ilimitado',
    'Acompanhamento nutricional',
    'Gestão completa do tratamento',
    'Ebooks e conteúdos exclusivos',
  ];

  const voyRole = [
    'Cuidamos da avaliação e receita médica;',
    'Compramos o medicamento prescrito em farmácias credenciadas;',
    'Você recebe tudo em casa a cada 2 meses;',
    'Acompanhamos sua evolução e damos suporte clínico e nutricional via WhatsApp.',
  ];

  return (
    <div className="flex flex-col pb-28">
      {/* ============================================ */}
      {/* LOGO */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 text-center bg-background">
        <div className="flex flex-col items-center">
          <img
            src="/logo.svg"
            alt="EmagreCENTER"
            className="w-40 h-10"
          />
          <span className="text-[10px] sm:text-xs text-[#5A6754]/70 tracking-[0.2em] font-semibold -mt-0.5">
            SEU OBJETIVO, MAIS RÁPIDO
          </span>
        </div>
      </section>

      {/* ============================================ */}
      {/* HERO - Título Principal Personalizado */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center bg-background">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-heading font-bold text-primary mb-2">
          {answers.primeiroNome || answers.nome?.split(' ')[0] || ''}, seu plano está pronto
        </h1>
        <p className="text-base sm:text-lg text-accent font-medium">
          Seu objetivo está mais perto do que você imagina
        </p>
      </section>

      {/* ============================================ */}
      {/* PLAN CARD - Card do Plano */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-2xl border border-border overflow-hidden" style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}>
          {/* Header do Card - Benefits */}
          <div className="p-4 sm:p-6 border-b border-border">
            <p className="text-xs font-bold text-evergreen uppercase tracking-wider mb-4">
              O QUE ESTÁ INCLUSO NO PLANO
            </p>
            <div className="space-y-3">
              {planBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img src={benefit.icon} alt="" className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-sm sm:text-base text-primary">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferência de Medicação */}
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                  SUA PREFERÊNCIA
                </p>
                <p className="text-lg sm:text-xl font-bold text-primary">
                  {medicationInfo.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {medicationInfo.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 sm:p-6 bg-brown-stone border-b border-border">
            <p className="text-sm text-primary">
              <strong>Esta não é uma prescrição.</strong><br />
              Seu tratamento será definido por um médico credenciado.
            </p>
          </div>

          {/* Pricing */}
          <div className="p-4 sm:p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-accent font-medium mb-1">
                10% off na primeira compra
              </p>
              <div className="mt-2">
                <span className="text-3xl sm:text-4xl font-bold text-primary">
                  {medicationInfo.price}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleCheckout}
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-xl min-h-[56px]"
            >
              Obter meu plano
            </Button>

          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRÓXIMOS PASSOS - Timeline */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-brown-stone">
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2">
          Próximos passos
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          A EmagreCENTER gerencia todas as etapas do seu tratamento: prático e sem burocracia.
        </p>

        <div className="space-y-0">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                    ${step.status === 'completed' ? 'bg-evergreen' : 'bg-white border-2 border-border'}
                  `}
                >
                  {step.status === 'completed' ? (
                    <img src="/images/icons/timeline-check.svg" alt="" className="w-5 h-5" />
                  ) : (
                    <img src={step.icon} alt="" className="w-4 h-4" />
                  )}
                </div>
                {index < nextSteps.length - 1 && (
                  <div className="w-0.5 h-full min-h-[60px] bg-border" />
                )}
              </div>

              {/* Content */}
              <div className="pb-6 flex-1">
                <p className="text-xs font-bold text-evergreen uppercase tracking-wider">
                  {step.step}
                </p>
                <p className="text-sm sm:text-base text-primary mt-1">
                  {step.title}
                </p>
                <span className="inline-block text-xs bg-mint-light text-charcoal px-2 py-1 rounded mt-2">
                  {step.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-3 text-xs text-muted-foreground">
          <p>*Se o médico não indicar um tratamento, <strong>seu pedido é cancelado e o valor é reembolsado.</strong></p>
          <p>Lembrando que a decisão final é sempre médica, para garantir sua segurança. Na EmagreCENTER, não incentivamos a automedicação.</p>
          <p>Vendidos por farmácias credenciadas. A EmagreCENTER faz a gestão da compra e entrega dos medicamentos.</p>
        </div>

        {/* CTA Sticky */}
        <div className="mt-6">
          <Button
            onClick={handleCheckout}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-xl min-h-[56px]"
          >
            Obter meu plano
          </Button>
        </div>
      </section>

      {/* ============================================ */}
      {/* POR QUE ESCOLHER */}
      {/* ============================================ */}
      <section ref={whyChooseRef} className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white">
        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
          SEU PLANO
        </p>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2">
          Por que escolher a EmagreCENTER?
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Com a EmagreCENTER, você tem tudo o que precisa em um só lugar com segurança e conveniência.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {whyChoose.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl border border-border"
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              <img src={item.icon} alt="" className="w-8 h-8 mb-3" />
              <p className="text-sm font-medium text-primary mb-1">
                {item.title}
              </p>
              <span className="text-xs text-evergreen">
                {item.badge}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 text-xs text-evergreen">
          <a href="#" className="hover:underline flex items-center gap-1">
            Referência dos estudos citados
            <ChevronDown className="w-3 h-3" />
          </a>
        </div>

      </section>

      {/* ============================================ */}
      {/* ESTATÍSTICA - Gráfico de Perda de Peso */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-brown-stone">
        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700/70 mb-2">
            COM A EMAGRECENTER VOCÊ PODE MAIS
          </p>

          {/* Gráfico Animado */}
          <div className="my-6">
            <WeightLossChart
              pesoAtual={answers.peso}
              pesoMeta={answers.pesoMeta}
              dataEvento={answers.dataEventoMeta}
              nomeEvento={answers.nomeEventoMeta}
              sexo={answers.sexo}
            />
          </div>

          {/* Texto personalizado baseado nos dados */}
          {(() => {
            const peso = answers.peso || 0;
            const pesoMeta = answers.pesoMeta || 0;
            const metaKg = peso - pesoMeta;
            const nome = answers.primeiroNome || '';
            const isFemale = answers.sexo === 'feminino';
            const dataEvento = answers.dataEventoMeta;

            // Textos emocionais personalizados por gênero
            const emotionalBenefits = isFemale ? [
              'Se olhar no espelho e gostar do que vê',
              'Tirar fotos sem vergonha ou culpa',
              'Usar as roupas que estão no fundo do armário',
              'Se sentir mais atraente e confiante',
              'Receber elogios e se sentir bem com eles',
            ] : [
              'Se olhar no espelho e sentir orgulho',
              'Tirar fotos sem precisar esconder a barriga',
              'Usar roupas que marcam o corpo com confiança',
              'Se sentir mais atraente e desejado',
              'Ter mais disposição e energia no dia a dia',
            ];

            // Se não tem dados suficientes, mostra genérico
            if (!peso || !pesoMeta || metaKg <= 0) {
              return (
                <>
                  <div className="text-5xl sm:text-6xl font-bold text-purple-900 mb-2">6 a 14 KG</div>
                  <p className="text-sm text-purple-900/80 mb-4">
                    Os membros da EmagreCENTER perdem em média 6 a 14kg por mês
                  </p>
                </>
              );
            }

            // Calcular kg realista se tem data de evento
            let kgRealista = metaKg;
            let tempoLabel = '';
            let canAchieveBefore = false;

            if (dataEvento) {
              const hoje = new Date();
              const evento = new Date(dataEvento);
              const diffMeses = (evento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30);
              const mediaPerda = 10; // 10kg/mês como média (entre 6-14)
              const maxPossivel = Math.max(Math.round(diffMeses * mediaPerda), 6);

              // Se o kg desejado é MENOR que o máximo possível, pode atingir ANTES!
              canAchieveBefore = metaKg < maxPossivel;

              kgRealista = Math.min(metaKg, maxPossivel);
              tempoLabel = `até ${evento.toLocaleDateString('pt-BR')}`;
            } else {
              // Sem data definida: calcular tempo estimado baseado na média
              const meses = metaKg / 10; // 10kg/mês média
              const semanas = meses * 4;

              // Se menos de 2 meses, mostra em semanas (parece mais próximo)
              if (meses < 2) {
                const semanasRound = Math.round(semanas);
                tempoLabel = `em ~${semanasRound} semana${semanasRound > 1 ? 's' : ''}`;
              } else {
                const mesesRound = Math.round(meses);
                tempoLabel = `em ~${mesesRound} ${mesesRound === 1 ? 'mês' : 'meses'}`;
              }
            }

            return (
              <>
                <div className="text-5xl sm:text-6xl font-bold text-purple-900 mb-2">
                  -{kgRealista} KG
                </div>
                <p className="text-lg font-bold text-purple-900 mb-1">
                  mais {isFemale ? 'magra' : 'magro'}
                </p>
                {tempoLabel && (
                  <p className="text-sm text-purple-900/80 mb-2">
                    {tempoLabel}
                  </p>
                )}

                {/* Mensagem especial quando pode atingir ANTES da data */}
                {canAchieveBefore && (
                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2 mb-4">
                    <p className="text-sm font-bold text-green-700">
                      🎯 Você pode atingir seu objetivo ANTES da data!
                    </p>
                  </div>
                )}

                {/* Texto emocional - o que isso significa */}
                <div className="mt-6 text-left bg-white/50 rounded-xl p-4">
                  <p className="text-sm font-bold text-purple-900 mb-3">
                    Isso significa:
                  </p>
                  <ul className="space-y-2">
                    {emotionalBenefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-purple-900/80">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-purple-900/60 mt-4">
                  Nossos pacientes perdem em média 6 a 14kg por mês
                </p>
              </>
            );
          })()}
          <p className="text-xs text-purple-900/60">
            ¹Com base em uma análise interna dos resultados de membros.
          </p>
          <p className="text-xs text-purple-900/60">
            Resultados variam individualmente
          </p>
        </div>
      </section>

      {/* ============================================ */}
      {/* VIDEO TESTIMONIALS */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white">
        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2 text-center">
          COM A EMAGRECENTER VOCÊ PODE MAIS
        </p>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-6 text-center">
          Veja como a EmagreCENTER está transformando a vida das pessoas
        </h2>

        <div className="relative rounded-2xl overflow-hidden">
          <img
            src="/images/testimonial-thumbnail.jpg"
            alt="Depoimento"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <Play className="w-8 h-8 text-accent fill-accent ml-1" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleCheckout}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-xl min-h-[56px]"
          >
            Obter meu plano
          </Button>
        </div>
      </section>

      {/* ============================================ */}
      {/* NUTRIÇÃO SOB MEDIDA */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-brown-stone">
        <div className="flex items-center gap-2 mb-2">
          <img src="/images/icon-nutrition.svg" alt="" className="w-4 h-4" />
          <p className="text-xs font-bold text-accent uppercase tracking-wider">
            NUTRIÇÃO SOB MEDIDA
          </p>
        </div>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2">
          Nosso time está sempre por perto para te ajudar
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Te acompanhamos desde a primeira consulta. É só chamar pelo WhatsApp, sem custos adicionais.
        </p>

        <div className="mb-6">
          <picture>
            <source srcSet="/images/nutri-team.avif" type="image/avif" />
            <source srcSet="/images/nutri-team.webp" type="image/webp" />
            <img
              src="/images/nutri-team.png"
              alt="Time de nutricionistas"
              width={250}
              height={100}
              className="w-[250px] h-[100px] object-cover rounded-xl mx-auto"
            />
          </picture>
        </div>

        <div className="flex flex-col items-center gap-1 mb-6">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <img key={star} src="/images/icons/branded_rating_star_full.svg" alt="" className="w-4 h-4" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Nossos nutricionistas são avaliados com <strong>4,98 de 5</strong>
          </span>
        </div>

        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-border"
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              <p className="text-sm text-muted-foreground mb-3">
                "{testimonial.quote}"
              </p>
              <p className="text-sm">
                <strong className="text-primary">{testimonial.name}</strong>
                <span className="text-accent"> - {testimonial.achievement}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* COMO FUNCIONA */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white">
        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
          O PROGRAMA
        </p>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-6">
          Um plano personalizado para emagrecer com saúde
        </h2>

        <div className="space-y-4">
          {howItWorks.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-border flex gap-4"
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              <img src={item.image} alt={item.title} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl" />
              <div className="flex-1">
                <p className="font-bold text-primary">{item.title}</p>
                <span className="inline-block text-xs bg-mint-light text-charcoal px-2 py-1 rounded mt-1 mb-2">
                  {item.badge}
                </span>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Ainda não está pronto e prefere contratar apenas a avaliação médica por enquanto?
          </p>
          <a href="#" className="text-accent font-medium hover:underline">
            Saiba mais
          </a>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-brown-stone">
        <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
          PERGUNTAS FREQUENTES
        </p>
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-1">
          Ainda tem perguntas?
        </h2>
        <p className="text-xl sm:text-2xl font-heading font-bold text-muted-foreground mb-6">
          Temos respostas.
        </p>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-border overflow-hidden"
              style={{ boxShadow: 'rgba(11, 59, 60, 0.05) 0px 2px 4px 0px' }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                {faq.icon && (
                  <img src={faq.icon} alt="" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
                )}
                <span className="flex-1 font-medium text-primary">{faq.question}</span>
                <img
                  src="/images/icons/caret_down.svg"
                  alt=""
                  className={`w-6 h-6 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 pl-[72px] sm:pl-[80px]">
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleCheckout}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base sm:text-lg rounded-xl min-h-[56px]"
          >
            Obter meu plano
          </Button>
        </div>
      </section>

      {/* ============================================ */}
      {/* CONTATO WHATSAPP */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-accent">
        <div className="text-center">
          <img src="/images/consultation_callout_team.png" alt="Time" className="w-24 h-auto mx-auto mb-4 rounded-full" />
          <h3 className="text-xl font-bold text-white mb-2">
            Se ainda tiver dúvidas
          </h3>
          <p className="text-sm text-white/80 mb-6">
            Ainda tem dúvidas? Fale com nosso time e saiba tudo sobre o Seu Plano EmagreCENTER.
          </p>
          <Button
            variant="outline"
            className="w-full max-w-xs mx-auto bg-white text-accent border-0 font-bold py-4 px-8 rounded-full hover:bg-white/90 hover:text-accent min-h-[52px]"
          >
            <img src="/images/icons/whatsapp-green.svg" alt="" className="w-5 h-5 mr-2" />
            Fale com um especialista
          </Button>
        </div>
      </section>

      {/* ============================================ */}
      {/* PAPEL DA EMAGRECENTER + INCLUSO */}
      {/* ============================================ */}
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white">
        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary mb-2">
            Entenda o papel da EmagreCENTER
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            A EmagreCENTER cuida de toda a burocracia para que você possa focar somente no seu tratamento.
          </p>
          <ul className="space-y-2">
            {voyRole.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-primary mb-2">
            Planos com tudo incluso
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            O valor do medicamento prescrito e das entregas estão inclusos no valor do plano.
          </p>
          <p className="text-sm text-accent font-medium">
            Se o tratamento não for indicado para você, devolvemos 100% do seu dinheiro.
          </p>
        </div>

        <div className="bg-brown-stone rounded-2xl p-6">
          <p className="text-xs font-bold text-accent uppercase tracking-wider mb-4 text-center">
            INCLUSO EM TODOS OS PLANOS
          </p>
          <div className="space-y-3">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm text-primary">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA FINAL FIXO */}
      {/* ============================================ */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg z-50 transition-transform duration-300 ease-out ${
          showFixedCta ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-[480px] mx-auto">
          <Button
            onClick={handleCheckout}
            className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-6 text-base rounded-xl min-h-[56px]"
          >
            Obter meu plano
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Um médico credenciado vai avaliar o seu questionário de saúde
          </p>
        </div>
      </div>
    </div>
  );
}
