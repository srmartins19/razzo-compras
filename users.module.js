/**
 * BidFlow — Componente: Fornecedores (suppliers.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Listagem e busca de fornecedores
 *  - Perfil completo do fornecedor
 *  - Processo de homologação (documentos, aprovação)
 *  - Score / avaliação SRM
 *  - Histórico de compras por fornecedor
 *  - Convite de cadastro via link
 *  - Sincronização com Datasul (holderPublic)
 *
 * Integração Datasul (Fase 3):
 *   GET  /dts/datasul-rest/resources/prg/fin/v1/holderPublic
 *   POST /dts/datasul-rest/resources/prg/fin/v1/holderPublic
 *
 * Manutenção: se algo der errado em Fornecedores, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.SuppliersModule = (function () {

  const CSS = `
  /* ── suppliers.module.css ── */
  .sup-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
  .sup-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow);border-top:3px solid transparent}
  .sup-stat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;display:block}
  .sup-stat-label{font-size:11px;color:var(--text-3);display:block;margin-top:1px}

  /* Table */
  .sup-avatar{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
  .sup-score-wrap{display:flex;align-items:center;gap:8px}
  .sup-score-bar{flex:1;height:5px;background:var(--bg-4);border-radius:3px}
  .sup-score-fill{height:5px;border-radius:3px}
  .sup-score-num{font-size:12px;font-weight:600;min-width:24px}

  /* Detail panel */
  .sup-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;align-items:flex-start;justify-content:flex-end}
  .sup-detail-overlay.open{display:flex}
  .sup-detail-panel{width:680px;max-width:96vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.15);animation:slideIn .25s ease;display:flex;flex-direction:column}

  .sup-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 20px;background:var(--bg-2);position:sticky;top:0;z-index:1;overflow-x:auto}
  .sup-tab{padding:11px 13px;font-size:13px;font-weight:500;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif;white-space:nowrap}
  .sup-tab.active{color:var(--navy);border-bottom-color:var(--navy)}
  .sup-tab-content{display:none;padding:20px;flex:1}
  .sup-tab-content.active{display:block}

  /* Homologação */
  .hom-step{display:flex;gap:14px;margin-bottom:14px;align-items:flex-start}
  .hom-dot{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid}
  .hom-dot.ok{background:var(--green-light);border-color:var(--green);color:var(--green)}
  .hom-dot.pending{background:var(--amber-light);border-color:var(--amber);color:var(--amber)}
  .hom-dot.waiting{background:var(--bg-4);border-color:var(--border);color:var(--text-3)}
  .hom-info{flex:1;padding-top:4px}
  .hom-title{font-size:13.5px;font-weight:500}
  .hom-sub{font-size:12px;color:var(--text-3);margin-top:2px}

  /* Doc item */
  .sup-doc-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;margin-bottom:7px}
  .sup-doc-status{font-size:11px;padding:2px 7px;border-radius:20px;font-weight:600;white-space:nowrap}

  /* Compras history */
  .sup-hist-table{width:100%;border-collapse:collapse}
  .sup-hist-table th{background:var(--bg-3);padding:9px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border)}
  .sup-hist-table td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-2)}
  .sup-hist-table tr:last-child td{border-bottom:none}

  /* Score visual */
  .sup-score-big{display:flex;flex-direction:column;align-items:center;padding:16px 0}
  .sup-score-big-val{font-family:'Syne',sans-serif;font-size:48px;font-weight:700;color:var(--navy);line-height:1}
  .sup-score-big-max{font-size:16px;color:var(--text-3)}
  .sup-score-criteria{display:flex;flex-direction:column;gap:8px;margin-top:16px}
  .sup-score-crit-row{display:flex;align-items:center;gap:10px}
  .sup-score-crit-label{font-size:13px;color:var(--text-2);min-width:140px}
  .sup-score-crit-bar{flex:1;height:5px;background:var(--bg-4);border-radius:3px}
  .sup-score-crit-fill{height:5px;border-radius:3px;background:var(--navy-mid)}
  .sup-score-crit-val{font-size:12px;font-weight:600;color:var(--navy);min-width:30px;text-align:right}

  @media(max-width:1100px){.sup-stats{grid-template-columns:repeat(2,1fr)}}
  `;

  const brl  = v => 'R$ ' + (v>=1000?(v/1000).toFixed(0)+'K':Number(v).toLocaleString('pt-BR'));
  const brlF = v => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const toast = msg => window.toast?.(msg);
  const getDB = () => BF.db.fornecedores || [];

  let currentSupp  = null;
  let currentTab   = 'perfil';
  let filteredSupp = [];

  const catColors = {
    'TI & Tecnologia':'chip-blue','MRO':'chip-amber','Serviços':'chip-purple',
    'Logística':'chip-green','Equipamentos':'chip-red','Material de Escritório':'chip-amber','Outros':'chip-gray',
  };
  const avatarColors = ['#1e3a5f','#2563a8','#16a34a','#d97706','#7c3aed','#dc2626','#0891b2'];

  function scoreColor(s) {
    if (s>=9) return 'var(--green)';
    if (s>=7) return 'var(--navy-mid)';
    if (s>=5) return 'var(--amber)';
    return 'var(--red)';
  }

  function renderStats() {
    const all = getDB();
    const aprov  = all.filter(f=>f.status==='Aprovado').length;
    const homol  = all.filter(f=>f.status==='Homologando').length;
    const avgScore = all.length ? (all.reduce((s,f)=>s+(f.score||0),0)/all.length).toFixed(1) : 0;
    document.getElementById('sup-stats').innerHTML = [
      { label:'Total Fornecedores',  val:all.length,  color:'#8892a8' },
      { label:'Aprovados',           val:aprov,        color:'#16a34a' },
      { label:'Em Homologação',      val:homol,        color:'#d97706' },
      { label:'Score Médio SRM',     val:avgScore+'/10',color:'#1e3a5f' },
    ].map(s=>`
      <div class="sup-stat" style="border-top-color:${s.color}">
        <span class="sup-stat-val">${s.val}</span>
        <span class="sup-stat-label">${s.label}</span>
      </div>`).join('');
    document.getElementById('sup-subtitle').textContent =
      `${all.length} fornecedores · ${aprov} aprovados · ${homol} em homologação`;
  }

  function applyFilter() {
    const search = (document.getElementById('sup-search')||{}).value?.toLowerCase()||'';
    const status = (document.getElementById('sup-filter-status')||{}).value||'';
    const cat    = (document.getElementById('sup-filter-cat')||{}).value||'';

    filteredSupp = getDB().filter(f=>{
      const ms  = !search || (f.razaoSocial+f.nomeFantasia+(f.cnpj||'')+f.email).toLowerCase().includes(search);
      const mst = !status || f.status===status;
      const mc  = !cat    || f.categoria===cat;
      return ms && mst && mc;
    });
    renderTable();
  }

  function renderTable() {
    const tbody = document.getElementById('sup-tbody');
    if (!tbody) return;
    if (!filteredSupp.length) {
      tbody.innerHTML = `<tr><td colspan="9"><div style="text-align:center;padding:40px;color:var(--text-3)">Nenhum fornecedor encontrado.</div></td></tr>`;
      document.getElementById('sup-info').textContent = '0 resultados';
      return;
    }
    tbody.innerHTML = filteredSupp.map((f,i)=>{
      const sigla = (f.razaoSocial||f.nomeFantasia||'??').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const avatarBg = avatarColors[i%avatarColors.length];
      const score = f.score || 7.5;
      const catCls = catColors[f.categoria]||'chip-blue';
      const stCls  = f.status==='Aprovado'?'status-green':f.status==='Homologando'?'status-amber':'status-gray';
      return `
      <tr style="cursor:pointer" onclick="SuppliersModule.openDetail('${f.id}')">
        <td><input type="checkbox" onclick="event.stopPropagation()"></td>
        <td>
          <div class="table-entity">
            <div class="sup-avatar" style="background:${avatarBg};color:#fff">${sigla}</div>
            <div>
              <span class="entity-name">${f.razaoSocial||f.nomeFantasia}</span>
              <span class="entity-sub">${f.email||'—'}</span>
            </div>
          </div>
        </td>
        <td class="text-mono" style="font-size:11.5px">${f.cnpj||f.datasulCode||'—'}</td>
        <td><span class="chip ${catCls}">${f.categoria||'—'}</span></td>
        <td>
          <div class="sup-score-wrap">
            <div class="sup-score-bar"><div class="sup-score-fill" style="width:${score*10}%;background:${scoreColor(score)}"></div></div>
            <span class="sup-score-num" style="color:${scoreColor(score)}">${score}</span>
          </div>
        </td>
        <td><span class="status-badge ${stCls}">${f.status}</span></td>
        <td>${f.contratos||'—'}</td>
        <td style="font-family:monospace;font-size:11px;color:var(--text-3)">${f.datasulCode||'—'}</td>
        <td>
          <div class="action-btns" onclick="event.stopPropagation()">
            <button class="icon-btn" onclick="SuppliersModule.openDetail('${f.id}')" title="Ver perfil">
              <svg viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            </button>
            <button class="icon-btn" onclick="SuppliersModule.convidarRFQ('${f.id}')" title="Iniciar cotação">
              <svg viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
    document.getElementById('sup-info').textContent = `${filteredSupp.length} de ${getDB().length} fornecedores`;
  }

  // ── Detail panel ───────────────────────────────────────────────
  function openDetailPanel(id) {
    const f = getDB().find(x=>x.id===id); if(!f) return;
    currentSupp = f;
    const sigla = (f.razaoSocial||f.nomeFantasia||'??').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    document.getElementById('sup-detail-nome').textContent   = f.razaoSocial||f.nomeFantasia;
    document.getElementById('sup-detail-sigla').textContent  = sigla;
    document.getElementById('sup-detail-badge').textContent  = f.status;
    document.getElementById('sup-detail-badge').className    = 'status-badge '+(f.status==='Aprovado'?'status-green':f.status==='Homologando'?'status-amber':'status-gray');

    const footer = [];
    if (f.status==='Homologando') {
      footer.push(`<button class="btn btn-primary" onclick="SuppliersModule.aprovarFornecedor('${f.id}')">✓ Aprovar Fornecedor</button>`);
      footer.push(`<button class="btn btn-secondary" onclick="SuppliersModule.rejeitarFornecedor('${f.id}')">✕ Rejeitar</button>`);
    }
    footer.push(`<button class="btn btn-secondary" onclick="SuppliersModule.convidarRFQ('${f.id}')">💬 Iniciar Cotação</button>`);
    footer.push(`<button class="btn btn-secondary" onclick="SuppliersModule.closeDetail()">Fechar</button>`);
    document.getElementById('sup-detail-footer').innerHTML = footer.join('');

    switchTab('perfil');
    document.getElementById('supDetailOverlay').classList.add('open');
  }

  function switchTab(tab) {
    currentTab = tab;
    const tabs = ['perfil','homologacao','score','historico','docs'];
    document.querySelectorAll('.sup-tab').forEach((t,i)=>t.classList.toggle('active',tabs[i]===tab));
    document.querySelectorAll('.sup-tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById('sup-tab-'+tab)?.classList.add('active');
    if (!currentSupp) return;
    const f = currentSupp;
    if (tab==='perfil')       renderTabPerfil(f);
    if (tab==='homologacao')  renderTabHomologacao(f);
    if (tab==='score')        renderTabScore(f);
    if (tab==='historico')    renderTabHistorico(f);
    if (tab==='docs')         renderTabDocs(f);
  }

  function renderTabPerfil(f) {
    document.getElementById('sup-tab-perfil').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Dados Cadastrais</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Razão Social</span><span class="req-field-value">${f.razaoSocial||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Nome Fantasia</span><span class="req-field-value">${f.nomeFantasia||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">CNPJ</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${f.cnpj||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Inscrição Estadual</span><span class="req-field-value">${f.ie||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Categoria</span><span class="req-field-value"><span class="chip ${catColors[f.categoria]||'chip-blue'}">${f.categoria||'—'}</span></span></div>
          <div class="req-field"><span class="req-field-label">Código Datasul</span><span class="req-field-value" style="font-family:monospace;font-size:12px;color:var(--navy)">${f.datasulCode||'Não sincronizado'}</span></div>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Contato</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Contato Comercial</span><span class="req-field-value">${f.contato||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Cargo</span><span class="req-field-value">${f.cargo||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">E-mail Comercial</span><span class="req-field-value">${f.email||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">E-mail NF</span><span class="req-field-value">${f.emailNF||f.email||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Telefone</span><span class="req-field-value">${f.telefone||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">WhatsApp</span><span class="req-field-value">${f.celular||'—'}</span></div>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Endereço</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Logradouro</span><span class="req-field-value">${f.logradouro?f.logradouro+', '+f.numero:f.cidade?'—':f.email?'Não informado':'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Cidade/UF</span><span class="req-field-value">${f.cidade?f.cidade+'/'+f.uf:'—'}</span></div>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Dados Bancários</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Banco / Agência</span><span class="req-field-value">${f.banco?f.banco+' · Ag '+f.agencia:'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Conta</span><span class="req-field-value">${f.conta||'—'}</span></div>
          <div class="req-field"><span class="req-field-label">Chave PIX</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${f.pix||'—'}</span></div>
        </div>
      </div>
      <div style="background:var(--navy-light);border-radius:8px;padding:11px 13px;font-size:12.5px;color:var(--navy)">
        🔗 <strong>Datasul:</strong> fornecedor ${f.datasulCode?'sincronizado como código <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px">'+f.datasulCode+'</code> via <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px">holderPublic</code>':'ainda não sincronizado — será enviado após homologação (Fase 3)'}.
      </div>`;
  }

  function renderTabHomologacao(f) {
    const docs = f.docs || {};
    const steps = [
      { label:'Cadastro no portal',           done:true,                                icon:'✓' },
      { label:'Contrato Social / Requerimento',done:docs.contratSocial,                 icon:docs.contratSocial?'✓':'⏳' },
      { label:'Certidão Negativa Débitos',     done:docs.certidaoNegativa,              icon:docs.certidaoNegativa?'✓':'⏳' },
      { label:'Alvará de Funcionamento',       done:docs.alvara,                        icon:docs.alvara?'✓':'⏳' },
      { label:'Regularidade Fiscal (FGTS)',    done:docs.regularidadeFiscal,            icon:docs.regularidadeFiscal?'✓':'⏳' },
      { label:'Aprovação pelo Comprador',      done:f.status==='Aprovado',              icon:f.status==='Aprovado'?'✓':'⏳' },
      { label:'Sincronização com Datasul',     done:!!f.datasulCode,                    icon:f.datasulCode?'✓':'—' },
    ];
    const allDocs = Object.values(docs).every(Boolean);
    document.getElementById('sup-tab-homologacao').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Progresso de Homologação</div>
        ${steps.map(s=>`
        <div class="hom-step">
          <div class="hom-dot ${s.done?'ok':s.icon==='—'?'waiting':'pending'}">${s.icon}</div>
          <div class="hom-info">
            <div class="hom-title">${s.label}</div>
            <div class="hom-sub">${s.done?'Concluído':'Pendente'}</div>
          </div>
        </div>`).join('')}
      </div>
      ${f.status==='Homologando'?`
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary" onclick="SuppliersModule.aprovarFornecedor('${f.id}')">✓ Aprovar Fornecedor</button>
        <button class="btn btn-secondary" onclick="SuppliersModule.rejeitarFornecedor('${f.id}')">✕ Rejeitar</button>
      </div>`:''}`;
  }

  function renderTabScore(f) {
    const score = f.score || 7.5;
    const criterios = [
      { label:'Qualidade / Conformidade', pct: Math.round(score*9.5), val:(score*0.95).toFixed(1) },
      { label:'Prazo de Entrega',         pct: Math.round(score*8),   val:(score*0.8).toFixed(1) },
      { label:'Preço Competitivo',        pct: Math.round(score*10),  val:score.toFixed(1) },
      { label:'Relacionamento',           pct: Math.round(score*9),   val:(score*0.9).toFixed(1) },
      { label:'Documentação em dia',      pct: Object.values(f.docs||{}).filter(Boolean).length/4*100, val:(Object.values(f.docs||{}).filter(Boolean).length/4*10).toFixed(1) },
    ];
    document.getElementById('sup-tab-score').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">SRM Score</div>
        <div class="sup-score-big">
          <div><span class="sup-score-big-val" style="color:${scoreColor(score)}">${score}</span><span class="sup-score-big-max">/10</span></div>
          <div style="font-size:13px;color:var(--text-3);margin-top:6px">${score>=9?'Fornecedor excelente':score>=7?'Bom fornecedor':score>=5?'Fornecedor regular':'Atenção necessária'}</div>
        </div>
        <div class="sup-score-criteria">
          ${criterios.map(c=>`
          <div class="sup-score-crit-row">
            <span class="sup-score-crit-label">${c.label}</span>
            <div class="sup-score-crit-bar"><div class="sup-score-crit-fill" style="width:${c.pct}%;background:${scoreColor(parseFloat(c.val))}"></div></div>
            <span class="sup-score-crit-val" style="color:${scoreColor(parseFloat(c.val))}">${c.val}</span>
          </div>`).join('')}
        </div>
      </div>`;
  }

  function renderTabHistorico(f) {
    const pedidos = (BF.db.pedidos||[]).filter(p=>(p.fornecedor||'').toLowerCase().includes((f.razaoSocial||f.nomeFantasia||'').split(' ')[0].toLowerCase())).slice(0,10);
    document.getElementById('sup-tab-historico').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Histórico de Compras</div>
        ${pedidos.length?`
        <table class="sup-hist-table">
          <thead><tr><th>Pedido</th><th>Título</th><th>Valor</th><th>Status</th><th>Data</th></tr></thead>
          <tbody>
            ${pedidos.map(p=>`<tr>
              <td class="text-mono" style="font-size:11px">${p.id}</td>
              <td style="font-weight:500">${p.titulo}</td>
              <td style="font-weight:600;color:var(--navy)">${brlF(p.valor||0)}</td>
              <td><span class="status-badge ${p.status==='Recebido'?'status-green':p.status==='Aprovacao'?'status-amber':'status-blue'}">${p.status}</span></td>
              <td style="color:var(--text-3);font-size:12px">${p.emissao||'—'}</td>
            </tr>`).join('')}
          </tbody>
        </table>`:`<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhum pedido encontrado para este fornecedor.</div>`}
      </div>`;
  }

  function renderTabDocs(f) {
    const docs = f.docs || {};
    const docList = [
      { nome:'Contrato Social / Requerimento', key:'contratSocial' },
      { nome:'Certidão Negativa de Débitos',   key:'certidaoNegativa' },
      { nome:'Alvará de Funcionamento',        key:'alvara' },
      { nome:'Regularidade FGTS',             key:'regularidadeFiscal' },
    ];
    document.getElementById('sup-tab-docs').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Documentos de Homologação</div>
        ${docList.map(d=>`
        <div class="sup-doc-item">
          <div style="font-size:20px">${docs[d.key]?'📄':'📋'}</div>
          <div style="flex:1">
            <div style="font-size:13.5px;font-weight:500">${d.nome}</div>
            <div style="font-size:12px;color:var(--text-3)">Enviado pelo fornecedor via portal</div>
          </div>
          <span class="sup-doc-status ${docs[d.key]?'status-green':'status-gray'}">${docs[d.key]?'✓ Recebido':'Pendente'}</span>
          ${docs[d.key]?`<button class="btn btn-secondary btn-sm" onclick="toast('Download disponível após integração com armazenamento')">⬇</button>`:''}
        </div>`).join('')}
        <div style="margin-top:12px">
          <div class="inv-upload-zone" style="padding:16px" onclick="toast('Upload disponível após integração')">
            <div style="font-size:20px;margin-bottom:4px">📎</div>
            <div style="font-size:13px;font-weight:500;color:var(--text-2)">Adicionar documento</div>
          </div>
        </div>
      </div>`;
  }

  function buildPageHTML() {
    const cats = [...new Set((BF.db.fornecedores||[]).map(f=>f.categoria).filter(Boolean))];
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Fornecedores</h1>
        <p class="page-subtitle" id="sup-subtitle">Gestão e homologação de fornecedores</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="SuppliersModule.exportCSV()">Exportar CSV</button>
        <button class="btn btn-secondary" onclick="SuppliersModule.convidarNovo()">📧 Convidar Fornecedor</button>
        <button class="btn btn-primary"   onclick="openModal('supplierModal')">+ Novo Fornecedor</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="sup-stats" id="sup-stats"></div>

    <!-- Filtros -->
    <div class="filter-bar" style="margin-bottom:16px">
      <div class="filter-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="sup-search" placeholder="Buscar por nome, CNPJ, e-mail..." oninput="SuppliersModule.filter()">
      </div>
      <select class="filter-select" id="sup-filter-status" onchange="SuppliersModule.filter()">
        <option value="">Todos os status</option>
        <option value="Aprovado">Aprovado</option>
        <option value="Homologando">Em Homologação</option>
        <option value="Bloqueado">Bloqueado</option>
      </select>
      <select class="filter-select" id="sup-filter-cat" onchange="SuppliersModule.filter()">
        <option value="">Todas as categorias</option>
        ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
      </select>
    </div>

    <!-- Tabela -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th><input type="checkbox"></th>
            <th>Fornecedor</th>
            <th>CNPJ / Código</th>
            <th>Categoria</th>
            <th>Score SRM</th>
            <th>Status</th>
            <th>Contratos</th>
            <th>Cód. Datasul</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="sup-tbody"></tbody>
      </table>
      <div class="table-footer">
        <span class="table-info" id="sup-info"></span>
      </div>
    </div>

    <!-- Detail panel -->
    <div class="sup-detail-overlay" id="supDetailOverlay" onclick="SuppliersModule.closeDetail(event)">
      <div class="sup-detail-panel">
        <div class="req-detail-header">
          <div style="display:flex;align-items:center;gap:14px">
            <div class="sup-avatar" style="width:44px;height:44px;background:var(--navy);color:#fff;font-size:14px;border-radius:10px" id="sup-detail-sigla"></div>
            <div>
              <h2 style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700" id="sup-detail-nome"></h2>
              <span class="status-badge" id="sup-detail-badge" style="margin-top:4px;display:inline-block"></span>
            </div>
          </div>
          <button onclick="SuppliersModule.closeDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
        </div>
        <div class="sup-tabs">
          <button class="sup-tab active"  onclick="SuppliersModule.switchTab('perfil')">Perfil</button>
          <button class="sup-tab"         onclick="SuppliersModule.switchTab('homologacao')">Homologação</button>
          <button class="sup-tab"         onclick="SuppliersModule.switchTab('score')">Score SRM</button>
          <button class="sup-tab"         onclick="SuppliersModule.switchTab('historico')">Histórico</button>
          <button class="sup-tab"         onclick="SuppliersModule.switchTab('docs')">Documentos</button>
        </div>
        <div id="sup-tab-perfil"       class="sup-tab-content active"></div>
        <div id="sup-tab-homologacao"  class="sup-tab-content"></div>
        <div id="sup-tab-score"        class="sup-tab-content"></div>
        <div id="sup-tab-historico"    class="sup-tab-content"></div>
        <div id="sup-tab-docs"         class="sup-tab-content"></div>
        <div class="req-detail-footer" id="sup-detail-footer"></div>
      </div>
    </div>
    `;
  }

  return {
    init(containerEl) {
      if (!document.getElementById('sup-css')) {
        const s=document.createElement('style'); s.id='sup-css';
        s.textContent=CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = buildPageHTML();
      renderStats();
      this.filter();
    },

    filter: applyFilter,
    openDetail: openDetailPanel,
    switchTab,

    closeDetail(e) {
      if (!e || e.target===document.getElementById('supDetailOverlay'))
        document.getElementById('supDetailOverlay')?.classList.remove('open');
    },

    aprovarFornecedor(id) {
      const f = getDB().find(x=>x.id===id); if(!f) return;
      f.status = 'Aprovado';
      f.homologadoEm = new Date().toLocaleDateString('pt-BR');
      toast('✓ '+( f.razaoSocial||f.nomeFantasia)+' aprovado! Será sincronizado ao Datasul na Fase 3.');
      renderStats(); applyFilter();
      if (currentSupp?.id===id) switchTab('homologacao');
    },

    rejeitarFornecedor(id) {
      const f = getDB().find(x=>x.id===id); if(!f) return;
      f.status = 'Bloqueado';
      toast('Fornecedor rejeitado. Notificação enviada.');
      document.getElementById('supDetailOverlay')?.classList.remove('open');
      renderStats(); applyFilter();
    },

    convidarRFQ(id) {
      const f = getDB().find(x=>x.id===id); if(!f) return;
      toast('Abrindo nova cotação com '+(f.razaoSocial||f.nomeFantasia)+'...');
      setTimeout(()=>{ if(typeof showPage==='function') showPage('rfq'); }, 800);
    },

    convidarNovo() {
      toast('Use Usuários & Acessos → Convidar Fornecedor para gerar o link de cadastro.');
      setTimeout(()=>{ if(typeof showPage==='function') showPage('users'); }, 1000);
    },

    exportCSV() {
      const rows=[['ID','Razão Social','CNPJ','Categoria','Score','Status','E-mail','Cód Datasul']];
      getDB().forEach(f=>rows.push([f.id,f.razaoSocial||f.nomeFantasia,f.cnpj||'',f.categoria||'',f.score||'',f.status,f.email||'',f.datasulCode||'']));
      const csv=rows.map(r=>r.map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')).join('\n');
      const a=document.createElement('a');
      a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
      a.download='fornecedores-bidflow.csv'; a.click();
      toast('CSV exportado!');
    },
  };

})();
