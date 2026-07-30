const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DB = 'chispa-db';
const STORE = 'state';
const FX = { rate: 17.3973, date: '2026-07-25', source: 'Banco de México FIX' };

const markets = [
  ['amzmx', 'Amazon México'],
  ['ml', 'Mercado Libre México'],
  ['amzus', 'Amazon USA'],
  ['temu', 'Temu'],
  ['homedepot', 'Home Depot MX'],
  ['costco', 'Costco MX'],
  ['walmart', 'Walmart MX'],
  ['web', 'Google Web']
];

const categories = [
  ['groceries', 'Supermercado y comida', 'Groceries & food'],
  ['personal', 'Personal', 'Personal'],
  ['household', 'Hogar y limpieza', 'Household & cleaning'],
  ['pets', 'Mascotas', 'Pets'],
  ['kids', 'Niños y familia', 'Kids & family'],
  ['travel', 'Viajes', 'Travel'],
  ['health', 'Salud y cuidado', 'Health & care'],
  ['electronics', 'Electrónica y tech', 'Electronics & tech'],
  ['garden', 'Jardín y exterior', 'Garden & outdoor'],
  ['tools', 'Herramientas y ferretería', 'Tools & hardware'],
  ['office', 'Oficina', 'Office'],
  ['vehicle', 'Vehículo y transporte', 'Vehicle & auto'],
  ['projects', 'Proyectos especiales', 'Special projects'],
  ['wishlist', 'Lista de deseos', 'Wishlist'],
  ['custom', 'Personalizado', 'Custom']
];

const solarSeed = [
  ['bat', 'need', 'Baterías LiFePO₄ 12V 100Ah', '12V 100Ah LiFePO₄ batteries', 2, 310, 'LiTime / Redodo', 'Dos baterías idénticas y aprobadas por fabricante para conexión en serie.', 'Two identical batteries explicitly approved by the manufacturer for series connection.', 'No sustituir por batería automotriz, AGM, gel o plomo-ácido sin rediseñar el sistema.', 'Do not substitute automotive, AGM, gel or flooded lead-acid without redesigning the system.'],
  ['mppt', 'need', 'Victron SmartSolar MPPT 100/30', 'Victron SmartSolar MPPT 100/30', 1, 230, 'Victron', 'Controlador solar para el banco de 24V.', 'Solar charge controller for the 24V bank.', 'EPEVER 40A solo si es genuino y programable para litio.', 'EPEVER 40A only if genuine and lithium-programmable.'],
  ['inv', 'need', 'Inversor seno puro 24V 600–1000W', '24V 600–1000W pure-sine inverter', 1, 280, 'Victron / Giandel / Renogy', 'Alimenta la fuente AC original de Starlink.', 'Powers the original Starlink AC supply.', 'Solo seno puro; no onda modificada.', 'Pure sine only; no modified sine.'],
  ['shunt', 'need', 'Victron SmartShunt 500A', 'Victron SmartShunt 500A', 1, 130, 'Victron', 'Mide estado de carga y consumo.', 'Tracks state of charge and energy use.', '', ''],
  ['disconnect', 'need', 'Interruptor principal DC', 'Main DC battery disconnect', 1, 45, 'Blue Sea / equivalente', 'Aislamiento general cerca del banco.', 'Whole-system isolation near the battery bank.', 'Debe tener clasificación DC adecuada.', 'Must be correctly DC-rated.'],
  ['bus', 'need', 'Barras positiva y negativa con cubierta', 'Covered positive and negative bus bars', 1, 55, 'Blue Sea / equivalente', 'Distribución DC limpia y mantenible.', 'Clean, serviceable DC distribution.', '', ''],
  ['fuse', 'need', 'Fusible principal ANL o Class-T', 'ANL or Class-T main fuse', 1, 35, 'Blue Sea / Bussmann', 'Protección principal de cable/inversor.', 'Main cable/inverter circuit protection.', 'El tamaño final debe proteger el cable; no asumir 150A.', 'Final size must protect the cable; do not assume 150A.'],
  ['holder', 'need', 'Portafusible principal', 'Main fuse holder', 1, 35, 'Blue Sea / Bussmann', 'Debe coincidir con el fusible elegido.', 'Must match the selected fuse.', '', ''],
  ['batcable', 'need', 'Cable de batería cobre flexible', 'Fine-strand pure-copper battery cable', 1, 60, 'Cobre puro', 'Calibre según corriente, distancia y caída de voltaje.', 'Gauge based on current, run length and voltage drop.', 'Evitar CCA.', 'Avoid CCA.'],
  ['lugs', 'need', 'Terminales de cobre estañado', 'Tinned-copper cable lugs', 1, 25, 'Cobre estañado', 'Coincidir calibre y perno.', 'Match cable gauge and stud size.', '', ''],
  ['shrink', 'need', 'Termorretráctil con adhesivo', 'Adhesive-lined heat shrink', 1, 18, 'Grado marino', 'Sella y refuerza terminales.', 'Seals and reinforces terminations.', '', ''],
  ['pvwire', 'need', 'Cable solar PV 10 AWG rojo/negro', '10 AWG red/black PV cable', 1, 45, 'PV Wire / USE-2', 'Cable UV/exterior para el arreglo.', 'UV/outdoor-rated array cable.', '', ''],
  ['mc4', 'need', 'Conectores MC4 compatibles genuinos', 'Genuine compatible MC4 connectors', 2, 20, 'Stäubli / genuino', 'Solo según el cableado final.', 'Only as required by final wiring.', 'No mezclar conectores incompatibles.', 'Do not mix incompatible connectors.'],
  ['pvdisc', 'need', 'Desconectador PV / breaker DC', 'PV disconnect / DC breaker', 1, 45, 'PV-rated', 'Aislamiento del arreglo con clasificación correcta.', 'Correctly rated array isolation.', '', ''],
  ['mpptprot', 'need', 'Protección batería ↔ MPPT', 'Battery-side MPPT fuse/breaker', 1, 30, 'DC-rated', 'Protege el cableado del controlador.', 'Protects controller battery wiring.', '', ''],
  ['anderson', 'nice', 'Conectores rápidos Anderson', 'Anderson quick-disconnect connectors', 1, 28, 'Anderson SB50', 'Útiles para conexiones modulares.', 'Useful for modular connections.', '', ''],
  ['box', 'need', 'Caja ventilada resistente a salpicaduras', 'Ventilated splash-resistant enclosure', 1, 90, 'Gabinete exterior', 'Protege de humedad sin atrapar calor.', 'Protects from humidity without trapping heat.', 'No sellar LiFePO₄ en una caja caliente.', 'Do not seal LiFePO₄ into a heat-trapping box.'],
  ['labels', 'nice', 'Etiquetas, pasacables y conduit', 'Labels, grommets and loom', 1, 35, 'Grado eléctrico', 'Protege y organiza el cableado.', 'Protects and organizes wiring.', '', ''],
  ['ground', 'need', 'Puesta a tierra y bonding', 'Grounding and bonding', 1, 30, 'Definido por instalador', 'Debe definirse para la instalación real.', 'Must be selected for the actual installation.', '', ''],
  ['starlink', 'need', 'Fuente Starlink UTP-232L — ya la tenemos', 'Starlink UTP-232L supply — already owned', 1, 0, 'Ya la tenemos', 'Entrada 100–240V AC; salida 57V DC 3.42A; 195W máx. de etiqueta.', 'Input 100–240V AC; output 57V DC 3.42A; 195W max label rating.', 'No comprar de nuevo ni conectar 24V directo a la entrada de 57V.', 'Do not buy again or connect 24V directly to the 57V input.', true]
];

const supplierSeed = [
  { id: 'poderazul', type: 'local', name: 'PoderAzul', phone: '+52 322 182 7524', email: 'ventas1@poderazul.mx', url: 'https://poderazul.mx/ws/', place: 'Puerto Vallarta, Jalisco', es: 'Verificar stock, dirección exacta, autorización y precio antes de viajar.', en: 'Verify stock, exact address, authorization and price before traveling.' },
  { id: 'homedepot', type: 'local', name: 'Home Depot MX', phone: '800 004 6633', email: 'atencion@homedepot.com.mx', url: 'https://www.homedepot.com.mx', place: 'Puerto Vallarta', es: 'Herramientas, material eléctrico y mejoras para el hogar.', en: 'Tools, electrical supplies and home improvement.' },
  { id: 'costco', type: 'local', name: 'Costco Wholesale', phone: '322 226 2500', email: 'atencion@costco.com.mx', url: 'https://www.costco.com.mx', place: 'Puerto Vallarta', es: 'Viveres, alimentos al mayoreo y artículos del hogar.', en: 'Bulk groceries, food and household supplies.' },
  ...markets.slice(0, 4).map(([id, name]) => ({ id, type: 'online', name, url: id === 'amzmx' ? 'https://www.amazon.com.mx/' : id === 'amzus' ? 'https://www.amazon.com/' : id === 'ml' ? 'https://www.mercadolibre.com.mx/' : 'https://www.temu.com/' }))
];

let S = {
  v: 4,
  lang: 'es',
  view: 'home',
  activeList: 'quick',
  activeProject: 'solar',
  activeItem: null,
  projectTab: 'overview',
  budgetTab: 'summary',
  budgetPeriod: 'all',
  filter: 'all',
  categoryFilter: 'all',
  priorityScope: 'need',
  searchQuery: '',
  searchHistory: [],
  lists: [],
  projects: [],
  items: [],
  suppliers: [],
  settings: { usdToMxn: FX.rate, fxDate: FX.date, fxSource: FX.source, sync: 'local', theme: 'light' },
  meta: { onboarded: true, updatedAt: null }
};

const t = (es, en) => S.lang === 'es' ? es : en;
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const iconPaths = {
  home: 'M3 11 12 3l9 8v9H15v-6H9v6H3z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  search: 'M21 21l-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0',
  folder: 'M3 6h7l2 2h9v11H3z',
  budget: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12l4 4L19 6',
  back: 'M15 18l-6-6 6-6',
  next: 'M9 18l6-6-6-6',
  spark: 'M13 2l-2 8-7-2 5 5-5 5 7-2 2 8 2-8 7 2-5-5 5-5-7 2z',
  map: 'M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  share: 'M8 12h8M12 8l4 4-4 4',
  trash: 'M4 7h16M9 7V4h6v3m-8 0 1 14h8l1-14',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  copy: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2zM4 8H2v12a2 2 0 0 0 2 2h12v-2',
  archive: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4'
};

const I = n => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${iconPaths[n] || 'M5 12h14'}"/></svg>`;

function baseItem(o = {}) {
  const createdDate = o.createdAt || new Date().toISOString();
  return {
    id: o.id || `i${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
    ct: o.ct || 'list',
    cid: o.cid || 'quick',
    category: o.category || 'groceries',
    priority: o.priority || 'need',
    es: o.es || '',
    en: o.en || o.es || '',
    qty: Number(o.qty || 1),
    est: Number(o.est || 0),
    cur: o.cur || 'MXN',
    brand: o.brand || '',
    des: o.des || '',
    den: o.den || '',
    wes: o.wes || '',
    wen: o.wen || '',
    done: !!o.done,
    owned: !!o.owned,
    status: o.status || 'researching',
    urgency: o.urgency || (o.priority === 'need' ? 'this-week' : 'later'),
    assigned: o.assigned || 'shared',
    budgetCap: Number(o.budgetCap || 0),
    budgetCur: o.budgetCur || 'MXN',
    targetDate: o.targetDate || '',
    offers: Array.isArray(o.offers) ? o.offers : [],
    paid: Number(o.paid || 0),
    paidCur: o.paidCur || 'MXN',
    shipping: Number(o.shipping || 0),
    tax: Number(o.tax || 0),
    import: Number(o.import || 0),
    discount: Number(o.discount || 0),
    refund: Number(o.refund || 0),
    seller: o.seller || '',
    notes: o.notes || '',
    photo: o.photo || '',
    receipt: o.receipt || '',
    warranty: o.warranty || '',
    serial: o.serial || '',
    returnBy: o.returnBy || '',
    createdAt: createdDate,
    purchasedAt: o.purchasedAt || (o.done ? createdDate : '')
  };
}

function seed() {
  if (!Array.isArray(S.lists) || !S.lists.length) {
    S.lists = [
      { id: 'quick', es: 'Lista rápida', en: 'Quick list', cat: 'groceries' },
      { id: 'costco', es: 'Costco & Mayoreo', en: 'Costco & Wholesale', cat: 'groceries' },
      { id: 'pharmacy', es: 'Farmacia y Salud', en: 'Pharmacy & Health', cat: 'health' },
      { id: 'travel', es: 'Viajes', en: 'Travel', cat: 'travel' },
      { id: 'home', es: 'Casa y Mantenimiento', en: 'Home & Maintenance', cat: 'household' }
    ];
  }

  if (!Array.isArray(S.projects) || !S.projects.length) {
    S.projects = [
      { id: 'solar', es: 'Respaldo solar Starlink', en: 'Starlink solar backup', des: 'Proyecto de energía y conectividad para el hogar.', den: 'Home solar power and connectivity project.' },
      { id: 'hydroponics', es: 'Jardín Hidropónico', en: 'Hydroponics Garden', des: 'Sistema de cultivo vertical automatizado.', den: 'Automated vertical hydroponics system.' },
      { id: 'remodel', es: 'Remodelación Cocina', en: 'Kitchen Remodel', des: 'Mejoras, gabinetes e iluminación.', den: 'Upgrades, cabinets, and lighting.' }
    ];
  }

  S.items = (S.items || []).map(x => baseItem(x));

  if (!S.items.some(x => x.ct === 'project' && x.cid === 'solar')) {
    S.items.push(...solarSeed.map(x => baseItem({
      id: x[0],
      ct: 'project',
      cid: 'solar',
      priority: x[1],
      es: x[2],
      en: x[3],
      qty: x[4],
      est: x[5],
      cur: 'USD',
      brand: x[6],
      des: x[7],
      den: x[8],
      wes: x[9],
      wen: x[10],
      done: !!x[11],
      owned: !!x[11],
      status: x[11] ? 'owned' : 'researching'
    })));
  }

  if (!Array.isArray(S.suppliers) || !S.suppliers.length) {
    S.suppliers = structuredClone(supplierSeed);
  }

  S.v = 4;
}

function migrate(o) {
  if (o && typeof o === 'object') {
    S = { ...S, ...o, settings: { ...S.settings, ...(o.settings || {}) }, meta: { ...S.meta, ...(o.meta || {}) } };
  }
  S.items = (S.items || []).map(x => baseItem(x));
  if (!S.settings.fxDate) S.settings = { ...S.settings, usdToMxn: FX.rate, fxDate: FX.date, fxSource: FX.source };
  seed();
}

function openDB() {
  return new Promise((ok, no) => {
    try {
      const idb = typeof window !== 'undefined' ? (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB) : null;
      if (!idb) return no(new Error('IndexedDB not supported'));
      const r = idb.open(DB, 1);
      r.onupgradeneeded = () => {
        if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE);
      };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => no(r.error);
    } catch (e) {
      no(e);
    }
  });
}

async function load() {
  try {
    const d = await openDB(), r = d.transaction(STORE, 'readonly').objectStore(STORE).get('app');
    r.onsuccess = () => {
      migrate(r.result);
      applyRoute();
      render();
    };
    r.onerror = () => {
      seed();
      applyRoute();
      render();
    };
  } catch {
    seed();
    applyRoute();
    render();
  }
}

async function save() {
  S.meta.updatedAt = new Date().toISOString();
  try {
    (await openDB()).transaction(STORE, 'readwrite').objectStore(STORE).put(S, 'app');
  } catch {}
}

const money = (v, c = 'MXN') => new Intl.NumberFormat(S.lang === 'es' ? 'es-MX' : 'en-US', { style: 'currency', currency: c, maximumFractionDigits: c === 'MXN' ? 0 : 2 }).format(Number(v || 0));
const toMxn = (v, c = 'MXN') => c === 'USD' ? Number(v || 0) * Number(S.settings.usdToMxn || FX.rate) : Number(v || 0);
const toUsd = v => Number(v || 0) / Number(S.settings.usdToMxn || FX.rate);
const dual = v => `${money(v, 'MXN')} · ${money(toUsd(v), 'USD')}`;
const estimate = i => toMxn(i.est * i.qty, i.cur);
const spent = i => i.status === 'returned' ? 0 : Math.max(0, toMxn(Number(i.paid || 0) + Number(i.shipping || 0) + Number(i.tax || 0) + Number(i.import || 0) - Number(i.discount || 0), i.paidCur || 'MXN') - Number(i.refund || 0));
const landed = o => toMxn(Number(o.price || 0) + Number(o.shipping || 0) + Number(o.tax || 0) + Number(o.import || 0) - Number(o.discount || 0), o.cur || 'MXN');

const items = (ct, cid) => S.items.filter(x => x.ct === ct && x.cid === cid);
const filtered = (ct, cid) => items(ct, cid).filter(x => (S.filter === 'all' || x.priority === S.filter) && (S.categoryFilter === 'all' || x.category === S.categoryFilter));
const listName = l => S.lang === 'es' ? l.es : l.en;
const projectName = p => S.lang === 'es' ? p.es : p.en;
const categoryName = id => {
  const c = categories.find(x => x[0] === id);
  return c ? t(c[1], c[2]) : id;
};

function totals(a) {
  return {
    n: a.length,
    done: a.filter(x => x.done || x.owned).length,
    est: a.reduce((s, x) => s + estimate(x), 0),
    spent: a.reduce((s, x) => s + spent(x), 0)
  };
}

function applyRoute() {
  const u = new URL(location.href), v = u.searchParams.get('view'), action = u.searchParams.get('action');
  if (['home', 'lists', 'projects', 'budget', 'search', 'settings'].includes(v)) S.view = v;
  if (action === 'add') setTimeout(() => sheet('choice'), 50);
}

function header() {
  return `
    <header class="top">
      <button class="brand" data-go="home">
        <span>${I('spark')}</span>CHISPA
      </button>
      <div>
        <button class="plain" id="lang">${S.lang === 'es' ? 'EN' : 'ES'}</button>
        <button class="circle" id="add" aria-label="${t('Agregar', 'Add')}">${I('plus')}</button>
      </div>
    </header>
  `;
}

function heroBanner() {
  return `
    <section class="hero">
      <div class="hero-copy">
        <span class="kick">CHISPA V2</span>
        <h1>${t('Tu lista. Tu presupuesto. Tu proyecto.', 'Your list. Your budget. Your project.')}</h1>
        <p>${t('Gestión inteligente de compras del hogar, listas bilingües y seguimiento de proyectos con control total de gastos sin conexión.', 'Smart household shopping, bilingual lists and project tracking with full offline budget control.')}</p>
        <div class="actions">
          <button class="primary" data-go="lists">${I('list')} ${t('Ver compras', 'View lists')}</button>
          <button class="secondary" data-go="projects">${I('folder')} ${t('Explorar proyectos', 'Explore projects')}</button>
        </div>
      </div>
      <div class="hero-photo">
        <img src="/hero-chispa.jpg" alt="Chispa Hero Image" onerror="this.src='/icon.svg';this.style.objectFit='contain';this.style.padding='40px';">
      </div>
    </section>
  `;
}

function quickAddBar() {
  return `
    <section class="quick">
      <label>${t('¿Qué necesitamos hoy?', 'What do we need today?')}</label>
      <div>
        <input id="quickInput" placeholder="${t('Agregar a lista rápida (ej. Leche, Pan, Cable AWG)…', 'Add to quick list (e.g., Milk, Bread, AWG Cable)…')}">
        <button class="primary icon" id="quickBtn" aria-label="${t('Agregar', 'Add')}">${I('plus')}</button>
      </div>
    </section>
  `;
}

function urgencyLabel(v) {
  return v === 'today' ? t('Hoy', 'Today') : v === 'this-week' ? t('Esta semana', 'This week') : t('Después', 'Later');
}

function assignedLabel(v) {
  return v === 'me' ? t('Yo', 'Me') : v === 'wife' ? t('Esposa', 'Wife') : t('Compartido', 'Shared');
}

function lineItem(i) {
  const name = S.lang === 'es' ? i.es : i.en;
  const bestPrice = i.offers?.length ? Math.min(...i.offers.map(landed)) : i.paid ? spent(i) : i.est ? estimate(i) : 0;
  return `
    <div class="item" data-item="${i.id}">
      <button class="box ${i.done ? 'done' : ''}" data-toggle="${i.id}" aria-label="${t('Marcar comprado', 'Toggle done')}">
        ${i.done ? I('check') : ''}
      </button>
      <span data-open="${i.id}">
        <strong>${esc(name)}</strong>
        <small>${i.priority === 'need' ? t('Necesario', 'Need') : t('Bueno tener', 'Nice')} · ${urgencyLabel(i.urgency)} · ${categoryName(i.category)}</small>
      </span>
      ${bestPrice ? `<em>${dual(bestPrice)}</em>` : '<em>—</em>'}
      ${I('next')}
    </div>
  `;
}

function homeView() {
  const everyday = S.items.filter(x => x.ct === 'list');
  const needCount = everyday.filter(x => x.priority === 'need' && !x.done).length;
  const niceCount = everyday.filter(x => x.priority === 'nice' && !x.done).length;
  const totalSpentAll = S.items.reduce((acc, x) => acc + spent(x), 0);
  const activeProj = S.projects[0];
  const ttSolar = totals(items('project', activeProj?.id || 'solar'));
  const recentItems = S.items.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return `
    <main>
      ${heroBanner()}
      <div class="page">
        ${quickAddBar()}
        <div class="priority-cards">
          <button data-filter-scope="need">
            <span>${t('Necesario', 'Need to have')}</span>
            <b>${needCount}</b>
          </button>
          <button data-filter-scope="nice">
            <span>${t('Bueno tener', 'Nice to have')}</span>
            <b>${niceCount}</b>
          </button>
        </div>

        <div class="budget-summary">
          <div class="budget-card">
            <small>${t('Gasto total registrado', 'Total recorded spent')}</small>
            <b>${dual(totalSpentAll)}</b>
          </div>
          <div class="budget-card">
            <small>${t('Artículos en listas', 'List items')}</small>
            <b>${everyday.length}</b>
          </div>
          <div class="budget-card">
            <small>${t('Comprados / Listos', 'Done / Bought')}</small>
            <b>${everyday.filter(x => x.done).length}</b>
          </div>
          <div class="budget-card">
            <small>${t('Proyectos activos', 'Active projects')}</small>
            <b>${S.projects.length}</b>
          </div>
        </div>

        <div class="section-head">
          <div>
            <span class="kick">${t('Proyecto destacado', 'Featured project')}</span>
            <h2>${t('En progreso', 'In progress')}</h2>
          </div>
          <button class="link" data-go="projects">${t('Ver todos', 'See all')}</button>
        </div>

        ${activeProj ? `
          <button class="feature-project" data-project="${activeProj.id}">
            <div>
              <small>${t('PROYECTO PRINCIPAL', 'MAIN PROJECT')}</small>
              <h3>${esc(projectName(activeProj))}</h3>
              <p>${ttSolar.done}/${ttSolar.n} ${t('artículos listos', 'items done')} · ${money(ttSolar.spent)} ${t('gastado', 'spent')}</p>
            </div>
            <b>${ttSolar.n ? Math.round(ttSolar.done / ttSolar.n * 100) : 0}%</b>
          </button>
        ` : ''}

        <div class="section-head" style="margin-top: 36px;">
          <div>
            <span class="kick">${t('Actividad reciente', 'Recent activity')}</span>
            <h2>${t('Últimos artículos', 'Latest items')}</h2>
          </div>
        </div>
        <div class="item-list">
          ${recentItems.length ? recentItems.map(lineItem).join('') : `<div class="empty">${t('No hay actividad aún.', 'No activity yet.')}</div>`}
        </div>
      </div>
    </main>
  `;
}

function listsView() {
  const currentCategory = S.categoryFilter;
  const filteredLists = S.lists.filter(l => currentCategory === 'all' || l.cat === currentCategory);

  return `
    <main class="page">
      <div class="page-head">
        <div>
          <span class="kick">${t('Listas del hogar', 'Household lists')}</span>
          <h1>${t('Compras cotidianas', 'Everyday shopping')}</h1>
          <p>${t('Crea y administra listas para supermercado, farmacia, Costco y más.', 'Create and manage lists for groceries, pharmacy, Costco and more.')}</p>
        </div>
        <button class="primary" data-new-list>${I('plus')} ${t('Nueva lista', 'New list')}</button>
      </div>

      <div class="chips">
        <button class="${S.categoryFilter === 'all' ? 'on' : ''}" data-cat-filter="all">${t('Todas', 'All')}</button>
        ${categories.map(c => `<button class="${S.categoryFilter === c[0] ? 'on' : ''}" data-cat-filter="${c[0]}">${esc(t(c[1], c[2]))}</button>`).join('')}
      </div>

      <div class="cards">
        ${filteredLists.map(l => {
          const tt = totals(items('list', l.id));
          return `
            <div class="card-wrap">
              <button class="card" data-list="${l.id}">
                ${I('list')}
                <span>
                  <small>${esc(categoryName(l.cat))}</small>
                  <strong>${esc(listName(l))}</strong>
                  <em>${tt.n} ${t('artículos', 'items')} · ${tt.done} ${t('listos', 'done')} · ${money(tt.spent)}</em>
                </span>
                ${I('next')}
              </button>
              <button class="mini-edit" data-edit-list="${l.id}" aria-label="${t('Editar lista', 'Edit list')}">${I('edit')}</button>
            </div>
          `;
        }).join('')}
      </div>
    </main>
  `;
}

function listViewDetail() {
  const l = S.lists.find(x => x.id === S.activeList) || S.lists[0];
  const listItems = filtered('list', l.id);
  const tt = totals(items('list', l.id));

  return `
    <main class="page">
      <button class="back" data-go="lists">${I('back')} ${t('Todas las listas', 'All lists')}</button>
      <div class="page-head">
        <div>
          <span class="kick">${esc(categoryName(l.cat))}</span>
          <h1>${esc(listName(l))}</h1>
          <p>${tt.done}/${tt.n} ${t('listos', 'done')} · ${dual(tt.spent)} ${t('gastado registrado', 'spent recorded')}</p>
        </div>
        <div class="actions">
          <button class="secondary" data-edit-list="${l.id}">${I('edit')} ${t('Editar', 'Edit')}</button>
          <button class="primary" data-add-item data-ct="list" data-cid="${l.id}">${I('plus')} ${t('Agregar', 'Add')}</button>
        </div>
      </div>

      <div class="filters">
        <button data-filter="all" class="${S.filter === 'all' ? 'on' : ''}">${t('Todos', 'All')}</button>
        <button data-filter="need" class="${S.filter === 'need' ? 'on' : ''}">${t('Necesarios', 'Need to have')}</button>
        <button data-filter="nice" class="${S.filter === 'nice' ? 'on' : ''}">${t('Bueno tener', 'Nice to have')}</button>
      </div>

      <div class="item-list">
        ${listItems.length ? listItems.map(lineItem).join('') : `<div class="empty">${t('Lista vacía. Toca "Agregar" para comenzar.', 'List is empty. Tap "Add" to get started.')}</div>`}
      </div>
    </main>
  `;
}

function projectsView() {
  return `
    <main class="page">
      <div class="page-head">
        <div>
          <span class="kick">${t('Proyectos', 'Projects')}</span>
          <h1>${t('Proyectos del hogar', 'Household projects')}</h1>
          <p>${t('Solar, remodelación, viajes y emprendimientos con listas y presupuestos independientes.', 'Solar, remodel, travel and projects with isolated checklists and budgets.')}</p>
        </div>
        <button class="primary" data-new-project>${I('plus')} ${t('Nuevo proyecto', 'New project')}</button>
      </div>

      <div class="project-grid">
        ${S.projects.map(p => {
          const tt = totals(items('project', p.id));
          const pct = tt.n ? Math.round(tt.done / tt.n * 100) : 0;
          return `
            <div class="project-wrap">
              <button class="project-card" data-project="${p.id}">
                <div>
                  <span>${I('folder')}</span>
                  <b>${pct}%</b>
                </div>
                <h2>${esc(projectName(p))}</h2>
                <p>${esc(S.lang === 'es' ? (p.des || '') : (p.den || ''))}</p>
                <footer>
                  <span><b>${tt.n}</b>${t('artículos', 'items')}</span>
                  <span><b>${tt.done}</b>${t('listos', 'done')}</span>
                  <span><b>${money(tt.spent)}</b>${t('gastado', 'spent')}</span>
                </footer>
              </button>
              <button class="mini-edit" data-edit-project="${p.id}" aria-label="${t('Editar proyecto', 'Edit project')}">${I('edit')}</button>
            </div>
          `;
        }).join('')}
      </div>
    </main>
  `;
}

function projectViewDetail() {
  const p = S.projects.find(x => x.id === S.activeProject) || S.projects[0];
  const pItems = items('project', p.id);
  const tt = totals(pItems);
  const pct = tt.n ? Math.round(tt.done / tt.n * 100) : 0;

  const tabs = [
    ['overview', t('Resumen', 'Overview')],
    ['checklist', t('Lista de compras', 'Checklist')],
    ['docs', t('Documentos & Recibos', 'Docs & Receipts')],
    ...(p.id === 'solar' ? [['wiring', t('Esquema solar', 'Solar wiring')], ['suppliers', t('Proveedores', 'Suppliers')]] : [])
  ];

  let body = '';
  if (S.projectTab === 'checklist') {
    const listItems = filtered('project', p.id);
    body = `
      <div class="actions" style="margin-bottom:16px;">
        <button class="primary" data-add-item data-ct="project" data-cid="${p.id}">${I('plus')} ${t('Agregar artículo', 'Add item')}</button>
      </div>
      <div class="item-list">
        ${listItems.length ? listItems.map(lineItem).join('') : `<div class="empty">${t('No hay artículos registrados.', 'No items recorded.')}</div>`}
      </div>
    `;
  } else if (S.projectTab === 'docs') {
    body = `
      <div class="doc-grid">
        <div><span>${t('Fotos', 'Photos')}</span><b>${pItems.filter(i => i.photo).length}</b></div>
        <div><span>${t('Recibos', 'Receipts')}</span><b>${pItems.filter(i => i.receipt).length}</b></div>
        <div><span>${t('Garantías', 'Warranties')}</span><b>${pItems.filter(i => i.warranty).length}</b></div>
        <div><span>${t('Números de serie', 'Serials')}</span><b>${pItems.filter(i => i.serial).length}</b></div>
      </div>
    `;
  } else if (S.projectTab === 'wiring') {
    body = `
      <div class="wiring">
        ${[
          t('Paneles solares arreglados', 'Solar panel array'),
          'Victron SmartSolar MPPT 100/30',
          t('Banco 24V LiFePO₄ 100Ah', '24V 100Ah LiFePO₄ bank'),
          t('Inversor seno puro 24V → 120V AC', '24V pure-sine inverter → 120V AC'),
          'Fuente Starlink UTP-232L'
        ].map((x, i) => `<div><b>${i + 1}</b><strong>${x}</strong>${i < 4 ? I('next') : ''}</div>`).join('')}
      </div>
    `;
  } else if (S.projectTab === 'suppliers') {
    body = supplierCards(true);
  } else {
    body = `
      <div class="metrics">
        <div><span>${t('Progreso global', 'Overall progress')}</span><b>${pct}%</b></div>
        <div><span>${t('Presupuesto estimado', 'Planned estimate')}</span><b>${dual(tt.est)}</b></div>
        <div><span>${t('Total gastado', 'Recorded spent')}</span><b>${dual(tt.spent)}</b></div>
        <div><span>${t('Pendientes', 'Remaining')}</span><b>${Math.max(0, tt.n - tt.done)}</b></div>
      </div>
    `;
  }

  return `
    <main class="page">
      <button class="back" data-go="projects">${I('back')} ${t('Todos los proyectos', 'All projects')}</button>
      <div class="project-head">
        <div>
          <span class="kick">${t('Proyecto activo', 'Active project')}</span>
          <h1>${esc(projectName(p))}</h1>
          <p>${esc(S.lang === 'es' ? (p.des || '') : (p.den || ''))}</p>
        </div>
        <strong>${pct}%<small>${tt.done}/${tt.n} ${t('listos', 'done')}</small></strong>
      </div>
      <div class="tabs">
        ${tabs.map(x => `<button data-tab="${x[0]}" class="${S.projectTab === x[0] ? 'on' : ''}">${x[1]}</button>`).join('')}
      </div>
      ${body}
    </main>
  `;
}

function budgetView() {
  const itemsWithPurchases = S.items.filter(x => x.paid > 0 || x.done || x.status === 'delivered' || x.status === 'ordered');
  const totalPaid = S.items.reduce((s, x) => s + spent(x), 0);
  const totalEstimated = S.items.reduce((s, x) => s + estimate(x), 0);
  const totalNeedSpent = S.items.filter(x => x.priority === 'need').reduce((s, x) => s + spent(x), 0);
  const totalNiceSpent = S.items.filter(x => x.priority === 'nice').reduce((s, x) => s + spent(x), 0);

  return `
    <main class="page">
      <div class="page-head">
        <div>
          <span class="kick">${t('Finanzas del hogar', 'Household finances')}</span>
          <h1>${t('Presupuesto y gastos', 'Budget & spending')}</h1>
          <p>${t('Control de precios reales, impuestos, envío, descuentos y desgloses.', 'Real landed price tracking with tax, shipping, discounts and breakdowns.')}</p>
        </div>
      </div>

      <div class="budget-summary">
        <div class="budget-card">
          <small>${t('Total gastado', 'Total spent')}</small>
          <b>${dual(totalPaid)}</b>
        </div>
        <div class="budget-card">
          <small>${t('Estimación inicial', 'Initial estimate')}</small>
          <b>${dual(totalEstimated)}</b>
        </div>
        <div class="budget-card">
          <small>${t('Gasto en Necesarios', 'Need spent')}</small>
          <b>${money(totalNeedSpent)}</b>
        </div>
        <div class="budget-card">
          <small>${t('Gasto en Bueno tener', 'Nice spent')}</small>
          <b>${money(totalNiceSpent)}</b>
        </div>
      </div>

      <div class="section-head">
        <h2>${t('Historial de compras', 'Purchase history')}</h2>
      </div>

      <div class="budget-table-wrap">
        <table class="budget-table">
          <thead>
            <tr>
              <th>${t('Artículo', 'Item')}</th>
              <th>${t('Categoría', 'Category')}</th>
              <th>${t('Estado', 'Status')}</th>
              <th>${t('Vendedor', 'Seller')}</th>
              <th>${t('Total real', 'Landed cost')}</th>
            </tr>
          </thead>
          <tbody>
            ${itemsWithPurchases.length ? itemsWithPurchases.map(i => `
              <tr data-open="${i.id}" style="cursor:pointer;">
                <td><strong>${esc(S.lang === 'es' ? i.es : i.en)}</strong></td>
                <td>${categoryName(i.category)}</td>
                <td>${i.status}</td>
                <td>${esc(i.seller || '—')}</td>
                <td><strong>${dual(spent(i))}</strong></td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" class="empty">${t('No hay compras registradas.', 'No purchases recorded yet.')}</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </main>
  `;
}

function searchView() {
  const query = S.searchQuery.toLowerCase().trim();
  const searchResults = query ? S.items.filter(x => (x.es + ' ' + x.en + ' ' + (x.brand || '') + ' ' + (x.seller || '')).toLowerCase().includes(query)) : [];

  return `
    <main class="page narrow">
      <div class="page-head">
        <div>
          <span class="kick">${t('Buscador', 'Search engine')}</span>
          <h1>${t('Busca en tus guardados y tiendas', 'Search items and stores')}</h1>
          <p>${t('Encuentra artículos guardados o abre búsquedas directas en tus tiendas preferidas.', 'Find saved items or open direct searches on your favorite stores.')}</p>
        </div>
      </div>

      <div class="search">
        <input id="searchInput" value="${esc(S.searchQuery)}" placeholder="${t('Buscar artículo, marca o tienda…', 'Search item, brand or store…')}">
        <button class="primary" id="searchBtn">${I('search')} ${t('Buscar', 'Search')}</button>
      </div>

      ${query ? `
        <div class="section-head">
          <h2>${t('Resultados en Chispa', 'Results in Chispa')} (${searchResults.length})</h2>
        </div>
        <div class="item-list" style="margin-bottom:24px;">
          ${searchResults.length ? searchResults.map(lineItem).join('') : `<div class="empty">${t('No se encontraron artículos guardados.', 'No saved items found.')}</div>`}
        </div>
      ` : ''}

      <div class="section-head">
        <h2>${t('Buscar en tiendas en línea', 'Search online stores')}</h2>
      </div>

      <div class="markets">
        ${markets.map(m => `
          <a href="${searchUrl(m[0], S.searchQuery || 'compras')}" target="_blank" rel="noopener">
            <strong>${m[1]} ↗</strong>
            <small>${t('Buscar en tienda externa', 'Search external store')}</small>
          </a>
        `).join('')}
      </div>
    </main>
  `;
}

function searchUrl(id, q) {
  const e = encodeURIComponent(q);
  if (id === 'amzmx') return `https://www.amazon.com.mx/s?k=${e}`;
  if (id === 'amzus') return `https://www.amazon.com/s?k=${e}`;
  if (id === 'ml') return `https://listado.mercadolibre.com.mx/${e}`;
  if (id === 'temu') return `https://www.temu.com/search_result.html?search_key=${e}`;
  if (id === 'homedepot') return `https://www.homedepot.com.mx/busqueda?q=${e}`;
  if (id === 'costco') return `https://www.costco.com.mx/search?text=${e}`;
  if (id === 'walmart') return `https://www.walmart.com.mx/busca?q=${e}`;
  return `https://www.google.com/search?q=${e}`;
}

function settingsView() {
  return `
    <main class="page">
      <div class="page-head">
        <div>
          <span class="kick">${t('Configuración', 'Settings')}</span>
          <h1>${t('Ajustes y respaldo', 'Settings & backup')}</h1>
          <p>${t('Administra moneda, sincronización en nube, idioma y copias de seguridad.', 'Manage currency, cloud sync, language and backups.')}</p>
        </div>
      </div>

      <div class="setting-grid">
        <section>
          <h3>${t('Idioma y moneda', 'Language & currency')}</h3>
          <p><b>${S.lang === 'es' ? 'Español' : 'English'}</b></p>
          <label style="margin-top:10px;">
            USD → MXN
            <input id="rateInput" type="number" step=".0001" value="${S.settings.usdToMxn}">
          </label>
          <small>${esc(S.settings.fxSource)} · ${esc(S.settings.fxDate)}</small>
        </section>

        <section>
          <h3>${t('Nube del hogar (Supabase)', 'Household cloud (Supabase)')}</h3>
          <p><b>${t('Sync RLS activo', 'RLS sync active')}</b></p>
          <p class="muted">${t('Sincroniza tus compras entre múltiples teléfonos.', 'Sync your purchases across multiple phones.')}</p>
        </section>

        <section class="wide">
          <h3>${t('Copia de seguridad', 'Backup & export')}</h3>
          <div class="actions">
            <button class="secondary" id="exportJson">${I('copy')} Exportar JSON</button>
            <label class="secondary file">
              Importar JSON
              <input id="importFile" type="file" accept=".json" hidden>
            </label>
            <button class="secondary" id="printPdf">${t('Imprimir / PDF', 'Print / PDF')}</button>
          </div>
        </section>

        <section class="wide">
          <h3>${t('Restablecer datos', 'Reset local data')}</h3>
          <button class="secondary danger-link" id="resetData">${t('Restablecer Chispa', 'Reset Chispa')}</button>
        </section>
      </div>
    </main>
  `;
}

function itemViewDetail() {
  const i = S.items.find(x => x.id === S.activeItem);
  if (!i) return homeView();
  const name = S.lang === 'es' ? i.es : i.en;
  const desc = S.lang === 'es' ? i.des : i.den;
  const warn = S.lang === 'es' ? i.wes : i.wen;

  return `
    <main class="page item-page">
      <button class="back" data-go="${i.ct === 'project' ? 'project' : 'list'}">${I('back')} ${t('Volver', 'Back')}</button>

      <div class="item-hero">
        <div class="photo">
          ${i.photo ? `<img src="${esc(i.photo)}" alt="${esc(name)}">` : `${I('spark')}<small>${t('Sin foto', 'No photo')}</small>`}
        </div>
        <div>
          <span class="priority ${i.priority}">${i.priority === 'need' ? t('Necesario', 'Need') : t('Bueno tener', 'Nice')}</span>
          <h1>${esc(name)}</h1>
          <p>${esc(desc || '')}</p>
          <div class="price">
            <small>${t('Precio / Costo real registrado', 'Price / Recorded cost')}</small>
            <b>${dual(spent(i) || estimate(i))}</b>
          </div>
          <label class="done">
            <input type="checkbox" data-done="${i.id}" ${i.done ? 'checked' : ''}>
            ${i.done ? t('Comprado / Listo', 'Bought / Done') : t('Marcar como comprado', 'Mark as bought')}
          </label>
        </div>
      </div>

      <div class="item-actions">
        <button class="primary" data-search-item="${esc(name)}">${I('search')} ${t('Buscar oferta', 'Search deal')}</button>
        <button class="secondary" data-delete-item="${i.id}">${I('trash')} ${t('Eliminar artículo', 'Delete item')}</button>
      </div>

      <details open>
        <summary>${t('Detalles y edición', 'Details & edit')}</summary>
        <div class="form">
          <label class="wide">
            ${t('Nombre (ES)', 'Name (ES)')}
            <input data-field="es" data-id="${i.id}" value="${esc(i.es)}">
          </label>
          <label class="wide">
            ${t('Nombre (EN)', 'Name (EN)')}
            <input data-field="en" data-id="${i.id}" value="${esc(i.en)}">
          </label>
          <label>
            ${t('Prioridad', 'Priority')}
            <select data-field="priority" data-id="${i.id}">
              <option value="need" ${i.priority === 'need' ? 'selected' : ''}>${t('Necesario', 'Need')}</option>
              <option value="nice" ${i.priority === 'nice' ? 'selected' : ''}>${t('Bueno tener', 'Nice')}</option>
            </select>
          </label>
          <label>
            ${t('Cantidad', 'Quantity')}
            <input type="number" data-field="qty" data-id="${i.id}" value="${i.qty}">
          </label>
          <label>
            ${t('Estimación USD', 'Estimate USD')}
            <input type="number" step=".01" data-field="est" data-id="${i.id}" value="${i.est}">
          </label>
          <label>
            ${t('Precio pagado MXN', 'Paid MXN')}
            <input type="number" step=".01" data-field="paid" data-id="${i.id}" value="${i.paid}">
          </label>
          <label>
            ${t('Vendedor / Tienda', 'Seller / Store')}
            <input data-field="seller" data-id="${i.id}" value="${esc(i.seller)}">
          </label>
          <label>
            ${t('Urgencia', 'Urgency')}
            <select data-field="urgency" data-id="${i.id}">
              <option value="today" ${i.urgency === 'today' ? 'selected' : ''}>${t('Hoy', 'Today')}</option>
              <option value="this-week" ${i.urgency === 'this-week' ? 'selected' : ''}>${t('Esta semana', 'This week')}</option>
              <option value="later" ${i.urgency === 'later' ? 'selected' : ''}>${t('Después', 'Later')}</option>
            </select>
          </label>
        </div>
      </details>
    </main>
  `;
}

function supplierCards(projectOnly = false) {
  return `
    <div class="supplier-grid">
      ${S.suppliers.map(s => `
        <article>
          <span class="kick">${s.type === 'local' ? t('Local', 'Local') : t('En línea', 'Online')}</span>
          <h3>${esc(s.name)}</h3>
          ${s.es ? `<p>${esc(t(s.es, s.en))}</p>` : ''}
          <div class="links">
            ${s.phone ? `<a href="tel:${s.phone.replace(/\s/g, '')}">${t('Llamar', 'Call')} ${esc(s.phone)}</a>` : ''}
            ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${t('Sitio', 'Website')} ↗</a>` : ''}
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

function bottomNavigation() {
  const navItems = [
    ['home', 'home', t('Inicio', 'Home')],
    ['lists', 'list', t('Listas', 'Lists')],
    ['projects', 'folder', t('Proyectos', 'Projects')],
    ['budget', 'budget', t('Presupuesto', 'Budget')],
    ['search', 'search', t('Buscar', 'Search')],
    ['settings', 'gear', t('Ajustes', 'Settings')]
  ];

  return `
    <nav class="bottom">
      ${navItems.map(item => `
        <button data-go="${item[0]}" class="${S.view === item[0] ? 'on' : ''}">
          ${I(item[1])}
          <span>${item[2]}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

function render() {
  let content = '';
  if (S.view === 'home') content = homeView();
  else if (S.view === 'lists') content = listsView();
  else if (S.view === 'list') content = listViewDetail();
  else if (S.view === 'projects') content = projectsView();
  else if (S.view === 'project') content = projectViewDetail();
  else if (S.view === 'budget') content = budgetView();
  else if (S.view === 'search') content = searchView();
  else if (S.view === 'settings') content = settingsView();
  else if (S.view === 'item') content = itemViewDetail();
  else content = homeView();

  $('#app').innerHTML = `
    <div class="app">
      ${header()}
      ${content}
      ${bottomNavigation()}
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  // Navigation
  $$('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));
  $$('[data-list]').forEach(b => b.onclick = () => { S.activeList = b.dataset.list; go('list'); });
  $$('[data-project]').forEach(b => b.onclick = () => { S.activeProject = b.dataset.project; S.projectTab = 'overview'; go('project'); });
  $$('[data-open]').forEach(b => b.onclick = () => { S.activeItem = b.dataset.open; go('item'); });

  // Quick Add
  const qBtn = $('#quickBtn'), qInput = $('#quickInput');
  if (qBtn && qInput) {
    const addQuick = () => {
      const val = qInput.value.trim();
      if (!val) return;
      const newItem = baseItem({ ct: 'list', cid: 'quick', es: val, en: val });
      S.items.push(newItem);
      save();
      qInput.value = '';
      render();
      toast(t('Artículo agregado', 'Item added'));
    };
    qBtn.onclick = addQuick;
    qInput.onkeypress = e => { if (e.key === 'Enter') addQuick(); };
  }

  // Language switch
  const langBtn = $('#lang');
  if (langBtn) {
    langBtn.onclick = () => {
      S.lang = S.lang === 'es' ? 'en' : 'es';
      save();
      render();
    };
  }

  // Add sheet button
  const addBtn = $('#add');
  if (addBtn) addBtn.onclick = () => sheet('choice');

  // Filter scope on Home
  $$('[data-filter-scope]').forEach(b => b.onclick = () => {
    S.filter = b.dataset.filterScope;
    S.activeList = 'quick';
    go('list');
  });

  // Category filter
  $$('[data-cat-filter]').forEach(b => b.onclick = () => {
    S.categoryFilter = b.dataset.catFilter;
    render();
  });

  // Checkbox toggle
  $$('[data-toggle]').forEach(b => b.onclick = e => {
    e.stopPropagation();
    const item = S.items.find(x => x.id === b.dataset.toggle);
    if (item) {
      item.done = !item.done;
      item.purchasedAt = item.done ? new Date().toISOString() : '';
      save();
      render();
    }
  });

  // Tabs inside Project Detail
  $$('[data-tab]').forEach(b => b.onclick = () => {
    S.projectTab = b.dataset.tab;
    render();
  });

  // Search input & button
  const sBtn = $('#searchBtn'), sInput = $('#searchInput');
  if (sBtn && sInput) {
    const doSearch = () => {
      S.searchQuery = sInput.value;
      render();
    };
    sBtn.onclick = doSearch;
    sInput.onkeypress = e => { if (e.key === 'Enter') doSearch(); };
  }

  // Search item button
  $$('[data-search-item]').forEach(b => b.onclick = () => {
    S.searchQuery = b.dataset.searchItem;
    go('search');
  });

  // New list & project modal triggers
  $$('[data-new-list]').forEach(b => b.onclick = () => sheet('list'));
  $$('[data-new-project]').forEach(b => b.onclick = () => sheet('project'));
  $$('[data-add-item]').forEach(b => b.onclick = () => sheet('item', { ct: b.dataset.ct, cid: b.dataset.cid }));
  $$('[data-edit-list]').forEach(b => b.onclick = e => { e.stopPropagation(); sheet('list', { id: b.dataset.editList }); });
  $$('[data-edit-project]').forEach(b => b.onclick = e => { e.stopPropagation(); sheet('project', { id: b.dataset.editProject }); });

  // Settings export JSON
  const expJson = $('#exportJson');
  if (expJson) {
    expJson.onclick = () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(S, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `chispa-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    };
  }

  // Settings import JSON
  const impFile = $('#importFile');
  if (impFile) {
    impFile.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const parsed = JSON.parse(ev.target.result);
          migrate(parsed);
          save();
          render();
          toast(t('Datos importados con éxito', 'Data imported successfully'));
        } catch {
          toast(t('Error al importar archivo JSON', 'Failed to import JSON file'));
        }
      };
      reader.readAsText(file);
    };
  }

  // Print PDF
  const printPdf = $('#printPdf');
  if (printPdf) printPdf.onclick = () => window.print();

  // Reset
  const resetData = $('#resetData');
  if (resetData) {
    resetData.onclick = () => {
      if (confirm(t('¿Restablecer Chispa? Se borrarán tus datos locales.', 'Reset Chispa? Local data will be cleared.'))) {
        indexedDB.deleteDatabase(DB);
        localStorage.clear();
        location.reload();
      }
    };
  }

  // Live item edits
  $$('[data-field]').forEach(inp => {
    inp.onchange = () => {
      const id = inp.dataset.id, field = inp.dataset.field;
      const item = S.items.find(x => x.id === id);
      if (item) {
        item[field] = inp.value;
        save();
      }
    };
  });

  // Delete item
  $$('[data-delete-item]').forEach(b => b.onclick = () => {
    if (confirm(t('¿Eliminar artículo?', 'Delete item?'))) {
      S.items = S.items.filter(x => x.id !== b.dataset.deleteItem);
      save();
      go('lists');
    }
  });
}

function go(v) {
  S.view = v;
  save();
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toast(m) {
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = m;
  document.body.append(d);
  setTimeout(() => d.remove(), 2000);
}

function sheet(type, ctx = {}) {
  const w = document.createElement('div');
  w.className = 'sheet-wrap';
  w.innerHTML = `
    <button class="shade" aria-label="${t('Cerrar', 'Close')}"></button>
    <section class="sheet">
      <i></i>
      ${type === 'choice' ? choiceForm() : type === 'list' ? listForm(ctx) : type === 'project' ? projectForm(ctx) : itemForm(ctx)}
    </section>
  `;
  document.body.append(w);
  $('.shade', w).onclick = () => w.remove();
  bindSheet(w, type, ctx);
}

function choiceForm() {
  return `
    <h2>${t('Agregar nuevo', 'Add new')}</h2>
    <div class="choices">
      <button data-choice="item">
        ${I('plus')}
        <span><b>${t('Artículo', 'Item')}</b><small>${t('Agregar a una lista o proyecto', 'Add to list or project')}</small></span>
      </button>
      <button data-choice="list">
        ${I('list')}
        <span><b>${t('Nueva lista', 'New list')}</b><small>${t('Compras cotidianas o viaje', 'Everyday shopping or travel')}</small></span>
      </button>
      <button data-choice="project">
        ${I('folder')}
        <span><b>${t('Nuevo proyecto', 'New project')}</b><small>${t('Proyecto con lista y presupuesto', 'Project with list and budget')}</small></span>
      </button>
    </div>
  `;
}

function itemForm(c = {}) {
  const ct = c.ct || 'list', cid = c.cid || S.activeList;
  return `
    <h2>${t('Agregar artículo', 'Add item')}</h2>
    <form id="itemForm" class="form">
      <input type="hidden" name="ct" value="${ct}">
      <input type="hidden" name="cid" value="${cid}">
      <label class="wide">
        ${t('Nombre del artículo', 'Item name')}
        <input name="name" required autofocus placeholder="Ej. Leche, Panel Solar, Cable AWG">
      </label>
      <label>
        ${t('Categoría', 'Category')}
        <select name="category">
          ${categories.map(cat => `<option value="${cat[0]}">${esc(t(cat[1], cat[2]))}</option>`).join('')}
        </select>
      </label>
      <label>
        ${t('Prioridad', 'Priority')}
        <select name="priority">
          <option value="need">${t('Necesario', 'Need')}</option>
          <option value="nice">${t('Bueno tener', 'Nice')}</option>
        </select>
      </label>
      <label>
        ${t('Cantidad', 'Quantity')}
        <input name="qty" type="number" value="1">
      </label>
      <label>
        ${t('Estimación USD', 'Estimate USD')}
        <input name="est" type="number" step=".01" placeholder="0.00">
      </label>
      <button class="primary wide" style="margin-top:12px;">${t('Guardar artículo', 'Save item')}</button>
    </form>
  `;
}

function listForm(c = {}) {
  const l = c.id ? S.lists.find(x => x.id === c.id) : null;
  return `
    <h2>${l ? t('Editar lista', 'Edit list') : t('Nueva lista', 'New list')}</h2>
    <form id="listForm" class="form">
      <input type="hidden" name="id" value="${l?.id || ''}">
      <label class="wide">
        ${t('Nombre de la lista', 'List name')}
        <input name="name" value="${esc(l ? listName(l) : '')}" required>
      </label>
      <label class="wide">
        ${t('Categoría', 'Category')}
        <select name="cat">
          ${categories.map(cat => `<option value="${cat[0]}" ${l?.cat === cat[0] ? 'selected' : ''}>${t(cat[1], cat[2])}</option>`).join('')}
        </select>
      </label>
      <button class="primary wide" style="margin-top:12px;">${l ? t('Guardar cambios', 'Save changes') : t('Crear lista', 'Create list')}</button>
    </form>
  `;
}

function projectForm(c = {}) {
  const p = c.id ? S.projects.find(x => x.id === c.id) : null;
  return `
    <h2>${p ? t('Editar proyecto', 'Edit project') : t('Nuevo proyecto', 'New project')}</h2>
    <form id="projectForm" class="form">
      <input type="hidden" name="id" value="${p?.id || ''}">
      <label class="wide">
        ${t('Nombre del proyecto', 'Project name')}
        <input name="name" value="${esc(p ? projectName(p) : '')}" required>
      </label>
      <label class="wide">
        ${t('Descripción', 'Description')}
        <textarea name="desc">${esc(p ? (S.lang === 'es' ? p.des : p.den) : '')}</textarea>
      </label>
      <button class="primary wide" style="margin-top:12px;">${p ? t('Guardar cambios', 'Save changes') : t('Crear proyecto', 'Create project')}</button>
    </form>
  `;
}

function bindSheet(w, type, ctx) {
  $$('[data-choice]', w).forEach(b => b.onclick = () => {
    w.remove();
    sheet(b.dataset.choice);
  });

  const iForm = $('#itemForm', w);
  if (iForm) {
    iForm.onsubmit = e => {
      e.preventDefault();
      const d = new FormData(e.target);
      const name = String(d.get('name')).trim();
      const newItem = baseItem({
        ct: d.get('ct'),
        cid: d.get('cid'),
        category: d.get('category'),
        priority: d.get('priority'),
        es: name,
        en: name,
        qty: d.get('qty'),
        est: d.get('est')
      });
      S.items.push(newItem);
      save();
      w.remove();
      render();
      toast(t('Artículo guardado', 'Item saved'));
    };
  }

  const lForm = $('#listForm', w);
  if (lForm) {
    lForm.onsubmit = e => {
      e.preventDefault();
      const d = new FormData(e.target);
      const id = String(d.get('id') || '');
      const name = String(d.get('name')).trim();
      if (id) {
        const l = S.lists.find(x => x.id === id);
        l.es = name;
        l.en = name;
        l.cat = d.get('cat');
      } else {
        const nid = 'l' + Date.now();
        S.lists.push({ id: nid, es: name, en: name, cat: d.get('cat') });
        S.activeList = nid;
      }
      save();
      w.remove();
      render();
      toast(t('Lista actualizada', 'List updated'));
    };
  }

  const pForm = $('#projectForm', w);
  if (pForm) {
    pForm.onsubmit = e => {
      e.preventDefault();
      const d = new FormData(e.target);
      const id = String(d.get('id') || '');
      const name = String(d.get('name')).trim();
      const desc = String(d.get('desc') || '');
      if (id) {
        const p = S.projects.find(x => x.id === id);
        p.es = name;
        p.en = name;
        p.des = desc;
        p.den = desc;
      } else {
        const nid = 'p' + Date.now();
        S.projects.push({ id: nid, es: name, en: name, des: desc, den: desc });
        S.activeProject = nid;
      }
      save();
      w.remove();
      render();
      toast(t('Proyecto actualizado', 'Project updated'));
    };
  }
}

// Immediate initial render with seed data so screen is never blank
seed();
try { render(); } catch(e) { console.error('Initial render error:', e); }

// Asynchronous hydration from IndexedDB
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', load);
} else {
  load();
}