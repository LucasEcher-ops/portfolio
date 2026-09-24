(() => {
  'use strict';
  // Insira aqui, após criar sua própria propriedade GA4, o ID de medição G-XXXXXXXXXX.
  // Sem ID válido, nada é carregado ou enviado a terceiros.
  const measurementId = '';
  const validId = /^G-[A-Z0-9]{6,16}$/.test(measurementId);
  const key = 'lucas_portfolio_analytics_choice_v1';
  let enabled = false;
  window.portfolioTrack = () => {}; // sem dados de consultas, nomes, IDs, células ou usuários
  if (!validId) return;

  const loadAnalytics = () => {
    if (enabled) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    const permittedEvents = new Set(['ps_demo_run', 'ops_demo_cell_view']);
    window.portfolioTrack = (eventName) => {
      if (enabled && permittedEvents.has(eventName)) window.gtag('event', eventName);
    };
  };

  const choice = document.createElement('div');
  choice.className = 'privacy-choice';
  choice.setAttribute('role', 'dialog');
  choice.setAttribute('aria-label', 'Preferências de análise do portfólio');
  choice.innerHTML = '<strong>Privacidade no portfólio</strong><p>Com sua autorização, usamos o Google Analytics para medir visitas e cliques nas demonstrações. Nenhum número digitado no simulador é enviado por este código. Você pode recusar e alterar sua escolha depois.</p><button type="button" data-choice="yes">Aceitar análise</button><button type="button" data-choice="no">Recusar</button>';
  choice.hidden = true;
  document.body.appendChild(choice);
  choice.querySelectorAll('[data-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const answer = button.dataset.choice;
      try { localStorage.setItem(key, answer); } catch { /* armazenamento bloqueado */ }
      choice.hidden = true;
      if (answer === 'yes') loadAnalytics();
      else if (enabled) window.location.reload(); // impedir continuidade de coleta após retirada de consentimento
    });
  });
  const foot = document.querySelector('.site-footer');
  if (foot) {
    const reopen = document.createElement('button');
    reopen.type = 'button';
    reopen.className = 'privacy-open';
    reopen.textContent = 'Preferências de privacidade';
    reopen.addEventListener('click', () => { choice.hidden = false; choice.querySelector('button')?.focus(); });
    foot.appendChild(reopen);
  }
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'yes') loadAnalytics();
    else if (saved !== 'no') choice.hidden = false;
  } catch {
    choice.hidden = false;
  }
})();
