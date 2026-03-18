/**
 * BidFlow — Componente: Contratos (contracts.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Listagem e gestão de contratos com fornecedores
 *  - Criação de contrato (manual ou a partir de PO/RFQ)
 *  - Aditivos de valor e prazo
 *  - Alertas automáticos de vencimento
 *  - Renovação e encerramento
 *  - Upload e gestão de documentos do contrato
 *  - Indicadores de desempenho do fornecedor (SLA)
 *  - Histórico de alterações
 *
 * Integração Datasul (Fase 3 — quando ativada, ver api.js):
 *   [Datasul não possui módulo nativo de contratos no MCC]
 *   A integração é feita via vinculação ao holderPublic do fornecedor
 *   e referência ao purchOrderPublic do pedido de origem.
 *   GET  /dts/datasul-rest/resources/prg/fin/v1/holderPublic
 *   POST (BidFlow gerencia contratos internamente)
 *
 * Manutenção: se algo der errado em contratos, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.ContractsModule = (function () {

  // ── Tipos e status ─────────────────────────────────────────────
  const TIPOS = ['Fornecimento','Serviços','Locação','Manutenção','Consultoria','Software/SaaS','Obra','Outros'];

  const STATUS_META = {
    'Ativo':      { cls:'status-green',  icon:'✓',  color:'#16a34a' },
    'Vencendo':   { cls:'status-amber',  icon:'⚠',  color:'#d97706' },
    'Vencido':    { cls:'status-red',    icon:'⏰', color:'#dc2626' },
    'Suspenso':   { cls:'status-red',    icon:'⏸',  color:'#dc2626' },
    'Encerrado':  { cls:'status-gray',   icon:'✕',  color:'#8892a8' },
    'Em revisão': { cls:'status-amber',  icon:'🔍', color:'#d97706' },
    'Rascunho':   { cls:'status-gray',   icon:'✎',  color:'#8892a8' },
  };

  const REAJUSTE_TIPOS = ['Fixo','IPCA','IGP-M','INPC','IPC-A','Sem reajuste'];

  // ── Mock data enriquecido ──────────────────────────────────────
  // [Datasul] Contratos são gerenciados pelo BidFlow.
  // Vinculação ao fornecedor via holderPublic (fornId → datasulCode)
  const MOCK_CONTRATOS = [
    {
      id:'CNT-0048', numero:'2026/0048',
      titulo:'Suporte TI Mensal — TechSupply',
      tipo:'Serviços',
      fornId:'F001', fornecedor:'TechSupply LTDA', cnpjForn:'12.345.678/0001-90',
      status:'Ativo',
      valorTotal:102000, valorMensal:8500, moeda:'BRL',
      inicio:'01/01/2026', fim:'31/12/2026',
      diasRestantes:288,
      renovacaoAutomatica:true, prazoAvisoPrevio:30,
      reajusteTipo:'IPCA', reajustePct:0,
      objeto:'Prestação de serviços de suporte técnico em TI, incluindo help desk, manutenção de servidores e gerenciamento de licenças.',
      condicaoPagto:'30 ddl', diaVencimento:10,
      responsavelInterno:'Maria Ribeiro',
      centroCusto:'TI & Tecnologia',
      poOrigem:'PC-2024-1102',
      rfqOrigem:'RFQ-2024-0887',
      datasulFornCode:'0012345',
      sla:{ disponibilidade:99.5, tempoResposta:'4h', tempoSolucao:'24h', multa:'2%/dia' },
      medicoes:[
        { mes:'Jan/2026', valor:8500, status:'Pago',    nota:'NF-4501', avaliacao:5 },
        { mes:'Fev/2026', valor:8500, status:'Pago',    nota:'NF-4510', avaliacao:4 },
        { mes:'Mar/2026', valor:8500, status:'Aberto',  nota:'',        avaliacao:null },
      ],
      aditivos:[],
      docs:[
        { nome:'Contrato assinado.pdf',    tipo:'Contrato', data:'01/01/2026', tamanho:'2.4MB' },
        { nome:'Proposta técnica.pdf',     tipo:'Proposta', data:'15/12/2025', tamanho:'1.1MB' },
      ],
      historico:[
        { data:'01/01/2026', acao:'Contrato criado e assinado', user:'Maria Ribeiro', cor:'green' },
        { data:'01/01/2026', acao:'Vigência iniciada',          user:'Sistema',       cor:'blue'  },
        { data:'01/02/2026', acao:'1ª medição aprovada — NF-4501', user:'Maria Ribeiro', cor:'green' },
        { data:'01/03/2026', acao:'2ª medição aprovada — NF-4510', user:'Maria Ribeiro', cor:'green' },
      ],
    },
    {
      id:'CNT-0047', numero:'2026/0047',
      titulo:'Fornecimento MRO Contínuo — OfficePro',
      tipo:'Fornecimento',
      fornId:'F002', fornecedor:'OfficePro Express LTDA', cnpjForn:'98.765.432/0001-11',
      status:'Ativo',
      valorTotal:540000, valorMensal:45000, moeda:'BRL',
      inicio:'01/02/2026', fim:'31/01/2027',
      diasRestantes:318,
      renovacaoAutomatica:false, prazoAvisoPrevio:60,
      reajusteTipo:'IGP-M', reajustePct:0,
      objeto:'Fornecimento contínuo de materiais de manutenção, reparo e operação (MRO) conforme demanda mensal.',
      condicaoPagto:'28 ddl', diaVencimento:15,
      responsavelInterno:'Carlos Mendes',
      centroCusto:'Produção',
      poOrigem:'',
      rfqOrigem:'RFQ-2024-0880',
      datasulFornCode:'0098765',
      sla:{ disponibilidade:null, tempoResposta:'48h pedido', tempoSolucao:'5 dias entrega', multa:'1%/dia' },
      medicoes:[
        { mes:'Fev/2026', valor:43200, status:'Pago',  nota:'NF-4505', avaliacao:4 },
        { mes:'Mar/2026', valor:47800, status:'Aberto',nota:'',        avaliacao:null },
      ],
      aditivos:[],
      docs:[
        { nome:'Contrato MRO 2026.pdf', tipo:'Contrato', data:'28/01/2026', tamanho:'3.1MB' },
      ],
      historico:[
        { data:'28/01/2026', acao:'Contrato criado', user:'Carlos Mendes', cor:'green' },
        { data:'01/02/2026', acao:'Vigência iniciada',user:'Sistema',      cor:'blue'  },
        { data:'28/02/2026', acao:'1ª medição — NF-4505', user:'Carlos Mendes', cor:'green' },
      ],
    },
    {
      id:'CNT-0046', numero:'2026/0046',
      titulo:'Transporte Regional — LogiMaster',
      tipo:'Serviços',
      fornId:'F003', fornecedor:'LogiMaster Transportes LTDA', cnpjForn:'55.111.222/0001-33',
      status:'Ativo',
      valorTotal:864000, valorMensal:72000, moeda:'BRL',
      inicio:'01/03/2026', fim:'28/02/2027',
      diasRestantes:347,
      renovacaoAutomatica:true, prazoAvisoPrevio:45,
      reajusteTipo:'IPCA', reajustePct:0,
      objeto:'Prestação de serviços de transporte e logística regional para distribuição de insumos e produtos acabados.',
      condicaoPagto:'30 ddl', diaVencimento:5,
      responsavelInterno:'Maria Ribeiro',
      centroCusto:'Logística',
      poOrigem:'',
      rfqOrigem:'RFQ-2024-0875',
      datasulFornCode:'',
      sla:{ disponibilidade:null, tempoResposta:'24h confirmação', tempoSolucao:'Conforme rota', multa:'0.5%/dia' },
      medicoes:[
        { mes:'Mar/2026', valor:68400, status:'Aberto', nota:'', avaliacao:null },
      ],
      aditivos:[],
      docs:[
        { nome:'Contrato Logística 2026.pdf', tipo:'Contrato', data:'25/02/2026', tamanho:'2.8MB' },
        { nome:'Apólice seguro carga.pdf',    tipo:'Seguro',   data:'01/03/2026', tamanho:'0.9MB' },
      ],
      historico:[
        { data:'25/02/2026', acao:'Contrato criado', user:'Maria Ribeiro', cor:'green' },
        { data:'01/03/2026', acao:'Vigência iniciada',user:'Sistema',      cor:'blue'  },
      ],
    },
    {
      id:'CNT-0045', numero:'2025/0045',
      titulo:'Segurança Patrimonial — Segurity Eng.',
      tipo:'Serviços',
      fornId:'F004', fornecedor:'Segurity Engenharia LTDA', cnpjForn:'33.444.555/0001-77',
      status:'Vencendo',
      valorTotal:1440000, valorMensal:120000, moeda:'BRL',
      inicio:'01/04/2025', fim:'31/03/2026',
      diasRestantes:14,
      renovacaoAutomatica:false, prazoAvisoPrevio:30,
      reajusteTipo:'INPC', reajustePct:4.82,
      objeto:'Prestação de serviços de segurança patrimonial e monitoramento 24h nas dependências da empresa.',
      condicaoPagto:'30 ddl', diaVencimento:1,
      responsavelInterno:'Roberto Alves',
      centroCusto:'Administrativo',
      poOrigem:'',
      rfqOrigem:'RFQ-2025-0410',
      datasulFornCode:'0033444',
      sla:{ disponibilidade:99.9, tempoResposta:'Imediato', tempoSolucao:'Imediato', multa:'5%/ocorrência' },
      medicoes:[
        { mes:'Jan/2026', valor:120000, status:'Pago',  nota:'NF-4488', avaliacao:3 },
        { mes:'Fev/2026', valor:120000, status:'Pago',  nota:'NF-4498', avaliacao:4 },
        { mes:'Mar/2026', valor:120000, status:'Aberto',nota:'',        avaliacao:null },
      ],
      aditivos:[
        { id:'AD-001', tipo:'Prazo', descricao:'Prorrogação por 60 dias', dataAssign:'15/01/2026', valorAnterior:null, valorNovo:null, prazoAnterior:'31/01/2026', prazoNovo:'31/03/2026', status:'Assinado' },
      ],
      docs:[
        { nome:'Contrato Segurança 2025.pdf',  tipo:'Contrato',  data:'28/03/2025', tamanho:'4.2MB' },
        { nome:'Aditivo 001 — Prazo.pdf',      tipo:'Aditivo',   data:'15/01/2026', tamanho:'0.7MB' },
        { nome:'Relatório mensal Jan.pdf',     tipo:'Relatório', data:'31/01/2026', tamanho:'1.3MB' },
      ],
      historico:[
        { data:'28/03/2025', acao:'Contrato criado',       user:'Roberto Alves', cor:'green' },
        { data:'01/04/2025', acao:'Vigência iniciada',     user:'Sistema',       cor:'blue'  },
        { data:'15/01/2026', acao:'Aditivo AD-001 assinado — prorrogação 60 dias', user:'Roberto Alves', cor:'amber' },
        { data:'01/03/2026', acao:'⚠ Alerta: vence em 30 dias — renovação pendente', user:'Sistema', cor:'red' },
        { data:'17/03/2026', acao:'⚠ Alerta: vence em 14 dias', user:'Sistema', cor:'red' },
      ],
    },
    {
      id:'CNT-0044', numero:'2025/0044',
      titulo:'Licença ERP TOTVS Datasul',
      tipo:'Software/SaaS',
      fornId:'F010', fornecedor:'TOTVS S.A.', cnpjForn:'53.113.791/0001-22',
      status:'Ativo',
      valorTotal:180000, valorMensal:15000, moeda:'BRL',
      inicio:'01/01/2025', fim:'31/12/2027',
      diasRestantes:654,
      renovacaoAutomatica:true, prazoAvisoPrevio:90,
      reajusteTipo:'Fixo', reajustePct:0,
      objeto:'Licença de uso do sistema TOTVS Datasul ERP, módulos MCC, FIN e RH. Suporte técnico incluso.',
      condicaoPagto:'30 ddl', diaVencimento:1,
      responsavelInterno:'João Souza',
      centroCusto:'TI & Tecnologia',
      poOrigem:'',
      rfqOrigem:'',
      datasulFornCode:'',
      sla:{ disponibilidade:99.7, tempoResposta:'8h', tempoSolucao:'48h', multa:'SLA previsto em contrato' },
      medicoes:[],
      aditivos:[],
      docs:[
        { nome:'Contrato TOTVS 2025-2027.pdf', tipo:'Contrato', data:'15/12/2024', tamanho:'5.8MB' },
      ],
      historico:[
        { data:'15/12/2024', acao:'Contrato criado', user:'João Souza', cor:'green' },
        { data:'01/01/2025', acao:'Vigência iniciada',user:'Sistema',   cor:'blue'  },
      ],
    },
  ];

  // ── CSS ────────────────────────────────────────────────────────
  const CSS = `
  /* ── contracts.module.css ── */
  .ctr-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
  .ctr-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;box-shadow:var(--shadow);border-top:3px solid transparent;cursor:default}
  .ctr-stat-val{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;display:block}
  .ctr-stat-label{font-size:11px;color:var(--text-3);display:block;margin-top:1px}

  .ctr-alert-banner{border-radius:10px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:flex-start;gap:12px;font-size:13px;border:1px solid}

  /* Card list */
  .ctr-list{display:flex;flex-direction:column;gap:14px}
  .ctr-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:border-color .15s}
  .ctr-card:hover{border-color:var(--navy-mid)}
  .ctr-card.vencendo{border-left:4px solid var(--amber)}
  .ctr-card.vencido{border-left:4px solid var(--red)}
  .ctr-card.encerrado{opacity:.65}
  .ctr-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:12px}
  .ctr-card-left{display:flex;gap:14px;flex:1}
  .ctr-card-icon{width:44px;height:44px;border-radius:10px;background:var(--navy-light);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
  .ctr-card-id{font-family:monospace;font-size:11px;color:var(--text-3)}
  .ctr-card-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin:3px 0 6px}
  .ctr-card-forn{font-size:13px;color:var(--text-2)}
  .ctr-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0}
  .ctr-card-valor{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--navy)}
  .ctr-card-meta{display:flex;gap:16px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--border)}
  .ctr-meta-item{font-size:12.5px;color:var(--text-3);display:flex;align-items:center;gap:4px}
  .ctr-meta-item strong{color:var(--text-2)}
  .ctr-progress-wrap{margin-top:12px}
  .ctr-progress-label{display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3);margin-bottom:5px}
  .ctr-progress-bar{height:5px;background:var(--bg-4);border-radius:3px}
  .ctr-progress-fill{height:5px;border-radius:3px;transition:width .5s}
  .ctr-card-actions{display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--border)}

  /* Vencimento countdown */
  .ctr-countdown{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:600}
  .ctr-countdown.ok{background:var(--green-light);color:var(--green)}
  .ctr-countdown.warn{background:var(--amber-light);color:var(--amber)}
  .ctr-countdown.danger{background:var(--red-light);color:var(--red)}
  .ctr-countdown.ended{background:var(--bg-4);color:var(--text-3)}

  /* Detail panel */
  .ctr-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:300;align-items:flex-start;justify-content:flex-end}
  .ctr-detail-overlay.open{display:flex}
  .ctr-detail-panel{width:700px;max-width:96vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,.15);animation:slideIn .25s ease;display:flex;flex-direction:column}

  /* Tabs */
  .ctr-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 20px;background:var(--bg-2);position:sticky;top:0;z-index:1;overflow-x:auto}
  .ctr-tab{padding:11px 13px;font-size:13px;font-weight:500;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif;white-space:nowrap}
  .ctr-tab.active{color:var(--navy);border-bottom-color:var(--navy)}
  .ctr-tab-content{display:none;padding:20px;flex:1}
  .ctr-tab-content.active{display:block}

  /* SLA */
  .sla-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:8px}
  .sla-item{background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:12px 14px}
  .sla-label{font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}
  .sla-value{font-size:14px;font-weight:600;color:var(--text)}

  /* Medições */
  .med-table{width:100%;border-collapse:collapse}
  .med-table th{background:var(--bg-3);padding:9px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border)}
  .med-table td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13.5px;color:var(--text-2)}
  .med-table tr:last-child td{border-bottom:none}
  .star-rating{display:flex;gap:2px}
  .star{font-size:13px;color:var(--bg-4)}
  .star.on{color:#f59e0b}

  /* Aditivos */
  .aditivo-card{background:var(--amber-light);border:1px solid rgba(217,119,6,.3);border-radius:8px;padding:14px 16px;margin-bottom:10px}
  .aditivo-id{font-family:monospace;font-size:11px;color:var(--amber);margin-bottom:4px}
  .aditivo-title{font-size:13.5px;font-weight:500;color:var(--text);margin-bottom:6px}
  .aditivo-meta{display:flex;gap:12px;font-size:12px;color:var(--text-3)}

  /* Docs */
  .doc-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;margin-bottom:8px}
  .doc-icon{font-size:22px;flex-shrink:0}
  .doc-info{flex:1}
  .doc-name{font-size:13.5px;font-weight:500;color:var(--text)}
  .doc-meta{font-size:12px;color:var(--text-3);margin-top:2px}
  .doc-tipo{font-size:11px;padding:2px 8px;border-radius:20px;background:var(--navy-light);color:var(--navy);font-weight:500}

  /* Novo contrato modal steps */
  .ctr-modal-steps{display:flex;border-bottom:1px solid var(--border);margin-bottom:20px}
  .ctr-modal-step{flex:1;text-align:center;padding:10px 6px;font-size:12px;font-weight:500;color:var(--text-3);border-bottom:2px solid transparent;cursor:default}
  .ctr-modal-step.active{color:var(--navy);border-bottom-color:var(--navy)}
  .ctr-modal-step.done{color:var(--green);border-bottom-color:var(--green)}
  .ctr-step-content{display:none}
  .ctr-step-content.active{display:block}

  /* Renovação modal */
  .renov-option{display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:8px;border:2px solid var(--border);cursor:pointer;margin-bottom:10px;transition:border-color .15s}
  .renov-option:hover{border-color:var(--navy-mid)}
  .renov-option.selected{border-color:var(--navy);background:var(--navy-light)}
  .renov-radio{width:18px;height:18px;border-radius:50%;border:2px solid var(--border-light);flex-shrink:0;margin-top:2px;transition:all .15s}
  .renov-option.selected .renov-radio{background:var(--navy);border-color:var(--navy)}

  @media(max-width:1100px){.ctr-stats{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:640px){.ctr-stats{grid-template-columns:1fr 1fr}.ctr-card-meta{gap:8px}.sla-grid{grid-template-columns:1fr}}
  `;

  // ── Estado ─────────────────────────────────────────────────────
  let db            = [...MOCK_CONTRATOS];
  let currentCtr    = null;
  let currentTab    = 'resumo';
  let filteredCtrs  = [];
  let modalStep     = 1;
  let renovOpcao    = 'renovar';

  // ── Helpers ────────────────────────────────────────────────────
  const brl   = v => 'R$ ' + (v>=1000?(v/1000).toFixed(1)+'K':Number(v).toLocaleString('pt-BR'));
  const brlF  = v => 'R$ ' + Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
  const toast = msg => window.toast?.(msg);

  function getDB() { return db; }

  function diasRestantes(fim) {
    const [d,m,y] = fim.split('/').map(Number);
    const diff = new Date(y,m-1,d) - new Date();
    return Math.ceil(diff / 86400000);
  }

  function progresso(inicio, fim) {
    const [di,mi,yi] = inicio.split('/').map(Number);
    const [df,mf,yf] = fim.split('/').map(Number);
    const total = new Date(yf,mf-1,df) - new Date(yi,mi-1,di);
    const decorrido = new Date() - new Date(yi,mi-1,di);
    return Math.min(100, Math.max(0, Math.round(decorrido/total*100)));
  }

  function countdownEl(dias) {
    if (dias < 0)   return `<span class="ctr-countdown ended">⏰ Vencido há ${Math.abs(dias)}d</span>`;
    if (dias <= 30) return `<span class="ctr-countdown danger">⚠ Vence em ${dias}d</span>`;
    if (dias <= 60) return `<span class="ctr-countdown warn">⏳ Vence em ${dias}d</span>`;
    return `<span class="ctr-countdown ok">✓ ${dias} dias restantes</span>`;
  }

  function tipoIcon(tipo) {
    const map = { 'Fornecimento':'📦','Serviços':'🔧','Locação':'🏢','Manutenção':'⚙️','Consultoria':'💼','Software/SaaS':'💻','Obra':'🏗️','Outros':'📋' };
    return map[tipo] || '📋';
  }

  function stars(n) {
    if (n===null||n===undefined) return '<span style="color:var(--text-3);font-size:12px">—</span>';
    return '<div class="star-rating">' + [1,2,3,4,5].map(i=>`<span class="star${i<=n?' on':''}">★</span>`).join('') + '</div>';
  }

  // ── Stats ──────────────────────────────────────────────────────
  function renderStats() {
    const all  = getDB();
    const ativos   = all.filter(c=>c.status==='Ativo').length;
    const vencendo = all.filter(c=>c.status==='Vencendo').length;
    const vencidos = all.filter(c=>c.status==='Vencido').length;
    const totalVal = all.filter(c=>c.status==='Ativo'||c.status==='Vencendo').reduce((s,c)=>s+(c.valorMensal||0),0);
    const totalAnual = totalVal * 12;

    document.getElementById('ctr-stats').innerHTML = [
      { label:'Total de Contratos', val:all.length,    color:'#8892a8' },
      { label:'Ativos',             val:ativos,        color:'#16a34a' },
      { label:'Vencendo (≤60d)',    val:vencendo,      color:'#d97706' },
      { label:'Vencidos',           val:vencidos,      color:'#dc2626' },
      { label:'Comprometido/ano',   val:brl(totalAnual),color:'#1e3a5f' },
    ].map(s=>`
      <div class="ctr-stat" style="border-top-color:${s.color}">
        <span class="ctr-stat-val" style="color:${s.color==='#dc2626'&&parseInt(s.val)>0?s.color:'var(--text)'}">${s.val}</span>
        <span class="ctr-stat-label">${s.label}</span>
      </div>`).join('');

    document.getElementById('ctr-subtitle').textContent =
      `${all.length} contratos · ${ativos} ativos · ${vencendo} vencendo em breve`;
  }

  // ── Alertas ────────────────────────────────────────────────────
  function renderAlerts() {
    const div  = document.getElementById('ctr-alerts');
    if (!div) return;
    const venc30 = getDB().filter(c=>c.diasRestantes>0&&c.diasRestantes<=30);
    const venc60 = getDB().filter(c=>c.diasRestantes>30&&c.diasRestantes<=60);
    const vencidos = getDB().filter(c=>c.diasRestantes<=0&&c.status!=='Encerrado');
    let html = '';
    if (vencidos.length) html += `
      <div class="ctr-alert-banner" style="background:var(--red-light);border-color:rgba(220,38,38,.3);color:var(--red)">
        <div style="font-size:18px;flex-shrink:0">⏰</div>
        <div><strong>${vencidos.length} contrato${vencidos.length>1?'s':''} vencido${vencidos.length>1?'s':''}!</strong>
        Tome uma decisão imediata: renovar, aditivar ou encerrar.<br>
        <span style="font-size:12px">${vencidos.map(c=>c.titulo).join(' · ')}</span></div>
        <button class="btn btn-secondary btn-sm" style="flex-shrink:0;color:var(--red);border-color:var(--red)" onclick="document.getElementById('ctr-filter-status').value='Vencido';ContractsModule.filter()">Filtrar</button>
      </div>`;
    if (venc30.length) html += `
      <div class="ctr-alert-banner" style="background:var(--red-light);border-color:rgba(220,38,38,.2);color:#b91c1c">
        <div style="font-size:18px;flex-shrink:0">⚠</div>
        <div><strong>${venc30.length} contrato${venc30.length>1?'s':''} vence${venc30.length>1?'m':''} em até 30 dias.</strong>
        Inicie o processo de renovação com antecedência.<br>
        <span style="font-size:12px">${venc30.map(c=>c.titulo+' ('+c.diasRestantes+'d)').join(' · ')}</span></div>
      </div>`;
    if (venc60.length) html += `
      <div class="ctr-alert-banner" style="background:var(--amber-light);border-color:rgba(217,119,6,.25);color:var(--amber)">
        <div style="font-size:18px;flex-shrink:0">⏳</div>
        <div><strong>${venc60.length} contrato${venc60.length>1?'s':''} vence${venc60.length>1?'m':''} em 31–60 dias.</strong>
        <span style="font-size:12px;display:block;margin-top:2px">${venc60.map(c=>c.titulo+' ('+c.diasRestantes+'d)').join(' · ')}</span></div>
      </div>`;
    div.innerHTML = html;
  }

  // ── Filter ─────────────────────────────────────────────────────
  function applyFilter() {
    const search = (document.getElementById('ctr-search')||{}).value?.toLowerCase()||'';
    const status = (document.getElementById('ctr-filter-status')||{}).value||'';
    const tipo   = (document.getElementById('ctr-filter-tipo')||{}).value||'';
    const sort   = (document.getElementById('ctr-filter-sort')||{}).value||'vencimento';

    filteredCtrs = getDB().filter(c=>{
      const ms = !search || (c.titulo+c.fornecedor+c.id+c.numero).toLowerCase().includes(search);
      const mst= !status || c.status===status;
      const mt = !tipo   || c.tipo===tipo;
      return ms && mst && mt;
    });

    if (sort==='vencimento') filteredCtrs.sort((a,b)=>a.diasRestantes-b.diasRestantes);
    if (sort==='valor_desc') filteredCtrs.sort((a,b)=>(b.valorMensal||0)-(a.valorMensal||0));
    if (sort==='recente')    filteredCtrs.sort((a,b)=>b.id.localeCompare(a.id));

    renderList();
  }

  // ── Lista de contratos ─────────────────────────────────────────
  function renderList() {
    const list = document.getElementById('ctr-list');
    if (!list) return;
    if (!filteredCtrs.length) {
      list.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-3)">Nenhum contrato encontrado.</div>';
      return;
    }
    list.innerHTML = filteredCtrs.map(c => {
      const st  = STATUS_META[c.status]||STATUS_META.Ativo;
      const pct = progresso(c.inicio, c.fim);
      const barColor = c.diasRestantes<=30?'var(--red)':c.diasRestantes<=60?'var(--amber)':'var(--navy-mid)';
      const valorAnual = (c.valorMensal||0)*12;

      return `
      <div class="ctr-card ${c.status==='Vencendo'?'vencendo':c.status==='Vencido'?'vencido':c.status==='Encerrado'?'encerrado':''}"
           onclick="ContractsModule.openDetail('${c.id}')">
        <div class="ctr-card-header">
          <div class="ctr-card-left">
            <div class="ctr-card-icon">${tipoIcon(c.tipo)}</div>
            <div>
              <div class="ctr-card-id">${c.id} · ${c.numero} · ${c.tipo}</div>
              <div class="ctr-card-title">${c.titulo}</div>
              <div class="ctr-card-forn">${c.fornecedor}</div>
            </div>
          </div>
          <div class="ctr-card-right">
            <span class="status-badge ${st.cls}">${st.icon} ${c.status}</span>
            <div class="ctr-card-valor">${brl(c.valorMensal)}<span style="font-size:11px;font-weight:400;color:var(--text-3)">/mês</span></div>
            ${countdownEl(c.diasRestantes)}
          </div>
        </div>
        <div class="ctr-progress-wrap">
          <div class="ctr-progress-label">
            <span>Vigência: ${c.inicio} → ${c.fim}</span>
            <span>${pct}% decorrido</span>
          </div>
          <div class="ctr-progress-bar"><div class="ctr-progress-fill" style="width:${pct}%;background:${barColor}"></div></div>
        </div>
        <div class="ctr-card-meta">
          <span class="ctr-meta-item">💰 Anual: <strong>${brl(valorAnual)}</strong></span>
          <span class="ctr-meta-item">👤 <strong>${c.responsavelInterno}</strong></span>
          <span class="ctr-meta-item">🏢 <strong>${c.centroCusto}</strong></span>
          <span class="ctr-meta-item">🔄 Reajuste: <strong>${c.reajusteTipo}${c.reajustePct?` ${c.reajustePct}%`:''}</strong></span>
          ${c.renovacaoAutomatica?'<span class="chip chip-green" style="font-size:10.5px">Renov. automática</span>':''}
          ${c.aditivos.length?`<span class="chip chip-amber" style="font-size:10.5px">${c.aditivos.length} aditivo${c.aditivos.length>1?'s':''}</span>`:''}
        </div>
        <div class="ctr-card-actions" onclick="event.stopPropagation()">
          ${c.status==='Vencendo'||c.status==='Vencido'?`<button class="btn btn-primary btn-sm" onclick="ContractsModule.openRenovacaoModal('${c.id}')">🔄 Renovar / Aditivar</button>`:''}
          <button class="btn btn-secondary btn-sm" onclick="ContractsModule.openDetail('${c.id}')">Ver Detalhes →</button>
          ${c.status==='Ativo'?`<button class="btn btn-secondary btn-sm" onclick="ContractsModule.openAditivoModal('${c.id}')">+ Aditivo</button>`:''}
          ${c.status==='Ativo'?`<button class="btn btn-secondary btn-sm" onclick="ContractsModule.encerrar('${c.id}')">Encerrar</button>`:''}
        </div>
      </div>`;
    }).join('');
  }

  // ── Detail Panel ───────────────────────────────────────────────
  function openDetailPanel(id) {
    const c = getDB().find(x=>x.id===id); if(!c) return;
    currentCtr = c;
    const st = STATUS_META[c.status]||STATUS_META.Ativo;

    document.getElementById('ctr-detail-id').textContent         = c.id + ' · ' + c.numero;
    document.getElementById('ctr-detail-title').textContent      = c.titulo;
    document.getElementById('ctr-detail-badge').textContent      = c.status;
    document.getElementById('ctr-detail-badge').className        = 'status-badge ' + st.cls;
    document.getElementById('ctr-detail-forn').textContent       = c.fornecedor + ' · ' + c.cnpjForn;

    const footer = [];
    if (c.status==='Vencendo'||c.status==='Vencido')
      footer.push(`<button class="btn btn-primary" onclick="ContractsModule.openRenovacaoModal('${c.id}')">🔄 Renovar / Aditivar</button>`);
    if (c.status==='Ativo')
      footer.push(`<button class="btn btn-secondary" onclick="ContractsModule.openAditivoModal('${c.id}')">+ Aditivo</button>`);
    if (c.status==='Ativo')
      footer.push(`<button class="btn btn-secondary" onclick="ContractsModule.encerrar('${c.id}')">Encerrar Contrato</button>`);
    footer.push(`<button class="btn btn-secondary" onclick="ContractsModule.closeDetail()">Fechar</button>`);
    document.getElementById('ctr-detail-footer').innerHTML = footer.join('');

    switchTab('resumo');
    document.getElementById('ctrDetailOverlay').classList.add('open');
  }

  // ── Tabs ───────────────────────────────────────────────────────
  function switchTab(tab) {
    currentTab = tab;
    const tabs = ['resumo','objeto','medicoes','aditivos','sla','docs','historico'];
    document.querySelectorAll('.ctr-tab').forEach((t,i)=>{
      t.classList.toggle('active', tabs[i]===tab);
    });
    document.querySelectorAll('.ctr-tab-content').forEach(c=>c.classList.remove('active'));
    document.getElementById('ctr-tab-'+tab)?.classList.add('active');
    if (!currentCtr) return;
    const c = currentCtr;
    if (tab==='resumo')    renderTabResumo(c);
    if (tab==='objeto')    renderTabObjeto(c);
    if (tab==='medicoes')  renderTabMedicoes(c);
    if (tab==='aditivos')  renderTabAditivos(c);
    if (tab==='sla')       renderTabSLA(c);
    if (tab==='docs')      renderTabDocs(c);
    if (tab==='historico') renderTabHistorico(c);
  }

  // ── Tab: Resumo ────────────────────────────────────────────────
  function renderTabResumo(c) {
    const pct = progresso(c.inicio, c.fim);
    const barColor = c.diasRestantes<=30?'var(--red)':c.diasRestantes<=60?'var(--amber)':'var(--navy-mid)';
    document.getElementById('ctr-tab-resumo').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Dados Gerais</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Tipo</span><span class="req-field-value">${tipoIcon(c.tipo)} ${c.tipo}</span></div>
          <div class="req-field"><span class="req-field-label">Responsável</span><span class="req-field-value">${c.responsavelInterno}</span></div>
          <div class="req-field"><span class="req-field-label">Centro de Custo</span><span class="req-field-value">${c.centroCusto}</span></div>
          <div class="req-field"><span class="req-field-label">Reajuste</span><span class="req-field-value">${c.reajusteTipo}${c.reajustePct?' — '+c.reajustePct+'%':''}</span></div>
          <div class="req-field"><span class="req-field-label">Renovação automática</span><span class="req-field-value">${c.renovacaoAutomatica?'✓ Sim — aviso '+c.prazoAvisoPrevio+'d antes':'✕ Não'}</span></div>
          <div class="req-field"><span class="req-field-label">Cond. Pagamento</span><span class="req-field-value">${c.condicaoPagto} · dia ${c.diaVencimento}</span></div>
          <div class="req-field"><span class="req-field-label">Valor Mensal</span><span class="req-field-value" style="color:var(--navy);font-size:15px">${brlF(c.valorMensal)}</span></div>
          <div class="req-field"><span class="req-field-label">Valor Total</span><span class="req-field-value" style="color:var(--navy);font-size:15px">${brlF(c.valorTotal)}</span></div>
          ${c.poOrigem?`<div class="req-field"><span class="req-field-label">PO de origem</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${c.poOrigem}</span></div>`:''}
          ${c.rfqOrigem?`<div class="req-field"><span class="req-field-label">RFQ de origem</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${c.rfqOrigem}</span></div>`:''}
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Vigência</div>
        <div style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:13.5px">${c.inicio} → ${c.fim}</span>
          ${countdownEl(c.diasRestantes)}
        </div>
        <div class="ctr-progress-bar" style="height:8px">
          <div class="ctr-progress-fill" style="width:${pct}%;height:8px;background:${barColor}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3);margin-top:5px">
          <span>Início</span><span>${pct}% decorrido</span><span>Fim</span>
        </div>
      </div>
      <div style="background:var(--navy-light);border-radius:8px;padding:11px 13px;font-size:12.5px;color:var(--navy)">
        🔗 <strong>Datasul:</strong> contratos são gerenciados internamente pelo BidFlow.
        O fornecedor está vinculado ao código
        <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px">${c.datasulFornCode||'pendente'}</code>
        no módulo <code style="background:rgba(30,58,95,.12);padding:1px 5px;border-radius:3px">holderPublic</code>.
      </div>`;
  }

  // ── Tab: Objeto ────────────────────────────────────────────────
  function renderTabObjeto(c) {
    document.getElementById('ctr-tab-objeto').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Objeto Contratual</div>
        <p style="font-size:13.5px;color:var(--text-2);line-height:1.7">${c.objeto}</p>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Penalidades e Multas</div>
        <div style="background:var(--red-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--red)">
          ⚠ Multa contratual: <strong>${c.sla?.multa||'Ver contrato'}</strong>
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Partes Envolvidas</div>
        <div class="req-field-grid">
          <div class="req-field"><span class="req-field-label">Contratante</span><span class="req-field-value">Razzo Indústria LTDA</span></div>
          <div class="req-field"><span class="req-field-label">Contratada</span><span class="req-field-value">${c.fornecedor}</span></div>
          <div class="req-field"><span class="req-field-label">CNPJ Contratada</span><span class="req-field-value" style="font-family:monospace;font-size:12px">${c.cnpjForn}</span></div>
          <div class="req-field"><span class="req-field-label">Gestor Razzo</span><span class="req-field-value">${c.responsavelInterno}</span></div>
        </div>
      </div>`;
  }

  // ── Tab: Medições ──────────────────────────────────────────────
  function renderTabMedicoes(c) {
    const med = c.medicoes || [];
    document.getElementById('ctr-tab-medicoes').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Medições Mensais</div>
        ${!med.length?'<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhuma medição registrada.</div>':`
        <table class="med-table">
          <thead><tr><th>Mês</th><th>Valor</th><th>Status</th><th>NF</th><th>Avaliação</th><th></th></tr></thead>
          <tbody>
            ${med.map((m,i)=>`<tr>
              <td style="font-weight:500">${m.mes}</td>
              <td style="font-weight:600;color:var(--navy)">${brlF(m.valor)}</td>
              <td><span class="status-badge ${m.status==='Pago'?'status-green':'status-amber'}">${m.status}</span></td>
              <td style="font-family:monospace;font-size:12px">${m.nota||'—'}</td>
              <td>${stars(m.avaliacao)}</td>
              <td>
                ${m.status==='Aberto'?`
                <button class="btn btn-primary btn-sm" onclick="ContractsModule.aprovarMedicao('${c.id}',${i})">Aprovar</button>
                <select class="filter-select" id="med-stars-${i}" style="padding:3px 6px;font-size:11px;height:26px">
                  <option value="5">★★★★★ Ótimo</option><option value="4">★★★★ Bom</option>
                  <option value="3">★★★ Regular</option><option value="2">★★ Ruim</option><option value="1">★ Péssimo</option>
                </select>`:''}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>`}
        <div style="margin-top:14px;text-align:right">
          <button class="btn btn-secondary btn-sm" onclick="ContractsModule.adicionarMedicao('${c.id}')">+ Nova Medição</button>
        </div>
      </div>`;
  }

  // ── Tab: Aditivos ──────────────────────────────────────────────
  function renderTabAditivos(c) {
    document.getElementById('ctr-tab-aditivos').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Aditivos Contratuais</div>
        ${!c.aditivos.length?`<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhum aditivo registrado.</div>`:`
        ${c.aditivos.map(a=>`
          <div class="aditivo-card">
            <div class="aditivo-id">${a.id}</div>
            <div class="aditivo-title">${a.tipo} — ${a.descricao}</div>
            <div class="aditivo-meta">
              <span>Assinado em: ${a.dataAssign}</span>
              ${a.valorAnterior?`<span>Valor: ${brlF(a.valorAnterior)} → ${brlF(a.valorNovo)}</span>`:''}
              ${a.prazoAnterior?`<span>Prazo: ${a.prazoAnterior} → ${a.prazoNovo}</span>`:''}
              <span class="status-badge status-green" style="font-size:11px">${a.status}</span>
            </div>
          </div>`).join('')}`}
        <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="ContractsModule.openAditivoModal('${c.id}')">+ Novo Aditivo</button>
      </div>`;
  }

  // ── Tab: SLA ───────────────────────────────────────────────────
  function renderTabSLA(c) {
    const sla = c.sla || {};
    const medicoesComAval = c.medicoes.filter(m=>m.avaliacao!==null);
    const mediaAval = medicoesComAval.length
      ? (medicoesComAval.reduce((s,m)=>s+m.avaliacao,0)/medicoesComAval.length).toFixed(1)
      : null;
    document.getElementById('ctr-tab-sla').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Indicadores de Desempenho (SLA)</div>
        <div class="sla-grid">
          ${sla.disponibilidade?`<div class="sla-item"><div class="sla-label">Disponibilidade contratada</div><div class="sla-value">${sla.disponibilidade}%</div></div>`:''}
          ${sla.tempoResposta?`<div class="sla-item"><div class="sla-label">Tempo de resposta</div><div class="sla-value">${sla.tempoResposta}</div></div>`:''}
          ${sla.tempoSolucao?`<div class="sla-item"><div class="sla-label">Tempo de solução</div><div class="sla-value">${sla.tempoSolucao}</div></div>`:''}
          ${sla.multa?`<div class="sla-item" style="border-color:rgba(220,38,38,.2)"><div class="sla-label">Multa por descumprimento</div><div class="sla-value" style="color:var(--red)">${sla.multa}</div></div>`:''}
        </div>
      </div>
      <div class="req-detail-section">
        <div class="req-detail-section-title">Avaliação Acumulada do Fornecedor</div>
        <div style="display:flex;align-items:center;gap:16px">
          <div style="font-family:'Syne',sans-serif;font-size:36px;font-weight:700;color:var(--navy)">${mediaAval||'—'}</div>
          <div>
            ${mediaAval?stars(Math.round(parseFloat(mediaAval))):'<span style="color:var(--text-3);font-size:13px">Nenhuma avaliação ainda</span>'}
            <div style="font-size:12px;color:var(--text-3);margin-top:4px">${medicoesComAval.length} avaliação${medicoesComAval.length!==1?'ões':''}</div>
          </div>
        </div>
      </div>`;
  }

  // ── Tab: Documentos ────────────────────────────────────────────
  function renderTabDocs(c) {
    const docIcons = { Contrato:'📄', Aditivo:'📝', Proposta:'📊', Seguro:'🛡️', Relatório:'📈' };
    document.getElementById('ctr-tab-docs').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Documentos Vinculados</div>
        ${c.docs.map(d=>`
          <div class="doc-item">
            <div class="doc-icon">${docIcons[d.tipo]||'📄'}</div>
            <div class="doc-info">
              <div class="doc-name">${d.nome}</div>
              <div class="doc-meta">${d.data} · ${d.tamanho}</div>
            </div>
            <span class="doc-tipo">${d.tipo}</span>
            <button class="btn btn-secondary btn-sm" onclick="toast('Download disponível após integração com armazenamento')">⬇ Baixar</button>
          </div>`).join('')}
        <div style="margin-top:12px">
          <div class="inv-upload-zone" style="padding:18px" onclick="toast('Upload disponível após integração com armazenamento')">
            <div style="font-size:20px;margin-bottom:6px">📎</div>
            <div style="font-size:13px;font-weight:500;color:var(--text-2)">Clique para anexar documento</div>
            <div style="font-size:12px;color:var(--text-3);margin-top:3px">PDF, DOCX, XLSX · max 20MB</div>
          </div>
        </div>
      </div>`;
  }

  // ── Tab: Histórico ─────────────────────────────────────────────
  function renderTabHistorico(c) {
    document.getElementById('ctr-tab-historico').innerHTML = `
      <div class="req-detail-section">
        <div class="req-detail-section-title">Linha do Tempo</div>
        <div class="req-timeline">
          ${c.historico.map(h=>`
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

  // ── HTML da página ─────────────────────────────────────────────
  function renderPageHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Contratos</h1>
        <p class="page-subtitle" id="ctr-subtitle">Gestão e acompanhamento de contratos</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="ContractsModule.exportCSV()">Exportar</button>
        <button class="btn btn-primary"   onclick="ContractsModule.openNewModal()">+ Novo Contrato</button>
      </div>
    </div>

    <!-- Alertas automáticos -->
    <div id="ctr-alerts"></div>

    <!-- Stats -->
    <div class="ctr-stats" id="ctr-stats"></div>

    <!-- Filtros -->
    <div class="filter-bar" style="margin-bottom:16px">
      <div class="filter-search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="ctr-search" placeholder="Buscar por título, fornecedor, número..." oninput="ContractsModule.filter()">
      </div>
      <select class="filter-select" id="ctr-filter-status" onchange="ContractsModule.filter()">
        <option value="">Todos os status</option>
        ${Object.keys(STATUS_META).map(s=>`<option value="${s}">${s}</option>`).join('')}
      </select>
      <select class="filter-select" id="ctr-filter-tipo" onchange="ContractsModule.filter()">
        <option value="">Todos os tipos</option>
        ${TIPOS.map(t=>`<option value="${t}">${t}</option>`).join('')}
      </select>
      <select class="filter-select" id="ctr-filter-sort" onchange="ContractsModule.filter()">
        <option value="vencimento">Vencimento próximo</option>
        <option value="valor_desc">Maior valor</option>
        <option value="recente">Mais recentes</option>
      </select>
    </div>

    <!-- Lista -->
    <div class="ctr-list" id="ctr-list"></div>

    <!-- Detail panel -->
    <div class="ctr-detail-overlay" id="ctrDetailOverlay" onclick="ContractsModule.closeDetail(event)">
      <div class="ctr-detail-panel">
        <div class="req-detail-header">
          <div>
            <div style="font-family:monospace;font-size:12px;color:var(--text-3)" id="ctr-detail-id"></div>
            <h2 style="font-family:'Syne',sans-serif;font-size:17px;font-weight:700;margin-top:4px" id="ctr-detail-title"></h2>
            <div style="font-size:13px;color:var(--text-3);margin-top:3px" id="ctr-detail-forn"></div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
            <span class="status-badge" id="ctr-detail-badge"></span>
            <button onclick="ContractsModule.closeDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
          </div>
        </div>
        <div class="ctr-tabs">
          <button class="ctr-tab active"  onclick="ContractsModule.switchTab('resumo')">Resumo</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('objeto')">Objeto</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('medicoes')">Medições</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('aditivos')">Aditivos</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('sla')">SLA / Avaliação</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('docs')">Documentos</button>
          <button class="ctr-tab"         onclick="ContractsModule.switchTab('historico')">Histórico</button>
        </div>
        <div id="ctr-tab-resumo"    class="ctr-tab-content active"></div>
        <div id="ctr-tab-objeto"    class="ctr-tab-content"></div>
        <div id="ctr-tab-medicoes"  class="ctr-tab-content"></div>
        <div id="ctr-tab-aditivos"  class="ctr-tab-content"></div>
        <div id="ctr-tab-sla"       class="ctr-tab-content"></div>
        <div id="ctr-tab-docs"      class="ctr-tab-content"></div>
        <div id="ctr-tab-historico" class="ctr-tab-content"></div>
        <div class="req-detail-footer" id="ctr-detail-footer"></div>
      </div>
    </div>

    <!-- Modal: Novo Contrato (4 etapas) -->
    <div class="modal-overlay" id="ctrNewModal" onclick="if(event.target===this)ContractsModule.closeNewModal()">
      <div class="modal" style="width:640px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Novo Contrato</h2>
          <button class="modal-close" onclick="ContractsModule.closeNewModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="ctr-modal-steps">
            <div class="ctr-modal-step active" id="ctr-step-lbl-1">1. Identificação</div>
            <div class="ctr-modal-step"         id="ctr-step-lbl-2">2. Vigência e Valor</div>
            <div class="ctr-modal-step"         id="ctr-step-lbl-3">3. SLA</div>
            <div class="ctr-modal-step"         id="ctr-step-lbl-4">4. Revisão</div>
          </div>
          <!-- Step 1 -->
          <div class="ctr-step-content active" id="ctr-step-1">
            <div class="form-row">
              <div class="form-group"><label>Título do Contrato *</label>
                <input type="text" class="form-input" id="ctr-f-titulo" placeholder="Ex: Suporte TI Mensal — TechSupply">
              </div>
              <div class="form-group"><label>Tipo *</label>
                <select class="form-input" id="ctr-f-tipo">
                  <option value="">Selecione...</option>
                  ${TIPOS.map(t=>`<option>${t}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Fornecedor *</label>
                <select class="form-input" id="ctr-f-forn">
                  <option value="">Selecione...</option>
                </select>
              </div>
              <div class="form-group"><label>Centro de Custo</label>
                <select class="form-input" id="ctr-f-cc">
                  <option value="">Selecione...</option>
                  <option>TI & Tecnologia</option><option>Administrativo</option>
                  <option>Produção</option><option>Logística</option><option>RH</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label>Objeto Contratual *</label>
              <textarea class="form-input" id="ctr-f-objeto" rows="3" placeholder="Descreva detalhadamente o objeto do contrato..."></textarea>
            </div>
          </div>
          <!-- Step 2 -->
          <div class="ctr-step-content" id="ctr-step-2">
            <div class="form-row">
              <div class="form-group"><label>Data de Início *</label>
                <input type="date" class="form-input" id="ctr-f-inicio">
              </div>
              <div class="form-group"><label>Data de Fim *</label>
                <input type="date" class="form-input" id="ctr-f-fim" oninput="ContractsModule.calcDias()">
              </div>
            </div>
            <div style="background:var(--bg-3);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text-2);margin-bottom:14px" id="ctr-vigencia-preview">Preencha as datas para calcular a vigência.</div>
            <div class="form-row">
              <div class="form-group"><label>Valor Mensal (R$) *</label>
                <input type="number" class="form-input" id="ctr-f-mensal" placeholder="0,00" oninput="ContractsModule.calcTotal()">
              </div>
              <div class="form-group"><label>Valor Total estimado</label>
                <input type="text" class="form-input" id="ctr-f-total" readonly placeholder="Calculado automaticamente">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Cond. Pagamento</label>
                <select class="form-input" id="ctr-f-pagto">
                  <option>30 ddl</option><option>28 ddl</option><option>À vista</option>
                </select>
              </div>
              <div class="form-group"><label>Dia Vencimento</label>
                <input type="number" class="form-input" id="ctr-f-diavenc" placeholder="Ex: 10" min="1" max="31">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Reajuste</label>
                <select class="form-input" id="ctr-f-reajuste">
                  ${REAJUSTE_TIPOS.map(r=>`<option>${r}</option>`).join('')}
                </select>
              </div>
              <div class="form-group"><label>Renovação Automática</label>
                <select class="form-input" id="ctr-f-renov">
                  <option value="true">Sim</option><option value="false">Não</option>
                </select>
              </div>
            </div>
          </div>
          <!-- Step 3: SLA -->
          <div class="ctr-step-content" id="ctr-step-3">
            <div style="font-size:13px;color:var(--text-2);margin-bottom:14px">Defina os indicadores de nível de serviço (SLA) que serão monitorados mensalmente.</div>
            <div class="form-row">
              <div class="form-group"><label>Disponibilidade Mínima (%)</label>
                <input type="number" class="form-input" id="ctr-f-sla-disp" placeholder="Ex: 99.5" step="0.1">
              </div>
              <div class="form-group"><label>Tempo de Resposta</label>
                <input type="text" class="form-input" id="ctr-f-sla-resp" placeholder="Ex: 4h, 24h, Imediato">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Tempo de Solução</label>
                <input type="text" class="form-input" id="ctr-f-sla-soluc" placeholder="Ex: 24h, 5 dias úteis">
              </div>
              <div class="form-group"><label>Multa por Descumprimento</label>
                <input type="text" class="form-input" id="ctr-f-sla-multa" placeholder="Ex: 2%/dia, 1 mensalidade">
              </div>
            </div>
          </div>
          <!-- Step 4: Revisão -->
          <div class="ctr-step-content" id="ctr-step-4">
            <div id="ctr-review-content"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="ctr-btn-back" onclick="ContractsModule.stepPrev()" style="display:none">← Voltar</button>
          <button class="btn btn-secondary" onclick="ContractsModule.closeNewModal()">Cancelar</button>
          <button class="btn btn-primary" id="ctr-btn-next" onclick="ContractsModule.stepNext()">Próximo →</button>
        </div>
      </div>
    </div>

    <!-- Modal: Renovação / Aditivo -->
    <div class="modal-overlay" id="ctrRenovModal" onclick="if(event.target===this)document.getElementById('ctrRenovModal').classList.remove('open')">
      <div class="modal" style="width:520px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 id="renov-modal-title">Renovar / Aditivar Contrato</h2>
          <button class="modal-close" onclick="document.getElementById('ctrRenovModal').classList.remove('open')">✕</button>
        </div>
        <div class="modal-body" id="renov-modal-body"></div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('ctrRenovModal').classList.remove('open')">Cancelar</button>
          <button class="btn btn-primary" onclick="ContractsModule.confirmarRenovacao()">Confirmar</button>
        </div>
      </div>
    </div>

    <!-- Modal: Aditivo -->
    <div class="modal-overlay" id="ctrAditivoModal" onclick="if(event.target===this)document.getElementById('ctrAditivoModal').classList.remove('open')">
      <div class="modal" style="width:500px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Novo Aditivo Contratual</h2>
          <button class="modal-close" onclick="document.getElementById('ctrAditivoModal').classList.remove('open')">✕</button>
        </div>
        <div class="modal-body">
          <div id="aditivo-ctr-info" style="background:var(--bg-3);border-radius:8px;padding:10px 14px;font-size:13px;color:var(--text-2);margin-bottom:16px"></div>
          <div class="form-row">
            <div class="form-group"><label>Tipo de Aditivo *</label>
              <select class="form-input" id="aditivo-tipo">
                <option>Prazo</option><option>Valor</option><option>Prazo e Valor</option><option>Objeto</option>
              </select>
            </div>
            <div class="form-group"><label>Data de Assinatura *</label>
              <input type="date" class="form-input" id="aditivo-data">
            </div>
          </div>
          <div class="form-group"><label>Descrição *</label>
            <input type="text" class="form-input" id="aditivo-desc" placeholder="Ex: Prorrogação por 90 dias por necessidade operacional">
          </div>
          <div class="form-row" id="aditivo-valor-row">
            <div class="form-group"><label>Novo Valor Mensal (R$)</label>
              <input type="number" class="form-input" id="aditivo-valor" placeholder="Deixe em branco se não altera">
            </div>
            <div class="form-group"><label>Novo Prazo Final</label>
              <input type="date" class="form-input" id="aditivo-prazo">
            </div>
          </div>
          <div class="form-group"><label>Justificativa</label>
            <textarea class="form-input" id="aditivo-just" rows="2" placeholder="Motivo do aditivo..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('ctrAditivoModal').classList.remove('open')">Cancelar</button>
          <button class="btn btn-primary" onclick="ContractsModule.confirmarAditivo()">Registrar Aditivo</button>
        </div>
      </div>
    </div>
    `;
  }

  // ── Public API ─────────────────────────────────────────────────
  return {

    init(containerEl) {
      if (!document.getElementById('ctr-css')) {
        const s = document.createElement('style'); s.id='ctr-css';
        s.textContent = CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = renderPageHTML();
      // Populate fornecedor select
      const sel = document.getElementById('ctr-f-forn');
      if (sel && BF.db.fornecedores) {
        sel.innerHTML = '<option value="">Selecione...</option>' +
          BF.db.fornecedores.map(f=>`<option value="${f.id}">${f.razaoSocial||f.nomeFantasia}</option>`).join('');
      }
      // Sync dias restantes
      db.forEach(c => { if (!c.diasRestantes) c.diasRestantes = diasRestantes(c.fim); });
      // Update status based on diasRestantes
      db.forEach(c => {
        if (c.status!=='Encerrado'&&c.status!=='Suspenso') {
          if (c.diasRestantes<=0)  c.status='Vencido';
          else if (c.diasRestantes<=60) c.status='Vencendo';
          else c.status='Ativo';
        }
      });
      renderStats();
      renderAlerts();
      this.filter();
    },

    filter: applyFilter,

    openDetail: openDetailPanel,

    closeDetail(e) {
      if (!e || e.target===document.getElementById('ctrDetailOverlay'))
        document.getElementById('ctrDetailOverlay')?.classList.remove('open');
    },

    switchTab,

    // ── Ações ────────────────────────────────────────────────────
    aprovarMedicao(ctrId, idx) {
      const c = db.find(x=>x.id===ctrId); if(!c) return;
      const av = parseInt(document.getElementById('med-stars-'+idx)?.value)||5;
      c.medicoes[idx].status    = 'Pago';
      c.medicoes[idx].avaliacao = av;
      c.medicoes[idx].nota      = 'NF-' + (4530+Math.floor(Math.random()*10));
      c.historico.push({ data:'Agora', acao:`Medição ${c.medicoes[idx].mes} aprovada · Avaliação: ${av}/5`, user:'Maria Ribeiro', cor:'green' });
      toast(`✓ Medição ${c.medicoes[idx].mes} aprovada!`);
      renderStats(); applyFilter();
      switchTab('medicoes');
    },

    adicionarMedicao(ctrId) {
      const c = db.find(x=>x.id===ctrId); if(!c) return;
      const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      const mes = meses[new Date().getMonth()] + '/' + new Date().getFullYear();
      c.medicoes.push({ mes, valor:c.valorMensal, status:'Aberto', nota:'', avaliacao:null });
      toast('Nova medição de '+mes+' criada.');
      switchTab('medicoes');
    },

    encerrar(id) {
      const c = db.find(x=>x.id===id); if(!c) return;
      if (!confirm('Confirmar encerramento do contrato '+c.titulo+'?')) return;
      c.status = 'Encerrado';
      c.historico.push({ data:'Agora', acao:'Contrato encerrado', user:'Maria Ribeiro', cor:'red' });
      toast('Contrato '+id+' encerrado.');
      document.getElementById('ctrDetailOverlay')?.classList.remove('open');
      renderStats(); renderAlerts(); applyFilter();
    },

    // ── Renovação ────────────────────────────────────────────────
    openRenovacaoModal(id) {
      const c = db.find(x=>x.id===id); if(!c) return;
      currentCtr = c;
      document.getElementById('renov-modal-title').textContent = 'Renovar — ' + c.titulo;
      document.getElementById('renov-modal-body').innerHTML = `
        <div style="margin-bottom:16px;font-size:13px;color:var(--text-2)">Contrato ${c.id} · Vence em ${c.fim} · ${c.diasRestantes} dias</div>
        <div class="renov-option selected" id="renov-opt-renovar" onclick="ContractsModule.selectRenovOpcao('renovar')">
          <div class="renov-radio"></div>
          <div><div style="font-weight:500;font-size:13.5px">Renovar por 12 meses</div>
          <div style="font-size:12.5px;color:var(--text-3);margin-top:3px">Mesmo valor, mesmo escopo. Novo prazo: ${c.fim.replace(/\d{4}$/,String(parseInt(c.fim.slice(-4))+1))}.</div></div>
        </div>
        <div class="renov-option" id="renov-opt-aditivo" onclick="ContractsModule.selectRenovOpcao('aditivo')">
          <div class="renov-radio"></div>
          <div><div style="font-weight:500;font-size:13.5px">Aditivar prazo (diferente de 12 meses)</div>
          <div style="font-size:12.5px;color:var(--text-3);margin-top:3px">Escolha quantos meses prorrogar.</div>
          <div style="margin-top:8px" id="aditivo-meses-wrap" style="display:none">
            <input type="number" class="form-input" id="renov-meses" placeholder="Nº de meses" min="1" max="60" style="width:120px;display:inline-block">
          </div></div>
        </div>
        <div class="renov-option" id="renov-opt-encerrar" onclick="ContractsModule.selectRenovOpcao('encerrar')">
          <div class="renov-radio"></div>
          <div><div style="font-weight:500;font-size:13.5px;color:var(--red)">Encerrar contrato</div>
          <div style="font-size:12.5px;color:var(--text-3);margin-top:3px">O contrato será marcado como encerrado sem renovação.</div></div>
        </div>`;
      document.getElementById('ctrRenovModal').classList.add('open');
    },

    selectRenovOpcao(opcao) {
      renovOpcao = opcao;
      ['renovar','aditivo','encerrar'].forEach(o=>{
        document.getElementById('renov-opt-'+o)?.classList.toggle('selected',o===opcao);
      });
      const wrap = document.getElementById('aditivo-meses-wrap');
      if (wrap) wrap.style.display = opcao==='aditivo' ? 'block' : 'none';
    },

    confirmarRenovacao() {
      const c = currentCtr; if(!c) return;
      if (renovOpcao==='encerrar') { this.encerrar(c.id); document.getElementById('ctrRenovModal').classList.remove('open'); return; }
      const meses = renovOpcao==='renovar' ? 12 : parseInt(document.getElementById('renov-meses')?.value)||12;
      const [d,m,y] = c.fim.split('/').map(Number);
      const novaData = new Date(y,m-1+meses,d);
      const novoFim = [String(novaData.getDate()).padStart(2,'0'),String(novaData.getMonth()+1).padStart(2,'0'),novaData.getFullYear()].join('/');
      c.fim = novoFim;
      c.diasRestantes = diasRestantes(novoFim);
      c.status = 'Ativo';
      c.valorTotal += c.valorMensal * meses;
      c.historico.push({ data:'Agora', acao:`Contrato renovado por ${meses} meses. Novo fim: ${novoFim}`, user:'Maria Ribeiro', cor:'green' });
      if (renovOpcao==='aditivo') {
        c.aditivos.push({ id:'AD-00'+(c.aditivos.length+2), tipo:'Prazo', descricao:`Prorrogação por ${meses} meses`, dataAssign:new Date().toLocaleDateString('pt-BR'), valorAnterior:null, valorNovo:null, prazoAnterior:'—', prazoNovo:novoFim, status:'Assinado' });
      }
      document.getElementById('ctrRenovModal').classList.remove('open');
      toast(`✓ Contrato ${c.id} renovado até ${novoFim}!`);
      renderStats(); renderAlerts(); applyFilter();
    },

    // ── Aditivo ──────────────────────────────────────────────────
    _aditivoCtrId: null,
    openAditivoModal(id) {
      const c = db.find(x=>x.id===id); if(!c) return;
      this._aditivoCtrId = id;
      document.getElementById('aditivo-ctr-info').textContent = c.titulo + ' · Vige até: ' + c.fim;
      document.getElementById('aditivo-data').value = new Date().toISOString().split('T')[0];
      document.getElementById('aditivo-prazo').value = '';
      document.getElementById('aditivo-valor').value = '';
      document.getElementById('aditivo-desc').value = '';
      document.getElementById('aditivo-just').value = '';
      document.getElementById('ctrAditivoModal').classList.add('open');
    },

    confirmarAditivo() {
      const id = this._aditivoCtrId;
      const c  = db.find(x=>x.id===id); if(!c) return;
      const tipo  = document.getElementById('aditivo-tipo').value;
      const data  = document.getElementById('aditivo-data').value;
      const desc  = document.getElementById('aditivo-desc').value.trim();
      const valor = document.getElementById('aditivo-valor').value;
      const prazo = document.getElementById('aditivo-prazo').value;
      if (!desc) { toast('Informe a descrição do aditivo'); return; }
      const novoId = 'AD-' + String(c.aditivos.length + 1).padStart(3,'0');
      const [d,m,y] = prazo ? prazo.split('-') : [];
      const prazoFormatado = prazo ? `${d||''}/${m||''}/${y||''}`.replace('undefined','—') : null;
      const novoAditivo = {
        id: novoId, tipo, descricao: desc,
        dataAssign: new Date(data).toLocaleDateString('pt-BR'),
        valorAnterior: valor ? c.valorMensal : null,
        valorNovo:     valor ? parseFloat(valor) : null,
        prazoAnterior: prazo ? c.fim : null,
        prazoNovo:     prazoFormatado,
        status: 'Assinado',
      };
      c.aditivos.push(novoAditivo);
      if (valor) { c.valorMensal = parseFloat(valor); c.valorTotal += parseFloat(valor)*3; }
      if (prazo) {
        const [yd,ym,yy] = prazo.split('-');
        const novo = [yy,ym,yd].reverse().join('/');
        c.fim = novo; c.diasRestantes = diasRestantes(novo);
      }
      c.historico.push({ data:'Agora', acao:`Aditivo ${novoId} registrado — ${tipo}: ${desc}`, user:'Maria Ribeiro', cor:'amber' });
      document.getElementById('ctrAditivoModal').classList.remove('open');
      toast(`✓ Aditivo ${novoId} registrado com sucesso!`);
      renderStats(); renderAlerts(); applyFilter();
      if (currentCtr?.id===id) switchTab('aditivos');
    },

    // ── Novo contrato ────────────────────────────────────────────
    openNewModal() {
      modalStep = 1;
      this.updateModalSteps();
      document.getElementById('ctrNewModal').classList.add('open');
      const d = new Date(); d.setDate(1);
      document.getElementById('ctr-f-inicio').value = d.toISOString().split('T')[0];
    },

    closeNewModal() { document.getElementById('ctrNewModal').classList.remove('open'); },

    updateModalSteps() {
      for (let i=1;i<=4;i++) {
        document.getElementById('ctr-step-'+i).classList.toggle('active', i===modalStep);
        const lbl = document.getElementById('ctr-step-lbl-'+i);
        lbl.classList.toggle('active', i===modalStep);
        lbl.classList.toggle('done', i<modalStep);
      }
      document.getElementById('ctr-btn-back').style.display = modalStep>1?'':'none';
      document.getElementById('ctr-btn-next').textContent   = modalStep===4?'Criar Contrato':'Próximo →';
    },

    calcDias() {
      const ini = document.getElementById('ctr-f-inicio')?.value;
      const fim = document.getElementById('ctr-f-fim')?.value;
      const prev = document.getElementById('ctr-vigencia-preview');
      if (!ini||!fim||!prev) return;
      const dias = Math.ceil((new Date(fim)-new Date(ini))/86400000);
      const meses= Math.round(dias/30);
      prev.textContent = `Vigência: ${dias} dias (${meses} meses)`;
      this.calcTotal();
    },

    calcTotal() {
      const mensal = parseFloat(document.getElementById('ctr-f-mensal')?.value)||0;
      const ini = document.getElementById('ctr-f-inicio')?.value;
      const fim = document.getElementById('ctr-f-fim')?.value;
      if (!mensal||!ini||!fim) return;
      const meses = Math.ceil((new Date(fim)-new Date(ini))/(86400000*30));
      const total = mensal * meses;
      const el = document.getElementById('ctr-f-total');
      if (el) el.value = brlF(total);
    },

    stepNext() {
      if (modalStep===1) {
        if (!document.getElementById('ctr-f-titulo').value.trim()) { toast('Informe o título'); return; }
        if (!document.getElementById('ctr-f-tipo').value)          { toast('Selecione o tipo'); return; }
        if (!document.getElementById('ctr-f-forn').value)          { toast('Selecione o fornecedor'); return; }
      }
      if (modalStep===2) {
        if (!document.getElementById('ctr-f-inicio').value) { toast('Informe a data de início'); return; }
        if (!document.getElementById('ctr-f-fim').value)    { toast('Informe a data de fim'); return; }
        if (!document.getElementById('ctr-f-mensal').value) { toast('Informe o valor mensal'); return; }
      }
      if (modalStep===3) this.buildReview();
      if (modalStep===4) { this.submitNewContract(); return; }
      modalStep++;
      this.updateModalSteps();
    },

    stepPrev() { if (modalStep>1) { modalStep--; this.updateModalSteps(); } },

    buildReview() {
      const titulo  = document.getElementById('ctr-f-titulo').value;
      const tipo    = document.getElementById('ctr-f-tipo').value;
      const fornEl  = document.getElementById('ctr-f-forn');
      const fornNome= fornEl?.options[fornEl.selectedIndex]?.text||'—';
      const inicio  = document.getElementById('ctr-f-inicio').value;
      const fim     = document.getElementById('ctr-f-fim').value;
      const mensal  = document.getElementById('ctr-f-mensal').value;
      const total   = document.getElementById('ctr-f-total').value;
      document.getElementById('ctr-review-content').innerHTML = `
        <div class="req-field-grid" style="margin-bottom:16px">
          <div class="req-field"><span class="req-field-label">Título</span><span class="req-field-value">${titulo}</span></div>
          <div class="req-field"><span class="req-field-label">Tipo</span><span class="req-field-value">${tipo}</span></div>
          <div class="req-field"><span class="req-field-label">Fornecedor</span><span class="req-field-value">${fornNome}</span></div>
          <div class="req-field"><span class="req-field-label">Vigência</span><span class="req-field-value">${new Date(inicio).toLocaleDateString('pt-BR')} → ${new Date(fim).toLocaleDateString('pt-BR')}</span></div>
          <div class="req-field"><span class="req-field-label">Valor Mensal</span><span class="req-field-value">${brlF(parseFloat(mensal)||0)}</span></div>
          <div class="req-field"><span class="req-field-label">Valor Total</span><span class="req-field-value">${total||'—'}</span></div>
        </div>
        <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--navy)">
          📧 Após criar, um e-mail de notificação será enviado ao fornecedor e ao responsável interno.
        </div>`;
    },

    submitNewContract() {
      const fornEl  = document.getElementById('ctr-f-forn');
      const fornId  = fornEl?.value;
      const fornNome= fornEl?.options[fornEl.selectedIndex]?.text||'—';
      const inicio  = new Date(document.getElementById('ctr-f-inicio').value);
      const fim     = new Date(document.getElementById('ctr-f-fim').value);
      const id = 'CNT-' + String(db.length + 43 + 1).padStart(4,'0');
      const novoContrato = {
        id, numero: new Date().getFullYear() + '/' + String(db.length+50).padStart(4,'0'),
        titulo: document.getElementById('ctr-f-titulo').value,
        tipo:   document.getElementById('ctr-f-tipo').value,
        fornId, fornecedor:fornNome, cnpjForn:'—',
        status:'Ativo',
        valorMensal: parseFloat(document.getElementById('ctr-f-mensal').value)||0,
        valorTotal:  parseFloat(document.getElementById('ctr-f-mensal').value||0) * Math.ceil((fim-inicio)/(86400000*30)),
        moeda:'BRL',
        inicio: inicio.toLocaleDateString('pt-BR'),
        fim:    fim.toLocaleDateString('pt-BR'),
        diasRestantes: Math.ceil((fim - new Date())/86400000),
        renovacaoAutomatica: document.getElementById('ctr-f-renov').value==='true',
        prazoAvisoPrevio: 30,
        reajusteTipo: document.getElementById('ctr-f-reajuste').value,
        reajustePct: 0,
        objeto: document.getElementById('ctr-f-objeto').value,
        condicaoPagto: document.getElementById('ctr-f-pagto').value,
        diaVencimento: parseInt(document.getElementById('ctr-f-diavenc').value)||10,
        responsavelInterno:'Maria Ribeiro',
        centroCusto: document.getElementById('ctr-f-cc').value,
        poOrigem:'', rfqOrigem:'', datasulFornCode:'',
        sla:{ disponibilidade:document.getElementById('ctr-f-sla-disp').value||null, tempoResposta:document.getElementById('ctr-f-sla-resp').value, tempoSolucao:document.getElementById('ctr-f-sla-soluc').value, multa:document.getElementById('ctr-f-sla-multa').value },
        medicoes:[], aditivos:[], docs:[],
        historico:[{ data:new Date().toLocaleDateString('pt-BR'), acao:'Contrato criado via BidFlow', user:'Maria Ribeiro', cor:'green' }],
      };
      db.unshift(novoContrato);
      this.closeNewModal();
      toast(`✓ Contrato ${id} criado com sucesso!`);
      renderStats(); renderAlerts(); applyFilter();
    },

    exportCSV() {
      const rows=[['ID','Número','Título','Fornecedor','Tipo','Status','Valor Mensal','Valor Total','Início','Fim','Dias Restantes']];
      db.forEach(c=>rows.push([c.id,c.numero,c.titulo,c.fornecedor,c.tipo,c.status,c.valorMensal,c.valorTotal,c.inicio,c.fim,c.diasRestantes]));
      const csv=rows.map(r=>r.map(v=>'"'+String(v||'').replace(/"/g,'""')+'"').join(',')).join('\n');
      const a=document.createElement('a');
      a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
      a.download='contratos-bidflow.csv'; a.click();
      toast('CSV exportado!');
    },

  };

})();
