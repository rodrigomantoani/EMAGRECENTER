'use client';

import { useEffect, useState } from 'react';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{question}</span>
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
          <i className={`ri-arrow-down-s-line text-lg text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToCheckout = () => {
    window.location.href = 'https://helixonlabs.shop/checkout-quiz?product=tirzepatida-60mg';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Logo Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-500 rounded-md flex items-center justify-center">
              <i className="ri-capsule-fill text-base text-white"></i>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              HELIXON
            </span>
          </div>
          <a
            href="https://helixonlabs.shop/checkout-quiz?product=tirzepatida-60mg"
            className={`text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap cursor-pointer ${
              isScrolled
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-white/90 text-teal-600 hover:bg-white'
            }`}
          >
            Comprar agora
          </a>
        </div>
      </div>

      {/* HERO Section */}
      <section className="relative min-h-screen md:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center px-4 pt-20 md:pt-24 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-gray-50"></div>
        <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-teal-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 md:w-80 md:h-80 bg-teal-50/50 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center md:text-left w-full order-2 md:order-1 md:py-8">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.15] mb-5 md:mb-6">
                Controle seu apetite e emagreça com{' '}
                <span className="text-teal-500">HELIXON</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Tirzepatida 60mg para saciedade prolongada e controle do apetite por até 12 semanas.
              </p>

              {/* Price Block */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">R$ 1.799</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 px-4 md:px-0">12 semanas de tratamento (5mg/semana) • Envio liofilizado • Frete grátis</p>
              </div>

              <a
                href="https://helixonlabs.shop/checkout-quiz?product=tirzepatida-60mg"
                className="inline-block w-full max-w-xs md:w-auto bg-teal-500 hover:bg-teal-600 text-white text-base md:text-lg font-bold px-8 md:px-12 py-4 md:py-5 rounded-full shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
              >
                Comprar agora
              </a>

              {/* Micro Benefits */}
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 md:gap-5 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <i className="ri-shield-check-line text-teal-500 text-base"></i>
                  <span>Alta pureza</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-flask-line text-teal-500 text-base"></i>
                  <span>Envio liofilizado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="ri-truck-line text-teal-500 text-base"></i>
                  <span>Frete grátis</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-wrap justify-center md:justify-start gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
                      <i className="ri-lock-line text-green-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Compra Segura</p>
                      <p className="text-[10px] text-gray-400">SSL 256-bit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-teal-100 rounded-full flex-shrink-0">
                      <i className="ri-bank-card-line text-teal-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Pagamento Protegido</p>
                      <p className="text-[10px] text-gray-400">Dados criptografados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full flex-shrink-0">
                      <i className="ri-medal-line text-amber-600 text-sm"></i>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Qualidade Garantida</p>
                      <p className="text-[10px] text-gray-400">Alta pureza</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Product Image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end w-full">
              <div className="relative w-[240px] h-[290px] sm:w-[280px] sm:h-[340px] md:w-[400px] md:h-[470px] lg:w-[450px] lg:h-[530px]">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 to-transparent rounded-3xl"></div>
                <img
                  src="https://readdy.ai/api/search-image?query=professional%20woman%20holding%20turquoise%20HELIXON%20branded%20pharmaceutical%20product%20box%2C%20smiling%20confidently%2C%20modern%20clean%20background%2C%20natural%20lighting%2C%20health%20and%20wellness%20lifestyle%20photography%2C%20premium%20product%20presentation%2C%20authentic%20real%20person%20holding%20medicine%20box%2C%20commercial%20advertising%20style%2C%20high%20quality%20ecommerce%20photo&width=450&height=530&seq=helixon-woman-holding-box-v1&orientation=portrait"
                  alt="HELIXON Tirzepatida 60mg - Mulher segurando a caixa do produto"
                  title="HELIXON Tirzepatida 60mg produto premium"
                  className="relative z-10 w-full h-full object-contain object-center rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA Section */}
      <section className="py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-8 md:mb-10">
            <a href="#como-funciona" id="como-funciona" className="text-gray-900 no-underline">
              Como funciona?
            </a>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg md:text-xl font-bold text-white">1</span>
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium">Reduz o apetite</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg md:text-xl font-bold text-white">2</span>
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium">Aumenta a saciedade</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg md:text-xl font-bold text-white">3</span>
              </div>
              <p className="text-sm md:text-base text-gray-700 font-medium">Otimiza o metabolismo</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
            <a href="#faq" id="faq" className="text-gray-900 no-underline">
              Perguntas Frequentes
            </a>
          </h2>

          <div className="space-y-3">
            <FaqItem
              question="Quanto tempo leva para ver resultados?"
              answer="A maioria dos usuarios comeca a notar reducao do apetite ja na primeira semana. Resultados visiveis de perda de peso geralmente aparecem entre 2 a 4 semanas de uso consistente."
            />
            <FaqItem
              question="Como e feito o envio?"
              answer="O produto e enviado na forma liofilizada (po), que garante maior estabilidade e durabilidade. O frete e gratis para todo o Brasil e o envio e discreto."
            />
            <FaqItem
              question="Qual a dosagem recomendada?"
              answer="O kit inclui 60mg de Tirzepatida para 12 semanas de tratamento, com dosagem de 5mg por semana. Instrucoes detalhadas de preparo e aplicacao acompanham o produto."
            />
            <FaqItem
              question="O produto e seguro?"
              answer="HELIXON e produzido com alta pureza e passa por rigoroso controle de qualidade. Recomendamos sempre consultar um profissional de saude antes de iniciar qualquer tratamento."
            />
            <FaqItem
              question="Posso parcelar o pagamento?"
              answer="Sim! Oferecemos opcoes de parcelamento no cartao de credito. Confira as condicoes disponiveis no checkout."
            />
            <FaqItem
              question="Qual o prazo de entrega?"
              answer="O prazo varia de acordo com sua regiao, geralmente entre 5 a 15 dias uteis. Voce recebera o codigo de rastreamento assim que o pedido for despachado."
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Comece agora com HELIXON
          </h2>
          <p className="text-sm md:text-base text-teal-100 mb-2">Tirzepatida 60mg • 12 semanas</p>
          <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">R$ 1.799</p>
          <a
            href="https://helixonlabs.shop/checkout-quiz?product=tirzepatida-60mg"
            className="inline-block w-full max-w-sm md:w-auto bg-white hover:bg-gray-50 text-teal-600 text-base md:text-lg font-bold px-10 md:px-12 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer"
          >
            Comprar agora
          </a>
          <p className="text-xs md:text-sm text-teal-200 mt-4">Frete grátis • Envio discreto • Alta pureza</p>
        </div>
      </section>

      {/* DISCLAIMER Footer */}
      <footer className="bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded-md flex items-center justify-center">
                <i className="ri-capsule-fill text-sm text-white"></i>
              </div>
              <span className="text-base font-bold text-gray-900">
                HELIXON
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            <p>&copy; 2025 HELIXON. Todos os direitos reservados.</p>
            <p className="mt-2">
              <a
                href="https://readdy.ai/?ref=logo"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="text-teal-500 hover:text-teal-600 cursor-pointer"
              >
                Powered by Readdy
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Mobile */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          showSticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-500">HELIXON 60mg</p>
              <p className="text-lg font-extrabold text-gray-900">R$ 1.799</p>
            </div>
            <a
              href="https://helixonlabs.shop/checkout-quiz?product=tirzepatida-60mg"
              className="bg-teal-500 hover:bg-teal-600 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg whitespace-nowrap cursor-pointer"
            >
              Comprar agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
