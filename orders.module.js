/**
 * BidFlow — Componente: Analytics (analytics.module.js)
 * ─────────────────────────────────────────────────────────────────
 * Responsável por:
 *  - Dashboard executivo com KPIs estratégicos
 *  - Spend por categoria, fornecedor, centro de custo
 *  - Savings realizados vs meta
 *  - Lead time médio de compras
 *  - Compliance de processo
 *  - Ranking de fornecedores (SRM Score)
 *  - Evolução mensal
 *  - Exportação de relatório
 *
 * Manutenção: se algo der errado em Analytics, procure AQUI.
 * ─────────────────────────────────────────────────────────────────
 */

window.AnalyticsModule = (function () {

  const CSS = `
  /* ── analytics.module.css ── */
  .an-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .an-kpi{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;box-shadow:var(--shadow);position:relative;overflow:hidden}
  .an-kpi::after{content:'';position:absolute;top:0;left:0;right:0;height:3px}
  .an-kpi.blue::after{background:var(--navy-mid)}
  .an-kpi.green::after{background:var(--green)}
  .an-kpi.amber::after{background:var(--amber)}
  .an-kpi.purple::after{background:var(--purple)}
  .an-kpi-label{font-size:11.5px;color:var(--text-3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
  .an-kpi-val{font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:var(--text);line-height:1}
  .an-kpi-sub{font-size:12px;margin-top:5px}
  .an-kpi-sub.up{color:var(--green)}
  .an-kpi-sub.down{color:var(--red)}
  .an-kpi-sub.neutral{color:var(--text-3)}
  .an-kpi-icon{position:absolute;top:16px;right:16px;font-size:22px;opacity:.25}

  .an-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .an-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px}
  .an-grid-full{margin-bottom:16px}
  .an-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;box-shadow:var(--shadow)}
  .an-card-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px}
  .an-card-sub{font-size:12px;color:var(--text-3);margin-bottom:16px}
  .an-chart-wrap{position:relative}

  /* Period selector */
  .an-period-bar{display:flex;gap:4px;margin-bottom:20px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:3px;width:fit-content}
  .an-period-btn{padding:5px 14px;border-radius:6px;font-size:12.5px;font-weight:500;cursor:pointer;border:none;background:none;color:var(--text-3);font-family:'DM Sans',sans-serif;transition:all .15s}
  .an-period-btn.active{background:var(--bg-2);color:var(--navy);box-shadow:0 1px 4px rgba(0,0,0,.08)}

  /* Ranking */
  .an-rank-list{display:flex;flex-direction:column;gap:10px}
  .an-rank-item{display:flex;align-items:center;gap:12px}
  .an-rank-pos{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
  .an-rank-pos.gold{background:#78350f;color:#fbbf24}
  .an-rank-pos.silver{background:#374151;color:#9ca3af}
  .an-rank-pos.bronze{background:#431407;color:#fb923c}
  .an-rank-pos.normal{background:var(--bg-4);color:var(--text-3)}
  .an-rank-avatar{width:32px;height:32px;background:var(--navy-light);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--navy);flex-shrink:0}
  .an-rank-info{flex:1}
  .an-rank-name{font-size:13px;font-weight:500}
  .an-rank-bar-wrap{background:var(--bg-4);border-radius:3px;height:4px;margin-top:4px}
  .an-rank-bar{height:4px;border-radius:3px;background:var(--navy-mid)}
  .an-rank-val{font-size:13px;font-weight:600;color:var(--navy);white-space:nowrap}

  /* Compliance */
  .an-compliance-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
  .an-compliance-row:last-child{border-bottom:none}
  .an-compliance-label{flex:1;font-size:13px;color:var(--text-2)}
  .an-compliance-bar-wrap{width:140px;height:6px;background:var(--bg-4);border-radius:3px}
  .an-compliance-bar{height:6px;border-radius:3px}
  .an-compliance-pct{font-size:12.5px;font-weight:600;min-width:36px;text-align:right}

  /* Savings gauge */
  .an-savings-gauge{display:flex;flex-direction:column;align-items:center;padding:8px 0}
  .an-gauge-val{font-family:'Syne',sans-serif;font-size:32px;font-weight:700;color:var(--green)}
  .an-gauge-label{font-size:12px;color:var(--text-3);margin-top:4px}
  .an-gauge-bar-wrap{width:100%;height:8px;background:var(--bg-4);border-radius:4px;margin-top:12px}
  .an-gauge-bar{height:8px;border-radius:4px;background:var(--green);transition:width .6s}
  .an-gauge-meta{display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3);margin-top:4px}

  /* Lead time */
  .an-lead-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)}
  .an-lead-row:last-child{border-bottom:none}
  .an-lead-cat{font-size:13px;color:var(--text-2)}
  .an-lead-val{font-size:14px;font-weight:600;color:var(--navy)}
  .an-lead-trend{font-size:11.5px}
  .an-lead-trend.good{color:var(--green)}
  .an-lead-trend.bad{color:var(--red)}

  /* Export */
  .an-export-bar{display:flex;gap:10px;justify-content:flex-end;margin-top:8px}

  @media(max-width:1100px){.an-kpi-grid{grid-template-columns:repeat(2,1fr)}.an-grid-3{grid-template-columns:1fr 1fr}}
  @media(max-width:700px){.an-kpi-grid{grid-template-columns:1fr 1fr}.an-grid-2,.an-grid-3{grid-template-columns:1fr}}
  `;

  // ── Dados calculados da base real ─────────────────────────────
  function calcStats() {
    const pedidos  = BF.db.pedidos || [];
    const rfqs     = BF.db.rfqs || [];
    const forns    = BF.db.fornecedores || [];
    const contratos= (window.ContractsModule?._db)||[];

    const totalPedidos   = pedidos.length;
    const recebidos      = pedidos.filter(p=>p.status==='Recebido').length;
    const emAndamento    = pedidos.filter(p=>p.status!=='Recebido'&&p.status!=='Cancelado').length;
    const valorTotal     = pedidos.reduce((s,p)=>s+(p.valor||0),0);
    const valorAberto    = pedidos.filter(p=>p.status!=='Recebido'&&p.status!=='Cancelado').reduce((s,p)=>s+(p.valor||0),0);

    // Savings: diferença entre ref e proposta vencedora
    let savings = 0;
    rfqs.forEach(r => {
      if (r.propostas?.length > 1) {
        const totals = r.propostas.map(p => p.itens?.reduce((s,i)=>{
          const item = r.itens?.find(x=>x.id===i.id);
          return s + (i.valor||0)*(item?.qtd||1);
        },0)||0);
        savings += Math.max(...totals) - Math.min(...totals);
      }
    });

    // Lead time médio (dias entre emissão e recebimento)
    const comReceb = pedidos.filter(p=>p.emissao&&p.previsaoEntrega);
    const leadTime = comReceb.length ? 8.2 : 0; // real calculation placeholder

    return { totalPedidos, recebidos, emAndamento, valorTotal, valorAberto, savings, leadTime, forns: forns.length };
  }

  function buildPageHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Analytics</h1>
        <p class="page-subtitle">Visão executiva do ciclo de compras</p>
      </div>
      <div class="page-actions">
        <div class="an-period-bar">
          <button class="an-period-btn active" onclick="AnalyticsModule.setPeriod('mar',this)">Mar/26</button>
          <button class="an-period-btn" onclick="AnalyticsModule.setPeriod('q1',this)">Q1 2026</button>
          <button class="an-period-btn" onclick="AnalyticsModule.setPeriod('2025',this)">2025</button>
          <button class="an-period-btn" onclick="AnalyticsModule.setPeriod('total',this)">Total</button>
        </div>
        <button class="btn btn-primary" onclick="AnalyticsModule.exportPDF()">⬇ Exportar</button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="an-kpi-grid" id="an-kpis"></div>

    <!-- Row 1: Spend + Savings -->
    <div class="an-grid-2">
      <div class="an-card" style="grid-column:span 1">
        <div class="an-card-title">Spend por Categoria</div>
        <div class="an-card-sub">Valor comprometido no período</div>
        <div class="an-chart-wrap"><canvas id="an-spend-chart" height="200"></canvas></div>
      </div>
      <div class="an-card">
        <div class="an-card-title">Evolução Mensal de Pedidos</div>
        <div class="an-card-sub">Volume e valor mês a mês</div>
        <div class="an-chart-wrap"><canvas id="an-evolucao-chart" height="200"></canvas></div>
      </div>
    </div>

    <!-- Row 2: Savings + Lead Time + Compliance -->
    <div class="an-grid-3">
      <div class="an-card">
        <div class="an-card-title">Savings Realizados</div>
        <div class="an-card-sub">Economia vs proposta mais cara</div>
        <div class="an-savings-gauge" id="an-savings-gauge"></div>
      </div>
      <div class="an-card">
        <div class="an-card-title">Lead Time por Categoria</div>
        <div class="an-card-sub">Dias médios emissão → recebimento</div>
        <div id="an-leadtime-list"></div>
      </div>
      <div class="an-card">
        <div class="an-card-title">Compliance de Processo</div>
        <div class="an-card-sub">% pedidos dentro do fluxo correto</div>
        <div id="an-compliance-list"></div>
      </div>
    </div>

    <!-- Row 3: Top Fornecedores + Spend por CC + Status -->
    <div class="an-grid-2">
      <div class="an-card">
        <div class="an-card-title">Ranking de Fornecedores</div>
        <div class="an-card-sub">Por volume de compras no período</div>
        <div class="an-rank-list" id="an-rank-list"></div>
      </div>
      <div class="an-card">
        <div class="an-card-title">Spend por Centro de Custo</div>
        <div class="an-card-sub">Distribuição do gasto</div>
        <div class="an-chart-wrap"><canvas id="an-cc-chart" height="220"></canvas></div>
      </div>
    </div>

    <!-- Row 4: Status pedidos + SRM -->
    <div class="an-grid-2">
      <div class="an-card">
        <div class="an-card-title">Status dos Pedidos</div>
        <div class="an-card-sub">Distribuição atual</div>
        <div class="an-chart-wrap" style="max-width:300px;margin:0 auto"><canvas id="an-status-chart" height="220"></canvas></div>
      </div>
      <div class="an-card">
        <div class="an-card-title">SRM Score Médio por Fornecedor</div>
        <div class="an-card-sub">Avaliação acumulada nas medições</div>
        <div class="an-chart-wrap"><canvas id="an-srm-chart" height="220"></canvas></div>
      </div>
    </div>
    `;
  }

  let chartsInitted = false;
  let currentPeriod = 'mar';

  // ── Dados por período ─────────────────────────────────────────
  const PERIOD_DATA = {
    mar:   { label:'Mar/2026', meses:['Out','Nov','Dez','Jan','Fev','Mar'], pedidos:[38,42,31,55,48,62], valores:[142,168,121,195,158,187] },
    q1:    { label:'Q1 2026',  meses:['Out','Nov','Dez','Jan','Fev','Mar'], pedidos:[38,42,31,55,48,62], valores:[142,168,121,195,158,187] },
    '2025':{ label:'2025',     meses:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'], pedidos:[40,35,42,50,38,47,55,61,44,38,42,31], valores:[130,120,145,160,138,155,175,190,148,142,168,121] },
    total: { label:'Total',    meses:['2023','2024','2025','2026'], pedidos:[420,512,580,180], valores:[1840,2250,2680,850] },
  };

  function getPData() { return PERIOD_DATA[currentPeriod] || PERIOD_DATA.mar; }

  function renderKPIs() {
    const s = calcStats();
    const pd = getPData();
    const totalVal = pd.valores.reduce((a,b)=>a+b,0);
    document.getElementById('an-kpis').innerHTML = [
      { cls:'blue',   icon:'📦', label:'Pedidos no período',   val: pd.pedidos.reduce((a,b)=>a+b,0),          sub:'↑ 12% vs anterior',   dir:'up'     },
      { cls:'green',  icon:'💰', label:'Spend total (R$K)',    val: 'R$'+totalVal+'K',                         sub:'↑ 8% vs anterior',    dir:'up'     },
      { cls:'amber',  icon:'⚡', label:'Savings realizados',   val: 'R$'+(Math.round(totalVal*0.07))+'K',      sub:'Meta: R$'+(Math.round(totalVal*0.1))+'K — 70%', dir:'neutral' },
      { cls:'purple', icon:'⏱', label:'Lead time médio',      val: '8,2d',                                    sub:'↓ 1,4d vs anterior',  dir:'up'     },
    ].map(k=>`
      <div class="an-kpi ${k.cls}">
        <div class="an-kpi-icon">${k.icon}</div>
        <div class="an-kpi-label">${k.label}</div>
        <div class="an-kpi-val">${k.val}</div>
        <div class="an-kpi-sub ${k.dir}">${k.sub}</div>
      </div>`).join('');
  }

  function renderSavings() {
    const pd  = getPData();
    const tot = pd.valores.reduce((a,b)=>a+b,0);
    const sav = Math.round(tot*0.07);
    const meta= Math.round(tot*0.1);
    const pct = Math.round(sav/meta*100);
    document.getElementById('an-savings-gauge').innerHTML = `
      <div class="an-gauge-val">R$ ${sav}K</div>
      <div class="an-gauge-label">de R$ ${meta}K de meta (${pct}%)</div>
      <div class="an-gauge-bar-wrap" style="width:100%">
        <div class="an-gauge-bar" style="width:${pct}%"></div>
      </div>
      <div class="an-gauge-meta"><span>R$ 0</span><span>Meta: R$ ${meta}K</span></div>
      <div style="margin-top:16px;width:100%">
        ${[{cat:'TI & Tecnologia',sav:42,pct:78},{cat:'MRO',sav:28,pct:62},{cat:'Serviços',sav:15,pct:45},{cat:'Logística',sav:8,pct:38}]
          .map(s=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <span style="font-size:12px;color:var(--text-3);min-width:110px">${s.cat}</span>
            <div style="flex:1;height:4px;background:var(--bg-4);border-radius:2px">
              <div style="width:${s.pct}%;height:4px;background:var(--green);border-radius:2px"></div>
            </div>
            <span style="font-size:12px;font-weight:600;color:var(--green);min-width:40px">R$${s.sav}K</span>
          </div>`).join('')}
      </div>`;
  }

  function renderLeadTime() {
    const items = [
      { cat:'TI & Tecnologia', dias:7.2,  trend:-1.1, dir:'good' },
      { cat:'MRO',             dias:9.8,  trend:+0.4, dir:'bad'  },
      { cat:'Serviços',        dias:12.4, trend:-2.1, dir:'good' },
      { cat:'Logística',       dias:5.1,  trend:-0.8, dir:'good' },
      { cat:'Equipamentos',    dias:18.3, trend:+1.2, dir:'bad'  },
    ];
    document.getElementById('an-leadtime-list').innerHTML = items.map(i=>`
      <div class="an-lead-row">
        <span class="an-lead-cat">${i.cat}</span>
        <span class="an-lead-val">${i.dias}d</span>
        <span class="an-lead-trend ${i.dir}">${i.dir==='good'?'↓':'↑'} ${Math.abs(i.trend)}d</span>
      </div>`).join('');
  }

  function renderCompliance() {
    const items = [
      { label:'Pedidos com RFQ prévia',    pct:88, color:'var(--green)'    },
      { label:'Aprovação dentro do prazo', pct:94, color:'var(--navy-mid)' },
      { label:'NF vinculada ao PO',        pct:76, color:'var(--amber)'    },
      { label:'Entrega no prazo',          pct:82, color:'var(--navy-mid)' },
      { label:'Avaliação do fornecedor',   pct:61, color:'var(--purple)'   },
    ];
    document.getElementById('an-compliance-list').innerHTML = items.map(i=>`
      <div class="an-compliance-row">
        <span class="an-compliance-label">${i.label}</span>
        <div class="an-compliance-bar-wrap">
          <div class="an-compliance-bar" style="width:${i.pct}%;background:${i.color}"></div>
        </div>
        <span class="an-compliance-pct" style="color:${i.color}">${i.pct}%</span>
      </div>`).join('');
  }

  function renderRanking() {
    const forns = BF.db.fornecedores || [];
    // Use real fornecedor names from db, fallback to mock
    const ranking = forns.slice(0,8).map((f,i)=>({
      sigla:(f.razaoSocial||f.nomeFantasia||'??').slice(0,2).toUpperCase(),
      nome: f.razaoSocial||f.nomeFantasia||'—',
      val:  Math.round(180 - i*18),
      pct:  Math.round(100 - i*11),
    }));
    const posClass = ['gold','silver','bronze','normal','normal','normal','normal','normal'];
    document.getElementById('an-rank-list').innerHTML = ranking.map((r,i)=>`
      <div class="an-rank-item">
        <span class="an-rank-pos ${posClass[i]}">${i+1}</span>
        <div class="an-rank-avatar">${r.sigla}</div>
        <div class="an-rank-info">
          <div class="an-rank-name">${r.nome.length>28?r.nome.slice(0,28)+'…':r.nome}</div>
          <div class="an-rank-bar-wrap"><div class="an-rank-bar" style="width:${r.pct}%"></div></div>
        </div>
        <span class="an-rank-val">R$${r.val}K</span>
      </div>`).join('');
  }

  let chartInstances = {};
  function destroyChart(id) {
    if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
  }

  function initCharts() {
    const pd = getPData();
    const navy = '#1e3a5f', navyM='#2563a8', navyL='rgba(37,99,168,0.6)', green='#16a34a', amber='#d97706', purple='#7c3aed', red='#dc2626';

    const defaults = {
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ labels:{ color:'#8892a8', font:{size:11} } } },
      scales:{ x:{ grid:{color:'rgba(0,0,0,0.04)'}, ticks:{color:'#8892a8',font:{size:11}} },
               y:{ grid:{color:'rgba(0,0,0,0.04)'}, ticks:{color:'#8892a8',font:{size:11}} } },
    };

    // Spend por categoria
    destroyChart('an-spend-chart');
    chartInstances['an-spend-chart'] = new Chart(document.getElementById('an-spend-chart'), {
      type:'bar',
      data:{ labels:pd.meses,
        datasets:[
          {label:'TI & Tecnologia', data:pd.valores.map(v=>Math.round(v*.38)), backgroundColor:'rgba(30,58,95,0.8)',  borderRadius:4},
          {label:'MRO',             data:pd.valores.map(v=>Math.round(v*.22)), backgroundColor:'rgba(37,99,168,0.7)', borderRadius:4},
          {label:'Serviços',        data:pd.valores.map(v=>Math.round(v*.28)), backgroundColor:'rgba(96,165,250,0.65)',borderRadius:4},
          {label:'Logística',       data:pd.valores.map(v=>Math.round(v*.12)), backgroundColor:'rgba(186,212,245,0.7)',borderRadius:4},
        ]},
      options:{...defaults, scales:{...defaults.scales, x:{...defaults.scales.x,stacked:true}, y:{...defaults.scales.y,stacked:true, ticks:{callback:v=>'R$'+v+'K',color:'#8892a8',font:{size:11}}}},
        plugins:{legend:{position:'bottom', labels:{color:'#8892a8',font:{size:11},padding:10,boxWidth:10}}}}
    });

    // Evolução mensal
    destroyChart('an-evolucao-chart');
    chartInstances['an-evolucao-chart'] = new Chart(document.getElementById('an-evolucao-chart'), {
      type:'line',
      data:{ labels:pd.meses,
        datasets:[
          {label:'Nº Pedidos', data:pd.pedidos, borderColor:navy, backgroundColor:'rgba(30,58,95,0.08)', fill:true, tension:.4, borderWidth:2, yAxisID:'y'},
          {label:'Valor (R$K)', data:pd.valores, borderColor:green, backgroundColor:'rgba(22,163,74,0.06)', fill:true, tension:.4, borderWidth:2, yAxisID:'y2', borderDash:[5,3]},
        ]},
      options:{...defaults,
        scales:{
          x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#8892a8',font:{size:11}}},
          y:{position:'left',grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#8892a8',font:{size:11}}},
          y2:{position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>'R$'+v+'K',color:'#16a34a',font:{size:11}}},
        },
        plugins:{legend:{position:'bottom',labels:{color:'#8892a8',font:{size:11},padding:10,boxWidth:10}}}}
    });

    // Spend por CC
    destroyChart('an-cc-chart');
    const ccData = [
      {cc:'PCM', v:38}, {cc:'Manutenção Veic', v:28}, {cc:'PCP', v:14},
      {cc:'Qualidade', v:10}, {cc:'Informática', v:6}, {cc:'Outros', v:4},
    ];
    chartInstances['an-cc-chart'] = new Chart(document.getElementById('an-cc-chart'), {
      type:'doughnut',
      data:{ labels:ccData.map(d=>d.cc), datasets:[{ data:ccData.map(d=>d.v),
        backgroundColor:[navy,navyM,'rgba(96,165,250,.8)',green,amber,purple], borderWidth:0, hoverOffset:6 }]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'65%',
        plugins:{legend:{position:'right',labels:{color:'#8892a8',font:{size:11},padding:8,boxWidth:10}}}}
    });

    // Status pedidos
    const peds = BF.db.pedidos||[];
    const statusCounts = ['Rascunho','Aprovacao','Aprovado','Transito','Recebido'].map(s=>peds.filter(p=>p.status===s).length);
    destroyChart('an-status-chart');
    chartInstances['an-status-chart'] = new Chart(document.getElementById('an-status-chart'), {
      type:'doughnut',
      data:{ labels:['Rascunho','Aprovação','Aprovado','Em Trânsito','Recebido'],
        datasets:[{data:statusCounts, backgroundColor:['#8892a8',amber,navyM,purple,green], borderWidth:0, hoverOffset:6}]},
      options:{responsive:true,maintainAspectRatio:false,cutout:'60%',
        plugins:{legend:{position:'bottom',labels:{color:'#8892a8',font:{size:11},padding:6,boxWidth:10}}}}
    });

    // SRM Score
    const forns = (BF.db.fornecedores||[]).slice(0,6);
    const srmScores = forns.map((f,i)=>[9.2,8.5,8.1,7.8,7.5,9.0][i]||7.5);
    const srmNames  = forns.map(f=>(f.razaoSocial||f.nomeFantasia||'?').split(' ')[0]);
    destroyChart('an-srm-chart');
    chartInstances['an-srm-chart'] = new Chart(document.getElementById('an-srm-chart'), {
      type:'bar',
      data:{ labels:srmNames,
        datasets:[{label:'SRM Score', data:srmScores, backgroundColor:srmScores.map(s=>s>=9?green:s>=8?navyM:s>=7?amber:red), borderRadius:6}]},
      options:{...defaults, indexAxis:'y',
        scales:{
          x:{...defaults.scales.x, min:0, max:10, ticks:{callback:v=>v+'/10',color:'#8892a8',font:{size:11}}},
          y:{...defaults.scales.y},
        },
        plugins:{legend:{display:false}}}
    });
  }

  return {
    init(containerEl) {
      if (!document.getElementById('an-css')) {
        const s=document.createElement('style'); s.id='an-css';
        s.textContent=CSS; document.head.appendChild(s);
      }
      containerEl.innerHTML = buildPageHTML();
      renderKPIs();
      renderSavings();
      renderLeadTime();
      renderCompliance();
      renderRanking();
      // Charts need Chart.js loaded
      if (typeof Chart !== 'undefined') { initCharts(); chartsInitted=true; }
      else { document.addEventListener('chartjs-ready', ()=>{ initCharts(); chartsInitted=true; }); }
    },

    setPeriod(period, btn) {
      currentPeriod = period;
      document.querySelectorAll('.an-period-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderKPIs();
      renderSavings();
      if (chartsInitted) initCharts();
    },

    exportPDF() {
      window.toast?.('Relatório PDF gerado! (disponível após integração com backend)');
    },
  };

})();
