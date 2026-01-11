'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface WeightLossChartProps {
  pesoAtual?: number;
  pesoMeta?: number;
  dataEvento?: string;
  nomeEvento?: string;
  sexo?: 'masculino' | 'feminino';
}

export function WeightLossChart({
  pesoAtual,
  pesoMeta,
  dataEvento,
  nomeEvento,
  sexo,
}: WeightLossChartProps) {
  const chartRef = useRef<SVGSVGElement>(null);
  const mainTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const pulseTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Calcular dias até o evento
  const getDaysUntilEvent = () => {
    if (!dataEvento) return null;
    const today = new Date();
    const eventDate = new Date(dataEvento);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Formatar data do evento
  const formatEventDate = () => {
    if (!dataEvento) return null;
    const date = new Date(dataEvento);
    const day = date.getDate();
    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const daysUntilEvent = getDaysUntilEvent();
  const eventDateLabel = formatEventDate();
  const isFemale = sexo === 'feminino';

  // Calcular perda realista baseada no tempo disponível
  // Média: 10kg/mês (entre 6-14kg)
  const kgDesejado = pesoAtual && pesoMeta ? pesoAtual - pesoMeta : null;

  const calcResults = () => {
    if (!kgDesejado || kgDesejado <= 0) return { kgRealista: null, canAchieveBefore: false };
    if (!daysUntilEvent) return { kgRealista: kgDesejado, canAchieveBefore: false };

    const meses = daysUntilEvent / 30;
    const maxPossivel = Math.round(meses * 10); // 10kg/mês média

    // Se o kg desejado é MENOR que o máximo possível, pode atingir ANTES da data!
    const canAchieveBefore = kgDesejado < maxPossivel;

    // Retorna o menor entre o desejado e o possível
    const kgRealista = Math.min(kgDesejado, Math.max(maxPossivel, 6)); // Mínimo 6kg

    return { kgRealista, canAchieveBefore };
  };

  const { kgRealista, canAchieveBefore } = calcResults();

  // Calcular tempo estimado quando não tem data definida
  // Baseado na média de 10kg/mês
  const getEstimatedTimeLabel = () => {
    if (!kgDesejado || kgDesejado <= 0) return { main: 'DIA 30', sub: '' };

    const meses = kgDesejado / 10; // 10kg/mês média
    const semanas = meses * 4;

    // Se menos de 2 meses, mostra em semanas (parece mais próximo)
    if (meses < 2) {
      const semanasRound = Math.round(semanas);
      return {
        main: `~${semanasRound} SEMANA${semanasRound > 1 ? 'S' : ''}`,
        sub: 'TEMPO ESTIMADO'
      };
    }

    // Se 2+ meses, mostra em meses
    const mesesRound = Math.round(meses);
    return {
      main: `~${mesesRound} ${mesesRound === 1 ? 'MÊS' : 'MESES'}`,
      sub: 'TEMPO ESTIMADO'
    };
  };

  const estimatedTime = getEstimatedTimeLabel();

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = chartRef.current;
    const mainLine = svg.querySelector('.main-line') as SVGPathElement;
    const areaFill = svg.querySelector('.area-fill') as SVGPathElement;
    const weekPoints = svg.querySelectorAll('.week-point');
    const weekLabels = svg.querySelectorAll('.week-label');
    const todayLabel = svg.querySelector('.today-label');
    const afterLabel = svg.querySelector('.after-label');
    const pulseRing = svg.querySelector('.pulse-ring');
    const brandText = svg.querySelector('.brand-text');

    if (!mainLine) return;

    // Get path length for animation
    const pathLength = mainLine.getTotalLength();

    // Initial states
    gsap.set(mainLine, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(areaFill, { opacity: 0 });
    gsap.set(weekPoints, { opacity: 0, scale: 0 });
    gsap.set(weekLabels, { opacity: 0 });
    gsap.set(todayLabel, { opacity: 0 });
    gsap.set(afterLabel, { opacity: 0 });
    gsap.set(pulseRing, { opacity: 0 });
    gsap.set(brandText, { opacity: 0 });

    // Pulse animation function - usando attr: { r } conforme Divine Flow
    function startPulseAnimation() {
      if (!pulseRing) return;
      pulseTimelineRef.current = gsap.timeline({ repeat: -1 });
      pulseTimelineRef.current.fromTo(
        pulseRing,
        { opacity: 0.5, attr: { r: 14 } },
        { opacity: 0, attr: { r: 40 }, duration: 1.5, ease: 'power1.out' }
      );
    }

    // Main animation timeline
    mainTimelineRef.current = gsap.timeline({ delay: 0.3 });

    mainTimelineRef.current
      // Brand text appears
      .to(brandText, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      // Week labels appear
      .to(weekLabels, { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
      // Line draws
      .to(mainLine, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, '-=0.2')
      // Area fills
      .to(areaFill, { opacity: 1, duration: 1, ease: 'power1.inOut' }, '-=1.2')
      // Week points appear in sequence
      .to(weekPoints, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.8')
      // Today label
      .to(todayLabel, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      // After label
      .to(afterLabel, { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.2')
      // Start pulse
      .call(() => startPulseAnimation());

    return () => {
      mainTimelineRef.current?.kill();
      pulseTimelineRef.current?.kill();
    };
  }, []);

  return (
    <div className="w-full">
      <svg
        ref={chartRef}
        viewBox="0 -40 420 360"
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradiente da linha: Vermelho → Laranja → Amarelo → Verde (descendente) */}
          <linearGradient id="lineGradWeight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E85D54" />
            <stop offset="33%" stopColor="#F5A623" />
            <stop offset="66%" stopColor="#F5C623" />
            <stop offset="100%" stopColor="#7CB342" />
          </linearGradient>

          {/* Gradiente da área */}
          <linearGradient id="areaGradWeight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E85D54" stopOpacity="0.3" />
            <stop offset="33%" stopColor="#F5A623" stopOpacity="0.25" />
            <stop offset="66%" stopColor="#F5C623" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7CB342" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Brand text - EMAGRECENTER como marca d'água sutil */}
        <g className="brand-text">
          <text
            x="210"
            y="150"
            textAnchor="middle"
            style={{
              fontSize: '28px',
              fill: '#7CB342',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              opacity: 0.08,
              letterSpacing: '0.15em',
            }}
          >
            EMAGRECENTER
          </text>
        </g>

        {/* Eixo Y - Linha vertical pontilhada com seta */}
        <line x1="40" y1="250" x2="40" y2="40" stroke="#BDBDBD" strokeWidth="1.5" strokeDasharray="4,4" />
        <polygon points="40,35 36,45 44,45" fill="#BDBDBD" />

        {/* Eixo X - Linha horizontal pontilhada com seta */}
        <line x1="40" y1="250" x2="390" y2="250" stroke="#BDBDBD" strokeWidth="1.5" strokeDasharray="4,4" />
        <polygon points="395,250 385,246 385,254" fill="#BDBDBD" />

        {/* Eixo Y - Label vertical */}
        <text
          x="12"
          y="150"
          textAnchor="middle"
          transform="rotate(-90, 12, 150)"
          style={{
            fontSize: '10px',
            fill: '#9E9E9E',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          SEU PESO
        </text>

        {/* Eixo X - Label horizontal - só mostra quando NÃO tem data específica */}
        {!dataEvento && (
          <text
            x="370"
            y="265"
            textAnchor="middle"
            style={{
              fontSize: '10px',
              fill: '#9E9E9E',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            TEMPO
          </text>
        )}

        {/* Linhas horizontais pontilhadas de referência */}
        <line x1="40" y1="50" x2="380" y2="50" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="40" y1="100" x2="380" y2="100" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="40" y1="150" x2="380" y2="150" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="40" y1="200" x2="380" y2="200" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="40" y1="250" x2="380" y2="250" stroke="#E8E8E8" strokeWidth="1" strokeDasharray="4,4" />

        {/* Área preenchida - curva S DESCENDO (de cima pra baixo) */}
        <path
          className="area-fill"
          d="M 60 50
             C 90 50, 110 55, 130 70
             C 160 95, 180 130, 210 170
             C 240 210, 280 230, 360 230
             L 360 250 L 60 250 Z"
          fill="url(#areaGradWeight)"
        />

        {/* Main line - curva S DESCENDO */}
        <path
          className="main-line"
          d="M 60 50
             C 90 50, 110 55, 130 70
             C 160 95, 180 130, 210 170
             C 240 210, 280 230, 360 230"
          fill="none"
          stroke="url(#lineGradWeight)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Pontos */}
        {/* DIA 1 - Vermelho (HOJE) - em cima */}
        <g className="week-point" style={{ transformOrigin: '60px 50px' }}>
          <circle cx="60" cy="50" r="14" fill="#E85D54" fillOpacity="0.3" />
          <circle cx="60" cy="50" r="8" fill="#E85D54" />
        </g>

        {/* DIA 30 - Verde (META) - embaixo com pulse */}
        <g className="week-point" style={{ transformOrigin: '360px 230px' }}>
          <circle className="pulse-ring" cx="360" cy="230" r="14" fill="#7CB342" />
          <circle cx="360" cy="230" r="14" fill="#7CB342" fillOpacity="0.3" />
          <circle cx="360" cy="230" r="8" fill="#7CB342" />
        </g>

        {/* Labels dos dias (embaixo) */}
        <text x="60" y="275" textAnchor="middle" className="week-label" style={{ fontSize: '10px', fill: '#9E9E9E', fontWeight: 600 }}>HOJE</text>
        {dataEvento && eventDateLabel ? (
          <>
            <text x="360" y="285" textAnchor="middle" className="week-label" style={{ fontSize: '12px', fill: '#7CB342', fontWeight: 700 }}>{eventDateLabel}</text>
            <text x="360" y="300" textAnchor="middle" className="week-label" style={{ fontSize: '9px', fill: '#9E9E9E', fontWeight: 600 }}>SEU OBJETIVO</text>
          </>
        ) : (
          <>
            <text x="360" y="285" textAnchor="middle" className="week-label" style={{ fontSize: '11px', fill: '#7CB342', fontWeight: 700 }}>{estimatedTime.main}</text>
            {estimatedTime.sub && (
              <text x="360" y="300" textAnchor="middle" className="week-label" style={{ fontSize: '9px', fill: '#9E9E9E', fontWeight: 600 }}>{estimatedTime.sub}</text>
            )}
          </>
        )}

        {/* Label HOJE (speech bubble vermelho) - em cima do ponto */}
        <g className="today-label">
          <path
            d="M 25,-10
               Q 21,-10 21,-6
               L 21,16
               Q 21,20 25,20
               L 49,20
               L 60,30
               L 71,20
               L 95,20
               Q 99,20 99,16
               L 99,-6
               Q 99,-10 95,-10
               Z"
            fill="#E85D54"
          />
          <text x="60" y="9" textAnchor="middle" style={{ fontSize: '12px', fill: 'white', fontWeight: 600 }}>Hoje</text>
        </g>

        {/* Label kg (speech bubble verde) - dentro do gráfico, acima do ponto */}
        <g className="after-label">
          {/* Retângulo do badge - maior para caber o texto */}
          <rect x="290" y="165" width="140" height="45" rx="6" fill="#7CB342" />
          {/* Seta apontando para baixo */}
          <polygon points="350,210 360,222 370,210" fill="#7CB342" />
          <text x="360" y="183" textAnchor="middle" style={{ fontSize: '15px', fill: 'white', fontWeight: 700 }}>
            {kgRealista && kgRealista > 0 ? `-${kgRealista}kg` : '6 a 14kg'}
          </text>
          <text x="360" y="200" textAnchor="middle" style={{ fontSize: '11px', fill: 'white', fontWeight: 500, opacity: 0.9 }}>
            {kgRealista ? `mais ${isFemale ? 'magra' : 'magro'}` : 'por mês'}
          </text>
        </g>
      </svg>
    </div>
  );
}
