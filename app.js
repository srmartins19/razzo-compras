// ---- NAVIGATION ----
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item');
const breadcrumb = document.getElementById('breadcrumb');

const pageNames = {
  dashboard: 'Dashboard',
  requisitions: 'Requisições',
  rfq: 'Cotações (RFQ)',
  orders: 'Pedidos de Compra',
  contracts: 'Contratos',
  invoices: 'Notas Fiscais',
  suppliers: 'Fornecedores',
  catalog: 'Catálogo',
  approvals: 'Aprovações',
  analytics: 'Analytics',
  integrations: 'Integrações',
  settings: 'Configurações',
};

function showPage(id) {
  pages.forEach(p => p.classList.remove('active'));
  navItems.forEach(n => n.classList.remove('active'));

  const page = document.getElementById('page-' + id);
  if (page) page.classList.add('active');

  const navItem = document.querySelector(`[data-page="${id}"]`);
  if (navItem) navItem.classList.add('active');

  breadcrumb.textContent = pageNames[id] || id;

  // Close sidebar on mobile
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar').classList.remove('open');
  }

  // Init charts lazily
  if (id === 'dashboard') initDashboardCharts();
  if (id === 'analytics') initAnalyticsCharts();
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(item.dataset.page);
  });
});

// ---- SIDEBAR TOGGLE ----
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

// ---- MODALS ----
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
window.openModal = openModal;
window.closeModal = closeModal;

// ---- DASHBOARD CHARTS ----
let dashChartsInitted = false;
function initDashboardCharts() {
  if (dashChartsInitted) return;
  dashChartsInitted = true;

  const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'];

  // Spend by Category - Bar
  const spendCtx = document.getElementById('spendChart');
  if (spendCtx) {
    new Chart(spendCtx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'TI & Tecnologia',
            data: [142, 160, 120, 185, 145, 168],
            backgroundColor: 'rgba(59,130,246,0.75)',
            borderRadius: 5,
          },
          {
            label: 'MRO',
            data: [65, 70, 58, 82, 75, 90],
            backgroundColor: 'rgba(168,85,247,0.75)',
            borderRadius: 5,
          },
          {
            label: 'Serviços',
            data: [88, 92, 85, 100, 95, 112],
            backgroundColor: 'rgba(245,158,11,0.75)',
            borderRadius: 5,
          },
          {
            label: 'Logística',
            data: [40, 35, 42, 50, 38, 47],
            backgroundColor: 'rgba(34,197,94,0.75)',
            borderRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#9aa0b8', font: { size: 11 }, padding: 14, boxWidth: 12 },
          },
          tooltip: { mode: 'index' },
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(42,48,68,0.5)' },
            ticks: { color: '#636b86', font: { size: 11 } },
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(42,48,68,0.5)' },
            ticks: {
              color: '#636b86',
              font: { size: 11 },
              callback: v => 'R$' + v + 'K',
            },
          },
        },
      },
    });
  }
}

// ---- ANALYTICS CHARTS ----
let analyticsInitted = false;
function initAnalyticsCharts() {
  if (analyticsInitted) return;
  analyticsInitted = true;

  const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'];
  const lineOpts = (color) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: {} },
    scales: {
      x: { grid: { color: 'rgba(42,48,68,0.5)' }, ticks: { color: '#636b86', font: { size: 10 } } },
      y: { grid: { color: 'rgba(42,48,68,0.5)' }, ticks: { color: '#636b86', font: { size: 10 } } },
    },
    elements: { point: { radius: 3, hoverRadius: 5 } },
  });

  const sparkData = (data, color) => ({
    labels: months,
    datasets: [{
      data,
      borderColor: color,
      backgroundColor: color.replace('1)', '0.1)'),
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    }],
  });

  const sC = document.getElementById('savingsChart');
  if (sC) new Chart(sC, { type: 'line', data: sparkData([145, 160, 140, 175, 190, 213], 'rgba(34,197,94,1)'), options: lineOpts('rgba(34,197,94,1)') });

  const lC = document.getElementById('leadChart');
  if (lC) new Chart(lC, { type: 'line', data: sparkData([11.2, 10.8, 10.1, 9.5, 9.6, 8.2], 'rgba(59,130,246,1)'), options: lineOpts('rgba(59,130,246,1)') });

  const cC = document.getElementById('complianceChart');
  if (cC) new Chart(cC, { type: 'line', data: sparkData([88, 90, 91, 92, 93, 94.3], 'rgba(168,85,247,1)'), options: lineOpts('rgba(168,85,247,1)') });

  const srmC = document.getElementById('srmChart');
  if (srmC) new Chart(srmC, { type: 'line', data: sparkData([7.2, 7.5, 7.6, 7.8, 7.8, 8.1], 'rgba(245,158,11,1)'), options: lineOpts('rgba(245,158,11,1)') });
}

// ---- INIT ----
showPage('dashboard');
