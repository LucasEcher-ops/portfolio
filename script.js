(() => {
  const root = document.documentElement;
  const revealItems = document.querySelectorAll('.reveal');
  const year = document.querySelector('#current-year');
  const stage = document.querySelector('.hero-stage');
  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty('--scroll-progress', Math.min(Math.max(progress, 0), 1).toFixed(4));
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  if ('IntersectionObserver' in window && motionAllowed) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (stage && motionAllowed && window.matchMedia('(pointer: fine)').matches) {
    const depthItems = stage.querySelectorAll('[data-depth]');

    stage.addEventListener('pointermove', (event) => {
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;

      depthItems.forEach((item) => {
        const depth = Number(item.dataset.depth || 1);
        const rotate = item.classList.contains('float-card-product') ? 2.5
          : item.classList.contains('float-card-scale') ? 4
          : item.classList.contains('float-card-data') ? -3
          : -2;
        const baseX = item.classList.contains('portrait-card') ? '-50%' : '0px';
        item.style.transform = `translateX(${baseX}) translate(${x * 18 * depth}px, ${y * 14 * depth}px) rotate(${rotate + x * depth}deg)`;
      });
    });

    stage.addEventListener('pointerleave', () => {
      depthItems.forEach((item) => item.style.removeProperty('transform'));
    });
  }

  /* =======================================================
     MINI PROBLEM SOLVER — DEMONSTRAÇÃO PÚBLICA
     Todos os dados abaixo são sintéticos e gerados localmente.
     ======================================================= */

  const form = document.querySelector('#mini-ps-form');
  const input = document.querySelector('#mini-ps-input');
  const physicalLocations = document.querySelector('#ps-physical-locations');
  const virtualLocations = document.querySelector('#ps-virtual-locations');
  const botWindow = document.querySelector('.bot-window-live');

  const productNames = [
    'Kit Casa & Organização',
    'Fone Bluetooth Compacto',
    'Garrafa Térmica 1L',
    'Organizador Modular',
    'Luminária LED',
    'Jogo de Toalhas',
    'Cabo USB-C Reforçado',
    'Kit Cozinha Essencial',
    'Mochila Casual',
    'Caixa Organizadora',
    'Suporte Ajustável',
    'Kit Higiene Pessoal'
  ];

  const virtualPositions = [
    ['AV', 'Posição virtual (LOST / UNSELLABLE; não é estoque disponível)'],
    ['RT', 'Rack Transfer / movimentação'],
    ['TS', 'Trânsito / transferência em curso'],
    ['OS', 'Posição transitória / fluxo de saída'],
    ['IBT', 'Tratativa de inbound'],
    ['QA', 'Qualidade / análise de exceção']
  ];

  const hashSeed = (value) => {
    const text = String(value || Date.now());
    let hash = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  };

  const seededRandom = (seed) => {
    let state = seed >>> 0;

    return () => {
      state += 0x6D2B79F5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  };

  const randomInt = (random, min, max) =>
    Math.floor(random() * (max - min + 1)) + min;

  const pick = (random, list) =>
    list[Math.floor(random() * list.length)];

  const createPhysicalLocation = (random) => {
    const mz = randomInt(random, 0, 3);
    const aisle = String(randomInt(random, 1, 99)).padStart(2, '0');
    const position = String(randomInt(random, 1, 99)).padStart(2, '0');
    return `MZ${mz}-${aisle}-${position}`;
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const renderProblemSolverCase = (rawValue) => {
    if (!physicalLocations || !virtualLocations) return;

    const fallback = String(Date.now());
    const source = String(rawValue || fallback).trim() || fallback;
    const seed = hashSeed(source);
    const random = seededRandom(seed);

    const received = randomInt(random, 84, 430);
    const boxingPending = randomInt(
      random,
      0,
      Math.min(28, Math.max(4, Math.floor(received * 0.14)))
    );
    const boxing = received - boxingPending;

    const storedPending = randomInt(
      random,
      0,
      Math.min(24, Math.max(4, Math.floor(boxing * 0.12)))
    );
    const stored = Math.max(0, boxing - storedPending);

    const minPhysical = Math.min(storedPending, 2);
    const maxPhysical = Math.max(storedPending + randomInt(random, 0, 6), 6);
    const physical = randomInt(random, minPhysical, maxPhysical);

    setText('#ps-product-name', pick(random, productNames));
    setText('#ps-case-id', `SKU DEMO-${String(seed).slice(-7)}`);
    setText('#ps-received', received.toLocaleString('pt-BR'));
    setText('#ps-boxing', boxing.toLocaleString('pt-BR'));
    setText('#ps-stored', stored.toLocaleString('pt-BR'));
    setText('#ps-physical', physical.toLocaleString('pt-BR'));

    const locationCount = randomInt(random, 2, 5);
    const uniqueLocations = new Set();

    while (uniqueLocations.size < locationCount) {
      uniqueLocations.add(createPhysicalLocation(random));
    }

    physicalLocations.innerHTML = [...uniqueLocations]
      .map((location) => `<span>${location}</span>`)
      .join('');

    const virtualCount = randomInt(random, 1, 3);
    const shuffledVirtuals = [...virtualPositions]
      .map((entry) => ({ entry, score: random() }))
      .sort((a, b) => a.score - b.score)
      .slice(0, virtualCount)
      .map(({ entry }) => entry);

    virtualLocations.innerHTML = shuffledVirtuals
      .map(([code, description]) => `<span><b>${code}</b> ${description}</span>`)
      .join('');

    let decision =
      'Fluxo equilibrado. O caso não apresenta diferença relevante para direcionamento.';

    if (boxingPending > 0 && storedPending > 0) {
      decision =
        `Há ${boxingPending} un. pendentes de Boxing e ${storedPending} un. pendentes de armazenagem. ` +
        'O caso pede validação em duas etapas antes de qualquer decisão.';
    } else if (boxingPending > 0) {
      decision =
        `Há ${boxingPending} un. pendentes de Boxing. ` +
        'A prioridade é concluir essa etapa antes de classificar o físico como excedente.';
    } else if (storedPending > 0) {
      decision =
        `Há ${storedPending} un. pendentes de armazenagem. ` +
        'Validar as posições e direcionar o físico restante.';
    }

    setText('#ps-decision strong', decision);
  };

  if (form && input) {
    renderProblemSolverCase('102938');

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (botWindow) botWindow.classList.add('is-running');

      window.setTimeout(() => {
        renderProblemSolverCase(input.value);
        window.portfolioTrack?.('ps_demo_run');
        if (botWindow) botWindow.classList.remove('is-running');
      }, motionAllowed ? 220 : 0);
    });
  }

  /* =======================================================
     PAINEL OPERACIONAL — DEMONSTRAÇÃO PÚBLICA
     ======================================================= */

  const board = document.querySelector('#ops-demo-board');
  const popover = document.querySelector('#ops-demo-popover');
  const popoverClose = document.querySelector('#ops-popover-close');

  const demoNames = [
    'Ana Martins',
    'Bruno Lima',
    'Carla Souza',
    'Diego Alves',
    'Evelyn Rocha',
    'Felipe Mendes',
    'Giovana Silva',
    'Henrique Costa',
    'Isabela Santos',
    'João Ribeiro',
    'Karen Oliveira',
    'Mariana Castro',
    'Nicolas Gomes',
    'Patrícia Melo',
    'Rafael Nunes'
  ];

  const demoProcesses = [
    'Recebimento',
    'Boxing',
    'Armazenagem',
    'Conferência',
    'Tratativa'
  ];

  const cells = [
    'R01', 'R02', 'R03', 'R04', 'R05',
    'B01', 'B02', 'B03', 'B04', 'B05',
    'A01', 'A02', 'A03', 'A04', 'A05'
  ];

  const buildBoard = () => {
    if (!board) return;

    const random = seededRandom(2300);

    board.innerHTML = cells.map((cell, index) => {
      const production = randomInt(random, 1420, 2288);
      const percent = production / 2300;
      const band = percent >= 0.9 ? 'good' : percent >= 0.78 ? 'alert' : 'normal';

      return `
        <button
          class="ops-demo-cell"
          type="button"
          data-cell="${cell}"
          data-value="${production}"
          data-index="${index}"
          data-band="${band}"
          aria-label="${cell}, produção demonstrativa ${production}"
        >
          <span>${cell}</span>
          <strong>${production.toLocaleString('pt-BR')}</strong>
          <i aria-hidden="true"></i>
        </button>
      `;
    }).join('');
  };

  const showOperator = (cellElement) => {
    if (!popover || !cellElement) return;

    board?.querySelectorAll('.ops-demo-cell').forEach((cell) => {
      cell.classList.toggle('is-selected', cell === cellElement);
    });

    const cell = cellElement.dataset.cell || 'CÉLULA';
    const production = Number(cellElement.dataset.value || 0);
    const index = Number(cellElement.dataset.index || 0);

    const random = seededRandom(hashSeed(`${cell}:${production}:${index}`));
    const name = pick(random, demoNames);
    const process = pick(random, demoProcesses);
    const percent = Math.min(99, Math.round((production / 2300) * 100));

    setText('#ops-popover-cell', cell);
    setText('#ops-popover-name', name);
    setText('#ops-popover-role', process);
    setText('#ops-popover-value', production.toLocaleString('pt-BR'));
    setText('#ops-popover-percent', `${percent}%`);

    const bar = document.querySelector('#ops-popover-bar');
    if (bar) bar.style.width = `${percent}%`;

    popover.hidden = false;
  };

  buildBoard();

  if (board) {
    board.addEventListener('click', (event) => {
      const cell = event.target.closest('.ops-demo-cell');
      if (!cell) return;
      showOperator(cell);
      window.portfolioTrack?.('ops_demo_cell_view');
    });

    const initialCell = board.querySelector('.ops-demo-cell:nth-child(3)');
    if (initialCell) showOperator(initialCell);
  }

  if (popoverClose && popover) {
    popoverClose.addEventListener('click', () => {
      popover.hidden = true;
      board?.querySelectorAll('.ops-demo-cell').forEach((cell) => {
        cell.classList.remove('is-selected');
      });
    });
  }
})();
