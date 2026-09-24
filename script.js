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

  /* Painel de alocação simplificado — todos os dados abaixo são fictícios. */
  const opsEditor = popover;
  const opsNameSelect = document.querySelector('#ops-person-name');
  const opsProcessSelect = document.querySelector('#ops-person-process');
  const opsValueInput = document.querySelector('#ops-person-value');
  const opsGoalInput = document.querySelector('#ops-person-goal');

  const opsDemoNames = [
    'Ana Martins', 'Bruno Lima', 'Carla Souza', 'Diego Alves',
    'Evelyn Rocha', 'Felipe Mendes', 'Giovana Silva', 'Henrique Costa',
    'Isabela Santos', 'João Ribeiro', 'Karen Oliveira', 'Lucas Freitas',
    'Mariana Castro', 'Nicolas Gomes', 'Patrícia Melo', 'Rafael Nunes',
    'Sabrina Monteiro', 'Thiago Ramos', 'Vanessa Duarte', 'William Barros',
    'Yasmin Correia', 'Arthur Peixoto', 'Beatriz Campos', 'Caio Teixeira',
    'Daniela Moraes', 'Eduardo Pires', 'Fernanda Lopes', 'Gabriel Tavares',
    'Helena Azevedo', 'Igor Cardoso', 'Juliana Rezende', 'Matheus Farias'
  ];
  const opsDemoProcesses = ['Boxing', 'Conferência', 'Apoio', 'Tratativa IBT'];
  const opsDemoLanes = [
    { id: 'A', label: 'ESTEIRA A' },
    { id: 'B', label: 'ESTEIRA B' },
    { id: 'C', label: 'ESTEIRA C' },
    { id: 'V', label: 'VOLUMOSO' }
  ];

  const opsRandom = seededRandom(516);
  const opsPeople = opsDemoLanes.flatMap((lane, laneIndex) => (
    Array.from({ length: 6 }, (_, positionIndex) => ({
      lane: lane.id,
      laneLabel: lane.label,
      position: `${lane.id}${String(positionIndex + 1).padStart(2, '0')}`,
      name: opsDemoNames[(laneIndex * 6) + positionIndex],
      process: opsDemoProcesses[(laneIndex + positionIndex) % opsDemoProcesses.length],
      production: randomInt(opsRandom, 138, 238),
      goal: 200
    }))
  ));

  const opsIbtCases = [
    { id: 'IBT-2041', type: 'sobra', label: 'Sobra', units: 8, area: 'Esteira A', note: 'Validar origem antes da devolução ao fluxo.' },
    { id: 'IBT-2048', type: 'falta', label: 'Falta', units: 5, area: 'Esteira C', note: 'Recontagem solicitada na posição de origem.' },
    { id: 'IBT-2053', type: 'avaria', label: 'Avaria', units: 3, area: 'Volumoso', note: 'Material separado para avaliação de qualidade.' },
    { id: 'IBT-2060', type: 'sobra', label: 'Sobra', units: 6, area: 'Esteira B', note: 'Conferência cruzada com o lote demonstrativo.' },
    { id: 'IBT-2067', type: 'falta', label: 'Falta', units: 4, area: 'Esteira A', note: 'Diferença em análise com o fluxo anterior.' },
    { id: 'IBT-2074', type: 'avaria', label: 'Avaria', units: 2, area: 'Esteira C', note: 'Aguardando classificação da ocorrência.' },
    { id: 'IBT-2081', type: 'sobra', label: 'Sobra', units: 7, area: 'Volumoso', note: 'Pendência direcionada para tratativa local.' },
    { id: 'IBT-2089', type: 'falta', label: 'Falta', units: 3, area: 'Esteira B', note: 'Busca iniciada em posições correlatas.' }
  ];

  let activeOperatorIndex = 2;

  const getOpsBand = (person) => {
    const rate = person.production / person.goal;
    if (rate >= 1) return 'good';
    if (rate >= 0.8) return 'alert';
    return 'low';
  };

  const getOpsInitials = (name) => name.split(' ').slice(0, 2).map((part) => part[0]).join('');

  const updateOpsKpis = () => {
    const pieces = opsPeople.reduce((sum, person) => sum + person.production, 0);
    const totalGoal = opsPeople.reduce((sum, person) => sum + person.goal, 0);
    const productivity = Math.round((pieces / totalGoal) * 100);
    setText('#ops-kpi-hc', opsPeople.length);
    setText('#ops-kpi-pieces', pieces.toLocaleString('pt-BR'));
    setText('#ops-kpi-productivity', `${productivity}%`);
    setText('#ops-kpi-goal', Math.round(totalGoal / opsPeople.length));
  };

  const renderOpsBoard = () => {
    if (!board) return;
    board.innerHTML = opsDemoLanes.map((lane) => {
      const lanePeople = opsPeople
        .map((person, index) => ({ person, index }))
        .filter(({ person }) => person.lane === lane.id);
      const laneRate = Math.round(
        (lanePeople.reduce((sum, item) => sum + item.person.production, 0) /
        lanePeople.reduce((sum, item) => sum + item.person.goal, 0)) * 100
      );

      return `
        <section class="ops-lane" aria-label="${lane.label}">
          <header><strong>${lane.label}</strong><span>${lanePeople.length} HC · ${laneRate}%</span></header>
          <div class="ops-lane-grid">
            ${lanePeople.map(({ person, index }) => `
              <button
                class="ops-demo-cell${index === activeOperatorIndex ? ' is-selected' : ''}"
                type="button"
                data-index="${index}"
                data-band="${getOpsBand(person)}"
                aria-label="Editar ${person.name}, posição ${person.position}, produção ${person.production}"
              >
                <span class="ops-avatar" aria-hidden="true">${getOpsInitials(person.name)}</span>
                <span class="ops-person-copy"><b>${person.position}</b><strong>${person.name}</strong><small>${person.process}</small></span>
                <span class="ops-person-prod"><b>${person.production}</b><small>/ ${person.goal}</small><i aria-hidden="true"></i></span>
              </button>
            `).join('')}
          </div>
        </section>
      `;
    }).join('');
    updateOpsKpis();
  };

  const populateOpsEditor = () => {
    if (!opsEditor || activeOperatorIndex === null) return;
    const person = opsPeople[activeOperatorIndex];
    const usedNames = new Set(opsPeople.map((item) => item.name));

    setText('#ops-popover-cell', `${person.laneLabel} · ${person.position}`);
    setText('#ops-editor-title', person.name);
    if (opsNameSelect) {
      opsNameSelect.innerHTML = opsDemoNames.map((name) => (
        `<option value="${name}"${name === person.name ? ' selected' : ''}${usedNames.has(name) && name !== person.name ? ' disabled' : ''}>${name}</option>`
      )).join('');
    }
    if (opsProcessSelect) {
      opsProcessSelect.innerHTML = opsDemoProcesses.map((process) => (
        `<option value="${process}"${process === person.process ? ' selected' : ''}>${process}</option>`
      )).join('');
    }
    if (opsValueInput) opsValueInput.value = person.production;
    if (opsGoalInput) opsGoalInput.value = person.goal;

    const percent = Math.min(130, Math.round((person.production / person.goal) * 100));
    const bar = document.querySelector('#ops-popover-bar');
    if (bar) bar.style.width = `${Math.min(100, percent)}%`;
    setText('#ops-popover-percent', `${percent}% da meta`);
    setText('#ops-save-status', '');
    opsEditor.hidden = false;
  };

  const selectOpsOperator = (index) => {
    activeOperatorIndex = index;
    renderOpsBoard();
    populateOpsEditor();
  };

  const renderOpsIbt = (filter = 'todos') => {
    const list = document.querySelector('#ops-ibt-list');
    const totals = opsIbtCases.reduce((summary, item) => {
      summary.total += item.units;
      summary[item.type] += item.units;
      return summary;
    }, { total: 0, sobra: 0, avaria: 0, falta: 0 });
    setText('#ops-ibt-total', totals.total);
    setText('#ops-ibt-sobra', totals.sobra);
    setText('#ops-ibt-avaria', totals.avaria);
    setText('#ops-ibt-falta', totals.falta);

    if (!list) return;
    const visibleCases = filter === 'todos' ? opsIbtCases : opsIbtCases.filter((item) => item.type === filter);
    list.innerHTML = visibleCases.map((item) => `
      <article data-type="${item.type}">
        <span class="ops-ibt-type">${item.label}</span>
        <div><strong>${item.id}</strong><small>${item.area} · caso fictício</small></div>
        <b>${item.units} un.</b>
        <p>${item.note}</p>
      </article>
    `).join('');
  };

  renderOpsBoard();
  populateOpsEditor();
  renderOpsIbt();

  board?.addEventListener('click', (event) => {
    const cell = event.target.closest('.ops-demo-cell');
    if (!cell) return;
    selectOpsOperator(Number(cell.dataset.index));
    window.portfolioTrack?.('ops_demo_person_edit');
  });

  opsEditor?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (activeOperatorIndex === null) return;
    const person = opsPeople[activeOperatorIndex];
    person.name = opsNameSelect?.value || person.name;
    person.process = opsProcessSelect?.value || person.process;
    person.production = Math.max(0, Math.min(500, Number(opsValueInput?.value || 0)));
    person.goal = Math.max(1, Math.min(500, Number(opsGoalInput?.value || 200)));
    renderOpsBoard();
    populateOpsEditor();
    setText('#ops-save-status', 'Atualizado somente nesta simulação ✓');
    window.portfolioTrack?.('ops_demo_person_update');
  });

  popoverClose?.addEventListener('click', () => {
    activeOperatorIndex = null;
    opsEditor.hidden = true;
    renderOpsBoard();
  });

  document.querySelector('#ops-ibt-filters')?.addEventListener('click', (event) => {
    const filterButton = event.target.closest('button[data-filter]');
    if (!filterButton) return;
    document.querySelectorAll('#ops-ibt-filters button').forEach((button) => {
      button.classList.toggle('is-active', button === filterButton);
    });
    renderOpsIbt(filterButton.dataset.filter);
    window.portfolioTrack?.('ops_demo_ibt_filter');
  });
})();
