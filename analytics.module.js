/**
 * BidFlow — Componente: Aprovações (approvals.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Fila de aprovação unificada (PO, RFQ, Requisição, Contrato)
 *  - Filtro por tipo, urgência e alçada
 *  - Aprovação / reprovação individual e em massa
 *  - Delegação de aprovação
 *  - Histórico de decisões
 *  - Configuração de alçadas por perfil
 *
 * Manutenção: se algo der errado em Aprovações, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.ApprovalsModule = (function () {

  const CSS = `
  /* ── approvals.module.css ── */
  .apv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .apv-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow);border-top:3px solid transparent}
  .apv-stat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;display:block}
  .apv-stat-label{font-size:11px;color:var(--text-3);display:block;margin-top:1px}

  .apv-bulk-bar{display:none;background:var(--navy);color:#fff;padding:10px 16px;border-radius:10px;align-items:center;gap:12px;margin-bottom:14px;font-size:13px}
  .apv-bulk-bar.show{display:flex}

  .apv-list{display:flex;flex-direction:column;gap:10px}
  .apv-item{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 18px;display:grid;grid-template-columns:36px 80px 1fr auto auto auto;align-items:center;gap:14px;box-shadow:var(--shadow);transition:border-color .15s}
  .apv-item:hover{border-color:var(--navy-mid)}
  .apv-item.urgent{border-left:3px solid var(--red)}
  .apv-item.done{opacity:.5;pointer-events:none}
  .apv-tipo-badge{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:20px;text-align:center;white-space:nowrap}
  .apv-tipo-po{background:var(--navy-light);color:var(--navy)}
  .apv-tipo-rfq{background:var(--purple-light);color:var(--purple)}
  .apv-tipo-req{background:var(--green-light);color:var(--green)}
  .apv-tipo-cnt{background:var(--amber-light);color:var(--amber)}
  .apv-info-id{font-family:monospace;font-size:11px;color:var(--text-3)}
  .apv-info-title{font-size:13.5px;font-weight:500;color:var(--text);margin:2px 0}
  .apv-info-sub{font-size:12px;color:var(--text-3)}
  .apv-valor{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:var(--navy);text-align:right;white-space:nowrap}
  .apv-prazo{font-size:11.5px;text-align:right;margin-top:3px}
  .apv-prazo.urgente{color:var(--red);font-weight:600}
  .apv-prazo.normal{color:var(--text-3)}
  .apv-btns{display:flex;gap:8px;flex-shrink:0}
  .apv-btn-ok{background:var(--green-light);color:var(--green);border:1px solid rgba(22,163,74,.3);padding:7px 16px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif;white-space:nowrap}
  .apv-btn-ok:hover{background:#bbf7d0}
  .apv-btn-no{background:var(--red-light);color:var(--red);border:1px solid rgba(220,38,38,.3);padding:7px 16px;border-radius:7px;cursor:pointer;font-size:13px;font-weight:500;font-family:'DM Sans',sans-serif}
  .apv-btn-no:hover{background:#fecaca}
  .apv-btn-view{background:var(--bg-3);color:var(--text-2);border:1px solid var(--border);padding:7px 12px;border-radius:7px;cursor:pointer;font-size:12.5px;font-family:'DM Sans',sans-serif}

  /* Alçadas config */
  .alcada-row{display:grid;grid-template-columns:160px 1fr 1fr 1fr;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)}
  .alcada-row:last-child{border-bottom:none}
  .alcada-perfil{font-size:13px;font-weight:500}

  /* History */
  .apv-hist-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
  .apv-hist-item:last-child{border-bottom:none}
  .apv-hist-dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0}

  /* Detail modal */
  .apv-detail-modal .modal{width:580px}

  @media(max-width:900px){.apv-item{grid-template-columns:36px 1fr auto auto;gap:10px}.apv-tipo-badge{display:none}.apv-stats{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:600px){.apv-item{grid-template-columns:1fr auto}.apv-valor{display:none}}
  `;

  // ── Fila unificada de aprovações ──────────────────────────────
  function buildQueue() {
    const queue = [];

    // Pedidos em aprovação
    (BF.db.pedidos||[]).filter(p=>p.status==='Aprovacao').forEach(p=>{
      queue.push({
        id: p.id, tipo:'PO', tipoCls:'apv-tipo-po',
        titulo: p.titulo,
        sub: (p.fornecedor||'—') + ' · ' + (p.cc||'—'),
        valor: p.valor||0,
        urgente: p.urgente||false,
        prazo: p.urgente ? 'Hoje — URGENTE' : 'Sem prazo',
        alca: p.valor>50000 ? 'Diretoria' : 'Gerência',
        obj: p,
      });
    });

    // RFQs em análise aguardando seleção de vencedor
    (BF.db.rfqs||[]).filter(r=>r.status==='Análise').forEach(r=>{
      queue.push({
        id: r.id, tipo:'RFQ', tipoCls:'apv-tipo-rfq',
        titulo: r.titulo,
        sub: (r.comprador||'—') + ' · ' + (r.respostas||0) + ' propostas',
        valor: r.valorEstimado||0,
        urgente: false,
        prazo: r.prazo||'—',
        alca: 'Gerência Compras',
        obj: r,
      });
    });

    // Requisições em análise
    (BF.db.requisicoes||MOCK.requisicoes||[]).filter(r=>r.status==='Em análise').forEach(r=>{
      queue.push({
        id: r.id, tipo:'REQ', tipoCls:'apv-tipo-req',
        titulo: r.descricao,
        sub: (r.solicitante||'—'),
        valor: r.valor||0,
        urgente: r.prioridade==='Alta',
        prazo: r.prioridade==='Alta' ? 'Alta prioridade' : 'Normal',
        alca: 'Gerência Compras',
        obj: r,
      });
    });

    // Ordenar: urgentes primeiro, depois por valor desc
    queue.sort((a,b)=>(b.urgente?1:0)-(a.urgente?1:0)||(b.valor-a.valor));
    return queue;
  }

  let queue       = [];
  let filtered    = [];
  let selected    = new Set();
  let histItems   = [];

  const brl  = v => 'R$ ' + (v>=1000?(v/1000).toFixed(0)+'K':Number(v).toLocaleString('pt-BR'));
  const brlF = v => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const toast = msg => window.toast?.(msg);

  function renderStats() {
    const q = queue;
    document.getElementById('apv-stats').innerHTML = [
      { label:'Aguardando aprovação', val:q.length,                          color:'#d97706' },
      { label:'Urgentes',             val:q.filter(x=>x.urgente).length,     color:'#dc2626' },
      { label:'Valor total em fila',  val:brl(q.reduce((s,x)=>s+x.valor,0)), color:'#1e3a5f' },
      { label:'Aprovados hoje',       val:histItems.filter(h=>h.acao==='Aprovado').length, color:'#16a34a' },
    ].map(s=>`
      <div class="apv-stat" style="border-top-color:${s.color}">
        <span class="apv-stat-val" style="color:${s.color==='#dc2626'&&parseInt(s.val)>0?s.color:'var(--text)'}">${s.val}</span>
        <span class="apv-stat-label">${s.label}</span>
      </div>`).join('');
    document.getElementById('apv-subtitle').textContent =
      `${q.length} documento${q.length!==1?'s':''} aguardando sua aprovação`;
  }

  function applyFilter() {
    const search = (document.getElementById('apv-search')||{}).value?.toLowerCase()||'';
    const tipo   = (document.getElementById('apv-filter-tipo')||{}).value||'';
    const alca   = (document.getElementById('apv-filter-alca')||{}).value||'';

    filtered = queue.filter(x=>{
      const ms  = !search || (x.id+x.titulo+x.sub).toLowerCase().includes(search);
      const mt  = !tipo   || x.tipo===tipo;
      const ma  = !alca   || x.alca===alca;
      return ms && mt && ma;
    });
    renderList();
  }

  function renderList() {
    const el = document.getElementById('apv-list');
    if (!el) return;
    if (!filtered.length) {
      el.innerHTML = `<div style="text-align:center;padding:56px;color:var(--text-3)">
        <div style="font-size:40px;margin-bottom:12px">✅</div>
        <div style="font-size:15px;font-weight:500;color:var(--text-2)">Nenhuma aprovação pendente</div>
        <div style="font-size:13px;margin-top:6px">Todas as solicitações foram tratadas.</div>
      </div>`;
      return;
    }
    el.innerHTML = filtered.map(x=>`
      <div class="apv-item${x.urgente?' urgent':''}" id="apv-item-${x.id}">
        <input type="checkbox" onchange="ApprovalsModule.toggleSel('${x.id}',this)" onclick="event.stopPropagation()">
        <span class="apv-tipo-badge ${x.tipoCls}">${x.tipo}</span>
        <div>
          <div class="apv-info-id">${x.id} · Alçada: ${x.alca}</div>
          <div class="apv-info-title">${x.titulo}</div>
          <div class="apv-info-sub">${x.sub}</div>
        </div>
        <div>
          <div class="apv-valor">${brlF(x.valor)}</div>
          <div class="apv-prazo ${x.urgente?'urgente':'normal'}">${x.prazo}</div>
        </div>
        <div class="apv-btns">
          <button class="apv-btn-ok" onclick="ApprovalsModule.aprovar('${x.id}')">✓ Aprovar</button>
          <button class="apv-btn-no" onclick="ApprovalsModule.reprovar('${x.id}')">✕ Reprovar</button>
          <button class="apv-btn-view" onclick="ApprovalsModule.verDetalhe('${x.id}')">Ver →</button>
        </div>
      </div>`).join('');
  }

  function renderHistorico() {
    const el = document.getElementById('apv-hist-list');
    if (!el) return;
    if (!histItems.length) {
      el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhuma decisão registrada nesta sessão.</div>';
      return;
    }
    el.innerHTML = histItems.map(h=>`
      <div class="apv-hist-item">
        <div class="apv-hist-dot" style="background:${h.acao==='Aprovado'?'var(--green)':'var(--red)'}"></div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:500">${h.acao}: <span style="font-family:monospace;font-size:12px">${h.id}</span></div>
          <div style="font-size:12px;color:var(--text-3)">${h.titulo} · ${h.data} · ${h.user}</div>
        </div>
        <span class="status-badge ${h.acao==='Aprovado'?'status-green':'status-red'}" style="flex-shrink:0">${h.acao}</span>
      </div>`).join('');
  }

  function buildPageHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Aprovações</h1>
        <p class="page-subtitle" id="apv-subtitle">Fila unificada de aprovação</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="ApprovalsModule.showConfig()">⚙ Alçadas</button>
        <button class="btn btn-secondary" onclick="ApprovalsModule.delegar()">↗ Delegar</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="apv-stats" id="apv-stats"></div>

    <!-- Bulk bar -->
    <div class="apv-bulk-bar" id="apv-bulk-bar">
      <span id="apv-bulk-count">0 selecionados</span>
      <div style="display:flex;gap:8px;margin-left:auto">
        <button class="btn-white" onclick="ApprovalsModule.bulkAprovar()">✓ Aprovar todos</button>
        <button class="btn-white" onclick="ApprovalsModule.bulkReprovar()">✕ Reprovar todos</button>
      </div>
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:16px">
      <button class="rfq-tab active" id="apv-tab-fila"      onclick="ApprovalsModule.subTab('fila')">Fila de Aprovação <span class="badge badge-warn" id="apv-fila-badge">0</span></button>
      <button class="rfq-tab"        id="apv-tab-historico" onclick="ApprovalsModule.subTab('historico')">Histórico de Decisões</button>
      <button class="rfq-tab"        id="apv-tab-alcadas"   onclick="ApprovalsModule.subTab('alcadas')">Configurar Alçadas</button>
    </div>

    <!-- Fila -->
    <div id="apv-sec-fila">
      <div class="filter-bar" style="margin-bottom:14px">
        <div class="filter-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="apv-search" placeholder="Buscar por ID, título, fornecedor..." oninput="ApprovalsModule.filter()">
        </div>
        <select class="filter-select" id="apv-filter-tipo" onchange="ApprovalsModule.filter()">
          <option value="">Todos os tipos</option>
          <option value="PO">Pedido de Compra</option>
          <option value="RFQ">Cotação RFQ</option>
          <option value="REQ">Requisição</option>
          <option value="CNT">Contrato</option>
        </select>
        <select class="filter-select" id="apv-filter-alca" onchange="ApprovalsModule.filter()">
          <option value="">Todas as alçadas</option>
          <option value="Gerência Compras">Gerência Compras</option>
          <option value="Diretoria">Diretoria</option>
        </select>
      </div>
      <div class="apv-list" id="apv-list"></div>
    </div>

    <!-- Histórico -->
    <div id="apv-sec-historico" style="display:none">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Decisões desta sessão</h3></div>
        <div id="apv-hist-list"></div>
      </div>
    </div>

    <!-- Alçadas -->
    <div id="apv-sec-alcadas" style="display:none">
      <div class="card" style="margin-bottom:14px">
        <div class="card-header"><h3 class="card-title">Alçadas de Aprovação</h3><button class="btn btn-primary btn-sm" onclick="ApprovalsModule.salvarAlcadas()">Salvar</button></div>
        <div class="alcada-row" style="background:var(--bg-3);border-radius:6px;padding:10px 12px;margin-bottom:6px">
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-3)">Perfil</div>
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-3)">Limite inferior</div>
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-3)">Limite superior</div>
          <div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--text-3)">Aprovação automática?</div>
        </div>
        ${[
          {perfil:'Solicitante',   de:'R$ 0',         ate:'R$ 0',        auto:false, desc:'Apenas cria requisições'},
          {perfil:'Comprador',     de:'R$ 1',          ate:'R$ 10.000',   auto:false, desc:'Aprova pedidos até R$ 10K'},
          {perfil:'Aprovador',     de:'R$ 10.001',     ate:'R$ 50.000',   auto:false, desc:'Aprova até R$ 50K'},
          {perfil:'Diretor',       de:'R$ 50.001',     ate:'Sem limite',  auto:false, desc:'Aprovação final'},
        ].map(a=>`
          <div class="alcada-row">
            <div><span class="chip chip-blue" style="font-size:11px">${a.perfil}</span><div style="font-size:11px;color:var(--text-3);margin-top:3px">${a.desc}</div></div>
            <div><input type="text" class="form-input" value="${a.de}" style="font-size:12.5px"></div>
            <div><input type="text" class="form-input" value="${a.ate}" style="font-size:12.5px"></div>
            <div><select class="filter-select" style="font-size:12.5px"><option ${!a.auto?'selected':''}>Manual</option><option ${a.auto?'selected':''}>Automática</option></select></div>
          </div>`).join('')}
      </div>
      <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--navy)">
        🔗 Quando integrado ao Datasul, as alçadas serão espelhadas no módulo <strong>MLA</strong> automaticamente.
      </div>
    </div>

    <!-- Modal detalhe aprovação -->
    <div class="modal-overlay apv-detail-modal" id="apvDetailModal" onclick="if(event.target===this)document.getElementById('apvDetailModal').classList.remove('open')">
      <div class="modal" style="width:560px" onclick="event.stopPropagation()">
        <div class="modal-header"><h2 id="apv-detail-title">Detalhe</h2><button class="modal-close" onclick="document.getElementById('apvDetailModal').classList.remove('open')">✕</button></div>
        <div class="modal-body" id="apv-detail-body"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('apvDetailModal').classList.remove('open')">Fechar</button>
          <button class="btn btn-secondary" id="apv-detail-btn-no"  onclick="ApprovalsModule._detailAction('no')">✕ Reprovar</button>
          <button class="btn btn-primary"   id="apv-detail-btn-ok"  onclick="ApprovalsModule._detailAction('ok')">✓ Aprovar</button>
        </div>
      </div>
    </div>

    <!-- Modal delegação -->
    <div class="modal-overlay" id="apvDelegarModal" onclick="if(event.target===this)document.getElementById('apvDelegarModal').classList.remove('open')">
      <div class="modal" style="width:440px" onclick="event.stopPropagation()">
        <div class="modal-header"><h2>Delegar Aprovações</h2><button class="modal-close" onclick="document.getElementById('apvDelegarModal').classList.remove('open')">✕</button></div>
        <div class="modal-body">
          <div class="form-group"><label>Delegar para</label>
            <select class="form-input" id="apv-delegar-user">
              ${(BF.db.usuarios||[]).filter(u=>u.perfil==='Aprovador'||u.perfil==='Diretor'||u.perfil==='Admin').map(u=>`<option value="${u.id}">${u.nome} — ${u.perfil}</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Período</label>
            <div style="display:flex;gap:8px">
              <input type="date" class="form-input" id="apv-del-ini">
              <input type="date" class="form-input" id="apv-del-fim">
            </div>
          </div>
          <div class="form-group"><label>Motivo</label>
            <input type="text" class="form-input" id="apv-del-motivo" placeholder="Ex: Férias, viagem...">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('apvDelegarModal').classList.remove('open')">Cancelar</button>
          <button class="btn btn-primary" onclick="ApprovalsModule.confirmarDelegacao()">Confirmar Delegação</button>
        </div>
      </div>
    </div>
    `;
  }

  let _currentDetailId = null;

  return {
    init(containerEl) {
      if (!document.getElementById('apv-css')) {
        const s=document.createElement('style'); s.id='apv-css';
        s.textContent=CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = buildPageHTML();
      queue    = buildQueue();
      filtered = [...queue];
      renderStats();
      renderList();
      renderHistorico();
      document.getElementById('apv-fila-badge').textContent = queue.length;
    },

    filter: applyFilter,

    subTab(tab) {
      ['fila','historico','alcadas'].forEach(t=>{
        document.getElementById('apv-sec-'+t).style.display    = t===tab?'':'none';
        document.getElementById('apv-tab-'+t)?.classList.toggle('active',t===tab);
      });
      if (tab==='historico') renderHistorico();
    },

    toggleSel(id, cb) {
      if (cb.checked) selected.add(id); else selected.delete(id);
      const bar = document.getElementById('apv-bulk-bar');
      bar.classList.toggle('show', selected.size>0);
      document.getElementById('apv-bulk-count').textContent = selected.size+' selecionado'+(selected.size!==1?'s':'');
    },

    aprovar(id) {
      const item = queue.find(x=>x.id===id); if(!item) return;
      // Update source object
      if (item.tipo==='PO')  { const p=BF.db.pedidos.find(x=>x.id===id); if(p) p.status='Aprovado'; }
      if (item.tipo==='RFQ') { const r=BF.db.rfqs.find(x=>x.id===id);    if(r) r.status='Concluída'; }
      if (item.tipo==='REQ') { const r=(BF.db.requisicoes||MOCK.requisicoes||[]).find(x=>x.id===id); if(r) r.status='Aprovada'; }
      histItems.unshift({ id, titulo:item.titulo, acao:'Aprovado', user:'Maria Ribeiro', data:new Date().toLocaleTimeString('pt-BR') });
      queue = queue.filter(x=>x.id!==id);
      filtered = filtered.filter(x=>x.id!==id);
      // Animate out
      const el = document.getElementById('apv-item-'+id);
      if (el) { el.style.transition='opacity .3s'; el.style.opacity='0'; setTimeout(()=>renderList(),350); }
      else renderList();
      renderStats();
      document.getElementById('apv-fila-badge').textContent = queue.length;
      toast('✓ '+id+' aprovado!');
      document.getElementById('apvDetailModal')?.classList.remove('open');
    },

    reprovar(id) {
      const item = queue.find(x=>x.id===id); if(!item) return;
      if (item.tipo==='PO')  { const p=BF.db.pedidos.find(x=>x.id===id); if(p) p.status='Cancelado'; }
      if (item.tipo==='REQ') { const r=(BF.db.requisicoes||MOCK.requisicoes||[]).find(x=>x.id===id); if(r) r.status='Cancelada'; }
      histItems.unshift({ id, titulo:item.titulo, acao:'Reprovado', user:'Maria Ribeiro', data:new Date().toLocaleTimeString('pt-BR') });
      queue = queue.filter(x=>x.id!==id);
      filtered = filtered.filter(x=>x.id!==id);
      renderList(); renderStats();
      document.getElementById('apv-fila-badge').textContent = queue.length;
      toast('Reprovado: '+id);
      document.getElementById('apvDetailModal')?.classList.remove('open');
    },

    bulkAprovar() {
      const ids = [...selected];
      ids.forEach(id=>this.aprovar(id));
      selected.clear();
      document.getElementById('apv-bulk-bar').classList.remove('show');
    },

    bulkReprovar() {
      const ids = [...selected];
      ids.forEach(id=>this.reprovar(id));
      selected.clear();
      document.getElementById('apv-bulk-bar').classList.remove('show');
    },

    verDetalhe(id) {
      const item = queue.find(x=>x.id===id); if(!item) return;
      _currentDetailId = id;
      document.getElementById('apv-detail-title').textContent = item.tipo+' — '+id;
      document.getElementById('apv-detail-body').innerHTML = `
        <div class="req-field-grid" style="margin-bottom:16px">
          <div class="req-field"><span class="req-field-label">Tipo</span><span class="req-field-value"><span class="apv-tipo-badge ${item.tipoCls}">${item.tipo}</span></span></div>
          <div class="req-field"><span class="req-field-label">Alçada</span><span class="req-field-value">${item.alca}</span></div>
          <div class="req-field"><span class="req-field-label">Título</span><span class="req-field-value">${item.titulo}</span></div>
          <div class="req-field"><span class="req-field-label">Solicitante/Comprador</span><span class="req-field-value">${item.sub}</span></div>
          <div class="req-field"><span class="req-field-label">Valor</span><span class="req-field-value" style="color:var(--navy);font-size:16px;font-weight:700">${brlF(item.valor)}</span></div>
          <div class="req-field"><span class="req-field-label">Urgência</span><span class="req-field-value">${item.urgente?'<span class="chip chip-red">⚡ Urgente</span>':'Normal'}</span></div>
        </div>
        <div class="form-group"><label>Observação (opcional)</label>
          <textarea class="form-input" id="apv-detail-obs" rows="2" placeholder="Comentário sobre a decisão..."></textarea>
        </div>`;
      document.getElementById('apvDetailModal').classList.add('open');
    },

    _detailAction(act) {
      if (!_currentDetailId) return;
      if (act==='ok') this.aprovar(_currentDetailId);
      else this.reprovar(_currentDetailId);
      _currentDetailId = null;
    },

    showConfig() { this.subTab('alcadas'); },

    salvarAlcadas() { toast('Configuração de alçadas salva!'); },

    delegar() { document.getElementById('apvDelegarModal').classList.add('open'); },

    confirmarDelegacao() {
      const user = document.getElementById('apv-delegar-user')?.value;
      const motivo = document.getElementById('apv-del-motivo')?.value;
      document.getElementById('apvDelegarModal').classList.remove('open');
      toast('Aprovações delegadas com sucesso!');
    },
  };

})();
