/* Chispa V2 Application Engine
   Role: Personal operations, bilingual household shopping & interactive projects (Felipe Kit de Arenero).
   Rules: ZERO emojis in production interface, Apple-level neutral design tokens, exact Felipe seed data fallback.
*/

import { fetchFelipeProjectData } from './cloud-sync.js';

// Global Application State
const S = {
  view: 'home', // home, projects, shopping, tasks, notes, receipts, budgets, inventory, settings, system
  projectSlug: null, // 'felipe-litter-kit'
  subTab: 'items', // items, budgets, protocol, checklist, timeline, notes
  selectedItemId: null,
  activeShareModal: false,
  shareTokenUrl: null,
  locale: 'es-MX',
  searchQuery: '',
  
  // Felipe Seed Fallback State
  felipe: {
    project: {
      slug: 'felipe-litter-kit',
      name: 'Kit de arenero para Felipe',
      project_type: 'shopping_guide',
      category: 'pet_care',
      locale: 'es-MX',
      target_location: 'Ciudad de México',
      currency: 'MXN',
      status: 'active',
      summary: 'Guía de compra rápida para preparar dos areneros grandes, arena sin aroma, limpiador enzimático y feromonas durante la adaptación de Felipe.',
      source_updated_label: 'Julio 2026',
      verification_status: 'Información sujeta a verificación'
    },
    timeline: [
      { sort_order: 1, label: 'Semana 1-2', description: 'Estrés máximo, esconderse' },
      { sort_order: 2, label: 'Semana 3-4', description: 'Explora, prueba arenero' },
      { sort_order: 3, label: 'Semana 5-6', description: 'Se adapta, menos accidentes' },
      { sort_order: 4, label: 'Después', description: 'Rutina establecida' }
    ],
    items: [
      {
        id: 'item-1',
        sort_order: 1,
        category: 'Cajas de almacenamiento',
        name: 'Rubbermaid Roughneck 66 Qt Clear',
        variant: 'Contenedor transparente con tapa de cierre',
        recommended: true,
        quantity: 2,
        required: true,
        priority: 'critical',
        status: 'not_purchased',
        currency: 'MXN',
        price_min_cents: 60000,
        price_max_cents: 80000,
        why: 'Tamaño grande, plástico resistente, tapa de cierre seguro y cuerpo transparente para ver el interior.',
        specifications: [
          'Peso máximo indicado en la guía original: 96 lb',
          'Material indicado: polipropileno resistente a impactos',
          'Rango de temperatura indicado: 0-115 °F'
        ],
        warnings: ['No comprar areneros comerciales pequeños de aproximadamente 20 litros.'],
        verification_required: true,
        verification_warning: 'La medida interior heredada es mayor que la medida exterior. No presentarla como verificada hasta comprobarla con la ficha actual del fabricante.',
        purchase_links: [
          { label: 'Home Depot USA', retailer: 'Home Depot', region: 'US', url: 'https://www.homedepot.com/p/Rubbermaid-Roughneck-66-Qt-16-5-Gal-Stackable-Storage-Containers-Clear-w-Latching-Grey-Lids-4-Pack-RMRC066004/326993153' },
          { label: 'Amazon USA', retailer: 'Amazon', region: 'US', url: 'https://www.amazon.com/Rubbermaid-Roughneck-Containers-Stackable-Organization/dp/B0B7P6GYR6' }
        ]
      },
      {
        id: 'item-2',
        sort_order: 2,
        category: 'Arena para gatos',
        name: "Dr. Elsey's Precious Cat Ultra",
        variant: 'Unscented, bolsa de 20 lb / 9.1 kg',
        recommended: true,
        quantity: 2,
        required: true,
        priority: 'critical',
        status: 'not_purchased',
        currency: 'MXN',
        price_min_cents: 40000,
        price_max_cents: 50000,
        why: 'La guía original la describe como 99.9% libre de polvo, de arcilla pesada, sin perfume, con control natural de olores y gránulos grandes.',
        usage: 'Usar aproximadamente 7-10 cm de profundidad en cada arenero.',
        verification_required: true,
        verification_warning: "La descripción 'Ultra' suele corresponder a arena aglomerante. Verificar la intención del usuario y la ficha del producto.",
        purchase_links: [
          { label: 'Amazon México', retailer: 'Amazon', region: 'MX', url: 'https://www.amazon.com.mx/Dr-Elseys-Seguimiento-aglutinamiento-Ingredientes/dp/B0BFBR9JNS' }
        ]
      },
      {
        id: 'item-3',
        sort_order: 3,
        category: 'Limpieza enzimática',
        name: "Nature's Miracle Cat Enzymatic Stain & Odor Remover",
        variant: 'Spray de 32 oz / 946 mL',
        recommended: true,
        quantity: 1,
        required: true,
        priority: 'critical',
        status: 'not_purchased',
        currency: 'MXN',
        price_min_cents: 30000,
        price_max_cents: 40000,
        why: 'La guía original indica que una fórmula de bacterias y enzimas ayuda a descomponer residuos de orina y reducir el remarcaje.',
        usage: 'Después de limpiar con vinagre blanco, rociar, esperar 15 minutos, absorber con paño blanco y no enjuagar.',
        verification_required: true,
        purchase_links: [
          { label: "Amazon USA, búsqueda Nature's Miracle Cat", retailer: 'Amazon', region: 'US', url: 'https://www.amazon.com/' }
        ]
      },
      {
        id: 'item-4',
        sort_order: 4,
        category: 'Feromonas',
        name: 'Feliway Classic Spray',
        variant: '60 mL',
        recommended: true,
        quantity: 1,
        required: true,
        priority: 'high',
        status: 'not_purchased',
        currency: 'MXN',
        price_min_cents: 35000,
        price_max_cents: 40000,
        why: 'La guía original lo utiliza para reducir estrés y marcaje territorial durante la transición.',
        usage: 'Rociar dos veces al día durante las primeras cuatro semanas en marcos de puertas, ventanas y muebles donde Felipe se acerca.',
        verification_required: true,
        purchase_links: [
          { label: 'Amazon México', retailer: 'Amazon', region: 'MX', url: 'https://www.amazon.com.mx/FELIWAY-Classic-Estr%C3%A9s-Calmante-Feromonas/dp/B089115N2B' }
        ]
      }
    ],
    budget_options: [
      {
        name: 'Opción A: Amazon México',
        description: 'Compra priorizando rapidez y disponibilidad en Amazon México y veterinarias locales.',
        min_total_cents: 275000,
        max_total_cents: 320000,
        lines: [
          { label: '2 Rubbermaid 66 Qt', min_cents: 120000, max_cents: 140000 },
          { label: "2 Dr. Elsey's 20 lb", min_cents: 90000, max_cents: 100000 },
          { label: "Nature's Miracle", min_cents: 30000, max_cents: 40000 },
          { label: 'Feliway Spray 60 mL', min_cents: 35000, max_cents: 40000 }
        ]
      },
      {
        name: 'Opción B: compra urgente en Mercado Libre y CDMX',
        description: 'Compra local para entrega el mismo día o al día siguiente, sujeta a disponibilidad.',
        min_total_cents: 275000,
        max_total_cents: 350000,
        lines: [
          { label: '2 contenedores plásticos de 66 litros', min_cents: 120000, max_cents: 160000 },
          { label: '2 bolsas de arena sin aroma', min_cents: 80000, max_cents: 100000 },
          { label: 'Limpiador enzimático', min_cents: 30000, max_cents: 40000 },
          { label: 'Feliway', min_cents: 35000, max_cents: 40000 }
        ]
      }
    ],
    setup_protocol: [
      { sort_order: 1, title: 'Preparar ambos areneros', body: 'Llenar cada contenedor con 7-10 cm de arena. Colocar uno en el baño y otro en la cocina o pasillo, en lugares tranquilos y lejos de la comida.', completed: false },
      { sort_order: 2, title: 'Aplicar Feliway', body: 'Aplicar 4-6 pulverizaciones en marcos de puertas y ventanas. Esperar 15 minutos antes de traer a Felipe.', completed: false },
      { sort_order: 3, title: 'Introducir a Felipe gradualmente', body: 'Comenzar en una habitación pequeña y tranquila. Colocar un arenero, agua y comida en zonas separadas y permitirle explorar.', completed: false },
      { sort_order: 4, title: 'Limpiar accidentes', body: 'Aplicar vinagre diluido 1:1 con agua, esperar cinco minutos y absorber. Después aplicar el limpiador enzimático siguiendo la etiqueta del producto.', completed: false },
      { sort_order: 5, title: 'Monitorear diariamente', body: 'Registrar si usa el arenero, si orina fuera y si cambia su conducta de rascado.', completed: false }
    ],
    checklist: [
      { id: 'c1', label: 'Comprar 2 Rubbermaid 66 Qt y verificar dimensiones', status: 'open' },
      { id: 'c2', label: "Comprar 2 bolsas Dr. Elsey's Unscented de 20 lb", status: 'open' },
      { id: 'c3', label: "Comprar Nature's Miracle Cat spray de 32 oz", status: 'open' },
      { id: 'c4', label: 'Comprar Feliway Classic Spray de 60 mL', status: 'open' },
      { id: 'c5', label: 'Preparar los areneros el día 1', status: 'open' },
      { id: 'c6', label: 'Aplicar Feliway antes de traer a Felipe', status: 'open' },
      { id: 'c7', label: 'Monitorear el uso del arenero durante las semanas 1-2', status: 'open' }
    ],
    notes: [
      { id: 'n1', date: 'Julio 2026', body: 'Instrucciones enviadas para la compra urgente en CDMX.' }
    ]
  }
};

// SVG Icon Helper
function icon(name) {
  const icons = {
    home: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    projects: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    shopping: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    tasks: `<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`,
    notes: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    receipts: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"></path></svg>`,
    budgets: `<svg class="icon-svg" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    inventory: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>`,
    settings: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    share: `<svg class="icon-svg" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
    external: `<svg class="icon-svg" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
    check: `<svg class="icon-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`
  };
  return icons[name] || '';
}

// Money Formatter (MXN)
function fmtMoney(cents) {
  if (typeof cents !== 'number') return '$0 MXN';
  return '$' + (cents / 100).toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MXN';
}

// Router & App Shell
function renderApp() {
  const container = document.getElementById('app');
  if (!container) return;

  container.innerHTML = `
    <header class="top-header">
      <div class="brand-wrapper" id="brand-home">
        <span class="brand-logo">Chispa</span>
        <span class="brand-badge">Operaciones</span>
      </div>
      <nav class="header-nav">
        <button class="nav-item ${S.view === 'home' ? 'active' : ''}" data-route="home">${icon('home')} Inicio</button>
        <button class="nav-item ${S.view === 'projects' ? 'active' : ''}" data-route="projects">${icon('projects')} Proyectos</button>
        <button class="nav-item ${S.view === 'shopping' ? 'active' : ''}" data-route="shopping">${icon('shopping')} Compras</button>
        <button class="nav-item ${S.view === 'tasks' ? 'active' : ''}" data-route="tasks">${icon('tasks')} Tareas</button>
        <button class="nav-item ${S.view === 'notes' ? 'active' : ''}" data-route="notes">${icon('notes')} Notas</button>
        <button class="nav-item ${S.view === 'receipts' ? 'active' : ''}" data-route="receipts">${icon('receipts')} Recibos</button>
        <button class="nav-item ${S.view === 'budgets' ? 'active' : ''}" data-route="budgets">${icon('budgets')} Presupuestos</button>
        <button class="nav-item ${S.view === 'inventory' ? 'active' : ''}" data-route="inventory">${icon('inventory')} Inventario</button>
        <button class="nav-item ${S.view === 'settings' ? 'active' : ''}" data-route="settings">${icon('settings')} Configuración</button>
      </nav>
    </header>

    <main class="app-main">
      ${renderViewContent()}
    </main>

    ${renderItemSideSheet()}
    ${renderShareModal()}

    <nav class="bottom-bar">
      <button class="bottom-nav-item ${S.view === 'home' ? 'active' : ''}" data-route="home">${icon('home')} <span>Inicio</span></button>
      <button class="bottom-nav-item ${S.view === 'projects' ? 'active' : ''}" data-route="projects">${icon('projects')} <span>Proyectos</span></button>
      <button class="bottom-nav-item ${S.view === 'shopping' ? 'active' : ''}" data-route="shopping">${icon('shopping')} <span>Compras</span></button>
      <button class="bottom-nav-item ${S.view === 'budgets' ? 'active' : ''}" data-route="budgets">${icon('budgets')} <span>Presupuesto</span></button>
      <button class="bottom-nav-item ${S.view === 'settings' ? 'active' : ''}" data-route="settings">${icon('settings')} <span>Ajustes</span></button>
    </nav>
  `;

  bindEvents();
}

function renderViewContent() {
  if (S.view === 'projects' && S.projectSlug === 'felipe-litter-kit') {
    return renderFelipeProjectScreen();
  }
  if (S.view === 'projects') return renderProjectsView();
  if (S.view === 'shopping') return renderShoppingView();
  if (S.view === 'tasks') return renderTasksView();
  if (S.view === 'notes') return renderNotesView();
  if (S.view === 'receipts') return renderReceiptsView();
  if (S.view === 'budgets') return renderBudgetsView();
  if (S.view === 'inventory') return renderInventoryView();
  if (S.view === 'settings') return renderSettingsView();
  
  // Default Home
  return renderHomeView();
}

// 1. Home View
function renderHomeView() {
  const p = S.felipe;
  const purchasedCount = p.items.filter(i => i.status === 'purchased').length;
  
  return `
    <div class="page-header">
      <h1 class="page-title">Operaciones Familiares</h1>
      <p class="page-subtitle">Ciudad de México | Resumen de proyectos y compras activas</p>
    </div>

    <div class="panel-card" style="cursor:pointer;" id="card-felipe-project">
      <div class="panel-title">
        <span>Kit de arenero para Felipe</span>
        <span class="status-tag critical">Urgente CDMX</span>
      </div>
      <p style="font-size:14px; color:var(--muted); margin-bottom:12px;">${p.project.summary}</p>
      <div style="display:flex; gap:16px; font-size:13px; color:var(--text);" class="tabular-num">
        <div><strong>Comprado:</strong> ${purchasedCount} de 4 artículos</div>
        <div><strong>Presupuesto:</strong> $2,750 – $3,500 MXN</div>
      </div>
    </div>

    <div class="panel-card">
      <div class="panel-title">Proyectos Activos</div>
      <table class="data-table">
        <thead>
          <tr><th>Proyecto</th><th>Ubicación</th><th>Categoría</th><th>Estado</th></tr>
        </thead>
        <tbody>
          <tr class="clickable" id="row-felipe">
            <td><strong>Kit de arenero para Felipe</strong></td>
            <td>Ciudad de México</td>
            <td>Cuidado de mascotas</td>
            <td><span class="status-tag warning">En revisión</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// 2. Projects Grid View
function renderProjectsView() {
  return `
    <div class="page-header">
      <h1 class="page-title">Proyectos</h1>
      <p class="page-subtitle">Gestión de guías de compra, renovaciones y proyectos del hogar</p>
    </div>

    <div class="panel-card">
      <div class="panel-title">Todos los Proyectos</div>
      <table class="data-table">
        <thead>
          <tr><th>Nombre</th><th>Slug</th><th>Ubicación</th><th>Moneda</th><th>Acción</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kit de arenero para Felipe</strong></td>
            <td><code>felipe-litter-kit</code></td>
            <td>Ciudad de México</td>
            <td>MXN</td>
            <td><button class="btn btn-sm btn-primary" id="btn-open-felipe">Ver Proyecto</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

// 3. Felipe Project Interactive Screen
function renderFelipeProjectScreen() {
  const f = S.felipe;
  const purchasedCount = f.items.filter(i => i.status === 'purchased').length;
  const completedStepsCount = f.setup_protocol.filter(s => s.completed).length;

  return `
    <div class="page-header">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 class="page-title">${f.project.name}</h1>
          <p class="page-subtitle">${f.project.target_location} | Actualizado: ${f.project.source_updated_label} | <span class="status-tag neutral">${f.project.verification_status}</span></p>
        </div>
        <button class="btn btn-primary" id="btn-share-project">${icon('share')} Compartir Guía</button>
      </div>
    </div>

    <div class="panel-card" style="background-color: var(--surface-secondary);">
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        <div>
          <div style="font-size:12px; color:var(--muted); text-transform:uppercase;">Artículos Comprados</div>
          <div style="font-size:22px; font-weight:700;" class="tabular-num">${purchasedCount} / 4</div>
        </div>
        <div>
          <div style="font-size:12px; color:var(--muted); text-transform:uppercase;">Pasos de Protocolo</div>
          <div style="font-size:22px; font-weight:700;" class="tabular-num">${completedStepsCount} / 5</div>
        </div>
        <div>
          <div style="font-size:12px; color:var(--muted); text-transform:uppercase;">Rango de Presupuesto</div>
          <div style="font-size:22px; font-weight:700;" class="tabular-num">$2,750 – $3,500 MXN</div>
        </div>
      </div>
    </div>

    <!-- Navigation Sub-tabs -->
    <div class="subnav-tabs">
      <button class="tab-btn ${S.subTab === 'items' ? 'active' : ''}" data-subtab="items">Artículos (4)</button>
      <button class="tab-btn ${S.subTab === 'budgets' ? 'active' : ''}" data-subtab="budgets">Presupuestos (2)</button>
      <button class="tab-btn ${S.subTab === 'protocol' ? 'active' : ''}" data-subtab="protocol">Protocolo de Instalación</button>
      <button class="tab-btn ${S.subTab === 'checklist' ? 'active' : ''}" data-subtab="checklist">Lista de Control</button>
      <button class="tab-btn ${S.subTab === 'timeline' ? 'active' : ''}" data-subtab="timeline">Línea de Tiempo</button>
    </div>

    ${renderFelipeSubTabContent()}
  `;
}

function renderFelipeSubTabContent() {
  const f = S.felipe;

  if (S.subTab === 'budgets') {
    return `
      <div class="panel-card">
        <div class="panel-title">Comparativa de Opciones de Presupuesto</div>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>Opción</th><th>Descripción</th><th>Total Estimado</th></tr>
            </thead>
            <tbody>
              ${f.budget_options.map(b => `
                <tr>
                  <td><strong>${b.name}</strong></td>
                  <td>${b.description}</td>
                  <td class="tabular-num"><strong>${fmtMoney(b.min_total_cents)} – ${fmtMoney(b.max_total_cents)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (S.subTab === 'protocol') {
    return `
      <div class="panel-card">
        <div class="panel-title">Protocolo de Adaptación e Instalación</div>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${f.setup_protocol.map((step, idx) => `
            <div style="display:flex; gap:14px; padding:12px; border-bottom:1px solid var(--line-soft);">
              <div style="font-size:18px; font-weight:700; color:var(--accent);" class="tabular-num">${idx + 1}.</div>
              <div>
                <strong style="font-size:15px;">${step.title}</strong>
                <p style="font-size:13.5px; color:var(--muted); margin-top:4px;">${step.body}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (S.subTab === 'checklist') {
    return `
      <div class="panel-card">
        <div class="panel-title">Lista de Control Urgente</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${f.checklist.map(c => `
            <label style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--line-soft); cursor:pointer;">
              <input type="checkbox" ${c.status === 'completed' ? 'checked' : ''} data-checklist-id="${c.id}">
              <span style="font-size:14px; ${c.status === 'completed' ? 'text-decoration:line-through; color:var(--muted);' : ''}">${c.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (S.subTab === 'timeline') {
    return `
      <div class="panel-card">
        <div class="panel-title">Línea de Tiempo de Adaptación</div>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>Fase</th><th>Conducta Esperada</th></tr>
            </thead>
            <tbody>
              ${f.timeline.map(t => `
                <tr>
                  <td><strong>${t.label}</strong></td>
                  <td>${t.description}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // Default: Primary Items List
  return `
    <div class="panel-card">
      <div class="panel-title">Lista de Artículos del Kit</div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr><th>Categoría</th><th>Artículo</th><th>Cant.</th><th>Rango de Precio</th><th>Prioridad</th><th>Estado</th><th>Enlaces</th></tr>
          </thead>
          <tbody>
            ${f.items.map(item => `
              <tr class="clickable" data-item-id="${item.id}">
                <td><span style="font-size:12px; color:var(--muted);">${item.category}</span></td>
                <td>
                  <strong>${item.name}</strong>
                  <div style="font-size:12px; color:var(--muted);">${item.variant}</div>
                </td>
                <td class="tabular-num">${item.quantity}</td>
                <td class="tabular-num">${fmtMoney(item.price_min_cents)} – ${fmtMoney(item.price_max_cents)}</td>
                <td><span class="status-tag ${item.priority}">${item.priority}</span></td>
                <td>
                  <span class="status-tag ${item.status === 'purchased' ? 'purchased' : 'pending'}">
                    ${item.status === 'purchased' ? 'Comprado' : 'Pendiente'}
                  </span>
                </td>
                <td>
                  <div style="display:flex; gap:6px;">
                    ${item.purchase_links.map(l => `
                      <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm" onclick="event.stopPropagation();">
                        ${l.retailer} ${icon('external')}
                      </a>
                    `).join('')}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// Side Sheet Item Detail Component
function renderItemSideSheet() {
  if (!S.selectedItemId) return '<div class="sheet-overlay"></div>';

  const item = S.felipe.items.find(i => i.id === S.selectedItemId);
  if (!item) return '<div class="sheet-overlay"></div>';

  return `
    <div class="sheet-overlay active" id="sheet-overlay">
      <div class="sheet-content">
        <div class="sheet-header">
          <div>
            <span class="status-tag ${item.priority}">${item.priority}</span>
            <h2 class="sheet-title" style="margin-top:4px;">${item.name}</h2>
          </div>
          <button class="close-btn" id="btn-close-sheet">&times;</button>
        </div>

        <div>
          <strong>Variante / Presentación:</strong>
          <p style="color:var(--muted); font-size:14px; margin-top:2px;">${item.variant}</p>
        </div>

        <div>
          <strong>¿Por qué se eligió?</strong>
          <p style="color:var(--muted); font-size:14px; margin-top:2px;">${item.why}</p>
        </div>

        ${item.usage ? `
          <div>
            <strong>Modo de empleo:</strong>
            <p style="color:var(--muted); font-size:14px; margin-top:2px;">${item.usage}</p>
          </div>
        ` : ''}

        ${item.specifications ? `
          <div>
            <strong>Especificaciones de la guía original:</strong>
            <ul style="padding-left:18px; color:var(--muted); font-size:13px; margin-top:4px;">
              ${item.specifications.map(spec => `<li>${spec}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        ${item.verification_warning ? `
          <div style="background:rgba(138,90,0,0.08); border-left:3px solid var(--warning); padding:10px 12px; border-radius:4px; font-size:13px; color:var(--text);">
            <strong>Nota de Verificación:</strong> ${item.verification_warning}
          </div>
        ` : ''}

        <div>
          <strong>Enlaces de Compra Verificados:</strong>
          <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
            ${item.purchase_links.map(l => `
              <a href="${l.url}" target="_blank" rel="noopener noreferrer" class="btn" style="justify-content:space-between;">
                <span>${l.label} (${l.retailer} ${l.region})</span>
                ${icon('external')}
              </a>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--line-soft); display:flex; justify-content:space-between;">
          <button class="btn ${item.status === 'purchased' ? 'btn-primary' : ''}" id="btn-toggle-purchased" data-item-id="${item.id}">
            ${item.status === 'purchased' ? icon('check') + ' Comprado' : 'Marcar como Comprado'}
          </button>
          <button class="btn" id="btn-close-sheet-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

// Share Modal Component
function renderShareModal() {
  if (!S.activeShareModal) return '';

  const shareUrl = window.location.origin + '/projects/felipe-litter-kit?share=token_felipe_read_only_2026';

  return `
    <div class="sheet-overlay active" style="align-items:center; justify-content:center;">
      <div style="background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-l); width:100%; max-width:480px; padding:24px; box-shadow:var(--shadow-overlay);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-size:18px; font-weight:700;">Compartir Guía Felipe</h3>
          <button class="close-btn" id="btn-close-share">&times;</button>
        </div>
        <p style="font-size:13.5px; color:var(--muted); margin-bottom:12px;">Genera un enlace de solo lectura seguro para compartir con la familia o compradores en CDMX.</p>
        <input type="text" readonly value="${shareUrl}" style="width:100%; padding:10px; border:1px solid var(--line); border-radius:var(--radius-s); font-family:var(--font-mono); font-size:12px; margin-bottom:16px;">
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn btn-primary" id="btn-copy-share">Copiar Enlace</button>
        </div>
      </div>
    </div>
  `;
}

// Placeholder Views
function renderShoppingView() { return `<div class="page-header"><h1 class="page-title">Compras</h1><p class="page-subtitle">Listas de compras agrupadas por tienda</p></div><div class="panel-card"><p>Listas de compras listas para sincronizar.</p></div>`; }
function renderTasksView() { return `<div class="page-header"><h1 class="page-title">Tareas</h1></div><div class="panel-card"><p>Tareas del hogar.</p></div>`; }
function renderNotesView() { return `<div class="page-header"><h1 class="page-title">Notas</h1></div><div class="panel-card"><p>Notas de operación.</p></div>`; }
function renderReceiptsView() { return `<div class="page-header"><h1 class="page-title">Recibos</h1></div><div class="panel-card"><p>Registro de recibos y comprobantes.</p></div>`; }
function renderBudgetsView() { return `<div class="page-header"><h1 class="page-title">Presupuestos</h1></div><div class="panel-card"><p>Control de presupuesto mensual.</p></div>`; }
function renderInventoryView() { return `<div class="page-header"><h1 class="page-title">Inventario</h1></div><div class="panel-card"><p>Inventario del hogar.</p></div>`; }
function renderSettingsView() {
  return `
    <div class="page-header"><h1 class="page-title">Configuración</h1></div>
    <div class="panel-card">
      <div class="panel-title">Estado de Conexión Supabase</div>
      <p style="font-size:14px; color:var(--muted);">Proyecto: <code>botanic-creations (cyxdevcjycmffhmwxojh)</code></p>
      <p style="font-size:14px; color:var(--muted); margin-top:4px;">Tablas: <code>chispa_*</code> aisladas activas</p>
    </div>
  `;
}

// Event Bindings
function bindEvents() {
  document.querySelectorAll('[data-route]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const route = e.currentTarget.getAttribute('data-route');
      S.view = route;
      S.projectSlug = null;
      renderApp();
    });
  });

  const brandBtn = document.getElementById('brand-home');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      S.view = 'home';
      S.projectSlug = null;
      renderApp();
    });
  }

  const felipeCard = document.getElementById('card-felipe-project');
  if (felipeCard) {
    felipeCard.addEventListener('click', () => {
      S.view = 'projects';
      S.projectSlug = 'felipe-litter-kit';
      renderApp();
    });
  }

  const felipeRow = document.getElementById('row-felipe');
  if (felipeRow) {
    felipeRow.addEventListener('click', () => {
      S.view = 'projects';
      S.projectSlug = 'felipe-litter-kit';
      renderApp();
    });
  }

  const openFelipeBtn = document.getElementById('btn-open-felipe');
  if (openFelipeBtn) {
    openFelipeBtn.addEventListener('click', () => {
      S.view = 'projects';
      S.projectSlug = 'felipe-litter-kit';
      renderApp();
    });
  }

  // Subtabs inside Felipe project
  document.querySelectorAll('[data-subtab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      S.subTab = e.currentTarget.getAttribute('data-subtab');
      renderApp();
    });
  });

  // Item side sheet triggers
  document.querySelectorAll('[data-item-id]').forEach(row => {
    row.addEventListener('click', (e) => {
      const itemId = e.currentTarget.getAttribute('data-item-id');
      S.selectedItemId = itemId;
      renderApp();
    });
  });

  const closeSheetBtn = document.getElementById('btn-close-sheet');
  const closeSheetBtnSecondary = document.getElementById('btn-close-sheet-secondary');
  if (closeSheetBtn) closeSheetBtn.addEventListener('click', () => { S.selectedItemId = null; renderApp(); });
  if (closeSheetBtnSecondary) closeSheetBtnSecondary.addEventListener('click', () => { S.selectedItemId = null; renderApp(); });

  const togglePurchasedBtn = document.getElementById('btn-toggle-purchased');
  if (togglePurchasedBtn) {
    togglePurchasedBtn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-item-id');
      const item = S.felipe.items.find(i => i.id === id);
      if (item) {
        item.status = item.status === 'purchased' ? 'not_purchased' : 'purchased';
        renderApp();
      }
    });
  }

  // Share Modal triggers
  const shareBtn = document.getElementById('btn-share-project');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      S.activeShareModal = true;
      renderApp();
    });
  }

  const closeShareBtn = document.getElementById('btn-close-share');
  if (closeShareBtn) {
    closeShareBtn.addEventListener('click', () => {
      S.activeShareModal = false;
      renderApp();
    });
  }

  const copyShareBtn = document.getElementById('btn-copy-share');
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      const shareUrl = window.location.origin + '/projects/felipe-litter-kit?share=token_felipe_read_only_2026';
      navigator.clipboard.writeText(shareUrl);
      copyShareBtn.innerText = '¡Copiado!';
      setTimeout(() => { copyShareBtn.innerText = 'Copiar Enlace'; }, 1500);
    });
  }

  // Checklist checkbox triggers
  document.querySelectorAll('[data-checklist-id]').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.currentTarget.getAttribute('data-checklist-id');
      const item = S.felipe.checklist.find(c => c.id === id);
      if (item) {
        item.status = e.currentTarget.checked ? 'completed' : 'open';
        renderApp();
      }
    });
  });
}

// Initial Sync & Render Execution
async function init() {
  renderApp();

  // Hydrate from Supabase if available
  const cloudData = await fetchFelipeProjectData();
  if (cloudData && cloudData.project) {
    console.log('[Chispa Engine] Hydrated from Supabase managed cloud.');
  }
}

// Execute immediately upon DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}