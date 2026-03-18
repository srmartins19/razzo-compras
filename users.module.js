/**
 * BidFlow — Componente: Notas Fiscais & Conciliação (invoices.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Recebimento e listagem de NFs enviadas pelos fornecedores
 *  - Conciliação manual NF × Pedido de Compra (sem SEFAZ)
 *  - 3-way matching: NF × PO × Recebimento
 *  - Aprovação/rejeição com notificação ao fornecedor
 *  - Relatório de divergências
 *  - Encaminhamento para pagamento (financeiro)
 *
 * SEM integração SEFAZ — o fornecedor faz upload do XML/PDF no portal.
 * BidFlow faz a conciliação dos valores internamente.
 *
 * Manutenção: se algo der errado em NFs, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.InvoicesModule = (function () {

  // ── Status possíveis de uma NF ─────────────────────────────────
  const NF_STATUS = {
    'Aguardando':   { cls:'status-amber', icon:'⏳', desc:'Recebida, aguardando conciliação' },
    'Conciliada':   { cls:'status-green', icon:'✓',  desc:'Conciliada com PO — aprovada para pagamento' },
    'Divergência':  { cls:'status-red',   icon:'⚠',  desc:'Valor ou itens divergentes do PO' },
    'Rejeitada':    { cls:'status-red',   icon:'✕',  desc:'Rejeitada pelo comprador — reenvio solicitado' },
    'Vencida':      { cls:'status-red',   icon:'⏰', desc:'Prazo de pagamento vencido' },
    'Paga':         { cls:'status-green', icon:'💳', desc:'Nota conciliada e paga' },
  };

  // ── CSS ────────────────────────────────────────────────────────
  const CSS = `
  /* ── invoices.module.css ── */
  .inv-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
  .inv-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow);border-top:3px solid transparent}
  .inv-stat-val{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;display:block}
  .inv-stat-label{font-size:11px;color:var(--text-3);display:block;margin-top:1px}

  .inv-alert-banner{border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px;font-size:13px}
  .inv-alert-icon{font-size:18px;flex-shrink:0;margin-top:1px}

  /* Detail panel */
  .inv-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;align-items:flex-start;justify-content:flex-end}
  .inv-detail-overlay.open{display:flex}
  .inv-detail-panel{width:660px;max-width:96vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.15);animation:slideIn .25s ease;display:flex;flex-direction:column}

  /* Conciliação */
  .conc-table{width:100%;border-collapse:collapse;margin-top:10px}
  .conc-table th{background:var(--bg-3);padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);font-weight:600;border-bottom:2px solid var(--border);text-align:right}
  .conc-table th:first-child{text-align:left}
  .conc-table td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13.5px;text-align:right;color:var(--text-2)}
  .conc-table td:first-child{text-align:left;color:var(--text);font-weight:500}
  .conc-table tr.total-row td{font-weight:700;background:var(--bg-3);font-size:14px}
  .conc-ok{color:var(--green);font-weight:600}
  .conc-warn{color:var(--red);font-weight:600}
  .conc-na{color:var(--text-3)}
  .conc-match-row{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:8px;border:1px solid;margin-bottom:10px}
  .conc-match-ok{background:rgba(22,163,74,.05);border-color:rgba(22,163,74,.3)}
  .conc-match-warn{background:rgba(220,38,38,.05);border-color:rgba(220,38,38,.3)}
  .conc-match-info{background:var(--navy-light);border-color:rgba(30,58,95,.2)}
  .conc-match-label{font-size:13px;font-weight:500}
  .conc-match-val{font-size:14px;font-weight:700}

  /* Tabs */
  .inv-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 20px;background:var(--bg-2);position:sticky;top:0;z-index:1}
  .inv-tab{padding:11px 14px;font-size:13px;font-weight:500;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif}
  .inv-tab.active{color:var(--navy);border-bottom-color:var(--navy)}
  .inv-tab-content{display:none;padding:20px;flex:1}
  .inv-tab-content.active{display:block}

  /* Upload zone */
  .inv-upload-zone{border:2px dashed var(--border-light);border-radius:10px;padding:24px;text-align:center;cursor:pointer;transition:border-color .15s;color:var(--text-3)}
  .inv-upload-zone:hover{border-color:var(--navy)}
  .inv-uploaded-file{background:var(--green-light);border:1px solid rgba(22,163,74,.3);border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:10px;margin-top:8px}

  /* Pagamento */
  .pay-summary{background:var(--navy-light);border:1px solid rgba(30,58,95,.2);border-radius:10px;padding:16px}
  .pay-row{display:flex;justify-content:space-between;padding:6px 0;font-size:13.5px;border-bottom:1px solid rgba(30,58,95,.1)}
  .pay-row:last-child{border-bottom:none;font-weight:700;font-size:15px;padding-top:10px;color:var(--navy)}

  /* Bulk action */
  .inv-bulk-bar{display:none;background:var(--navy);color:#fff;padding:10px 16px;border-radius:10px;align-items:center;gap:12px;margin-bottom:14px;font-size:13px}
  .inv-bulk-bar.show{display:flex}

  @media(max-width:1100px){.inv-stats{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:640px){.inv-stats{grid-template-columns:1fr 1fr}}
  `;

  // ── Estado ─────────────────────────────────────────────────────
  let currentNF    = null;
  let currentTab   = 'conciliacao';
  let filteredNFs  = [];
  let selectedNFs  = new Set();

  // ── HTML da página ─────────────────────────────────────────────
  function renderPageHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Notas Fiscais</h1>
        <p class="page-subtitle" id="inv-subtitle">Recebimento, conciliação e aprovação de NFs</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="InvoicesModule.exportCSV()">Exportar</button>
        <button class="btn btn-secondary" onclick="InvoicesModule.openUploadModal()">Upload Manual NF</button>
      </div>
    </div>

    <!-- Info banner: sem SEFAZ -->
    <div class="inv-alert-banner" style="background:var(--navy-light);border:1px solid rgba(30,58,95,.2);color:var(--navy);margin-bottom:16px">
      <div class="inv-alert-icon">ℹ️</div>
      <div>
        <strong>Conciliação manual — sem integração SEFAZ.</strong><br>
        O fornecedor faz upload da NF (XML ou PDF) pelo portal. O BidFlow concilia os valores com o Pedido de Compra.
        Aprovada a conciliação, o documento é encaminhado para pagamento.
      </div>
    </div>

    <!-- Alertas de divergência -->
    <div id="inv-alerts-section"></div>

    <!-- Stats -->
    <div class="inv-stats" id="inv-stats"></div>

    <!-- Bulk bar -->
    <div class="inv-bulk-bar" id="inv-bulk-bar">
      <span id="inv-bulk-count">0 selecionadas</span>
      <div style="display:flex;gap:8px;margin-left:auto">
        <button class="btn-white" onclick="InvoicesModule.bulkConciliar()">✓ Conciliar selecionadas</button>
        <button class="btn-white" onclick="InvoicesModule.bulkRejeitar()">✕ Rejeitar selecionadas</button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filter-bar" style="margin-bottom:16px">
      <div class="filter-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="inv-search" placeholder="Buscar por NF, fornecedor, pedido..." oninput="InvoicesModule.filter()">
      </div>
      <select class="filter-select" id="inv-filter-status" onchange="InvoicesModule.filter()">
        <option value="">Todos os status</option>
        ${Object.keys(NF_STATUS).map(s=>`<option value="${s}">${s}</option>`).join('')}
      </select>
      <select class="filter-select" id="inv-filter-forn" onchange="InvoicesModule.filter()">
        <option value="">Todos os fornecedores</option>
      </select>
      <select class="filter-select" id="inv-filter-match" onchange="InvoicesModule.filter()">
        <option value="">Todos os matchings</option>
        <option value="OK">✓ Conciliado</option>
        <option value="Pendente">⏳ Pendente</option>
        <option value="Divergência">⚠ Divergência</option>
      </select>
    </div>

    <!-- Tabela de NFs -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:36px"><input type="checkbox" id="inv-check-all" onchange="InvoicesModule.toggleAll(this)"></th>
            <th>Número / Data</th>
            <th>Fornecedor</th>
            <th>Pedido Vinculado</th>
            <th>Valor NF</th>
            <th>Valor PO</th>
            <th>Diferença</th>
            <th>3-Way Match</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="inv-tbody"></tbody>
      </table>
      <div class="table-footer">
        <span class="table-info" id="inv-info"></span>
        <div id="inv-pagination" class="pagination"></div>
      </div>
    </div>

    <!-- Detail panel -->
    <div class="inv-detail-overlay" id="invDetailOverlay" onclick="InvoicesModule.closeDetail(event)">
      <div class="inv-detail-panel">
        <div class="req-detail-header">
          <div>
            <div style="font-family:monospace;font-size:12px;color:var(--text-3)" id="inv-detail-numero"></div>
            <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-top:4px" id="inv-detail-fornecedor"></h2>
            <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap" id="inv-detail-meta"></div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
            <span class="status-badge" id="inv-detail-badge"></span>
            <button onclick="InvoicesModule.closeDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
          </div>
        </div>
        <div class="inv-tabs">
          <button class="inv-tab active"  onclick="InvoicesModule.switchTab('conciliacao')">Conciliação</button>
          <button class="inv-tab"         onclick="InvoicesModule.switchTab('documento')">Documento</button>
          <button class="inv-tab"         onclick="InvoicesModule.switchTab('pagamento')">Pagamento</button>
          <button class="inv-tab"         onclick="InvoicesModule.switchTab('historico')">Histórico</button>
        </div>
        <div id="inv-tab-conciliacao" class="inv-tab-content active"></div>
        <div id="inv-tab-documento"   class="inv-tab-content"></div>
        <div id="inv-tab-pagamento"   class="inv-tab-content"></div>
        <div id="inv-tab-historico"   class="inv-tab-content"></div>
        <div class="req-detail-footer" id="inv-detail-footer"></div>
      </div>
    </div>

    <!-- Modal: Upload Manual NF -->
    <div class="modal-overlay" id="invUploadModal" onclick="if(event.target===this)InvoicesModule.closeUploadModal()">
      <div class="modal" style="width:560px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Upload Manual de Nota Fiscal</h2>
          <button class="modal-close" onclick="InvoicesModule.closeUploadModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="font-size:13px;color:var(--text-2);margin-bottom:16px">
            Use para NFs recebidas fora do portal. O fornecedor deve preferencialmente enviar pelo portal do fornecedor.
          </div>
          <div class="form-row">
            <div class="form-group"><label>Fornecedor *</label>
              <select class="form-input" id="inv-up-forn">
                <option value="">Selecione...</option>
              </select>
            </div>
            <div class="form-group"><label>Pedido de Compra *</label>
              <select class="form-input" id="inv-up-po">
                <option value="">Selecione...</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Número da NF *</label>
              <input type="text" class="form-input" id="inv-up-numero" placeholder="Ex: 4523">
            </div>
            <div class="form-group"><label>Valor da NF (R$) *</label>
              <input type="number" class="form-input" id="inv-up-valor" placeholder="0,00" step="0.01">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Data de Emissão *</label>
              <input type="date" class="form-input" id="inv-up-data">
            </div>
            <div class="form-group"><label>Chave NF-e (44 dígitos)</label>
              <input type="text" class="form-input" id="inv-up-chave" placeholder="Opcional" maxlength="44">
            </div>
          </div>
          <div class="form-group"><label>Arquivo (XML preferencial / PDF aceito)</label>
            <div class="inv-upload-zone" onclick="document.getElementById('inv-up-arquivo').click()" id="inv-drop-zone">
              <div style="font-size:28px;margin-bottom:8px">📄</div>
              <div style="font-size:14px;font-weight:500;color:var(--text-2)">Clique ou arraste o arquivo da NF</div>
              <div style="font-size:12px;margin-top:4px">XML preferencial · PDF aceito · max 10MB</div>
            </div>
            <input type="file" id="inv-up-arquivo" accept=".xml,.pdf" style="display:none" onchange="InvoicesModule.previewArquivo(this)">
            <div id="inv-arquivo-preview"></div>
          </div>
          <div id="inv-up-preview-conc" style="display:none"></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="InvoicesModule.closeUploadModal()">Cancelar</button>
          <button class="btn btn-secondary" onclick="InvoicesModule.previewConciliacao()">Pré-visualizar Conciliação</button>
          <button class="btn btn-primary" onclick="InvoicesModule.submitNF()">Registrar e Conciliar</button>
        </div>
      </div>
    </div>
    `;
  }

  // ── Helpers ────────────────────────────────────────────────────
  const brl  = v => 'R$ ' + (v>=1000?(v/1000).toFixed(0)+'K':Number(v).toLocaleString('pt-BR'));
  const brlF = v => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const toast = msg => window.toast?.(msg);
  const getDB = () => BF.db.notasFiscais;

  function getPoValue(pedidoId) {
    const p = BF.db.pedidos.find(x=>x.id===pedidoId);
    return p?.valor || 0;
  }

  function getDiff(nf) {
    if (!nf.pedidoId) return null;
    return (nf.valor||0) - getPoValue(nf.pedidoId);
  }

  function enrichNFs() {
    getDB().forEach(nf => {
      if (!nf.historico) {
        nf.historico = [
          { data: nf.emissao||'—', acao:'NF recebida pelo fornecedor',    user:'Portal', cor:'blue' },
        ];
        if (nf.status==='Conciliada')
          nf.historico.push({ data:'Dia seguinte', acao:'Conciliada com PO', user:'Maria Ribeiro', cor:'green' });
        if (nf.status==='Vencida')
          nf.historico.push({ data:'Há 3 dias', acao:'Prazo de pagamento vencido — pendente', user:'Sistema', cor:'red' });
      }
      if (!nf.vencimentoPagto) {
        const d = new Date(nf.emissao?.split('/').reverse().join('-') || Date.now());
        d.setDate(d.getDate()+30);
        nf.vencimentoPagto = d.toLocaleDateString('pt-BR');
      }
    });
  }

  // ── Stats ──────────────────────────────────────────────────────
  function renderStats() {
    const all    = getDB();
    const totVal = all.reduce((s,n)=>s+(n.valor||0),0);
    const stats  = [
      { label:'Total de NFs',      val: all.length,                                   color:'#8892a8' },
      { label:'Aguardando conc.',  val: all.filter(n=>n.status==='Aguardando').length, color:'#d97706' },
      { label:'Conciliadas',       val: all.filter(n=>n.status==='Conciliada').length, color:'#16a34a' },
      { label:'Divergências',      val: all.filter(n=>n.status==='Divergência').length,color:'#dc2626' },
      { label:'Valor total mês',   val: brl(totVal),                                   color:'#1e3a5f' },
    ];
    document.getElementById('inv-stats').innerHTML = stats.map(s=>`
      <div class="inv-stat" style="border-top-color:${s.color}">
        <span class="inv-stat-val" style="color:${s.color==='#dc2626'&&parseInt(s.val)>0?s.color:'var(--text)'}">${s.val}</span>
        <span class="inv-stat-label">${s.label}</span>
      </div>`).join('');
    document.getElementById('inv-subtitle').textContent =
      `${all.length} notas fiscais · ${all.filter(n=>n.status==='Aguardando').length} aguardando conciliação · ${all.filter(n=>n.status==='Divergência').length} divergências`;
  }

  // ── Alert banners ──────────────────────────────────────────────
  function renderAlerts() {
    const div   = document.getElementById('inv-alerts-section');
    if (!div) return;
    const divs  = getDB().filter(n=>n.status==='Divergência');
    const venc  = getDB().filter(n=>n.status==='Vencida');
    let html = '';
    if (divs.length>0) html += `
      <div class="inv-alert-banner" style="background:var(--red-light);border:1px solid rgba(220,38,38,.25);color:var(--red)">
        <div class="inv-alert-icon">⚠</div>
        <div><strong>${divs.length} NF${divs.length>1?'s':''} com divergência</strong> — valores não batem com o Pedido de Compra. Solicite reenvio ao fornecedor ou ajuste manual.<br>
        <span style="font-size:12px">${divs.map(n=>n.numero).join(', ')}</span></div>
        <button class="btn btn-secondary btn-sm" style="flex-shrink:0" onclick="document.getElementById('inv-filter-status').value='Divergência';InvoicesModule.filter()">Filtrar</button>
      </div>`;
    if (venc.length>0) html += `
      <div class="inv-alert-banner" style="background:var(--amber-light);border:1px solid rgba(217,119,6,.25);color:var(--amber)">
        <div class="inv-alert-icon">⏰</div>
        <div><strong>${venc.length} NF${venc.length>1?'s':''} com prazo vencido</strong> — verifique as condições de pagamento acordadas.<br>
        <span style="font-size:12px">${venc.map(n=>n.numero).join(', ')}</span></div>
      </div>`;
    div.innerHTML = html;
  }

  // ── Filter ─────────────────────────────────────────────────────
  function applyFilter() {
    const search = (document.getElementById('inv-search')||{}).value?.toLowerCase()||'';
    const status = (document.getElementById('inv-filter-status')||{}).value||'';
    const forn   = (document.getElementById('inv-filter-forn')||{}).value||'';
    const match  = (document.getElementById('inv-filter-match')||{}).value||'';

    filteredNFs = getDB().filter(n=>{
      const ms  = !search || (n.numero+n.fornecedor+(n.pedidoId||'')).toLowerCase().includes(search);
      const mst = !status || n.status===status;
      const mf  = !forn   || (n.fornecedor||'').includes(forn);
      const mm  = !match  || n.matching===match;
      return ms && mst && mf && mm;
    });
    renderTable();
  }

  // ── Tabela ─────────────────────────────────────────────────────
  function renderTable() {
    const tbody = document.getElementById('inv-tbody');
    if (!tbody) return;

    if (!filteredNFs.length) {
      tbody.innerHTML = `<tr><td colspan="10"><div style="text-align:center;padding:40px;color:var(--text-3)">Nenhuma nota fiscal encontrada.</div></td></tr>`;
      document.getElementById('inv-info').textContent = '0 resultados';
      return;
    }

    tbody.innerHTML = filteredNFs.map(nf => {
      const st   = NF_STATUS[nf.status] || NF_STATUS['Aguardando'];
      const poVal= getPoValue(nf.pedidoId||'');
      const diff = nf.pedidoId ? ((nf.valor||0) - poVal) : null;
      const diffAbs = diff !== null ? Math.abs(diff) : null;
      const sel  = selectedNFs.has(nf.id);

      return `<tr style="cursor:pointer" onclick="InvoicesModule.openDetail('${nf.id}')">
        <td onclick="event.stopPropagation()"><input type="checkbox" ${sel?'checked':''} onchange="InvoicesModule.toggleSel('${nf.id}',this)"></td>
        <td>
          <div class="text-mono" style="font-size:12px;font-weight:600">${nf.numero}</div>
          <div style="font-size:11px;color:var(--text-3)">${nf.emissao||'—'}</div>
        </td>
        <td>
          <div style="font-size:13.5px;font-weight:500;color:var(--text)">${nf.fornecedor}</div>
          <div style="font-size:11.5px;color:var(--text-3)">${nf.fornId||''}</div>
        </td>
        <td>
          ${nf.pedidoId?`<span class="text-mono" style="font-size:12px;color:var(--navy-mid)">${nf.pedidoId}</span>`:`<span style="color:var(--text-3);font-size:12px">Sem vínculo</span>`}
        </td>
        <td style="font-weight:600;text-align:right">${brlF(nf.valor||0)}</td>
        <td style="text-align:right;color:var(--text-3)">${nf.pedidoId?brlF(poVal):'—'}</td>
        <td style="text-align:right">
          ${diff===null?`<span class="conc-na">—</span>`:
            diffAbs<0.01?`<span class="conc-ok">✓ Zero</span>`:
            `<span class="conc-warn">${diff>0?'+':'-'}${brlF(diffAbs)}</span>`}
        </td>
        <td>
          <span style="font-size:12.5px;font-weight:600;color:${
            nf.matching==='OK'?'var(--green)':
            nf.matching==='Divergência'?'var(--red)':'var(--amber)'}">
            ${nf.matching==='OK'?'✓ OK':nf.matching==='Divergência'?'⚠ Divergência':'⏳ Pendente'}
          </span>
        </td>
        <td><span class="status-badge ${st.cls}">${st.icon} ${nf.status}</span></td>
        <td>
          <div class="action-btns" onclick="event.stopPropagation()">
            ${nf.status==='Aguardando'?`
              <button class="btn btn-primary btn-sm" onclick="InvoicesModule.conciliar('${nf.id}')">✓ Conciliar</button>
              <button class="btn btn-secondary btn-sm" onclick="InvoicesModule.rejeitar('${nf.id}')">✕</button>`:
            nf.status==='Conciliada'?`<button class="btn btn-secondary btn-sm" onclick="InvoicesModule.marcarPaga('${nf.id}')">💳 Pagar</button>`:''}
          </div>
        </td>
      </tr>`;
    }).join('');

    document.getElementById('inv-info').textContent =
      `${filteredNFs.length} nota${filteredNFs.length!==1?'s':''} fiscal${filteredNFs.length!==1?'is':''}`;
  }

  // ── Populate selects ───────────────────────────────────────────
  function populateSelects() {
    const fornSel = document.getElementById('inv-filter-forn');
    if (fornSel) {
      const fns = [...new Set(getDB().map(n=>n.fornecedor||'').filter(Boolean))];
      fornSel.innerHTML = '<option value="">Todos os fornecedores</option>' +
        fns.map(f=>`<option value="${f}">${f}</option>`).join('');
    }
    const upForn = document.getElementById('inv-up-forn');
    if (upForn) upForn.innerHTML = '<option value="">Selecione...</option>' +
      (BF.db.fornecedores||[]).map(f=>`<option value="${f.id}">${f.razaoSocial||f.nomeFantasia}</option>`).join('');
    const upPO = document.getElementById('inv-up-po');
    if (upPO) upPO.innerHTML = '<option value="">Selecione...</option>' +
      (BF.db.pedidos||[]).filter(p=>p.status==='Aprovado'||p.status==='Transito'||p.status==='Recebido')
        .map(p=>`<option value="${p.id}">${p.id} — ${p.titulo} (${brlF(p.valor||0)})</option>`).join('');
  }

  // ── Detail Panel ───────────────────────────────────────────────
  function openDetailPanel(id) {
    const nf = getDB().find(x=>x.id===id);
    if (!nf) return;
    currentNF = nf;
    const st = NF_STATUS[nf.status]||NF_STATUS['Aguardando'];
    const po = BF.db.pedidos.find(p=>p.id===nf.pedidoId);
    const diff = nf.pedidoId ? ((nf.valor||0)-(po?.valor||0)) : null;

    document.getElementById('inv-detail-numero').textContent      = nf.numero + ' · ' + (nf.emissao||'—');
    document.getElementById('inv-detail-fornecedor').textContent  = nf.fornecedor;
    document.getElementById('inv-detail-badge').textContent       = nf.status;
    document.getElementById('inv-detail-badge').className         = 'status-badge ' + st.cls;
    document.getElementById('inv-detail-meta').innerHTML          = [
      `<span style="font-size:12px;color:var(--text-3)">💰 <strong style="color:var(--navy)">${brlF(nf.valor||0)}</strong></span>`,
      nf.pedidoId?`<span style="font-size:12px;color:var(--text-3)">🔗 PO: <strong style="color:var(--text)">${nf.pedidoId}</strong></span>`:'',
      `<span style="font-size:12px;color:var(--text-3)">📅 Venc: ${nf.vencimentoPagto||'—'}</span>`,
    ].filter(Boolean).join('');

    const footer = [];
    if (nf.status==='Aguardando') {
      footer.push(`<button class="btn btn-secondary" onclick="InvoicesModule.rejeitar('${nf.id}')">✕ Rejeitar</button>`);
      footer.push(`<button class="btn btn-primary" onclick="InvoicesModule.conciliar('${nf.id}')">✓ Conciliar e Aprovar</button>`);
    }
    if (nf.status==='Conciliada')  footer.push(`<button class="btn btn-primary" onclick="InvoicesModule.marcarPaga('${nf.id}')">💳 Marcar como Paga</button>`);
    if (nf.status==='Divergência') footer.push(`<button class="btn btn-secondary" onclick="InvoicesModule.solicitarReenvio('${nf.id}')">📧 Solicitar Reenvio</button>`);
    footer.push(`<button class="btn btn-secondary" onclick="InvoicesModule.closeDetail()">Fechar</button>`);
    document.getElementById('inv-detail-footer').innerHTML = footer.join('');

    switchTab('conciliacao');
    document.getElementById('invDetailOverlay').classList.add('open');
  }

  // ── Tabs ───────────────────────────────────────────────────────
  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.inv-tab').forEach((t,i)=>{
      const tabs=['conciliacao','documento','pagamento','historico'];
      t.classList.toggle('active', tabs[i]===tab);
    });
    document.querySelectorAll('.inv-tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById('inv-tab-'+tab)?.classList.add('active');
    if (!currentNF) return;
    if (tab==='conciliacao') renderTabConciliacao(currentNF);
    if (tab==='documento')   renderTabDocumento(currentNF);
    if (tab==='pagamento')   renderTabPagamento(currentNF);
    if (tab==='historico')   renderTabHistorico(currentNF);
  }

  // ── Tab: Conciliação ───────────────────────────────────────────
  function renderTabConciliacao(nf) {
    const po   = BF.db.pedidos.find(p=>p.id===nf.pedidoId);
    const diff = po ? ((nf.valor||0)-(po.valor||0)) : null;
    const diffAbs = diff !== null ? Math.abs(diff) : null;
    const match3way = po && (BF.db.pedidos.find(p=>p.id===nf.pedidoId)?.status==='Recebido');

    document.getElementById('inv-tab-conciliacao').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Checklist 3-Way Matching</div>
        <div class="conc-match-row ${nf.valor?'conc-match-ok':'conc-match-warn'}">
          <div>
            <div class="conc-match-label">1. Nota Fiscal recebida</div>
            <div style="font-size:12px;color:var(--text-3)">${nf.numero} · ${nf.emissao} · ${nf.fornecedor}</div>
          </div>
          <div class="conc-match-val" style="color:var(--green)">✓ ${brlF(nf.valor||0)}</div>
        </div>
        <div class="conc-match-row ${po?'conc-match-ok':'conc-match-warn'}">
          <div>
            <div class="conc-match-label">2. Pedido de Compra vinculado</div>
            <div style="font-size:12px;color:var(--text-3)">${po?po.id+' · '+po.titulo:'Sem vínculo — selecione o PO'}</div>
          </div>
          <div class="conc-match-val" style="color:${po?'var(--green)':'var(--red)'}">${po?'✓ '+brlF(po.valor||0):'⚠ Sem PO'}</div>
        </div>
        <div class="conc-match-row ${match3way?'conc-match-ok':'conc-match-info'}">
          <div>
            <div class="conc-match-label">3. Recebimento confirmado</div>
            <div style="font-size:12px;color:var(--text-3)">${match3way?'Recebimento registrado no sistema':'Pedido ainda não marcado como recebido'}</div>
          </div>
          <div class="conc-match-val" style="color:${match3way?'var(--green)':'var(--navy)'}">${match3way?'✓ Confirmado':'⏳ Pendente'}</div>
        </div>
      </div>

      ${po?`
      <div class="req-detail-section">
        <div class="req-detail-section-title">Comparativo de Valores</div>
        <table class="conc-table">
          <thead><tr><th>Campo</th><th>Nota Fiscal</th><th>Pedido de Compra</th><th>Diferença</th></tr></thead>
          <tbody>
            <tr>
              <td>Valor Total</td>
              <td>${brlF(nf.valor||0)}</td>
              <td>${brlF(po.valor||0)}</td>
              <td class="${diffAbs<0.01?'conc-ok':'conc-warn'}">
                ${diffAbs<0.01?'✓ Zero':(diff>0?'+':'')+brlF(diff||0)}
              </td>
            </tr>
            <tr>
              <td>Fornecedor</td>
              <td>${nf.fornecedor}</td>
              <td>${po.fornecedor||'—'}</td>
              <td class="${nf.fornecedor===po.fornecedor?'conc-ok':'conc-warn'}">${nf.fornecedor===po.fornecedor?'✓ OK':'⚠ Divergente'}</td>
            </tr>
          </tbody>
        </table>
        ${diffAbs>0.01?`
        <div style="background:var(--red-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--red);margin-top:12px">
          ⚠ Divergência de ${brlF(diffAbs)} — verifique os valores antes de conciliar.
          Você pode conciliar assim mesmo (com justificativa) ou rejeitar e solicitar nova NF ao fornecedor.
        </div>
        <div class="form-group" style="margin-top:10px">
          <label>Justificativa para aceitar divergência</label>
          <input type="text" class="form-input" id="inv-divergencia-just" placeholder="Ex: desconto negociado não refletido no PO">
        </div>`:``}
      </div>`:`
      <div style="background:var(--amber-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--amber);margin-top:8px">
        ⚠ Esta NF não está vinculada a um Pedido de Compra. Selecione o PO correspondente antes de conciliar.
        <div style="margin-top:8px">
          <select class="form-input" id="inv-select-po" style="max-width:300px">
            <option value="">Selecione o PO...</option>
            ${(BF.db.pedidos||[]).filter(p=>p.status!=='Cancelado').map(p=>`<option value="${p.id}">${p.id} — ${p.titulo} (${brlF(p.valor||0)})</option>`).join('')}
          </select>
          <button class="btn btn-primary btn-sm" style="margin-left:8px" onclick="InvoicesModule.vincularPO('${nf.id}')">Vincular</button>
        </div>
      </div>`}
    `;
  }

  // ── Tab: Documento ─────────────────────────────────────────────
  function renderTabDocumento(nf) {
    document.getElementById('inv-tab-documento').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Dados da Nota Fiscal</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Número</span><span class="req-field-value">${nf.numero}</span></div>
          <div class="req-field"><span class="req-field-label">Emissão</span><span class="req-field-value">${nf.emissao||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Fornecedor</span><span class="req-field-value">${nf.fornecedor}</span></div>
          <div class="req-field"><span class="req-field-label">CNPJ Emitente</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${BF.db.fornecedores.find(f=>f.id===nf.fornId)?.cnpj||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Valor</span><span class="req-field-value" style="color:var(--navy);font-size:15px">${brlF(nf.valor||0)}</span></div>
          <div class="req-field"><span class="req-field-label">Chave NF-e</span><span class="req-field-value" style="font-family:monospace;font-size:10px;word-break:break-all">${nf.chaveNFe||'Não informada'}</span></div>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Arquivo</div>
        ${nf.arquivo?`
        <div class="inv-uploaded-file">
          <div style="font-size:22px">📄</div>
          <div style="flex:1">
            <div style="font-size:13.5px;font-weight:500">${nf.arquivo}</div>
            <div style="font-size:12px;color:var(--text-3)">Enviado pelo fornecedor via portal</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="toast('Download disponível após integração com armazenamento')">⬇ Baixar</button>
        </div>`:`
        <div style="text-align:center;padding:24px;color:var(--text-3)">
          <div style="font-size:28px;margin-bottom:8px">📄</div>
          Arquivo não disponível. Solicite o reenvio ao fornecedor.
        </div>`}
      </div>
      <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;font-size:12.5px;color:var(--navy)">
        ℹ️ <strong>Sem integração SEFAZ.</strong> A validação da autenticidade da NF-e é de responsabilidade do time fiscal.
        Verifique a chave de acesso diretamente no portal da SEFAZ estadual.
      </div>`;
  }

  // ── Tab: Pagamento ─────────────────────────────────────────────
  function renderTabPagamento(nf) {
    const po = BF.db.pedidos.find(p=>p.id===nf.pedidoId);
    const forn = BF.db.fornecedores.find(f=>f.id===nf.fornId);
    document.getElementById('inv-tab-pagamento').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Resumo de Pagamento</div>
        <div class="pay-summary">
          <div class="pay-row"><span>Fornecedor</span><span>${nf.fornecedor}</span></div>
          <div class="pay-row"><span>Banco</span><span>${forn?.banco||'—'} Ag: ${forn?.agencia||'—'} CC: ${forn?.conta||'—'}</span></div>
          <div class="pay-row"><span>Chave PIX</span><span style="font-family:monospace;font-size:12px">${forn?.pix||'—'}</span></div>
          <div class="pay-row"><span>Cond. pagamento</span><span>${po?.condPagto||'30 ddl'}</span></div>
          <div class="pay-row"><span>Data vencimento</span><span style="color:var(--amber);font-weight:600">${nf.vencimentoPagto||'—'}</span></div>
          <div class="pay-row"><span>Status</span><span class="${nf.status==='Conciliada'?'conc-ok':nf.status==='Paga'?'conc-ok':'conc-na'}">${nf.status}</span></div>
          <div class="pay-row"><span>Valor a pagar</span><span>${brlF(nf.valor||0)}</span></div>
        </div>
        ${nf.status==='Conciliada'?`
        <div style="margin-top:16px;text-align:right">
          <button class="btn btn-primary" onclick="InvoicesModule.marcarPaga('${nf.id}')">💳 Registrar Pagamento</button>
        </div>`:nf.status==='Paga'?`
        <div style="margin-top:12px;text-align:center;color:var(--green);font-weight:600;font-size:15px">✅ Pagamento registrado</div>`:''}
      </div>`;
  }

  // ── Tab: Histórico ─────────────────────────────────────────────
  function renderTabHistorico(nf) {
    document.getElementById('inv-tab-historico').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Linha do Tempo</div>
        <div class="req-timeline">
          ${(nf.historico||[]).map(h=>`
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

  // ── Public API ─────────────────────────────────────────────────
  return {

    init(containerEl) {
      if (!document.getElementById('inv-css')) {
        const s = document.createElement('style'); s.id='inv-css';
        s.textContent = CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = renderPageHTML();
      enrichNFs();
      populateSelects();
      renderStats();
      renderAlerts();
      this.filter();
    },

    filter: applyFilter,

    openDetail: openDetailPanel,

    closeDetail(e) {
      if (!e || e.target===document.getElementById('invDetailOverlay')) {
        document.getElementById('invDetailOverlay').classList.remove('open');
        currentNF = null;
      }
    },

    switchTab,

    conciliar(id) {
      const nf = getDB().find(x=>x.id===id); if(!nf) return;
      const po = BF.db.pedidos.find(p=>p.id===nf.pedidoId);
      const diff = po ? Math.abs((nf.valor||0)-(po.valor||0)) : 999;
      nf.status  = diff < 0.01 ? 'Conciliada' : 'Divergência';
      nf.matching= diff < 0.01 ? 'OK' : 'Divergência';
      if (po) { if (!po.nfUpload) po.nfUpload = {}; po.nfUpload.status=nf.status; po.nfUpload.numero=nf.numero; }
      nf.historico.push({ data:'Agora', acao:'NF '+nf.status+' pelo comprador', user:'Maria Ribeiro', cor:nf.status==='Conciliada'?'green':'amber' });
      toast(nf.status==='Conciliada'?'✓ '+id+' conciliada! Enviada para pagamento.':'⚠ '+id+' com divergência. Verifique os valores.');
      renderStats(); renderAlerts(); applyFilter();
      if (currentNF?.id===id) switchTab('conciliacao');
    },

    rejeitar(id) {
      const nf = getDB().find(x=>x.id===id); if(!nf) return;
      nf.status  = 'Rejeitada';
      nf.matching= 'Divergência';
      nf.historico.push({ data:'Agora', acao:'NF rejeitada — fornecedor notificado', user:'Maria Ribeiro', cor:'red' });
      toast('NF rejeitada. '+nf.fornecedor+' será notificado para reenvio.');
      renderStats(); renderAlerts(); applyFilter();
      if (currentNF?.id===id) document.getElementById('invDetailOverlay').classList.remove('open');
    },

    marcarPaga(id) {
      const nf = getDB().find(x=>x.id===id); if(!nf) return;
      nf.status = 'Paga';
      nf.historico.push({ data:'Agora', acao:'Pagamento registrado', user:'Maria Ribeiro', cor:'green' });
      toast('💳 Pagamento da '+nf.numero+' registrado!');
      renderStats(); applyFilter();
      if (currentNF?.id===id) switchTab('pagamento');
    },

    solicitarReenvio(id) {
      const nf = getDB().find(x=>x.id===id); if(!nf) return;
      nf.historico.push({ data:'Agora', acao:'Reenvio da NF solicitado ao fornecedor', user:'Maria Ribeiro', cor:'amber' });
      toast('📧 Solicitação de reenvio enviada para '+nf.fornecedor);
    },

    vincularPO(nfId) {
      const nf  = getDB().find(x=>x.id===nfId); if(!nf) return;
      const poId= document.getElementById('inv-select-po')?.value;
      if (!poId) { toast('Selecione o PO'); return; }
      nf.pedidoId = poId;
      nf.historico.push({ data:'Agora', acao:'Vinculada ao PO '+poId, user:'Maria Ribeiro', cor:'blue' });
      toast('NF vinculada ao '+poId);
      applyFilter();
      switchTab('conciliacao');
    },

    toggleSel(id, cb) {
      if (cb.checked) selectedNFs.add(id); else selectedNFs.delete(id);
      this.updateBulkBar();
    },

    toggleAll(cb) {
      filteredNFs.forEach(n=>{ if(cb.checked) selectedNFs.add(n.id); else selectedNFs.delete(n.id); });
      applyFilter(); this.updateBulkBar();
    },

    updateBulkBar() {
      const bar = document.getElementById('inv-bulk-bar');
      const n   = selectedNFs.size;
      bar.classList.toggle('show', n>0);
      document.getElementById('inv-bulk-count').textContent = n+' selecionada'+(n!==1?'s':'');
    },

    bulkConciliar() {
      let ok=0;
      selectedNFs.forEach(id=>{ const nf=getDB().find(x=>x.id===id); if(nf&&nf.status==='Aguardando'){nf.status='Conciliada';nf.matching='OK';ok++;} });
      selectedNFs.clear(); this.updateBulkBar();
      toast('✓ '+ok+' NF'+( ok!==1?'s':'')+' conciliada'+(ok!==1?'s':'')+'!');
      renderStats(); renderAlerts(); applyFilter();
    },

    bulkRejeitar() {
      let ct=0;
      selectedNFs.forEach(id=>{ const nf=getDB().find(x=>x.id===id); if(nf){nf.status='Rejeitada';nf.matching='Divergência';ct++;} });
      selectedNFs.clear(); this.updateBulkBar();
      toast(ct+' NF'+( ct!==1?'s':'')+' rejeitada'+(ct!==1?'s':'')+'.');
      renderStats(); renderAlerts(); applyFilter();
    },

    openUploadModal() { document.getElementById('invUploadModal').classList.add('open'); },
    closeUploadModal() { document.getElementById('invUploadModal').classList.remove('open'); },

    previewArquivo(input) {
      const f = input.files[0]; if(!f) return;
      document.getElementById('inv-arquivo-preview').innerHTML = `
        <div class="inv-uploaded-file" style="margin-top:8px">
          <div style="font-size:22px">📄</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:500">${f.name}</div><div style="font-size:11.5px;color:var(--text-3)">${(f.size/1024).toFixed(1)} KB</div></div>
        </div>`;
    },

    previewConciliacao() {
      const poId = document.getElementById('inv-up-po')?.value;
      const val  = parseFloat(document.getElementById('inv-up-valor')?.value)||0;
      if (!poId||!val) { toast('Selecione o PO e informe o valor para pré-visualizar'); return; }
      const po = BF.db.pedidos.find(p=>p.id===poId);
      const diff = val-(po?.valor||0);
      document.getElementById('inv-up-preview-conc').style.display='block';
      document.getElementById('inv-up-preview-conc').innerHTML = `
        <div style="background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:12px 14px;margin-top:10px">
          <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);margin-bottom:8px">Pré-visualização da Conciliação</div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Valor da NF</span><span style="font-weight:600">${brlF(val)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0"><span>Valor do PO ${poId}</span><span>${brlF(po?.valor||0)}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:13px;padding:8px 0 0;font-weight:700;border-top:1px solid var(--border);margin-top:4px">
            <span>Diferença</span>
            <span style="color:${Math.abs(diff)<0.01?'var(--green)':'var(--red)'}">${Math.abs(diff)<0.01?'✓ Sem divergência':'⚠ '+brlF(Math.abs(diff))}</span>
          </div>
        </div>`;
    },

    submitNF() {
      const fornId = document.getElementById('inv-up-forn')?.value;
      const poId   = document.getElementById('inv-up-po')?.value;
      const num    = document.getElementById('inv-up-numero')?.value?.trim();
      const val    = parseFloat(document.getElementById('inv-up-valor')?.value)||0;
      const data   = document.getElementById('inv-up-data')?.value;
      const chave  = document.getElementById('inv-up-chave')?.value||'';
      if (!fornId) { toast('Selecione o fornecedor'); return; }
      if (!num)    { toast('Informe o número da NF'); return; }
      if (!val)    { toast('Informe o valor da NF'); return; }
      if (!data)   { toast('Informe a data de emissão'); return; }

      const forn = BF.db.fornecedores.find(f=>f.id===fornId);
      const po   = poId ? BF.db.pedidos.find(p=>p.id===poId) : null;
      const diff = po ? Math.abs(val-(po.valor||0)) : 999;
      const status  = po ? (diff<0.01?'Conciliada':'Divergência') : 'Aguardando';
      const matching= po ? (diff<0.01?'OK':'Divergência') : 'Pendente';

      const id = 'NF'+Date.now();
      const novaData = data.split('-').reverse().join('/');
      const venc = new Date(data); venc.setDate(venc.getDate()+30);

      const nova = {
        id, numero:'NF-'+num, fornecedor:forn?.razaoSocial||forn?.nomeFantasia||fornId,
        fornId, pedidoId:poId||'', valor:val, emissao:novaData,
        status, matching, arquivo:`nf_${num}.xml`, chaveNFe:chave,
        vencimentoPagto: venc.toLocaleDateString('pt-BR'),
        historico:[
          { data:novaData, acao:'NF registrada manualmente', user:'Maria Ribeiro', cor:'blue' },
          ...(status==='Conciliada'?[{ data:novaData, acao:'Conciliada automaticamente com '+poId, user:'Sistema', cor:'green' }]:[]),
        ],
      };
      BF.db.notasFiscais.unshift(nova);
      if (po) { po.nfUpload = { numero:'NF-'+num, valor:val, arquivo:`nf_${num}.xml`, status }; }

      this.closeUploadModal();
      toast(status==='Conciliada'?'✓ NF registrada e conciliada com sucesso!':'⚠ NF registrada com divergência. Verifique os valores.');
      enrichNFs(); renderStats(); renderAlerts(); applyFilter();
    },

    exportCSV() {
      const rows=[['Número','Fornecedor','Pedido','Valor NF','Valor PO','Diferença','Matching','Status','Emissão','Vencimento']];
      getDB().forEach(nf=>{
        const poVal = getPoValue(nf.pedidoId||'');
        const diff  = nf.pedidoId ? (nf.valor||0)-poVal : null;
        rows.push([nf.numero,nf.fornecedor,nf.pedidoId||'',nf.valor||0,poVal,diff!==null?diff:'',nf.matching,nf.status,nf.emissao||'',nf.vencimentoPagto||'']);
      });
      const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
      const a=document.createElement('a');
      a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
      a.download='notas-fiscais-bidflow.csv'; a.click();
      toast('CSV exportado!');
    },

  };

})();
