/**
 * BidFlow — Componente: Pedidos de Compra (orders.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Listagem de pedidos com Kanban e visão tabela
 *  - Detalhe completo do pedido (painel lateral)
 *  - Fluxo de aprovação por alçada
 *  - Rastreamento de entrega
 *  - Confirmação de recebimento
 *  - Geração de PO a partir de cotação vencedora
 *
 * Integração Datasul (quando ativada — ver api.js):
 *   GET  /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic
 *   PUT  /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic/{id}
 *   POST /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic
 *
 * Manutenção: se algo der errado em pedidos, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.OrdersModule = (function () {

  // ── Constantes ────────────────────────────────────────────────
  const STATUS_FLOW = ['Rascunho','Aprovacao','Aprovado','Transito','Recebido','Cancelado'];

  const STATUS_META = {
    Rascunho:  { cls:'status-gray',   icon:'✎',  color:'#8892a8', trackIdx:0 },
    Aprovacao: { cls:'status-amber',  icon:'⏳', color:'#d97706', trackIdx:1 },
    Aprovado:  { cls:'status-blue',   icon:'✓',  color:'#2563a8', trackIdx:2 },
    Transito:  { cls:'status-purple', icon:'🚚', color:'#7c3aed', trackIdx:3 },
    Recebido:  { cls:'status-green',  icon:'✅', color:'#16a34a', trackIdx:4 },
    Cancelado: { cls:'status-red',    icon:'✕',  color:'#dc2626', trackIdx:-1 },
  };

  const KANBAN_COLS = [
    { key:'Rascunho',  label:'Rascunho',     countCls:'' },
    { key:'Aprovacao', label:'Aprovação',     countCls:'kanban-count-amber' },
    { key:'Aprovado',  label:'Aprovado',      countCls:'kanban-count-blue' },
    { key:'Transito',  label:'Em Trânsito',   countCls:'kanban-count-purple' },
    { key:'Recebido',  label:'Recebido',      countCls:'kanban-count-green' },
  ];

  const TRACKING_STEPS = ['Pedido emitido','Aprovado','Enviado','Em trânsito','Entregue'];

  // ── CSS do módulo ─────────────────────────────────────────────
  const CSS = `
  /* ── orders.module.css ── */
  .ord-view-toggle{display:flex;gap:4px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:3px}
  .ord-view-btn{padding:5px 12px;border-radius:6px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;background:none;color:var(--text-3);font-family:'DM Sans',sans-serif;transition:all .15s}
  .ord-view-btn.active{background:var(--bg-2);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.08)}

  /* Stats */
  .ord-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
  .ord-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow);border-top:3px solid transparent}
  .ord-stat-val{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--text);display:block}
  .ord-stat-label{font-size:11px;color:var(--text-3);display:block;margin-top:1px}

  /* Kanban */
  .ord-kanban{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px;min-height:400px}
  .ord-kanban-col{min-width:200px;flex:1;display:flex;flex-direction:column;gap:0}
  .ord-kanban-col-header{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px 8px 0 0;background:var(--bg-3);border:1px solid var(--border);border-bottom:none}
  .ord-kanban-col-title{font-size:12.5px;font-weight:600;color:var(--text-2)}
  .ord-kanban-body{flex:1;border:1px solid var(--border);border-top:none;border-radius:0 0 8px 8px;padding:8px;background:var(--bg-3);display:flex;flex-direction:column;gap:8px}
  .ord-card{background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;cursor:pointer;transition:all .15s;box-shadow:var(--shadow)}
  .ord-card:hover{border-color:var(--navy-mid);transform:translateY(-1px)}
  .ord-card.urgent{border-left:3px solid var(--red)}
  .ord-card.done{opacity:.7}
  .ord-card-badge{font-size:10px;font-weight:700;color:var(--red);letter-spacing:.06em;margin-bottom:5px}
  .ord-card-id{font-family:monospace;font-size:10.5px;color:var(--text-3);margin-bottom:3px}
  .ord-card-title{font-size:13px;font-weight:500;color:var(--text);margin-bottom:7px;line-height:1.3}
  .ord-card-meta{display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3)}
  .ord-card-valor{font-weight:600;color:var(--navy)}
  .ord-card-tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px}
  .ord-approvers{display:flex;gap:5px;margin-top:8px;flex-wrap:wrap}
  .ord-approver-pill{font-size:10.5px;padding:2px 8px;border-radius:20px}
  .ord-tracking-mini{display:flex;margin-top:8px}
  .ord-track-step{flex:1;text-align:center;font-size:9px;padding:3px 1px;border-bottom:2px solid var(--bg-4);color:var(--text-3);line-height:1.2}
  .ord-track-step.done{border-color:var(--green);color:var(--green)}
  .ord-track-step.active{border-color:var(--navy-mid);color:var(--navy-mid);font-weight:600}
  .ord-empty-col{text-align:center;padding:24px 8px;color:var(--text-3);font-size:12px;border:2px dashed var(--border);border-radius:8px;margin:4px 0}

  /* Table view */
  .ord-table-wrap{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow)}

  /* Detail panel */
  .ord-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;align-items:flex-start;justify-content:flex-end}
  .ord-detail-overlay.open{display:flex}
  .ord-detail-panel{width:620px;max-width:96vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.15);animation:slideIn .25s ease;display:flex;flex-direction:column}

  /* Tabs */
  .ord-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 20px;background:var(--bg-2);position:sticky;top:0;z-index:1}
  .ord-tab{padding:11px 14px;font-size:13px;font-weight:500;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif}
  .ord-tab.active{color:var(--navy);border-bottom-color:var(--navy)}
  .ord-tab-content{display:none;padding:20px;flex:1}
  .ord-tab-content.active{display:block}

  /* Aprovação */
  .aprov-flow{display:flex;flex-direction:column;gap:12px;margin-top:8px}
  .aprov-step{display:flex;gap:14px;align-items:flex-start}
  .aprov-step-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:2px solid}
  .aprov-step-dot.approved{background:var(--green-light);border-color:var(--green);color:var(--green)}
  .aprov-step-dot.pending{background:var(--amber-light);border-color:var(--amber);color:var(--amber)}
  .aprov-step-dot.waiting{background:var(--bg-4);border-color:var(--border-light);color:var(--text-3)}
  .aprov-step-info{flex:1;padding-top:4px}
  .aprov-step-title{font-size:13.5px;font-weight:500;color:var(--text)}
  .aprov-step-sub{font-size:12px;color:var(--text-3);margin-top:2px}
  .aprov-btns{display:flex;gap:8px;margin-top:10px}
  .btn-approve{background:var(--green-light);color:var(--green);border:1px solid rgba(22,163,74,.3);padding:7px 16px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif}
  .btn-reject{background:var(--red-light);color:var(--red);border:1px solid rgba(220,38,38,.3);padding:7px 16px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif}

  /* Tracking */
  .ord-track-full{display:flex;margin:16px 0;position:relative}
  .ord-track-full::before{content:'';position:absolute;top:18px;left:18px;right:18px;height:2px;background:var(--bg-4);z-index:0}
  .ord-track-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;position:relative;z-index:1}
  .ord-track-circle{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid var(--border);background:var(--bg-2)}
  .ord-track-circle.done{background:var(--green);border-color:var(--green);color:#fff}
  .ord-track-circle.active{background:var(--navy);border-color:var(--navy);color:#fff;box-shadow:0 0 0 4px var(--navy-light)}
  .ord-track-label{font-size:11px;text-align:center;color:var(--text-3);max-width:70px;line-height:1.3}
  .ord-track-label.done{color:var(--green);font-weight:500}
  .ord-track-label.active{color:var(--navy);font-weight:600}

  /* NF conciliação preview */
  .nf-preview-box{background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:14px;margin-top:8px}
  .nf-preview-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid var(--border)}
  .nf-preview-row:last-child{border-bottom:none;font-weight:700;font-size:14px;padding-top:10px}
  .nf-diff-ok{color:var(--green);font-weight:600}
  .nf-diff-warn{color:var(--red);font-weight:600}

  /* Datasul badge */
  .datasul-info-box{background:var(--navy-light);border:1px solid rgba(30,58,95,.2);border-radius:8px;padding:11px 13px;font-size:12.5px;color:var(--navy);margin-top:12px;line-height:1.6}

  /* New PO modal */
  .po-items-table{width:100%;border-collapse:collapse;margin-top:6px}
  .po-items-table th{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);padding:6px 8px;text-align:left;border-bottom:1px solid var(--border)}
  .po-items-table td{padding:7px 8px;border-bottom:1px solid var(--border);font-size:13px}
  .po-items-table tr:last-child td{border-bottom:none}

  @media(max-width:1200px){.ord-stats{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:900px){.ord-kanban-col{min-width:170px}.ord-stats{grid-template-columns:repeat(2,1fr)}}
  `;

  // ── Estado interno ─────────────────────────────────────────────
  let currentView   = 'kanban'; // 'kanban' | 'table'
  let currentOrder  = null;
  let currentTab    = 'resumo';
  let filteredOrders= [];

  // ── HTML da página ─────────────────────────────────────────────
  function renderPageHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Pedidos de Compra</h1>
        <p class="page-subtitle" id="ord-subtitle">Acompanhe o ciclo completo de cada pedido</p>
      </div>
      <div class="page-actions">
        <div class="ord-view-toggle">
          <button class="ord-view-btn active" id="ord-btn-kanban" onclick="OrdersModule.setView('kanban')">⬛ Kanban</button>
          <button class="ord-view-btn" id="ord-btn-table"  onclick="OrdersModule.setView('table')">☰ Tabela</button>
        </div>
        <button class="btn btn-secondary" onclick="OrdersModule.exportCSV()">Exportar</button>
        <button class="btn btn-primary"   onclick="OrdersModule.openNewPOModal()">+ Novo Pedido</button>
      </div>
    </div>

    <!-- Datasul banner -->
    <div class="datasul-info-box" style="margin-bottom:20px">
      🔗 <strong>Integração Datasul — Fase 3:</strong> quando ativada, pedidos serão criados automaticamente
      ao confirmar cotação vencedora via
      <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px;font-size:11.5px">POST /mcc/v1/purchOrderPublic</code>
      e atualizados em tempo real via
      <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px;font-size:11.5px">PUT /mcc/v1/purchOrderPublic/{id}</code>.
    </div>

    <!-- Stats -->
    <div class="ord-stats" id="ord-stats"></div>

    <!-- Filtros -->
    <div class="filter-bar" style="margin-bottom:16px">
      <div class="filter-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="ord-search" placeholder="Buscar por ID, título, fornecedor..." oninput="OrdersModule.filter()">
      </div>
      <select class="filter-select" id="ord-filter-status" onchange="OrdersModule.filter()">
        <option value="">Todos os status</option>
        ${STATUS_FLOW.map(s=>`<option value="${s}">${s}</option>`).join('')}
      </select>
      <select class="filter-select" id="ord-filter-forn" onchange="OrdersModule.filter()">
        <option value="">Todos os fornecedores</option>
      </select>
      <select class="filter-select" id="ord-filter-sort" onchange="OrdersModule.filter()">
        <option value="date">Mais recentes</option>
        <option value="valor_desc">Maior valor</option>
        <option value="urgente">Urgentes primeiro</option>
      </select>
    </div>

    <!-- Kanban view -->
    <div id="ord-kanban-view"><div class="ord-kanban" id="ord-kanban"></div></div>

    <!-- Table view -->
    <div id="ord-table-view" style="display:none">
      <div class="ord-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID / Data</th><th>Título</th><th>Fornecedor</th>
              <th>Valor</th><th>Status</th><th>Previsão Entrega</th>
              <th>NF</th><th></th>
            </tr>
          </thead>
          <tbody id="ord-table-tbody"></tbody>
        </table>
        <div class="table-footer">
          <span class="table-info" id="ord-table-info"></span>
        </div>
      </div>
    </div>

    <!-- Detail panel -->
    <div class="ord-detail-overlay" id="ordDetailOverlay" onclick="OrdersModule.closeDetail(event)">
      <div class="ord-detail-panel">
        <div class="req-detail-header">
          <div>
            <div style="font-family:monospace;font-size:12px;color:var(--text-3)" id="ord-detail-id"></div>
            <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-top:4px" id="ord-detail-title"></h2>
            <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap" id="ord-detail-meta"></div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
            <span class="status-badge" id="ord-detail-badge"></span>
            <button onclick="OrdersModule.closeDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
          </div>
        </div>
        <div class="ord-tabs" id="ord-tabs-bar">
          <button class="ord-tab active"  onclick="OrdersModule.switchTab('resumo')">Resumo</button>
          <button class="ord-tab"         onclick="OrdersModule.switchTab('aprovacao')">Aprovação</button>
          <button class="ord-tab"         onclick="OrdersModule.switchTab('rastreio')">Rastreio</button>
          <button class="ord-tab"         onclick="OrdersModule.switchTab('nf')">Nota Fiscal</button>
          <button class="ord-tab"         onclick="OrdersModule.switchTab('historico')">Histórico</button>
        </div>
        <div id="ord-tab-resumo"    class="ord-tab-content active"></div>
        <div id="ord-tab-aprovacao" class="ord-tab-content"></div>
        <div id="ord-tab-rastreio"  class="ord-tab-content"></div>
        <div id="ord-tab-nf"        class="ord-tab-content"></div>
        <div id="ord-tab-historico" class="ord-tab-content"></div>
        <div class="req-detail-footer" id="ord-detail-footer"></div>
      </div>
    </div>

    <!-- Modal: Novo Pedido manual -->
    <div class="modal-overlay" id="newPOModal" onclick="if(event.target===this)OrdersModule.closeNewPOModal()">
      <div class="modal" style="width:600px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Novo Pedido de Compra</h2>
          <button class="modal-close" onclick="OrdersModule.closeNewPOModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="background:var(--amber-light);border:1px solid rgba(217,119,6,.3);border-radius:8px;padding:10px 14px;font-size:12.5px;color:var(--amber);margin-bottom:16px">
            ⚡ Pedidos gerados a partir de cotação vencedora são criados automaticamente.
            Use este formulário apenas para pedidos emergenciais.
          </div>
          <div class="form-row">
            <div class="form-group"><label>Título *</label>
              <input type="text" class="form-input" id="po-f-titulo" placeholder="Ex: Servidor Dell PowerEdge">
            </div>
            <div class="form-group"><label>Fornecedor *</label>
              <select class="form-input" id="po-f-forn">
                <option value="">Selecione...</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Centro de Custo</label>
              <select class="form-input" id="po-f-cc">
                <option value="">Selecione...</option>
                <option>TI & Tecnologia</option><option>Administrativo</option>
                <option>Produção</option><option>Logística</option><option>Manutenção</option>
              </select>
            </div>
            <div class="form-group"><label>Previsão de Entrega</label>
              <input type="date" class="form-input" id="po-f-previsao">
            </div>
          </div>
          <div class="form-group"><label>Itens do Pedido</label>
            <table class="po-items-table" id="po-items-tbl">
              <thead><tr><th>Descrição</th><th>Qtd.</th><th>Unid.</th><th>Valor Unit. (R$)</th><th></th></tr></thead>
              <tbody id="po-items-body">
                <tr id="po-row-0">
                  <td><input type="text" class="form-input" placeholder="Item" style="font-size:12.5px"></td>
                  <td><input type="number" class="form-input" value="1" min="1" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
                  <td><input type="text" class="form-input" value="UN" style="font-size:12.5px"></td>
                  <td><input type="number" class="form-input" placeholder="0,00" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <button class="items-add-btn" onclick="OrdersModule.addPOItem()">+ Item</button>
            <div style="text-align:right;margin-top:6px;font-size:13px">Total: <strong id="po-total">R$ 0</strong></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Condição de Pagamento</label>
              <select class="form-input" id="po-f-pagto">
                <option>30 ddl</option><option>28 ddl</option><option>À vista</option>
              </select>
            </div>
            <div class="form-group"><label>Urgente?</label>
              <select class="form-input" id="po-f-urgente">
                <option value="false">Não</option><option value="true">Sim</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>Justificativa (pedido emergencial)</label>
            <textarea class="form-input" id="po-f-just" rows="2" placeholder="Motivo da compra emergencial..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="OrdersModule.closeNewPOModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="OrdersModule.submitNewPO()">Criar Pedido</button>
        </div>
      </div>
    </div>
    `;
  }

  // ── Helpers ────────────────────────────────────────────────────
  const brl  = v => 'R$ ' + (v>=1000?(v/1000).toFixed(0)+'K':Number(v).toLocaleString('pt-BR'));
  const brlF = v => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const toast = msg => window.toast?.(msg);

  function getDB() { return BF.db.pedidos; }

  function buildMockPedidos() {
    // Enriches with extra fields if not present
    getDB().forEach(p => {
      if (!p.aprovacoes) {
        const needDir = p.valor > 50000;
        p.aprovacoes = [
          { nivel:'Gerência Compras', alca:10000, aprovador:'Maria Ribeiro',     status: p.status==='Rascunho'?'pending':'approved', data: p.status!=='Rascunho'?'14/03 10h':'' },
          { nivel:'Diretoria',        alca:999999, aprovador:'Roberto Alves',    status: needDir?(p.status==='Aprovado'||p.status==='Transito'||p.status==='Recebido'?'approved':'pending'):'n/a', data:'' },
        ];
      }
      if (!p.historico) {
        p.historico = [
          { data:p.emissao||'10/03', acao:'Pedido criado',         user:'Sistema', cor:'blue' },
          { data:p.emissao||'10/03', acao:'Enviado para aprovação', user:'Sistema', cor:'amber' },
        ];
        if (p.status==='Aprovado'||p.status==='Transito'||p.status==='Recebido')
          p.historico.push({ data:'11/03', acao:'Aprovado — Gerência', user:'Maria Ribeiro', cor:'green' });
        if (p.status==='Transito'||p.status==='Recebido')
          p.historico.push({ data:'14/03', acao:'PO enviado ao fornecedor', user:'Sistema', cor:'blue' });
        if (p.status==='Recebido')
          p.historico.push({ data:p.previsaoEntrega||'17/03', acao:'Recebimento confirmado', user:'Carlos Mendes', cor:'green' });
      }
      if (!p.itens) p.itens = [{ desc:p.titulo, qtd:1, unid:'UN', valor:p.valor }];
      if (!p.emissao)         p.emissao         = '10/03/2026';
      if (!p.previsaoEntrega) p.previsaoEntrega = '25/03/2026';
      if (!p.rfqOrigem)       p.rfqOrigem       = '—';
      if (!p.datasulPOId)     p.datasulPOId     = '';
      if (p.nfUpload === undefined) p.nfUpload  = null;
    });
  }

  // ── Stats ──────────────────────────────────────────────────────
  function renderStats() {
    const all = getDB();
    const totalValor = all.reduce((s,p)=>s+(p.valor||0),0);
    const stats = [
      { label:'Total',          val: all.length,                                       color: '#8892a8' },
      { label:'Aguardando aprov.',val:all.filter(p=>p.status==='Aprovacao').length,    color: '#d97706' },
      { label:'Em Trânsito',    val: all.filter(p=>p.status==='Transito').length,      color: '#7c3aed' },
      { label:'Recebidos (mês)',val: all.filter(p=>p.status==='Recebido').length,      color: '#16a34a' },
      { label:'Valor em aberto',val: brl(all.filter(p=>p.status!=='Recebido'&&p.status!=='Cancelado').reduce((s,p)=>s+(p.valor||0),0)), color:'#1e3a5f' },
    ];
    document.getElementById('ord-stats').innerHTML = stats.map(s=>`
      <div class="ord-stat" style="border-top-color:${s.color}">
        <span class="ord-stat-val">${s.val}</span>
        <span class="ord-stat-label">${s.label}</span>
      </div>`).join('');
    document.getElementById('ord-subtitle').textContent =
      `${all.length} pedidos · ${all.filter(p=>p.status==='Aprovacao').length} aguardando aprovação · ${brl(totalValor)} em processamento`;
  }

  // ── Filter ─────────────────────────────────────────────────────
  function applyFilter() {
    const search = (document.getElementById('ord-search')||{}).value?.toLowerCase()||'';
    const status = (document.getElementById('ord-filter-status')||{}).value||'';
    const forn   = (document.getElementById('ord-filter-forn')||{}).value||'';
    const sort   = (document.getElementById('ord-filter-sort')||{}).value||'date';

    filteredOrders = getDB().filter(p => {
      const ms = !search || (p.id+p.titulo+(p.fornecedor||'')).toLowerCase().includes(search);
      const mst= !status || p.status===status;
      const mf = !forn   || (p.fornecedor||'').includes(forn);
      return ms && mst && mf;
    });
    if (sort==='valor_desc') filteredOrders.sort((a,b)=>(b.valor||0)-(a.valor||0));
    if (sort==='urgente')    filteredOrders.sort((a,b)=>(b.urgente?1:0)-(a.urgente?1:0));

    if (currentView==='kanban') renderKanban();
    else renderTable();
  }

  // ── Kanban ─────────────────────────────────────────────────────
  function renderKanban() {
    const board = document.getElementById('ord-kanban');
    if (!board) return;
    board.innerHTML = KANBAN_COLS.map(col => {
      const cards = filteredOrders.filter(p=>p.status===col.key);
      const trackIdx = STATUS_META[col.key]?.trackIdx || 0;
      return `
      <div class="ord-kanban-col">
        <div class="ord-kanban-col-header">
          <span class="ord-kanban-col-title">${col.label}</span>
          <span class="kanban-count ${col.countCls}">${cards.length}</span>
        </div>
        <div class="ord-kanban-body">
          ${cards.length===0?`<div class="ord-empty-col">Nenhum pedido</div>`:''}
          ${cards.map(p => {
            const st = STATUS_META[p.status]||STATUS_META.Rascunho;
            return `
            <div class="ord-card${p.urgente?' urgent':''}${p.status==='Recebido'?' done':''}" onclick="OrdersModule.openDetail('${p.id}')">
              ${p.urgente?`<div class="ord-card-badge">⚡ URGENTE</div>`:''}
              <div class="ord-card-id">${p.id}</div>
              <div class="ord-card-title">${p.titulo}</div>
              <div class="ord-card-meta">
                <span>🏢 ${(p.fornecedor||'—').split(' ')[0]}</span>
                <span class="ord-card-valor">${brl(p.valor||0)}</span>
              </div>
              ${col.key==='Aprovacao'?`
              <div class="ord-approvers">
                ${(p.aprovacoes||[]).filter(a=>a.status!=='n/a').map(a=>`
                <span class="ord-approver-pill ${a.status==='approved'?'approver-chip approved':a.status==='pending'?'approver-chip pending':'badge-gray'}">
                  ${a.status==='approved'?'✓':a.status==='pending'?'⏳':'—'} ${a.nivel.split(' ')[0]}
                </span>`).join('')}
              </div>`:''}
              ${col.key==='Transito'?`
              <div class="ord-tracking-mini">
                ${TRACKING_STEPS.map((s,i)=>`<div class="ord-track-step ${i<trackIdx?'done':i===trackIdx?'active':''}">${s.split(' ')[0]}</div>`).join('')}
              </div>`:''}
              ${col.key==='Transito'||col.key==='Aprovado'?`<div style="font-size:11px;color:var(--text-3);margin-top:6px">📅 Prev: ${p.previsaoEntrega}</div>`:''}
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }).join('');
  }

  // ── Table ──────────────────────────────────────────────────────
  function renderTable() {
    const tbody = document.getElementById('ord-table-tbody');
    if (!tbody) return;
    const stMap = { Rascunho:'status-gray', Aprovacao:'status-amber', Aprovado:'status-blue', Transito:'status-purple', Recebido:'status-green', Cancelado:'status-red' };
    tbody.innerHTML = filteredOrders.map(p=>`
      <tr style="cursor:pointer" onclick="OrdersModule.openDetail('${p.id}')">
        <td>
          <div class="text-mono" style="font-size:11px">${p.id}</div>
          <div style="font-size:11px;color:var(--text-3)">${p.emissao||'—'}</div>
        </td>
        <td>
          <div style="font-weight:500;color:var(--text)">${p.titulo}</div>
          ${p.rfqOrigem&&p.rfqOrigem!=='—'?`<div style="font-size:11.5px;color:var(--text-3)">RFQ: ${p.rfqOrigem}</div>`:''}
        </td>
        <td>${p.fornecedor||'—'}</td>
        <td style="font-weight:600;color:var(--navy)">${brlF(p.valor||0)}</td>
        <td><span class="status-badge ${stMap[p.status]||'status-gray'}">${p.status}</span>${p.urgente?` <span class="chip chip-red" style="font-size:10px">Urgente</span>`:''}</td>
        <td>${p.previsaoEntrega||'—'}</td>
        <td>${p.nfUpload?`<span style="color:${p.nfUpload.status==='Conciliada'?'var(--green)':'var(--amber)'};font-size:12.5px">${p.nfUpload.status==='Conciliada'?'✓':''} ${p.nfUpload.numero}</span>`:'<span style="color:var(--text-3);font-size:12px">Pendente</span>'}</td>
        <td>
          <div class="action-btns" onclick="event.stopPropagation()">
            ${p.status==='Aprovacao'?`<button class="btn btn-secondary btn-sm" onclick="OrdersModule.openDetail('${p.id}');OrdersModule.switchTab('aprovacao')">Aprovar</button>`:''}
            ${p.status==='Aprovado'?`<button class="btn btn-secondary btn-sm" onclick="OrdersModule.marcarTransito('${p.id}')">Enviar</button>`:''}
            ${p.status==='Transito'?`<button class="btn btn-primary btn-sm" onclick="OrdersModule.confirmarRecebimento('${p.id}')">✓ Receber</button>`:''}
          </div>
        </td>
      </tr>`).join('');
    document.getElementById('ord-table-info').textContent = `${filteredOrders.length} pedidos`;
  }

  // ── Detail Panel ───────────────────────────────────────────────
  function openDetailPanel(id) {
    const p = getDB().find(x=>x.id===id);
    if (!p) return;
    currentOrder = p;
    const st = STATUS_META[p.status]||STATUS_META.Rascunho;

    document.getElementById('ord-detail-id').textContent = id + ' · ' + (p.emissao||'—');
    document.getElementById('ord-detail-title').textContent = p.titulo;
    document.getElementById('ord-detail-badge').textContent = p.status;
    document.getElementById('ord-detail-badge').className = 'status-badge ' + st.cls;
    document.getElementById('ord-detail-meta').innerHTML = [
      `<span style="font-size:12px;color:var(--text-3)">🏢 <strong style="color:var(--text)">${p.fornecedor||'—'}</strong></span>`,
      `<span style="font-size:12px;color:var(--text-3)">💰 <strong style="color:var(--navy)">${brlF(p.valor||0)}</strong></span>`,
      p.rfqOrigem&&p.rfqOrigem!=='—'?`<span style="font-size:12px;color:var(--text-3)">🔗 ${p.rfqOrigem}</span>`:'',
      p.urgente?`<span class="chip chip-red" style="font-size:10.5px">⚡ Urgente</span>`:'',
    ].filter(Boolean).join('');

    // Footer actions
    const footer = [];
    if (p.status==='Aprovacao')footer.push(`<button class="btn btn-secondary" onclick="OrdersModule.switchTab('aprovacao')">Ver Aprovações</button>`);
    if (p.status==='Aprovado') footer.push(`<button class="btn btn-primary" onclick="OrdersModule.marcarTransito('${p.id}')">🚚 Marcar como Enviado</button>`);
    if (p.status==='Transito') footer.push(`<button class="btn btn-primary" onclick="OrdersModule.confirmarRecebimento('${p.id}')">✅ Confirmar Recebimento</button>`);
    if (!p.nfUpload&&p.status!=='Rascunho'&&p.status!=='Aprovacao')
      footer.push(`<button class="btn btn-secondary" onclick="OrdersModule.switchTab('nf')">📄 Aguardar NF</button>`);
    footer.push(`<button class="btn btn-secondary" onclick="OrdersModule.closeDetail()">Fechar</button>`);
    document.getElementById('ord-detail-footer').innerHTML = footer.join('');

    switchTab('resumo');
    document.getElementById('ordDetailOverlay').classList.add('open');
  }

  // ── Tabs ───────────────────────────────────────────────────────
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.ord-tab').forEach((t,i)=>{
      const tabs=['resumo','aprovacao','rastreio','nf','historico'];
      t.classList.toggle('active', tabs[i]===tab);
    });
    document.querySelectorAll('.ord-tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById('ord-tab-'+tab)?.classList.add('active');
    if (!currentOrder) return;
    if (tab==='resumo')    renderTabResumo(currentOrder);
    if (tab==='aprovacao') renderTabAprovacao(currentOrder);
    if (tab==='rastreio')  renderTabRastreio(currentOrder);
    if (tab==='nf')        renderTabNF(currentOrder);
    if (tab==='historico') renderTabHistorico(currentOrder);
  }

  // ── Tab: Resumo ────────────────────────────────────────────────
  function renderTabResumo(p) {
    document.getElementById('ord-tab-resumo').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Dados Gerais</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Fornecedor</span><span class="req-field-value">${p.fornecedor||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Centro de Custo</span><span class="req-field-value">${p.cc||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Data Emissão</span><span class="req-field-value">${p.emissao||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Previsão Entrega</span><span class="req-field-value">${p.previsaoEntrega||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Cond. Pagamento</span><span class="req-field-value">${p.condPagto||'30 ddl'}</span></div>
          <div class="req-field"><span class="req-field-label">RFQ de Origem</span><span class="req-field-value">${p.rfqOrigem||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">PO Datasul</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${p.datasulPOId||'Pendente (Fase 3)'}</span></div>
          <div class="req-field"><span class="req-field-label">Valor Total</span><span class="req-field-value" style="color:var(--navy);font-size:16px;font-weight:700">${brlF(p.valor||0)}</span></div>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Itens do Pedido</div>
        <table class="req-items-table">
          <thead><tr><th>Descrição</th><th>Qtd.</th><th>Unid.</th><th>Valor Unit.</th><th>Total</th></tr></thead>
          <tbody>
            ${(p.itens||[]).map(i=>`<tr>
              <td>${i.desc||i.descricao||'—'}</td>
              <td>${i.qtd||1}</td><td>${i.unid||'UN'}</td>
              <td>${brlF(i.valor||0)}</td>
              <td style="font-weight:600">${brlF((i.valor||0)*(i.qtd||1))}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="datasul-info-box">
        🔗 <strong>Datasul:</strong> este pedido ${p.datasulPOId?'está sincronizado como '+p.datasulPOId:
        'será criado automaticamente via <code>POST /mcc/v1/purchOrderPublic</code> quando a integração (Fase 3) for ativada'}.
      </div>`;
  }

  // ── Tab: Aprovação ─────────────────────────────────────────────
  function renderTabAprovacao(p) {
    const steps = (p.aprovacoes||[]).filter(a=>a.status!=='n/a');
    document.getElementById('ord-tab-aprovacao').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Fluxo de Aprovação — Alçadas</div>
        <div class="aprov-flow">
          ${steps.map((a,i)=>{
            const dotCls = a.status==='approved'?'approved':a.status==='pending'?'pending':'waiting';
            const dotIcon= a.status==='approved'?'✓':a.status==='pending'?'⏳':'—';
            return `
            <div class="aprov-step">
              <div class="aprov-step-dot ${dotCls}">${dotIcon}</div>
              <div class="aprov-step-info">
                <div class="aprov-step-title">${a.nivel} <span style="font-size:12px;color:var(--text-3)">— até ${brl(a.alca)}</span></div>
                <div class="aprov-step-sub">${a.aprovador} · ${a.status==='approved'?'Aprovado em '+a.data:a.status==='pending'?'Aguardando aprovação':'—'}</div>
                ${a.status==='pending'?`
                <div class="aprov-btns">
                  <button class="btn-approve" onclick="OrdersModule.aprovarEtapa('${p.id}',${i})">✓ Aprovar</button>
                  <button class="btn-reject"  onclick="OrdersModule.reprovarEtapa('${p.id}',${i})">✕ Reprovar</button>
                </div>`:``}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      ${p.valor>50000?`
      <div style="background:var(--amber-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--amber);margin-top:8px">
        ⚠ Valor acima de R$ 50.000 — requer aprovação da Diretoria.
      </div>`:''}
      <div class="datasul-info-box" style="margin-top:12px">
        🔗 Quando integrado ao Datasul, o status de aprovação é espelhado no <strong>módulo MLA</strong>.
        O Datasul também pode aprovar — o BidFlow sincroniza automaticamente.
      </div>`;
  }

  // ── Tab: Rastreio ──────────────────────────────────────────────
  function renderTabRastreio(p) {
    const st  = STATUS_META[p.status]||STATUS_META.Rascunho;
    const cur = st.trackIdx;
    const steps = [
      { label:'Pedido emitido',    icon:'📋', date: p.emissao||'—' },
      { label:'Aprovado',          icon:'✓',  date: p.aprovacoes?.find(a=>a.status==='approved')?.data||'—' },
      { label:'Enviado fornecedor',icon:'📤', date: cur>=2?'Confirmado':'Aguardando' },
      { label:'Em trânsito',       icon:'🚚', date: cur>=3?'Em rota':'Aguardando' },
      { label:'Entregue',          icon:'📦', date: cur>=4?(p.previsaoEntrega||'Confirmado'):'Prev: '+(p.previsaoEntrega||'—') },
    ];
    document.getElementById('ord-tab-rastreio').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Status de Entrega</div>
        <div class="ord-track-full">
          ${steps.map((s,i)=>`
          <div class="ord-track-node">
            <div class="ord-track-circle ${i<cur?'done':i===cur?'active':''}">${i<cur?'✓':s.icon}</div>
            <div class="ord-track-label ${i<cur?'done':i===cur?'active':''}">${s.label}</div>
            <div style="font-size:10px;color:var(--text-3);text-align:center;margin-top:2px">${s.date}</div>
          </div>`).join('')}
        </div>
        <div style="text-align:center;padding:12px 0">
          ${cur<4?`<div style="font-size:14px;font-weight:500;color:var(--text)">Status atual: <span style="color:${st.color}">${p.status}</span></div>
          <div style="font-size:13px;color:var(--text-3);margin-top:4px">Previsão de entrega: <strong>${p.previsaoEntrega||'—'}</strong></div>`:
          `<div style="font-size:15px;font-weight:600;color:var(--green)">✅ Entregue e recebido</div>`}
        </div>
      </div>
      ${cur===3?`
      <div style="text-align:center;margin-top:8px">
        <button class="btn btn-primary" onclick="OrdersModule.confirmarRecebimento('${p.id}')">✅ Confirmar Recebimento</button>
      </div>`:''}
      <div class="datasul-info-box" style="margin-top:16px">
        🔗 Quando integrado, o rastreio será alimentado pelo Datasul em tempo real via webhook ou polling
        em <code>GET /mcc/v1/purchOrderPublic/${p.id}/status</code>.
      </div>`;
  }

  // ── Tab: NF ────────────────────────────────────────────────────
  function renderTabNF(p) {
    const nf = p.nfUpload;
    document.getElementById('ord-tab-nf').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Nota Fiscal — Conciliação Manual</div>
        ${nf?`
        <div class="nf-preview-box">
          <div class="nf-preview-row"><span>Número NF</span><span style="font-weight:600">${nf.numero}</span></div>
          <div class="nf-preview-row"><span>Valor NF</span><span>${brlF(nf.valor||0)}</span></div>
          <div class="nf-preview-row"><span>Valor PO</span><span>${brlF(p.valor||0)}</span></div>
          <div class="nf-preview-row">
            <span>Diferença</span>
            <span class="${Math.abs((nf.valor||0)-(p.valor||0))<0.01?'nf-diff-ok':'nf-diff-warn'}">
              ${Math.abs((nf.valor||0)-(p.valor||0))<0.01?'✓ Sem divergência':'⚠ '+brlF(Math.abs((nf.valor||0)-(p.valor||0)))+' de diferença'}
            </span>
          </div>
          <div class="nf-preview-row"><span>Status</span><span class="${nf.status==='Conciliada'?'nf-diff-ok':nf.status==='Divergência'?'nf-diff-warn':''}">${nf.status}</span></div>
        </div>
        ${nf.status==='Aguardando conciliação'?`
        <div style="display:flex;gap:10px;margin-top:14px;justify-content:flex-end">
          <button class="btn btn-secondary" onclick="OrdersModule.rejeitarNF('${p.id}')">✕ Rejeitar NF</button>
          <button class="btn btn-primary" onclick="OrdersModule.conciliarNF('${p.id}')">✓ Conciliar e Aprovar</button>
        </div>`:''}
        `:`
        <div style="text-align:center;padding:32px;color:var(--text-3)">
          <div style="font-size:32px;margin-bottom:12px">📄</div>
          <div style="font-size:14px;font-weight:500;color:var(--text-2);margin-bottom:6px">Aguardando nota fiscal</div>
          <div style="font-size:13px">O fornecedor deve enviar a NF pelo portal do fornecedor.</div>
          <div style="font-size:13px;margin-top:4px">Após o upload, aparecerá aqui para conciliação.</div>
        </div>`}
      </div>
      <div class="datasul-info-box">
        ℹ️ <strong>Sem integração SEFAZ.</strong> O fornecedor faz upload do XML/PDF da NF no portal.
        O BidFlow concilia NF × PO internamente. Aprovada a conciliação, o financeiro é acionado para pagamento.
      </div>`;
  }

  // ── Tab: Histórico ─────────────────────────────────────────────
  function renderTabHistorico(p) {
    document.getElementById('ord-tab-historico').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Linha do Tempo</div>
        <div class="req-timeline">
          ${(p.historico||[]).map(h=>`
          <div class="req-timeline-item">
            <div class="req-timeline-dot ${h.cor}"></div>
            <div class="req-timeline-content">
              <div class="req-timeline-title">${h.acao}</div>
              <div class="req-timeline-sub">${h.data} · ${h.user}</div>
            </div>
          </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Populate fornecedor select ─────────────────────────────────
  function populateFornSelect() {
    const sel = document.getElementById('ord-filter-forn');
    if (!sel) return;
    const fns = [...new Set(getDB().map(p=>p.fornecedor||'').filter(Boolean))];
    sel.innerHTML = '<option value="">Todos os fornecedores</option>' +
      fns.map(f=>`<option value="${f}">${f}</option>`).join('');

    const poSel = document.getElementById('po-f-forn');
    if (poSel) poSel.innerHTML = '<option value="">Selecione...</option>' +
      (BF.db.fornecedores||[]).map(f=>`<option value="${f.razaoSocial||f.nomeFantasia}">${f.razaoSocial||f.nomeFantasia}</option>`).join('');
  }

  // ── New PO modal ───────────────────────────────────────────────
  let poRowCount = 1;
  function calcPOTotal() {
    let total = 0;
    document.querySelectorAll('#po-items-body tr').forEach(row=>{
      const inputs = row.querySelectorAll('input');
      const qtd = parseFloat(inputs[1]?.value)||0;
      const val = parseFloat(inputs[3]?.value)||0;
      total += qtd * val;
    });
    const el = document.getElementById('po-total');
    if (el) el.textContent = brlF(total);
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    init(containerEl) {
      // Inject CSS
      if (!document.getElementById('ord-css')) {
        const s = document.createElement('style'); s.id='ord-css';
        s.textContent = CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = renderPageHTML();
      buildMockPedidos();
      populateFornSelect();
      renderStats();
      this.filter();
    },

    filter: applyFilter,

    setView(view) {
      currentView = view;
      document.getElementById('ord-kanban-view').style.display = view==='kanban'?'':'none';
      document.getElementById('ord-table-view').style.display  = view==='table' ?'':'none';
      document.getElementById('ord-btn-kanban').classList.toggle('active', view==='kanban');
      document.getElementById('ord-btn-table').classList.toggle('active',  view==='table');
      applyFilter();
    },

    openDetail: openDetailPanel,

    closeDetail(e) {
      if (!e || e.target===document.getElementById('ordDetailOverlay')) {
        document.getElementById('ordDetailOverlay').classList.remove('open');
        currentOrder = null;
      }
    },

    switchTab,

    aprovarEtapa(id, idx) {
      const p = getDB().find(x=>x.id===id); if(!p) return;
      p.aprovacoes[idx].status = 'approved';
      p.aprovacoes[idx].data   = new Date().toLocaleTimeString('pt-BR');
      p.historico.push({ data:'Agora', acao:`Aprovado — ${p.aprovacoes[idx].nivel}`, user:'Maria Ribeiro', cor:'green' });
      const allApproved = p.aprovacoes.filter(a=>a.status!=='n/a').every(a=>a.status==='approved');
      if (allApproved) {
        p.status = 'Aprovado';
        p.historico.push({ data:'Agora', acao:'Pedido aprovado — aguardando envio ao fornecedor', user:'Sistema', cor:'blue' });
        toast('✓ Pedido '+id+' aprovado! Fornecedor será notificado.');
      } else {
        toast('Etapa aprovada. Aguardando próxima alçada.');
      }
      renderStats(); applyFilter();
      switchTab('aprovacao');
    },

    reprovarEtapa(id, idx) {
      const p = getDB().find(x=>x.id===id); if(!p) return;
      p.status = 'Cancelado';
      p.historico.push({ data:'Agora', acao:`Reprovado — ${p.aprovacoes[idx].nivel}`, user:'Maria Ribeiro', cor:'red' });
      toast('Pedido '+id+' reprovado.');
      document.getElementById('ordDetailOverlay').classList.remove('open');
      renderStats(); applyFilter();
    },

    marcarTransito(id) {
      const p = getDB().find(x=>x.id===id); if(!p) return;
      p.status = 'Transito';
      p.historico.push({ data:'Agora', acao:'PO enviado ao fornecedor — em trânsito', user:'Sistema', cor:'purple' });
      toast('🚚 Pedido '+id+' marcado como em trânsito.');
      renderStats(); applyFilter();
      if (currentOrder?.id===id) switchTab('rastreio');
    },

    confirmarRecebimento(id) {
      const p = getDB().find(x=>x.id===id); if(!p) return;
      p.status = 'Recebido';
      p.historico.push({ data:'Agora', acao:'Recebimento confirmado pelo comprador', user:'Maria Ribeiro', cor:'green' });
      // [Datasul] PUT /mcc/v1/purchOrderPublic/{id} { status: 'RECEIVED' }
      toast('✅ Recebimento do pedido '+id+' confirmado!');
      renderStats(); applyFilter();
      if (currentOrder?.id===id) switchTab('rastreio');
    },

    conciliarNF(id) {
      const p = getDB().find(x=>x.id===id); if(!p||!p.nfUpload) return;
      const diff = Math.abs((p.nfUpload.valor||0) - (p.valor||0));
      p.nfUpload.status = diff < 0.01 ? 'Conciliada' : 'Divergência';
      p.historico.push({ data:'Agora', acao:'NF conciliada com PO — '+p.nfUpload.status, user:'Maria Ribeiro', cor: diff<0.01?'green':'amber' });
      // Sync to notasFiscais
      const nf = BF.db.notasFiscais.find(n=>n.numero===p.nfUpload.numero);
      if (nf) { nf.status=p.nfUpload.status; nf.matching=diff<0.01?'OK':'Divergência'; nf.pedidoId=id; }
      toast(diff<0.01?'✓ NF conciliada com sucesso!':'⚠ NF conciliada com divergência de '+brlF(diff));
      renderStats(); applyFilter();
      switchTab('nf');
    },

    rejeitarNF(id) {
      const p = getDB().find(x=>x.id===id); if(!p||!p.nfUpload) return;
      p.nfUpload.status = 'Rejeitada';
      p.historico.push({ data:'Agora', acao:'NF rejeitada — fornecedor notificado', user:'Maria Ribeiro', cor:'red' });
      toast('NF rejeitada. Fornecedor será notificado para reenvio.');
      switchTab('nf');
    },

    openNewPOModal() {
      document.getElementById('po-f-titulo').value  = '';
      document.getElementById('po-f-just').value    = '';
      document.getElementById('po-items-body').innerHTML = `
        <tr>
          <td><input type="text" class="form-input" placeholder="Item" style="font-size:12.5px"></td>
          <td><input type="number" class="form-input" value="1" min="1" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
          <td><input type="text" class="form-input" value="UN" style="font-size:12.5px"></td>
          <td><input type="number" class="form-input" placeholder="0,00" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
          <td></td>
        </tr>`;
      document.getElementById('po-total').textContent = 'R$ 0';
      document.getElementById('newPOModal').classList.add('open');
    },

    closeNewPOModal() { document.getElementById('newPOModal').classList.remove('open'); },

    addPOItem() {
      document.getElementById('po-items-body').insertAdjacentHTML('beforeend',`
        <tr>
          <td><input type="text" class="form-input" placeholder="Item" style="font-size:12.5px"></td>
          <td><input type="number" class="form-input" value="1" min="1" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
          <td><input type="text" class="form-input" value="UN" style="font-size:12.5px"></td>
          <td><input type="number" class="form-input" placeholder="0,00" style="font-size:12.5px" oninput="OrdersModule.calcPOTotal()"></td>
          <td><button class="req-item-del" onclick="this.closest('tr').remove();OrdersModule.calcPOTotal()">×</button></td>
        </tr>`);
    },

    calcPOTotal,

    submitNewPO() {
      const titulo = document.getElementById('po-f-titulo').value.trim();
      const fornEl = document.getElementById('po-f-forn');
      const forn   = fornEl?.value;
      if (!titulo) { toast('Informe o título do pedido'); return; }
      if (!forn)   { toast('Selecione o fornecedor'); return; }
      let total = 0;
      const itens = [];
      document.querySelectorAll('#po-items-body tr').forEach(row=>{
        const inputs = row.querySelectorAll('input');
        const desc = inputs[0]?.value||titulo;
        const qtd  = parseFloat(inputs[1]?.value)||1;
        const unid = inputs[2]?.value||'UN';
        const val  = parseFloat(inputs[3]?.value)||0;
        total += qtd*val;
        itens.push({desc,qtd,unid,valor:val});
      });
      const id = 'PC-'+Date.now();
      const novo = {
        id, titulo, fornecedor:forn, valor:total,
        status: 'Aprovacao', urgente: document.getElementById('po-f-urgente').value==='true',
        cc:     document.getElementById('po-f-cc').value,
        previsaoEntrega: document.getElementById('po-f-previsao').value||'—',
        condPagto: document.getElementById('po-f-pagto').value,
        rfqOrigem:'—', datasulPOId:'', emissao: new Date().toLocaleDateString('pt-BR'),
        itens, nfUpload:null,
        historico:[{ data:'Agora', acao:'Pedido criado manualmente (emergencial)', user:'Maria Ribeiro', cor:'blue' }],
        aprovacoes:[
          { nivel:'Gerência Compras', alca:10000, aprovador:'Maria Ribeiro', status:'pending', data:'' },
          { nivel:'Diretoria', alca:999999, aprovador:'Roberto Alves', status: total>50000?'pending':'n/a', data:'' },
        ],
      };
      BF.db.pedidos.unshift(novo);
      this.closeNewPOModal();
      buildMockPedidos();
      renderStats(); applyFilter();
      toast('✓ Pedido '+id+' criado e enviado para aprovação!');
      // [Datasul] POST /mcc/v1/purchOrderPublic — será chamado via api.js na Fase 3
    },

    exportCSV() {
      const rows=[['ID','Título','Fornecedor','Valor','Status','Previsão','NF']];
      getDB().forEach(p=>rows.push([p.id,p.titulo,p.fornecedor||'',p.valor||0,p.status,p.previsaoEntrega||'',p.nfUpload?.numero||'']));
      const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
      const a=document.createElement('a');
      a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
      a.download='pedidos-bidflow.csv'; a.click();
      toast('CSV exportado!');
    },

  };

})();
