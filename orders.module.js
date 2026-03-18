<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BidFlow — Portal de Procurement</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #f0f2f5;
  --bg-2: #ffffff;
  --bg-3: #f4f6f9;
  --bg-4: #e8ecf2;
  --border: #dde2ea;
  --border-light: #c8d0dc;
  --text: #1a2133;
  --text-2: #4a5572;
  --text-3: #8892a8;
  --navy: #1e3a5f;
  --navy-2: #163050;
  --navy-3: #0d2040;
  --navy-light: #e8eef7;
  --navy-mid: #2563a8;
  --green: #16a34a;
  --green-light: #dcfce7;
  --amber: #d97706;
  --amber-light: #fef3c7;
  --red: #dc2626;
  --red-light: #fee2e2;
  --purple: #7c3aed;
  --purple-light: #ede9fe;
  --sidebar-w: 240px;
  --radius: 10px;
  --radius-lg: 14px;
  --shadow: 0 2px 16px rgba(30,58,95,0.08);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',sans-serif;font-size:14px;background:var(--bg);color:var(--text);display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{width:var(--sidebar-w);background:var(--navy-3);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:100;transition:transform .3s;overflow-y:auto}
.sidebar-logo{display:flex;align-items:center;gap:10px;padding:20px 18px 16px;border-bottom:1px solid rgba(255,255,255,0.08)}
.logo-mark{width:34px;height:34px;background:var(--navy-mid);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#fff;flex-shrink:0}
.logo-text{font-family:'Syne',sans-serif;font-weight:700;font-size:16px;color:#fff}
.logo-accent{color:#60a5fa}
.sidebar-nav{flex:1;padding:12px 10px;display:flex;flex-direction:column;gap:18px}
.nav-section{display:flex;flex-direction:column;gap:2px}
.nav-label{font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);padding:0 8px 6px}
.nav-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;color:rgba(255,255,255,0.55);text-decoration:none;font-size:13.5px;transition:all .15s;cursor:pointer}
.nav-item svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex-shrink:0}
.nav-item:hover{background:rgba(255,255,255,0.08);color:#fff}
.nav-item.active{background:rgba(96,165,250,0.18);color:#60a5fa;font-weight:500}
.badge{margin-left:auto;background:rgba(96,165,250,0.2);color:#60a5fa;font-size:11px;font-weight:600;padding:1px 7px;border-radius:20px}
.badge-warn{background:rgba(251,191,36,0.2);color:#fbbf24}
.badge-danger{background:rgba(248,113,113,0.2);color:#f87171}
.sidebar-user{display:flex;align-items:center;gap:10px;padding:14px;border-top:1px solid rgba(255,255,255,0.08);cursor:pointer}
.user-avatar{width:32px;height:32px;background:var(--navy-mid);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
.user-name{font-size:13px;font-weight:500;display:block;color:#fff}
.user-role{font-size:11px;color:rgba(255,255,255,0.4);display:block}

/* MAIN */
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh}

/* TOPBAR */
.topbar{height:60px;background:var(--bg-2);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50;box-shadow:var(--shadow)}
.topbar-left{display:flex;align-items:center;gap:12px}
.sidebar-toggle{background:none;border:none;cursor:pointer;padding:6px;border-radius:6px;color:var(--text-2);display:none}
.sidebar-toggle svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2}
.breadcrumb{font-family:'Syne',sans-serif;font-weight:600;font-size:15px;color:var(--text)}
.topbar-right{display:flex;align-items:center;gap:10px}
.search-bar{display:flex;align-items:center;gap:8px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;padding:6px 12px;width:280px}
.search-bar svg{width:15px;height:15px;stroke:var(--text-3);fill:none;stroke-width:2}
.search-bar input{background:none;border:none;outline:none;color:var(--text);font-size:13px;flex:1}
.search-bar input::placeholder{color:var(--text-3)}
.search-bar kbd{background:var(--bg-4);border:1px solid var(--border-light);border-radius:4px;font-size:10px;padding:1px 5px;color:var(--text-3)}
.topbar-btn{width:36px;height:36px;background:var(--bg-3);border:1px solid var(--border);border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2);position:relative}
.topbar-btn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.8}
.notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;background:var(--red);border-radius:50%;border:1.5px solid var(--bg-2)}

/* PAGES */
.page-content{flex:1;padding:28px 28px 48px}
.page{display:none;animation:fadeIn .2s ease}
.page.active{display:block}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.page-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;gap:16px}
.page-title{font-family:'Syne',sans-serif;font-size:24px;font-weight:700;color:var(--text)}
.page-subtitle{color:var(--text-3);font-size:13.5px;margin-top:3px}
.page-actions{display:flex;gap:10px;flex-shrink:0}

/* BUTTONS */
.btn{padding:8px 16px;border-radius:8px;font-size:13.5px;font-weight:500;cursor:pointer;border:none;transition:all .15s;white-space:nowrap;font-family:'DM Sans',sans-serif}
.btn-primary{background:var(--navy);color:#fff}
.btn-primary:hover{background:var(--navy-2)}
.btn-secondary{background:var(--bg-3);color:var(--text);border:1px solid var(--border-light)}
.btn-secondary:hover{background:var(--bg-4)}
.btn-sm{padding:5px 12px;font-size:12.5px}
.btn-ghost{background:none;border:none;color:var(--text-2);font-size:13px;cursor:pointer;padding:6px 10px;border-radius:6px;display:flex;align-items:center;gap:6px;transition:all .15s;font-family:'DM Sans',sans-serif}
.btn-ghost:hover,.btn-ghost.active{background:var(--bg-3);color:var(--text)}
.btn-ghost.active{color:var(--navy)}
.icon-btn{width:30px;height:30px;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-2)}
.icon-btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.8}
.icon-btn:hover{border-color:var(--navy);color:var(--navy)}

/* CARDS */
.card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;box-shadow:var(--shadow)}
.card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.card-title{font-family:'Syne',sans-serif;font-size:14.5px;font-weight:600;color:var(--text)}
.card-link{color:var(--navy-mid);font-size:13px;text-decoration:none}

/* KPI */
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.kpi-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;display:flex;gap:14px;align-items:center;position:relative;overflow:hidden;box-shadow:var(--shadow);transition:transform .2s}
.kpi-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px}
.kpi-blue::before{background:var(--navy-mid)}
.kpi-amber::before{background:var(--amber)}
.kpi-green::before{background:var(--green)}
.kpi-purple::before{background:var(--purple)}
.kpi-card:hover{transform:translateY(-1px)}
.kpi-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.kpi-blue .kpi-icon{background:var(--navy-light);color:var(--navy)}
.kpi-amber .kpi-icon{background:var(--amber-light);color:var(--amber)}
.kpi-green .kpi-icon{background:var(--green-light);color:var(--green)}
.kpi-purple .kpi-icon{background:var(--purple-light);color:var(--purple)}
.kpi-icon svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.8}
.kpi-content{display:flex;flex-direction:column;gap:2px}
.kpi-label{font-size:12px;color:var(--text-3)}
.kpi-value{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;line-height:1.2;color:var(--text)}
.kpi-change{font-size:11.5px}
.kpi-change.up{color:var(--green)}
.kpi-change.warn{color:var(--amber)}

/* DASHBOARD GRID */
.dashboard-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.chart-card{grid-column:span 2}
.chart-container{height:200px}

/* ALERTS */
.alert-list{display:flex;flex-direction:column;gap:10px}
.alert-item{display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;border:1px solid}
.alert-red{background:rgba(220,38,38,0.05);border-color:rgba(220,38,38,0.2)}
.alert-amber{background:rgba(217,119,6,0.05);border-color:rgba(217,119,6,0.2)}
.alert-blue{background:var(--navy-light);border-color:rgba(30,58,95,0.2)}
.alert-icon{font-size:16px}
.alert-content{flex:1}
.alert-title{font-size:13px;font-weight:500;display:block}
.alert-sub{font-size:11.5px;color:var(--text-3)}

/* SUPPLIER RANK */
.supplier-rank{display:flex;flex-direction:column;gap:14px}
.rank-item{display:flex;align-items:center;gap:10px}
.rank-pos{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;background:var(--bg-4);color:var(--text-3);flex-shrink:0}
.rank-pos.gold{background:#78350f;color:#fbbf24}
.rank-pos.silver{background:#374151;color:#9ca3af}
.rank-pos.bronze{background:#431407;color:#fb923c}
.rank-avatar{width:30px;height:30px;background:var(--navy-light);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--navy);flex-shrink:0}
.rank-info{flex:1}
.rank-name{font-size:12.5px;font-weight:500;display:block;margin-bottom:4px}
.rank-bar-wrap{background:var(--bg-4);border-radius:3px;height:4px}
.rank-bar{height:4px;background:var(--navy-mid);border-radius:3px}
.rank-value{font-size:12.5px;font-weight:600;white-space:nowrap}

/* ACTIVITY */
.activity-feed{display:flex;flex-direction:column}
.activity-item{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.activity-item:last-child{border-bottom:none}
.activity-dot{width:8px;height:8px;border-radius:50%;margin-top:5px;flex-shrink:0}
.activity-dot.green{background:var(--green)}
.activity-dot.blue{background:var(--navy-mid)}
.activity-dot.amber{background:var(--amber)}
.activity-dot.red{background:var(--red)}
.activity-content{flex:1}
.activity-text{font-size:13px;color:var(--text-2);display:block}
.activity-time{font-size:11px;color:var(--text-3)}

/* FILTER BAR */
.filter-bar{display:flex;gap:10px;align-items:center;margin-bottom:18px;flex-wrap:wrap}
.filter-search{display:flex;align-items:center;gap:8px;background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:7px 12px;flex:1;min-width:200px}
.filter-search svg{width:15px;height:15px;stroke:var(--text-3);fill:none;stroke-width:2}
.filter-search input{background:none;border:none;outline:none;color:var(--text);font-size:13px;flex:1}
.filter-select{background:var(--bg-2);border:1px solid var(--border);border-radius:8px;padding:7px 12px;color:var(--text-2);font-size:13px;cursor:pointer;outline:none;font-family:'DM Sans',sans-serif}

/* TABLE */
.table-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow)}
.data-table{width:100%;border-collapse:collapse}
.data-table th{background:var(--bg-3);padding:10px 14px;text-align:left;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-3);border-bottom:1px solid var(--border)}
.data-table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13.5px;color:var(--text-2)}
.data-table tbody tr:hover{background:var(--bg-3)}
.data-table tbody tr:last-child td{border-bottom:none}
.text-mono{font-family:monospace;font-size:12px}
.table-entity{display:flex;align-items:center;gap:10px}
.entity-avatar{width:34px;height:34px;background:var(--navy-light);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--navy);flex-shrink:0}
.entity-avatar.amber{background:var(--amber-light);color:var(--amber)}
.entity-avatar.green{background:var(--green-light);color:var(--green)}
.entity-name{font-size:13.5px;font-weight:500;color:var(--text);display:block}
.entity-sub{font-size:11.5px;color:var(--text-3)}
.score-wrap{display:flex;align-items:center;gap:8px}
.score-bar{flex:1;height:5px;background:var(--bg-4);border-radius:3px}
.score-fill{height:5px;background:var(--green);border-radius:3px}
.score-num{font-size:12px;font-weight:600;width:24px}
.table-footer{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--border)}
.table-info{font-size:12.5px;color:var(--text-3)}
.pagination{display:flex;gap:4px;align-items:center;font-size:12px;color:var(--text-3)}
.page-btn{width:28px;height:28px;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;cursor:pointer;color:var(--text-2);font-size:12px}
.page-btn.active{background:var(--navy);border-color:var(--navy);color:#fff}
.page-btn:disabled{opacity:.4;cursor:default}

/* CHIPS & BADGES */
.chip{display:inline-block;padding:2px 9px;border-radius:20px;font-size:11.5px;font-weight:500}
.chip-blue{background:var(--navy-light);color:var(--navy)}
.chip-amber{background:var(--amber-light);color:var(--amber)}
.chip-green{background:var(--green-light);color:var(--green)}
.chip-red{background:var(--red-light);color:var(--red)}
.chip-purple{background:var(--purple-light);color:var(--purple)}
.status-badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600}
.status-green{background:var(--green-light);color:var(--green)}
.status-amber{background:var(--amber-light);color:var(--amber)}
.status-blue{background:var(--navy-light);color:var(--navy)}
.status-gray{background:var(--bg-4);color:var(--text-3)}
.status-red{background:var(--red-light);color:var(--red)}
.action-btns{display:flex;gap:6px}

/* RFQ */
.rfq-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rfq-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;box-shadow:var(--shadow)}
.rfq-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.rfq-id{font-family:monospace;font-size:11.5px;color:var(--text-3)}
.rfq-title{font-size:14px;font-weight:600;margin-bottom:10px;color:var(--text)}
.rfq-meta{display:flex;flex-direction:column;gap:4px;font-size:12.5px;color:var(--text-3);margin-bottom:12px}
.rfq-progress{height:4px;background:var(--bg-4);border-radius:3px;margin-bottom:14px}
.rfq-progress-bar{height:4px;background:var(--navy-mid);border-radius:3px;transition:width .5s}
.rfq-actions{display:flex;gap:8px}

/* COMPARE TABLE */
.compare-table-wrap{overflow-x:auto}
.compare-table{width:100%;border-collapse:collapse}
.compare-table th,.compare-table td{padding:10px 14px;text-align:right;border-bottom:1px solid var(--border);font-size:13.5px}
.compare-table th:first-child,.compare-table td:first-child{text-align:left}
.compare-table th{font-size:12px;color:var(--text-3);font-weight:600;background:var(--bg-3)}
.supplier-col.best{color:var(--green);background:rgba(22,163,74,0.05)}
.best-val{color:var(--green);font-weight:600}
.total-row{background:var(--bg-3)}

/* KANBAN */
.kanban-board{display:flex;gap:14px;overflow-x:auto;padding-bottom:8px}
.kanban-col{min-width:210px;flex:1}
.kanban-col-header{display:flex;align-items:center;justify-content:space-between;padding:8px 4px;margin-bottom:8px}
.kanban-col-title{font-size:12.5px;font-weight:600;color:var(--text-2)}
.kanban-count{background:var(--bg-4);color:var(--text-3);font-size:11px;padding:1px 7px;border-radius:20px}
.kanban-count-amber{background:var(--amber-light);color:var(--amber)}
.kanban-count-blue{background:var(--navy-light);color:var(--navy)}
.kanban-count-purple{background:var(--purple-light);color:var(--purple)}
.kanban-count-green{background:var(--green-light);color:var(--green)}
.kanban-card{background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:8px;cursor:pointer;transition:border-color .15s;box-shadow:var(--shadow)}
.kanban-card:hover{border-color:var(--navy-mid)}
.kanban-card.kanban-urgent{border-color:rgba(220,38,38,0.4);border-left:3px solid var(--red)}
.kanban-card.kanban-done{opacity:.7}
.kanban-badge{font-size:10px;font-weight:700;color:var(--red);letter-spacing:.08em;margin-bottom:6px}
.kanban-id{font-family:monospace;font-size:11px;color:var(--text-3);margin-bottom:4px}
.kanban-title{font-size:13px;font-weight:500;color:var(--text);margin-bottom:8px}
.kanban-meta{display:flex;justify-content:space-between;font-size:11.5px;color:var(--text-3)}
.kanban-approvers{display:flex;gap:6px;margin-top:8px}
.approver-chip{font-size:10.5px;padding:2px 8px;border-radius:20px}
.approver-chip.approved{background:var(--green-light);color:var(--green)}
.approver-chip.pending{background:var(--amber-light);color:var(--amber)}
.tracking-bar{display:flex;margin-top:10px}
.tracking-step{flex:1;text-align:center;font-size:9px;padding:3px 2px;border-bottom:2px solid var(--bg-4);color:var(--text-3)}
.tracking-step.done{border-color:var(--green);color:var(--green)}
.tracking-step.active{border-color:var(--navy-mid);color:var(--navy-mid);font-weight:600}

/* APPROVALS */
.approval-list{display:flex;flex-direction:column;gap:12px}
.approval-item{background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.approval-item.urgent{border-left:3px solid var(--red)}
.approval-info{flex:1}
.approval-title{font-size:13.5px;font-weight:500;color:var(--text)}
.approval-sub{font-size:12px;color:var(--text-3);margin-top:2px}
.approval-valor{font-size:14px;font-weight:600;color:var(--navy);white-space:nowrap}
.approval-prazo{font-size:11px;color:var(--text-3);text-align:right;margin-top:2px}
.approval-btns{display:flex;gap:8px}
.btn-approve{background:var(--green-light);color:var(--green);border:1px solid rgba(22,163,74,0.3);padding:6px 14px;border-radius:7px;cursor:pointer;font-size:12.5px;font-weight:500;font-family:'DM Sans',sans-serif}
.btn-reject{background:var(--red-light);color:var(--red);border:1px solid rgba(220,38,38,0.3);padding:6px 14px;border-radius:7px;cursor:pointer;font-size:12.5px;font-weight:500;font-family:'DM Sans',sans-serif}

/* NF */
.nf-table .match-ok{color:var(--green);font-weight:600}
.nf-table .match-pend{color:var(--amber)}

/* INTEGRATIONS */
.integrations-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.int-category-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:12px;color:var(--text-2)}
.int-cards{display:flex;flex-direction:column;gap:8px}
.int-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-2);border:1px solid var(--border);border-radius:10px;transition:border-color .15s;box-shadow:var(--shadow)}
.int-card.connected{border-color:rgba(22,163,74,0.3);background:rgba(22,163,74,0.02)}
.int-card.pending-api{border-color:rgba(30,58,95,0.2);border-style:dashed;background:rgba(30,58,95,0.02)}
.int-logo{width:38px;height:38px;border-radius:8px;background:var(--bg-4);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--text-2);flex-shrink:0}
.int-logo.sap{background:#e8eef7;color:var(--navy)}
.int-logo.ai{background:var(--purple-light);color:var(--purple)}
.int-logo.nfe{background:var(--green-light);color:var(--green);font-size:9px}
.int-info{flex:1}
.int-name{font-size:13px;font-weight:500;display:block;color:var(--text)}
.int-desc{font-size:11.5px;color:var(--text-3)}
.int-status-ok{color:var(--green);font-size:12px;font-weight:500;white-space:nowrap}
.int-status-pend{color:var(--amber);font-size:11px;white-space:nowrap}
.int-tag-mock{background:var(--amber-light);color:var(--amber);font-size:10px;font-weight:600;padding:2px 7px;border-radius:20px;white-space:nowrap}

/* ANALYTICS */
.analytics-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.analytics-title{font-size:11px;color:var(--text-3);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em;font-weight:600}
.analytics-big{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;margin-bottom:4px;color:var(--text)}
.analytics-sub{font-size:12px;color:var(--green);margin-bottom:14px}

/* CONTRACTS */
.contract-list{display:flex;flex-direction:column;gap:10px}
.contract-item{background:var(--bg-2);border:1px solid var(--border);border-radius:10px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow)}
.contract-item.vencendo{border-left:3px solid var(--amber)}
.contract-info{flex:1}
.contract-id{font-family:monospace;font-size:11px;color:var(--text-3);margin-bottom:3px}
.contract-obj{font-size:13.5px;font-weight:500;color:var(--text)}
.contract-meta{font-size:12px;color:var(--text-3);margin-top:2px}
.contract-valor{font-size:14px;font-weight:600;color:var(--navy);text-align:right}
.contract-periodo{font-size:11px;color:var(--text-3);text-align:right;margin-top:2px}

/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;align-items:center;justify-content:center}
.modal-overlay.open{display:flex}
.modal{background:var(--bg-2);border:1px solid var(--border-light);border-radius:var(--radius-lg);width:560px;max-width:95vw;max-height:90vh;overflow-y:auto;box-shadow:0 16px 48px rgba(0,0,0,0.2);animation:modalIn .2s ease}
@keyframes modalIn{from{transform:translateY(16px) scale(.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
.modal-header{display:flex;justify-content:space-between;align-items:center;padding:18px 20px;border-bottom:1px solid var(--border)}
.modal-header h2{font-family:'Syne',sans-serif;font-size:17px;font-weight:700}
.modal-close{background:none;border:none;color:var(--text-3);font-size:18px;cursor:pointer;padding:0 4px}
.modal-body{padding:20px}
.modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--border)}
.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
.form-group label{font-size:12.5px;font-weight:500;color:var(--text-2)}
.form-input{background:var(--bg-3);border:1px solid var(--border-light);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13.5px;outline:none;width:100%;font-family:'DM Sans',sans-serif}
.form-input:focus{border-color:var(--navy)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.multi-select{display:flex;align-items:center;flex-wrap:wrap;gap:6px;background:var(--bg-3);border:1px solid var(--border-light);border-radius:8px;padding:6px 10px;min-height:38px}
.multi-tag{background:var(--navy-light);color:var(--navy);padding:2px 8px;border-radius:20px;font-size:12px;display:flex;align-items:center;gap:4px}
.multi-tag button{background:none;border:none;color:var(--navy);cursor:pointer;font-size:12px}
.multi-select input{background:none;border:none;outline:none;color:var(--text);font-size:13px;min-width:80px}
.upload-zone{display:flex;flex-direction:column;align-items:center;gap:6px;padding:24px;border:2px dashed var(--border-light);border-radius:10px;cursor:pointer;color:var(--text-3);transition:border-color .15s}
.upload-zone:hover{border-color:var(--navy)}
.upload-zone svg{width:28px;height:28px;stroke:var(--text-3);fill:none;stroke-width:1.5}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;background:var(--navy-3);color:#fff;padding:12px 20px;border-radius:10px;font-size:13.5px;z-index:999;box-shadow:0 8px 24px rgba(0,0,0,0.3);animation:toastIn .3s ease;display:none}
.toast.show{display:block}
@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* RESPONSIVE */
@media(max-width:1200px){.kpi-grid{grid-template-columns:repeat(2,1fr)}.analytics-grid{grid-template-columns:repeat(2,1fr)}.rfq-grid{grid-template-columns:1fr 1fr}}
@media(max-width:900px){.sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.main{margin-left:0}.sidebar-toggle{display:flex}.dashboard-grid{grid-template-columns:1fr}.chart-card{grid-column:span 1}.integrations-grid{grid-template-columns:1fr}}
@media(max-width:640px){.search-bar{display:none}.kpi-grid{grid-template-columns:1fr}.rfq-grid{grid-template-columns:1fr}.analytics-grid{grid-template-columns:1fr 1fr}.page-content{padding:16px}}

/* ===== REQUISIÇÕES — módulo completo ===== */
.req-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.req-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;display:flex;flex-direction:column;gap:2px;box-shadow:var(--shadow)}
.req-stat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:var(--text)}
.req-stat-label{font-size:11.5px;color:var(--text-3)}
.req-stat-bar{height:3px;border-radius:2px;margin-top:8px;background:var(--bg-4)}
.req-stat-fill{height:3px;border-radius:2px}

.req-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;align-items:flex-start;justify-content:flex-end}
.req-detail-overlay.open{display:flex}
.req-detail-panel{width:480px;max-width:95vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,0.15);animation:slideIn .25s ease;display:flex;flex-direction:column}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.req-detail-header{padding:20px 20px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;position:sticky;top:0;background:var(--bg-2);z-index:1}
.req-detail-body{padding:20px;flex:1}
.req-detail-section{margin-bottom:24px}
.req-detail-section-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.req-field-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.req-field{display:flex;flex-direction:column;gap:3px}
.req-field-label{font-size:11px;color:var(--text-3)}
.req-field-value{font-size:13.5px;font-weight:500;color:var(--text)}
.req-timeline{display:flex;flex-direction:column;gap:0}
.req-timeline-item{display:flex;gap:12px;padding-bottom:16px;position:relative}
.req-timeline-item:last-child{padding-bottom:0}
.req-timeline-item:not(:last-child)::before{content:'';position:absolute;left:7px;top:16px;bottom:0;width:1px;background:var(--border)}
.req-timeline-dot{width:16px;height:16px;border-radius:50%;flex-shrink:0;margin-top:2px;border:2px solid var(--bg-2);box-shadow:0 0 0 1px currentColor}
.req-timeline-dot.green{color:var(--green);background:var(--green)}
.req-timeline-dot.blue{color:var(--navy-mid);background:var(--navy-mid)}
.req-timeline-dot.amber{color:var(--amber);background:var(--amber)}
.req-timeline-dot.gray{color:var(--text-3);background:var(--bg-4)}
.req-timeline-content{flex:1}
.req-timeline-title{font-size:13px;font-weight:500;color:var(--text)}
.req-timeline-sub{font-size:11.5px;color:var(--text-3);margin-top:1px}
.req-items-table{width:100%;border-collapse:collapse;margin-top:6px}
.req-items-table th{font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);padding:6px 8px;text-align:left;border-bottom:1px solid var(--border)}
.req-items-table td{padding:8px;font-size:13px;border-bottom:1px solid var(--border);color:var(--text-2)}
.req-items-table tr:last-child td{border-bottom:none}
.req-detail-footer{padding:16px 20px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end;background:var(--bg-2);position:sticky;bottom:0}
.req-row-clickable{cursor:pointer}
.req-row-clickable:hover td{background:var(--navy-light)!important}
.req-bulk-bar{display:none;background:var(--navy);color:#fff;padding:10px 16px;border-radius:10px;align-items:center;gap:12px;margin-bottom:14px;font-size:13px}
.req-bulk-bar.show{display:flex}
.req-bulk-count{font-weight:600}
.req-bulk-actions{display:flex;gap:8px;margin-left:auto}
.btn-white{background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3);padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12.5px;font-family:'DM Sans',sans-serif;transition:background .15s}
.btn-white:hover{background:rgba(255,255,255,0.25)}
.req-empty{text-align:center;padding:48px;color:var(--text-3);font-size:14px}
.req-priority-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px}
.req-progress-wrap{display:flex;align-items:center;gap:8px}
.req-progress-bar-outer{flex:1;height:4px;background:var(--bg-4);border-radius:2px}
.req-progress-bar-inner{height:4px;border-radius:2px;transition:width .4s}
textarea.form-input{resize:vertical;min-height:72px}
.form-section-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--text-3);margin:18px 0 10px;padding-top:14px;border-top:1px solid var(--border)}
.form-section-title:first-child{margin-top:0;padding-top:0;border-top:none}
.items-add-btn{display:flex;align-items:center;gap:6px;color:var(--navy-mid);font-size:13px;cursor:pointer;padding:6px 0;background:none;border:none;font-family:'DM Sans',sans-serif}
.items-add-btn:hover{color:var(--navy)}
.req-item-row{display:grid;grid-template-columns:1fr 80px 80px 100px 36px;gap:8px;align-items:center;margin-bottom:8px}
.req-item-del{background:none;border:none;color:var(--text-3);cursor:pointer;font-size:16px;padding:0;line-height:1}
.req-item-del:hover{color:var(--red)}


/* ===== INTEGRAÇÕES — cards ricos ===== */
.int-category-header{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.int-category-icon{font-size:18px}
.int-cat-count{margin-left:auto;font-size:12px;color:var(--text-3);background:var(--bg-4);padding:2px 10px;border-radius:20px}
.int-cards-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.int-card-rich{background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:border-color .15s,box-shadow .15s;box-shadow:var(--shadow);display:flex;flex-direction:column;gap:10px}
.int-card-rich:hover{border-color:var(--navy-mid);box-shadow:0 4px 20px rgba(30,58,95,0.12)}
.int-card-rich.connected{border-color:rgba(22,163,74,0.3);background:rgba(22,163,74,0.02)}
.int-card-rich.pending-api{border-color:rgba(217,119,6,0.3);border-style:dashed}
.int-card-top{display:flex;align-items:center;justify-content:space-between}
.int-card-info{display:flex;flex-direction:column;gap:3px}
.int-card-endpoints{display:flex;flex-direction:column;gap:4px;min-height:42px}
.int-endpoint{background:var(--bg-3);border:1px solid var(--border);border-radius:4px;padding:3px 7px;font-size:10.5px;color:var(--text-3);font-family:monospace;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.int-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:2px;padding-top:10px;border-top:1px solid var(--border)}
.int-resp{font-size:11px;color:var(--text-3)}
.int-detail-btn{background:none;border:none;color:var(--navy-mid);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:500}
.int-detail-btn:hover{color:var(--navy)}
.int-status-pill{font-size:10.5px;font-weight:600;padding:3px 9px;border-radius:20px;white-space:nowrap}
.int-tag-mock{background:var(--amber-light);color:var(--amber)}
.int-tag-pending{background:var(--amber-light);color:var(--amber)}
.int-tag-ok{background:var(--green-light);color:var(--green)}
.int-tag-idle{background:var(--bg-4);color:var(--text-3)}
.int-logo.wa{background:#dcfce7;color:#16a34a}
@media(max-width:1100px){.int-cards-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){.int-cards-grid{grid-template-columns:1fr}}


/* ===== RFQ — módulo completo ===== */
.rfq-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.rfq-stat{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;box-shadow:var(--shadow)}
.rfq-stat-val{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:var(--text);display:block}
.rfq-stat-label{font-size:11.5px;color:var(--text-3);display:block;margin-top:2px}

.rfq-list{display:flex;flex-direction:column;gap:14px}
.rfq-item{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;box-shadow:var(--shadow);cursor:pointer;transition:border-color .15s}
.rfq-item:hover{border-color:var(--navy-mid)}
.rfq-item.active-border{border-color:var(--navy-mid);border-left:3px solid var(--navy-mid)}
.rfq-item-top{display:flex;align-items:flex-start;gap:14px}
.rfq-item-icon{width:42px;height:42px;border-radius:10px;background:var(--navy-light);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px}
.rfq-item-main{flex:1}
.rfq-item-id{font-family:monospace;font-size:11px;color:var(--text-3)}
.rfq-item-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;color:var(--text);margin:3px 0 6px}
.rfq-item-meta{display:flex;gap:16px;flex-wrap:wrap}
.rfq-item-meta span{font-size:12px;color:var(--text-3);display:flex;align-items:center;gap:4px}
.rfq-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.rfq-item-valor{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--navy)}
.rfq-item-bottom{margin-top:14px;padding-top:14px;border-top:1px solid var(--border);display:flex;align-items:center;gap:12px}
.rfq-resp-faces{display:flex;gap:-4px}
.rfq-resp-face{width:24px;height:24px;border-radius:50%;background:var(--navy-light);border:2px solid var(--bg-2);display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--navy);margin-left:-6px}
.rfq-resp-face:first-child{margin-left:0}
.rfq-countdown{font-size:12px;font-weight:600;padding:3px 10px;border-radius:20px;margin-left:auto}
.rfq-countdown.urgent{background:var(--red-light);color:var(--red)}
.rfq-countdown.ok{background:var(--green-light);color:var(--green)}
.rfq-countdown.ended{background:var(--bg-4);color:var(--text-3)}
.rfq-actions-bar{display:flex;gap:8px}

/* Detail panel */
.rfq-detail-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;align-items:flex-start;justify-content:flex-end}
.rfq-detail-overlay.open{display:flex}
.rfq-detail-panel{width:680px;max-width:95vw;height:100vh;background:var(--bg-2);overflow-y:auto;box-shadow:-8px 0 32px rgba(0,0,0,0.15);animation:slideIn .25s ease;display:flex;flex-direction:column}
.rfq-tabs{display:flex;gap:0;border-bottom:1px solid var(--border);padding:0 20px;background:var(--bg-2);position:sticky;top:60px;z-index:1}
.rfq-tab{padding:12px 16px;font-size:13px;font-weight:500;color:var(--text-3);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none;font-family:'DM Sans',sans-serif}
.rfq-tab.active{color:var(--navy);border-bottom-color:var(--navy)}
.rfq-tab-content{display:none;padding:20px;flex:1}
.rfq-tab-content.active{display:block}

/* Comparativo */
.compare-wrap{overflow-x:auto;margin-top:8px}
.compare-tbl{width:100%;border-collapse:collapse;min-width:500px}
.compare-tbl th{background:var(--bg-3);padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.05em;color:var(--text-3);font-weight:600;text-align:right;border-bottom:2px solid var(--border);white-space:nowrap}
.compare-tbl th:first-child{text-align:left}
.compare-tbl th.winner-col{background:var(--navy-light);color:var(--navy)}
.compare-tbl td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:13px;color:var(--text-2);text-align:right}
.compare-tbl td:first-child{text-align:left;font-weight:500;color:var(--text)}
.compare-tbl .best-cell{color:var(--green);font-weight:700;background:rgba(22,163,74,0.05)}
.compare-tbl .worst-cell{color:var(--red-light);color:#dc2626}
.compare-tbl .total-row td{font-weight:700;background:var(--bg-3);font-size:14px}
.compare-tbl .total-row .best-cell{color:var(--green)}
.compare-saving{display:inline-block;font-size:11px;background:var(--green-light);color:var(--green);padding:1px 7px;border-radius:20px;margin-left:6px;font-weight:600}
.winner-badge{display:inline-flex;align-items:center;gap:4px;background:var(--navy);color:#fff;font-size:11px;font-weight:600;padding:3px 10px;border-radius:20px}

/* Fornecedores status */
.forn-status-list{display:flex;flex-direction:column;gap:8px}
.forn-status-item{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg-3);border-radius:8px;border:1px solid var(--border)}
.forn-avatar{width:34px;height:34px;border-radius:8px;background:var(--navy-light);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--navy);flex-shrink:0}
.forn-info{flex:1}
.forn-name{font-size:13.5px;font-weight:500;color:var(--text)}
.forn-cnpj{font-size:11.5px;color:var(--text-3);font-family:monospace}
.forn-resp-status{font-size:11.5px;padding:2px 8px;border-radius:20px}
.forn-resp-ok{background:var(--green-light);color:var(--green)}
.forn-resp-wait{background:var(--amber-light);color:var(--amber)}

/* Select winner */
.winner-select-card{border:2px solid transparent;border-radius:10px;padding:14px;cursor:pointer;transition:all .15s;background:var(--bg-3);margin-bottom:10px}
.winner-select-card:hover{border-color:var(--navy-mid);background:var(--navy-light)}
.winner-select-card.selected{border-color:var(--navy);background:var(--navy-light)}
.winner-select-card .radio-dot{width:16px;height:16px;border-radius:50%;border:2px solid var(--border-light);flex-shrink:0;transition:all .15s}
.winner-select-card.selected .radio-dot{border-color:var(--navy);background:var(--navy)}

/* New RFQ modal */
.rfq-modal-steps{display:flex;gap:0;margin-bottom:20px;border-bottom:1px solid var(--border);padding-bottom:0}
.rfq-modal-step{flex:1;text-align:center;padding:10px;font-size:12.5px;font-weight:500;color:var(--text-3);border-bottom:2px solid transparent;cursor:default}
.rfq-modal-step.active{color:var(--navy);border-bottom-color:var(--navy)}
.rfq-modal-step.done{color:var(--green);border-bottom-color:var(--green)}
.rfq-step-content{display:none}
.rfq-step-content.active{display:block}
.forn-invite-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg-3);border-radius:8px;border:1px solid var(--border);margin-bottom:8px}
.forn-invite-check{width:18px;height:18px;border-radius:4px;border:1.5px solid var(--border-light);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;flex-shrink:0}
.forn-invite-check.on{background:var(--navy);border-color:var(--navy)}
.forn-invite-check.on::after{content:'✓';color:#fff;font-size:11px}
.datasul-banner{background:linear-gradient(135deg,var(--navy-light),#dbeafe);border:1px solid rgba(30,58,95,0.2);border-radius:10px;padding:14px 16px;margin-bottom:20px;display:flex;gap:12px;align-items:flex-start}
.datasul-banner-icon{font-size:20px;flex-shrink:0}
.datasul-banner-text{font-size:13px;color:var(--navy);line-height:1.5}
.datasul-banner-text strong{display:block;margin-bottom:3px;font-size:13.5px}

</style>
</head>
<body>

<!-- SIDEBAR -->
<aside class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <div class="logo-mark">B</div>
    <span class="logo-text">Bid<span class="logo-accent">Flow</span></span>
  </div>
  <nav class="sidebar-nav">
    <div class="nav-section">
      <span class="nav-label">Principal</span>
      <a class="nav-item active" data-page="dashboard">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Dashboard
      </a>
      <a class="nav-item" data-page="requisitions">
        <svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>Requisições
        <span class="badge">5</span>
      </a>
      <a class="nav-item" data-page="rfq">
        <svg viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>RFQ / Cotações
        <span class="badge badge-warn">4</span>
      </a>
      <a class="nav-item" data-page="orders">
        <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>Pedidos de Compra
      </a>
      <a class="nav-item" data-page="approvals">
        <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Aprovações
        <span class="badge badge-warn">5</span>
      </a>
      <a class="nav-item" data-page="contracts">
        <svg viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Contratos
      </a>
      <a class="nav-item" data-page="invoices">
        <svg viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>Notas Fiscais
        <span class="badge badge-danger">2</span>
      </a>
    </div>
    <div class="nav-section">
      <span class="nav-label">Gestão</span>
      <a class="nav-item" data-page="suppliers">
        <svg viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Fornecedores
      </a>
      <a class="nav-item" data-page="analytics">
        <svg viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>Analytics
      </a>
    </div>
    <div class="nav-section">
      <span class="nav-label">Sistema</span>
      <a class="nav-item" data-page="integrations">
        <svg viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>Integrações
      </a>
      <a class="nav-item" data-page="users">
        <svg viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Usuários & Acessos
      </a>
      <a class="nav-item" data-page="portal-fornecedor-preview">
        <svg viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>Portal Fornecedor
      </a>
    </div>
  </nav>
  <div class="sidebar-user">
    <div class="user-avatar">MR</div>
    <div class="user-info">
      <span class="user-name">Maria Ribeiro</span>
      <span class="user-role">Gerente de Compras</span>
    </div>
  </div>
</aside>

<!-- MAIN -->
<main class="main" id="main">
  <header class="topbar">
    <div class="topbar-left">
      <button class="sidebar-toggle" id="sidebarToggle">
        <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="breadcrumb" id="breadcrumb">Dashboard</div>
    </div>
    <div class="topbar-right">
      <div class="search-bar">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder="Buscar pedidos, fornecedores...">
        <kbd>⌘K</kbd>
      </div>
      <button class="topbar-btn"><svg viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg><span class="notif-dot"></span></button>
    </div>
  </header>

  <div class="page-content" id="pageContent">

    <!-- DASHBOARD -->
    <div class="page active" id="page-dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title" id="dash-greeting">Bom dia, Maria 👋</h1>
          <p class="page-subtitle" id="dash-date">Aqui está o resumo de procurement de hoje</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="showPage('requisitions')">Nova Requisição</button>
          <button class="btn btn-primary" onclick="showPage('rfq')">Iniciar Cotação</button>
        </div>
      </div>
      <div class="kpi-grid" id="kpi-grid"></div>
      <div class="dashboard-grid">
        <div class="card chart-card">
          <div class="card-header">
            <h3 class="card-title">Spend por Categoria</h3>
            <div class="card-actions" style="display:flex;gap:4px">
              <button class="btn-ghost active">Mês</button>
              <button class="btn-ghost">Trimestre</button>
              <button class="btn-ghost">Ano</button>
            </div>
          </div>
          <div class="chart-container"><canvas id="spendChart"></canvas></div>
        </div>
        <div class="card" id="alerts-card">
          <div class="card-header"><h3 class="card-title">Pendências Críticas</h3><a class="card-link" onclick="showPage('approvals')">Ver todas</a></div>
          <div class="alert-list" id="alert-list"></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Top Fornecedores do Mês</h3></div>
          <div class="supplier-rank" id="supplier-rank"></div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Últimas Atividades</h3></div>
          <div class="activity-feed" id="activity-feed"></div>
        </div>
      </div>
    </div>

    <!-- REQUISIÇÕES -->
    <div class="page" id="page-requisitions">
      <div class="page-header">
        <div>
          <h1 class="page-title">Requisições</h1>
          <p class="page-subtitle" id="req-subtitle">Solicitações internas de compra</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="exportReqCSV()">Exportar CSV</button>
          <button class="btn btn-primary" onclick="openReqModal()">+ Nova Requisição</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="req-stats" id="req-stats"></div>

      <!-- Bulk action bar -->
      <div class="req-bulk-bar" id="req-bulk-bar">
        <span class="req-bulk-count" id="req-bulk-count">0 selecionadas</span>
        <div class="req-bulk-actions">
          <button class="btn-white" onclick="bulkAction('rfq')">→ Converter em RFQ</button>
          <button class="btn-white" onclick="bulkAction('approve')">✓ Aprovar selecionadas</button>
          <button class="btn-white" onclick="bulkAction('cancel')">✕ Cancelar</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="filter-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="req-search" placeholder="Buscar por descrição, solicitante, ID..." oninput="filterReqs()">
        </div>
        <select class="filter-select" id="req-filter-status" onchange="filterReqs()">
          <option value="">Todos os status</option>
          <option value="Em análise">Em análise</option>
          <option value="Aprovada">Aprovada</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>
        <select class="filter-select" id="req-filter-prio" onchange="filterReqs()">
          <option value="">Todas as prioridades</option>
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </select>
        <select class="filter-select" id="req-filter-sort" onchange="filterReqs()">
          <option value="date">Mais recentes</option>
          <option value="valor_desc">Maior valor</option>
          <option value="valor_asc">Menor valor</option>
          <option value="prio">Prioridade</option>
        </select>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:36px"><input type="checkbox" id="req-check-all" onchange="toggleAllReqs(this)"></th>
              <th>ID / Data</th>
              <th>Descrição</th>
              <th>Solicitante</th>
              <th>Valor Est.</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Aprovações</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="req-tbody"></tbody>
        </table>
        <div class="table-footer">
          <span class="table-info" id="req-info"></span>
          <div class="pagination" id="req-pagination"></div>
        </div>
      </div>
    </div>

    <!-- REQUISIÇÃO DETAIL PANEL -->
    <div class="req-detail-overlay" id="reqDetailOverlay" onclick="closeReqDetail(event)">
      <div class="req-detail-panel" id="reqDetailPanel">
        <div class="req-detail-header">
          <div>
            <div style="font-family:monospace;font-size:12px;color:var(--text-3)" id="detail-id"></div>
            <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-top:4px" id="detail-title"></h2>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            <span class="status-badge" id="detail-status-badge"></span>
            <button onclick="closeReqDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
          </div>
        </div>
        <div class="req-detail-body" id="req-detail-body"></div>
        <div class="req-detail-footer" id="req-detail-footer"></div>
      </div>
    </div>

    <!-- RFQ -->
    <div class="page" id="page-rfq">
      <div class="page-header">
        <div>
          <h1 class="page-title">Cotações (RFQ)</h1>
          <p class="page-subtitle" id="rfq-subtitle">Gerencie solicitações de cotação e compare propostas</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" onclick="exportRFQCSV()">Exportar</button>
          <button class="btn btn-primary" onclick="openRFQModal()">+ Nova Cotação</button>
        </div>
      </div>

      <!-- Datasul integration banner -->
      <div class="datasul-banner">
        <div class="datasul-banner-icon">🔗</div>
        <div class="datasul-banner-text">
          <strong>Integração Datasul — Fase 3 (pendente)</strong>
          Quando ativada: ordens de compra serão importadas automaticamente do módulo MCC via
          <code style="background:rgba(30,58,95,0.1);padding:1px 5px;border-radius:3px;font-size:11.5px">GET /mcc/v1/purchOrderPublic</code>
          e a cotação vencedora será enviada de volta via
          <code style="background:rgba(30,58,95,0.1);padding:1px 5px;border-radius:3px;font-size:11.5px">POST /mcc/v1/purchQuotationPublic</code>.
          Até lá, o fluxo funciona 100% no BidFlow.
        </div>
      </div>

      <!-- Stats -->
      <div class="rfq-stats" id="rfq-stats"></div>

      <!-- Filtros -->
      <div class="filter-bar" style="margin-bottom:16px">
        <div class="filter-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="rfq-search" placeholder="Buscar por título, ID, comprador..." oninput="filterRFQs()">
        </div>
        <select class="filter-select" id="rfq-filter-status" onchange="filterRFQs()">
          <option value="">Todos os status</option>
          <option value="Rascunho">Rascunho</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Análise">Em análise</option>
          <option value="Concluída">Concluída</option>
        </select>
        <select class="filter-select" id="rfq-filter-sort" onchange="filterRFQs()">
          <option value="date">Mais recentes</option>
          <option value="valor_desc">Maior valor</option>
          <option value="respostas">Mais respostas</option>
        </select>
      </div>

      <!-- Lista de RFQs -->
      <div class="rfq-list" id="rfq-list"></div>
    </div>

    <!-- RFQ DETAIL PANEL -->
    <div class="rfq-detail-overlay" id="rfqDetailOverlay" onclick="closeRFQDetail(event)">
      <div class="rfq-detail-panel" id="rfqDetailPanel">
        <div class="req-detail-header">
          <div>
            <div style="font-family:monospace;font-size:12px;color:var(--text-3)" id="rfq-detail-id"></div>
            <h2 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-top:4px" id="rfq-detail-title"></h2>
            <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap" id="rfq-detail-meta"></div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
            <span class="status-badge" id="rfq-detail-badge"></span>
            <button onclick="closeRFQDetail()" style="background:none;border:none;cursor:pointer;color:var(--text-3);font-size:20px;line-height:1">✕</button>
          </div>
        </div>
        <div class="rfq-tabs" id="rfq-tabs">
          <button class="rfq-tab active" onclick="switchRFQTab('resumo')">Resumo</button>
          <button class="rfq-tab" onclick="switchRFQTab('comparativo')">Comparativo</button>
          <button class="rfq-tab" onclick="switchRFQTab('fornecedores')">Fornecedores</button>
          <button class="rfq-tab" onclick="switchRFQTab('historico')">Histórico</button>
          <button class="rfq-tab" onclick="switchRFQTab('vencedor')">Selecionar Vencedor</button>
        </div>
        <div id="rfq-tab-resumo"     class="rfq-tab-content active"></div>
        <div id="rfq-tab-comparativo"class="rfq-tab-content"></div>
        <div id="rfq-tab-fornecedores"class="rfq-tab-content"></div>
        <div id="rfq-tab-historico"  class="rfq-tab-content"></div>
        <div id="rfq-tab-vencedor"   class="rfq-tab-content"></div>
        <div class="req-detail-footer" id="rfq-detail-footer"></div>
      </div>
    </div>

    <!-- PEDIDOS DE COMPRA — orders.module.js -->
    <div class="page" id="page-orders">
      <div id="orders-module-container"></div>
    </div>

    <!-- APROVAÇÕES -->
    <div class="page" id="page-approvals">
      <div class="page-header">
        <div><h1 class="page-title">Aprovações</h1><p class="page-subtitle">Documentos aguardando sua ação</p></div>
        <div class="page-actions"><button class="btn btn-secondary">Delegar</button></div>
      </div>
      <div class="approval-list" id="approval-list"></div>
    </div>

    <!-- CONTRATOS — contracts.module.js -->
    <div class="page" id="page-contracts">
      <div id="contracts-module-container"></div>
    </div>

    <!-- NOTAS FISCAIS — invoices.module.js -->
    <div class="page" id="page-invoices">
      <div id="invoices-module-container"></div>
    </div>

    <!-- FORNECEDORES -->
    <div class="page" id="page-suppliers">
      <div class="page-header">
        <div><h1 class="page-title">Fornecedores</h1><p class="page-subtitle" id="supplier-subtitle"></p></div>
        <div class="page-actions"><button class="btn btn-secondary">Importar CSV</button><button class="btn btn-primary" onclick="openModal('supplierModal')">+ Novo Fornecedor</button></div>
      </div>
      <div class="filter-bar">
        <div class="filter-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Buscar por nome, CNPJ..."></div>
        <select class="filter-select"><option>Todos os status</option><option>Aprovado</option><option>Homologando</option></select>
      </div>
      <div class="table-card">
        <table class="data-table">
          <thead><tr><th><input type="checkbox"></th><th>Fornecedor</th><th>CNPJ</th><th>Categoria</th><th>Score</th><th>Status</th><th>Contratos</th><th>Último Pedido</th><th></th></tr></thead>
          <tbody id="supplier-tbody"></tbody>
        </table>
        <div class="table-footer"><span class="table-info" id="supplier-info"></span></div>
      </div>
    </div>

    <!-- ANALYTICS -->
    <div class="page" id="page-analytics">
      <div class="page-header">
        <div><h1 class="page-title">Analytics</h1><p class="page-subtitle">Visibilidade do ciclo de compras</p></div>
        <div class="page-actions"><button class="btn btn-primary" onclick="toast('Relatório exportado!')">Exportar PDF</button></div>
      </div>
      <div class="analytics-grid">
        <div class="card"><div class="analytics-title">Savings Realizados</div><div class="analytics-big">R$ 213K</div><div class="analytics-sub">↑ 18% vs anterior</div><canvas id="savingsChart" height="80"></canvas></div>
        <div class="card"><div class="analytics-title">Lead Time Médio</div><div class="analytics-big">8,2 dias</div><div class="analytics-sub">↓ 1,4 dias vs anterior</div><canvas id="leadChart" height="80"></canvas></div>
        <div class="card"><div class="analytics-title">Compliance</div><div class="analytics-big">94,3%</div><div class="analytics-sub">↑ 1,3pp vs anterior</div><canvas id="complianceChart" height="80"></canvas></div>
        <div class="card"><div class="analytics-title">SRM Score</div><div class="analytics-big">8,1/10</div><div class="analytics-sub">↑ 0,3 vs anterior</div><canvas id="srmChart" height="80"></canvas></div>
      </div>
    </div>

    <!-- INTEGRAÇÕES -->
    <div class="page" id="page-integrations">
      <div class="page-header">
        <div><h1 class="page-title">Integrações</h1><p class="page-subtitle">Conecte o BidFlow ao Datasul e sistemas externos</p></div>
      </div>
      <div style="background:var(--amber-light);border:1px solid rgba(217,119,6,0.3);border-radius:10px;padding:12px 16px;margin-bottom:24px;font-size:13px;color:var(--amber);display:flex;gap:10px;align-items:center">
        <span style="font-size:16px">⚡</span>
        <span><strong>Modo demonstração ativo.</strong> Integrações marcadas como "Mock ativo" funcionam com dados simulados. Clique em qualquer card para ver endpoints, status de implementação e iniciar a configuração.</span>
      </div>
      <div class="integrations-grid" id="int-grid"></div>
    </div>


    <!-- USUÁRIOS & ACESSOS -->
    <div class="page" id="page-users">
      <div id="users-module-container"></div>
    </div>

    <!-- PORTAL FORNECEDOR PREVIEW -->
    <div class="page" id="page-portal-fornecedor-preview">
      <div class="page-header">
        <div>
          <h1 class="page-title">Portal do Fornecedor</h1>
          <p class="page-subtitle">Página exclusiva para fornecedores responderem cotações e enviarem NFs</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.open('portal-fornecedor/index.html','_blank')">Abrir Portal →</button>
        </div>
      </div>
      <div style="background:var(--navy-light);border:1px solid rgba(30,58,95,.2);border-radius:10px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:var(--navy)">
        🔗 O portal do fornecedor é uma página separada (<code>portal-fornecedor/index.html</code>).<br>
        O fornecedor acessa via link único enviado por e-mail + WhatsApp quando uma RFQ é aberta.
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px">
        <div class="card">
          <div style="font-size:22px;margin-bottom:8px">📧</div>
          <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:4px">Fluxo de Convite RFQ</div>
          <div style="font-size:12.5px;color:var(--text-3);line-height:1.6">
            1. Comprador cria RFQ e seleciona fornecedores<br>
            2. BidFlow gera link único por fornecedor<br>
            3. E-mail + WhatsApp enviados automaticamente<br>
            4. Fornecedor clica → vai direto para a cotação
          </div>
        </div>
        <div class="card">
          <div style="font-size:22px;margin-bottom:8px">✏️</div>
          <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:4px">No Portal do Fornecedor</div>
          <div style="font-size:12.5px;color:var(--text-3);line-height:1.6">
            • Visualiza itens e quantidade<br>
            • Informa preço unitário por item<br>
            • Define prazo, pagamento, garantia<br>
            • Envia proposta com 1 clique
          </div>
        </div>
        <div class="card">
          <div style="font-size:22px;margin-bottom:8px">📄</div>
          <div style="font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:4px">Notas Fiscais</div>
          <div style="font-size:12.5px;color:var(--text-3);line-height:1.6">
            • Fornecedor faz upload da NF (XML/PDF)<br>
            • BidFlow concilia NF × Pedido de Compra<br>
            • Sem integração SEFAZ — conciliação manual<br>
            • Comprador valida e aprova pagamento
          </div>
        </div>
      </div>
      <!-- Preview iframe -->
      <div class="card" style="padding:0;overflow:hidden">
        <div style="background:var(--bg-3);padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
          <div style="display:flex;gap:6px"><div style="width:10px;height:10px;border-radius:50%;background:#ff5f57"></div><div style="width:10px;height:10px;border-radius:50%;background:#febc2e"></div><div style="width:10px;height:10px;border-radius:50%;background:#28c840"></div></div>
          <span style="font-size:12px;color:var(--text-3);flex:1;text-align:center">portal-fornecedor/index.html</span>
          <button class="btn btn-secondary btn-sm" onclick="window.open('portal-fornecedor/index.html','_blank')">Abrir em nova aba ↗</button>
        </div>
        <iframe src="portal-fornecedor/index.html" style="width:100%;height:600px;border:none;display:block" title="Portal Fornecedor Preview"></iframe>
      </div>
    </div>
  </div>
</main>

<!-- MODALS -->
<div class="modal-overlay" id="rfqModal" onclick="closeModal('rfqModal')">
  <div class="modal" onclick="event.stopPropagation()">
    <div class="modal-header"><h2>Nova Cotação (RFQ)</h2><button class="modal-close" onclick="closeModal('rfqModal')">✕</button></div>
    <div class="modal-body">
      <div class="form-group"><label>Título da Cotação</label><input type="text" class="form-input" placeholder="Ex: Notebooks para TI — Q2 2026"></div>
      <div class="form-row">
        <div class="form-group"><label>Prazo de Resposta</label><input type="datetime-local" class="form-input"></div>
        <div class="form-group"><label>Moeda</label><select class="form-input"><option>BRL — Real</option><option>USD — Dólar</option></select></div>
      </div>
      <div class="form-group"><label>Fornecedores Convidados</label>
        <div class="multi-select"><span class="multi-tag">TechSupply <button>×</button></span><span class="multi-tag">DataMax <button>×</button></span><input type="text" placeholder="Adicionar..."></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('rfqModal')">Cancelar</button>
      <button class="btn btn-secondary">Salvar Rascunho</button>
      <button class="btn btn-primary" onclick="closeModal('rfqModal');toast('RFQ enviado para fornecedores!')">Enviar RFQ</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="supplierModal" onclick="closeModal('supplierModal')">
  <div class="modal" onclick="event.stopPropagation()">
    <div class="modal-header"><h2>Cadastrar Fornecedor</h2><button class="modal-close" onclick="closeModal('supplierModal')">✕</button></div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group"><label>Razão Social</label><input type="text" class="form-input" placeholder="Nome da empresa"></div>
        <div class="form-group"><label>CNPJ</label><input type="text" class="form-input" placeholder="00.000.000/0000-00"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Categoria</label><select class="form-input"><option>TI & Tecnologia</option><option>MRO</option><option>Serviços</option><option>Logística</option></select></div>
        <div class="form-group"><label>E-mail Comercial</label><input type="email" class="form-input" placeholder="contato@fornecedor.com"></div>
      </div>
      <div class="form-group"><label>Documentos</label>
        <div class="upload-zone"><svg viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg><span>Arraste ou clique para enviar</span><span style="font-size:11px;color:var(--text-3)">Contrato social, certidões · PDF</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('supplierModal')">Cancelar</button>
      <button class="btn btn-primary" onclick="closeModal('supplierModal');toast('Fornecedor enviado para homologação!')">Iniciar Homologação</button>
    </div>
  </div>
</div>

<div class="modal-overlay" id="reqModal" onclick="closeModal('reqModal')">
  <div class="modal" style="width:600px" onclick="event.stopPropagation()">
    <div class="modal-header">
      <h2 id="req-modal-title">Nova Requisição de Compra</h2>
      <button class="modal-close" onclick="closeModal('reqModal')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-section-title">Identificação</div>
      <div class="form-group">
        <label>Título / Descrição Resumida *</label>
        <input type="text" class="form-input" id="req-f-titulo" placeholder="Ex: 10 Notebooks Dell i7 para equipe de TI">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Centro de Custo *</label>
          <select class="form-input" id="req-f-cc">
            <option value="">Selecione...</option>
            <option>TI & Tecnologia</option>
            <option>Administrativo</option>
            <option>Produção</option>
            <option>Logística</option>
            <option>RH</option>
            <option>Financeiro</option>
            <option>Manutenção</option>
          </select>
        </div>
        <div class="form-group">
          <label>Categoria do Item</label>
          <select class="form-input" id="req-f-cat">
            <option value="">Selecione...</option>
            <option>TI & Tecnologia</option>
            <option>MRO</option>
            <option>Serviços</option>
            <option>Material de Escritório</option>
            <option>Mobiliário</option>
            <option>Equipamentos</option>
            <option>Outros</option>
          </select>
        </div>
      </div>

      <div class="form-section-title">Itens Solicitados</div>
      <div id="req-items-list">
        <div class="req-item-row">
          <input type="text" class="form-input" placeholder="Descrição do item" style="font-size:12.5px">
          <input type="number" class="form-input" placeholder="Qtd." min="1" value="1" style="font-size:12.5px">
          <input type="text" class="form-input" placeholder="Unid." style="font-size:12.5px">
          <input type="number" class="form-input" placeholder="R$ unit." style="font-size:12.5px" oninput="calcReqTotal()">
          <button class="req-item-del" onclick="removeReqItem(this)">×</button>
        </div>
      </div>
      <button class="items-add-btn" onclick="addReqItem()">+ Adicionar item</button>
      <div style="text-align:right;margin-top:8px;font-size:13px;color:var(--text-2)">
        Total estimado: <strong id="req-total-display">R$ 0</strong>
      </div>

      <div class="form-section-title">Detalhes da Solicitação</div>
      <div class="form-row">
        <div class="form-group">
          <label>Prioridade *</label>
          <select class="form-input" id="req-f-prio">
            <option value="Alta">Alta — urgente</option>
            <option value="Média" selected>Média — planejado</option>
            <option value="Baixa">Baixa — pode aguardar</option>
          </select>
        </div>
        <div class="form-group">
          <label>Data Necessária</label>
          <input type="date" class="form-input" id="req-f-data">
        </div>
      </div>
      <div class="form-group">
        <label>Justificativa *</label>
        <textarea class="form-input" id="req-f-just" rows="3" placeholder="Descreva o motivo da compra e o impacto se não realizada..."></textarea>
      </div>
      <div class="form-group">
        <label>Fornecedor Sugerido (opcional)</label>
        <input type="text" class="form-input" id="req-f-forn" placeholder="Nome do fornecedor preferido, se houver">
      </div>
      <div class="form-group">
        <label>Anexos (cotações, specs)</label>
        <div class="upload-zone" onclick="toast('Upload disponível após integração com backend')">
          <svg viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          <span>Arraste ou clique para anexar</span>
          <span style="font-size:11px;color:var(--text-3)">PDF, XLSX, imagens · max 10MB</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('reqModal')">Cancelar</button>
      <button class="btn btn-secondary" onclick="saveReqDraft()">Salvar Rascunho</button>
      <button class="btn btn-primary" onclick="submitReq()">Enviar para Aprovação</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<script>
// ============================================================
// MOCK DATA — substituir por fetch() ao integrar com Datasul
// ============================================================
const MOCK = {
  kpis: { pedidosAbertos:38, aguardandoAprovacao:7, economizadoMes:48400, fornecedoresAtivos:142 },
  spendMensal: {
    labels:['Out','Nov','Dez','Jan','Fev','Mar'],
    ti:[142,160,120,185,145,168], mro:[65,70,58,82,75,90],
    servicos:[88,92,85,100,95,112], logistica:[40,35,42,50,38,47]
  },
  alertas:[
    {tipo:'red',  icone:'⚠',titulo:'NF 4521 vencida há 3 dias',    sub:'Fornecedor: TechSupply LTDA',  acao:'Resolver'},
    {tipo:'amber',icone:'🕐',titulo:'Cotação expira em 2h',         sub:'RFQ-2024-0891 · 3 fornecedores',acao:'Ver'},
    {tipo:'amber',icone:'📋',titulo:'Aprovação pendente — Diretoria',sub:'PC-2024-1102 · R$ 87.400',     acao:'Aprovar'},
    {tipo:'blue', icone:'🚚',titulo:'Entrega atrasada 1 dia',        sub:'PO-2024-0774 · Logística',     acao:'Rastrear'}
  ],
  topFornecedores:[
    {sigla:'TS',nome:'TechSupply LTDA',   valor:142000,pct:90,pos:'gold'},
    {sigla:'OP',nome:'OfficePro Express', valor:98000, pct:65,pos:'silver'},
    {sigla:'LG',nome:'LogiMaster',        valor:67000, pct:45,pos:'bronze'},
    {sigla:'SE',nome:'Segurity Engenharia',valor:43000,pct:30,pos:''}
  ],
  atividades:[
    {cor:'green',texto:'<strong>PC-1104</strong> aprovado por <strong>Carlos Mendes</strong>',tempo:'há 12 min'},
    {cor:'blue', texto:'Nova cotação recebida de <strong>TechSupply</strong> — RFQ-891',      tempo:'há 43 min'},
    {cor:'amber',texto:'<strong>REQ-2204</strong> criada por <strong>Ana Ferreira</strong>',  tempo:'há 1h'},
    {cor:'red',  texto:'Contrato <strong>CNT-0045</strong> vence em 15 dias',                 tempo:'há 2h'},
    {cor:'green',texto:'NF <strong>4520</strong> conciliada automaticamente',                  tempo:'há 3h'}
  ],
  requisicoes:[
    {id:'REQ-2204',descricao:'10 Notebooks Dell i7 16GB',solicitante:'Ana Ferreira · TI',valor:72000,prioridade:'Alta',status:'Em análise',cc:'TI & Tecnologia',categoria:'Equipamentos',data:'17 Mar 2026',dataNecessaria:'31/03/2026',justificativa:'Os notebooks atuais da equipe de TI têm mais de 5 anos e impactam diretamente a produtividade. Necessários para onboarding de 10 novos colaboradores em abril.',fornecedorSugerido:'TechSupply LTDA',itens:[{desc:'Notebook Dell i7 16GB 512SSD',qtd:10,unit:'UN',valor:6800},{desc:'Mouse sem fio',qtd:10,unit:'UN',valor:89},{desc:'Suporte ergonômico',qtd:10,unit:'UN',valor:150}]},
    {id:'REQ-2203',descricao:'Mobiliário Sala de Reuniões',solicitante:'Carlos Mendes · ADM',valor:18500,prioridade:'Média',status:'Aprovada',cc:'Administrativo',categoria:'Mobiliário',data:'15 Mar 2026',dataNecessaria:'15/04/2026',justificativa:'Reforma da sala de reuniões principal. Mobiliário atual está deteriorado e não comporta mais de 6 pessoas.',itens:[{desc:'Mesa de reunião 8 lugares',qtd:1,unit:'UN',valor:8500},{desc:'Cadeira executiva',qtd:8,unit:'UN',valor:850},{desc:'Painel acústico',qtd:4,unit:'UN',valor:600}]},
    {id:'REQ-2202',descricao:'Licenças Antivírus (50 users)',solicitante:'João Souza · TI',valor:4200,prioridade:'Baixa',status:'Concluída',cc:'TI & Tecnologia',categoria:'Software',data:'10 Mar 2026',dataNecessaria:'31/03/2026',justificativa:'Renovação anual das licenças de antivírus corporativo. Licenças vencem em 31/03.',itens:[{desc:'Licença Kaspersky Business 1 ano',qtd:50,unit:'UN',valor:84}]},
    {id:'REQ-2201',descricao:'Materiais de Higiene Industrial',solicitante:'Paula Lima · Produção',valor:9800,prioridade:'Média',status:'Em análise',cc:'Produção',categoria:'MRO',data:'14 Mar 2026',dataNecessaria:'25/03/2026',justificativa:'Reposição mensal de materiais de higiene para linha de produção. Estoque abaixo do nível mínimo.',itens:[{desc:'Sabão industrial 5L',qtd:24,unit:'CX',valor:180},{desc:'Luvas nitrila M',qtd:10,unit:'CX',valor:82},{desc:'Álcool gel 5L',qtd:12,unit:'UN',valor:95}]},
    {id:'REQ-2200',descricao:'Impressoras HP LaserJet',solicitante:'Marcos Silva · ADM',valor:7400,prioridade:'Baixa',status:'Aprovada',cc:'Administrativo',categoria:'Equipamentos',data:'08 Mar 2026',dataNecessaria:'30/04/2026',justificativa:'Substituição de 2 impressoras com defeito no setor administrativo.',itens:[{desc:'Impressora HP LaserJet Pro M404n',qtd:2,unit:'UN',valor:3200},{desc:'Toner HP CF259A',qtd:4,unit:'UN',valor:250}]}
  ],
  rfqs:[
    {
      id:'RFQ-2024-0891', titulo:'Notebooks e Periféricos TI',
      status:'Em andamento', vence:'2026-03-20T18:00', prazo:'20/03/2026 18:00',
      respostas:3, totalFornecedores:5, valorEstimado:45000, pct:60,
      requisicaoOrigem:'REQ-2204', comprador:'Ana Ferreira',
      cc:'TI & Tecnologia', categoria:'Equipamentos',
      observacoes:'Solicitar garantia mínima de 12 meses. Preferência por entrega em até 15 dias úteis.',
      // [Datasul] POST /dts/datasul-rest/resources/prg/mcc/v1/purchQuotationPublic
      // [Datasul] GET  /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic
      itens:[
        {id:1, desc:'Notebook Dell i7 16GB 512SSD', qtd:10, unid:'UN', valorRef:7000},
        {id:2, desc:'Mouse sem fio Logitech M330',  qtd:20, unid:'UN', valorRef:95},
        {id:3, desc:'Monitor 27" 4K LG UHD',        qtd:5,  unid:'UN', valorRef:2200}
      ],
      fornecedoresConvidados:[
        {id:'F1', nome:'TechSupply LTDA',    cnpj:'12.345.678/0001-90', contato:'vendas@techsupply.com.br',  status:'Respondeu'},
        {id:'F2', nome:'DataMax Informática',cnpj:'23.456.789/0001-01', contato:'comercial@datamax.com.br',  status:'Respondeu'},
        {id:'F3', nome:'InfoCorp Solutions', cnpj:'34.567.890/0001-12', contato:'rh@infocorp.com.br',        status:'Respondeu'},
        {id:'F4', nome:'ByteStore',          cnpj:'45.678.901/0001-23', contato:'compras@bytestore.com.br',  status:'Aguardando'},
        {id:'F5', nome:'CompuMax',           cnpj:'56.789.012/0001-34', contato:'vendas@compumax.com.br',    status:'Aguardando'}
      ],
      propostas:[
        {fornId:'F1', fornNome:'TechSupply',  recebida:'16/03 14h', validade:'30/03/2026', prazoEntrega:'10 dias úteis', frete:'Incluso',  condicaoPagto:'30 ddl', garantia:'12 meses',
         itens:[{id:1,valor:7200,obs:''},{id:2,valor:89,obs:''},{id:3,valor:2100,obs:'Modelo LG27UL550'}]},
        {fornId:'F2', fornNome:'DataMax',     recebida:'16/03 16h', validade:'28/03/2026', prazoEntrega:'12 dias úteis', frete:'R$ 350',   condicaoPagto:'28 ddl', garantia:'12 meses',
         itens:[{id:1,valor:7650,obs:''},{id:2,valor:89,obs:''},{id:3,valor:1980,obs:'Modelo Samsung 27"'}]},
        {fornId:'F3', fornNome:'InfoCorp',    recebida:'17/03 09h', validade:'25/03/2026', prazoEntrega:'15 dias úteis', frete:'Incluso',  condicaoPagto:'21 ddl', garantia:'6 meses',
         itens:[{id:1,valor:7950,obs:''},{id:2,valor:110,obs:''},{id:3,valor:2250,obs:''}]}
      ],
      historico:[
        {data:'14/03 10h', acao:'RFQ criada',           user:'Ana Ferreira',  cor:'blue'},
        {data:'14/03 10h', acao:'5 fornecedores convidados',user:'Ana Ferreira',cor:'blue'},
        {data:'15/03 14h', acao:'TechSupply visualizou o RFQ', user:'Sistema',cor:'gray'},
        {data:'16/03 14h', acao:'TechSupply enviou proposta',  user:'Sistema',cor:'green'},
        {data:'16/03 16h', acao:'DataMax enviou proposta',     user:'Sistema',cor:'green'},
        {data:'17/03 09h', acao:'InfoCorp enviou proposta',    user:'Sistema',cor:'green'},
        {data:'17/03 11h', acao:'Lembrete enviado para ByteStore e CompuMax', user:'Sistema',cor:'amber'}
      ]
    },
    {
      id:'RFQ-2024-0890', titulo:'Serviços de Limpeza — Contrato Anual',
      status:'Análise', vence:'2026-03-15T18:00', prazo:'15/03/2026 — Encerrado',
      respostas:4, totalFornecedores:4, valorEstimado:120000, pct:100,
      requisicaoOrigem:'REQ-2199', comprador:'Carlos Mendes',
      cc:'Administrativo', categoria:'Serviços',
      observacoes:'Contrato anual com visitas diárias. Incluso material de limpeza.',
      itens:[
        {id:1, desc:'Limpeza diária escritórios (12 meses)', qtd:1, unid:'CONTRATO', valorRef:100000},
        {id:2, desc:'Material de limpeza mensal',            qtd:12,unid:'KIT',      valorRef:1500}
      ],
      fornecedoresConvidados:[
        {id:'F6', nome:'LimpFácil Serviços', cnpj:'67.890.123/0001-45', contato:'licitacao@limpfacil.com.br', status:'Respondeu'},
        {id:'F7', nome:'CleanPro',           cnpj:'78.901.234/0001-56', contato:'vendas@cleanpro.com.br',     status:'Respondeu'},
        {id:'F8', nome:'HigieneMax',         cnpj:'89.012.345/0001-67', contato:'rh@higienemax.com.br',       status:'Respondeu'},
        {id:'F9', nome:'ServiLimpo LTDA',    cnpj:'90.123.456/0001-78', contato:'adm@servilimpo.com.br',      status:'Respondeu'}
      ],
      propostas:[
        {fornId:'F6', fornNome:'LimpFácil',  recebida:'14/03 10h', validade:'30/03/2026', prazoEntrega:'Imediato', frete:'—', condicaoPagto:'30 ddl', garantia:'—',
         itens:[{id:1,valor:96000,obs:''},{id:2,valor:1200,obs:'Material incluso'}]},
        {fornId:'F7', fornNome:'CleanPro',   recebida:'14/03 14h', validade:'31/03/2026', prazoEntrega:'Imediato', frete:'—', condicaoPagto:'28 ddl', garantia:'—',
         itens:[{id:1,valor:102000,obs:''},{id:2,valor:1400,obs:''}]},
        {fornId:'F8', fornNome:'HigieneMax', recebida:'13/03 11h', validade:'28/03/2026', prazoEntrega:'Imediato', frete:'—', condicaoPagto:'30 ddl', garantia:'—',
         itens:[{id:1,valor:98000,obs:''},{id:2,valor:1300,obs:''}]},
        {fornId:'F9', fornNome:'ServiLimpo', recebida:'15/03 09h', validade:'30/03/2026', prazoEntrega:'5 dias',   frete:'—', condicaoPagto:'30 ddl', garantia:'—',
         itens:[{id:1,valor:94000,obs:'10% desc. pagto antecipado'},{id:2,valor:1100,obs:''}]}
      ],
      historico:[
        {data:'10/03 09h', acao:'RFQ criada',            user:'Carlos Mendes',cor:'blue'},
        {data:'10/03 09h', acao:'4 fornecedores convidados', user:'Carlos Mendes',cor:'blue'},
        {data:'13/03 11h', acao:'HigieneMax enviou proposta', user:'Sistema',   cor:'green'},
        {data:'14/03 10h', acao:'LimpFácil enviou proposta',  user:'Sistema',   cor:'green'},
        {data:'14/03 14h', acao:'CleanPro enviou proposta',   user:'Sistema',   cor:'green'},
        {data:'15/03 09h', acao:'ServiLimpo enviou proposta', user:'Sistema',   cor:'green'},
        {data:'15/03 18h', acao:'RFQ encerrada automaticamente',user:'Sistema', cor:'amber'}
      ]
    },
    {
      id:'RFQ-2024-0892', titulo:'Material de Escritório Q2',
      status:'Rascunho', vence:'', prazo:'Não enviado',
      respostas:0, totalFornecedores:0, valorEstimado:8000, pct:0,
      requisicaoOrigem:'REQ-2200', comprador:'Marcos Silva',
      cc:'Administrativo', categoria:'Material de Escritório',
      observacoes:'',
      itens:[
        {id:1, desc:'Papel A4 resma 500fls', qtd:50, unid:'CX', valorRef:35},
        {id:2, desc:'Caneta esferográfica',   qtd:100,unid:'CX', valorRef:12},
        {id:3, desc:'Grampeador médio',       qtd:10, unid:'UN', valorRef:45}
      ],
      fornecedoresConvidados:[],
      propostas:[],
      historico:[
        {data:'08/03 15h', acao:'Rascunho criado', user:'Marcos Silva', cor:'gray'}
      ]
    }
  ],
  pedidos:[
    {id:'PC-2024-1108',titulo:'Equipamentos de Segurança',   fornecedor:'Segurity Eng.', valor:12400,status:'Rascunho', urgente:false},
    {id:'PC-2024-1107',titulo:'Suprimentos TI',              fornecedor:'TechSupply',    valor:8900, status:'Rascunho', urgente:false},
    {id:'PC-2024-1104',titulo:'Servidor Dell PowerEdge R740',fornecedor:'TechSupply',    valor:87400,status:'Aprovacao',urgente:true},
    {id:'PC-2024-1103',titulo:'Material Elétrico',           fornecedor:'ElectroPro',    valor:4200, status:'Aprovacao',urgente:false},
    {id:'PC-2024-1102',titulo:'Licenças Microsoft 365',      fornecedor:'TechSupply',    valor:24000,status:'Aprovado', urgente:false},
    {id:'PC-2024-1101',titulo:'Mobiliário Escritório',       fornecedor:'FurniCorp',     valor:18700,status:'Aprovado', urgente:false},
    {id:'PC-2024-1099',titulo:'Cabos e Conectores',          fornecedor:'CableWorld',    valor:3100, status:'Transito', urgente:false},
    {id:'PC-2024-1095',titulo:'Impressoras HP A4',           fornecedor:'OfficePro',     valor:6800, status:'Recebido', urgente:false}
  ],
  aprovacoes:[
    {id:'PC-2024-1104',tipo:'Pedido de Compra',valor:87400, solicitante:'Maria Ribeiro',fornecedor:'TechSupply', alca:'Diretoria',prazo:'Hoje 18h',urgente:true},
    {id:'PC-2024-1103',tipo:'Pedido de Compra',valor:4200,  solicitante:'João Souza',   fornecedor:'ElectroPro', alca:'Gerência', prazo:'Amanhã',  urgente:false},
    {id:'RFQ-0891',    tipo:'Cotação',         valor:45000, solicitante:'Ana Ferreira', fornecedor:'TechSupply', alca:'Gerência', prazo:'Hoje 18h',urgente:true},
    {id:'CNT-0049',    tipo:'Contrato',        valor:96000, solicitante:'Carlos Mendes',fornecedor:'LogiMaster', alca:'Diretoria',prazo:'17/03',   urgente:false},
    {id:'REQ-2204',    tipo:'Requisição',      valor:72000, solicitante:'Ana Ferreira', fornecedor:'—',          alca:'Gerência', prazo:'Sem prazo',urgente:false}
  ],
  contratos:[
    {id:'CNT-0048',fornecedor:'TechSupply LTDA',   objeto:'Suporte TI mensal',     valor:8500,  inicio:'01/01/2026',fim:'31/12/2026',status:'Ativo'},
    {id:'CNT-0047',fornecedor:'OfficePro Express', objeto:'Fornecimento MRO',      valor:45000, inicio:'01/02/2026',fim:'31/01/2027',status:'Ativo'},
    {id:'CNT-0046',fornecedor:'LogiMaster',        objeto:'Transporte regional',   valor:72000, inicio:'01/03/2026',fim:'28/02/2027',status:'Ativo'},
    {id:'CNT-0045',fornecedor:'Segurity Engenharia',objeto:'Segurança patrimonial',valor:120000,inicio:'01/04/2025',fim:'31/03/2026',status:'Vencendo'}
  ],
  notasFiscais:[
    {num:'NF-4522',fornecedor:'TechSupply LTDA',  pedido:'PC-2024-1095',valor:6800, emissao:'10/03/2026',status:'Conciliada',matching:'OK'},
    {num:'NF-4521',fornecedor:'OfficePro Express',pedido:'PC-2024-1088',valor:3200, emissao:'01/03/2026',status:'Vencida',   matching:'Pendente'},
    {num:'NF-4520',fornecedor:'LogiMaster',       pedido:'PC-2024-1090',valor:9100, emissao:'08/03/2026',status:'Conciliada',matching:'OK'},
    {num:'NF-4519',fornecedor:'FurniCorp',        pedido:'PC-2024-1101',valor:18700,emissao:'14/03/2026',status:'Aguardando',matching:'Pendente'}
  ],
  fornecedores:[
    {sigla:'TS',nome:'TechSupply LTDA',        cnpj:'12.345.678/0001-90',categoria:'TI & Tecnologia',catClass:'chip-blue',  score:9.2,status:'Aprovado',   statusClass:'status-green',contratos:'3 ativos', ultimo:'12 Mar 2026',cor:''},
    {sigla:'OP',nome:'OfficePro Express',       cnpj:'98.765.432/0001-11',categoria:'MRO',            catClass:'chip-amber', score:8.5,status:'Aprovado',   statusClass:'status-green',contratos:'1 ativo',  ultimo:'10 Mar 2026',cor:'amber'},
    {sigla:'LM',nome:'LogiMaster',              cnpj:'55.111.222/0001-33',categoria:'Logística',      catClass:'chip-green', score:7.0,status:'Homologando',statusClass:'status-amber',contratos:'—',        ultimo:'08 Mar 2026',cor:'green'},
    {sigla:'SE',nome:'Segurity Engenharia',     cnpj:'33.444.555/0001-77',categoria:'Serviços',       catClass:'chip-purple',score:8.1,status:'Aprovado',   statusClass:'status-green',contratos:'2 ativos', ultimo:'05 Mar 2026',cor:''},
    {sigla:'EP',nome:'ElectroPro Materiais',    cnpj:'77.888.999/0001-22',categoria:'MRO',            catClass:'chip-amber', score:6.8,status:'Homologando',statusClass:'status-amber',contratos:'—',        ultimo:'01 Mar 2026',cor:'amber'},
    {sigla:'FC',nome:'FurniCorp Design',        cnpj:'44.333.111/0001-55',categoria:'Serviços',       catClass:'chip-purple',score:7.9,status:'Aprovado',   statusClass:'status-green',contratos:'1 ativo',  ultimo:'28 Fev 2026',cor:'green'}
  ],
  integracoes:[
    {cat:'ERP & Financeiro',icon:'🏦',itens:[
      {logo:'DS', logoClass:'sap', nome:'TOTVS Datasul',      desc:'Módulo MCC — ordens, pedidos, cotações', status:'pending', tag:'Fase 3',
       detalhes:'Integração via REST API · endpoint purchOrderPublic · módulo MCC · requer liberação TI Razzo',
       endpoints:['GET /mcc/v1/purchOrderPublic','POST /mcc/v1/purchQuotationPublic','GET /mcc/v1/purchOrderLinePublic'],
       responsavel:'TI Razzo'},
      {logo:'SAP',logoClass:'sap', nome:'SAP S/4HANA',         desc:'Pedidos de compra, NFs, contabilidade',  status:'idle', tag:'Opcional',
       detalhes:'Integração via SAP OData API · módulos MM (compras) e FI (financeiro)',
       endpoints:['OData /sap/opu/odata/sap/MM_PUR_ORDERSV2_SRV','OData /sap/opu/odata/sap/API_SUPPLIER_SRV'],
       responsavel:'TI cliente'},
      {logo:'OR', logoClass:'sap', nome:'Oracle EBS',           desc:'Procurement e financeiro',              status:'idle', tag:'Opcional',
       detalhes:'Integração via Oracle REST Data Services (ORDS)',
       endpoints:['REST /ords/r/oracle/procurement/purchase-orders'],
       responsavel:'TI cliente'}
    ]},
    {cat:'Fiscal & Compliance',icon:'🏛️',itens:[
      {logo:'NF-e',logoClass:'nfe',nome:'SEFAZ / NF-e',         desc:'Validação automática de notas fiscais',  status:'mock', tag:'Mock ativo',
       detalhes:'Consulta de NF-e via WebService SEFAZ · validação de chave de acesso · status de autorização · cancelamento',
       endpoints:['SOAP nfeConsultaProtocolo','SOAP nfeStatusServico','SOAP nfeConsultaCadastro'],
       responsavel:'Dev BidFlow'},
      {logo:'SER',logoClass:'nfe', nome:'SERPRO / SICAF',        desc:'Consulta cadastros PJ e certidões',     status:'idle', tag:'Disponível',
       detalhes:'API SERPRO · consulta CNPJ, situação fiscal, certidões negativas de débito',
       endpoints:['REST /consulta-cnpj/v1/{cnpj}','REST /certidao/v1/{cnpj}'],
       responsavel:'Dev BidFlow'}
    ]},
    {cat:'Comunicação',icon:'💬',itens:[
      {logo:'WA', logoClass:'wa',  nome:'WhatsApp Business',     desc:'Alertas de RFQ e pedidos a fornecedores',status:'mock', tag:'Mock ativo',
       detalhes:'Meta Cloud API · envio de mensagens template para fornecedores · confirmação de cotações e pedidos',
       endpoints:['POST /v17.0/{phone-id}/messages','GET /v17.0/{phone-id}/message_templates'],
       responsavel:'Dev BidFlow'},
      {logo:'📧', logoClass:'',    nome:'E-mail / SMTP',          desc:'Notificações automáticas do sistema',   status:'mock', tag:'Mock ativo',
       detalhes:'SendGrid ou SMTP corporativo · templates de RFQ, aprovação, vencimento de contrato',
       endpoints:['REST POST /v3/mail/send (SendGrid)','SMTP TLS port 587'],
       responsavel:'Dev BidFlow'},
      {logo:'SL', logoClass:'',    nome:'Slack / MS Teams',       desc:'Alertas internos para compradores',     status:'idle', tag:'Disponível',
       detalhes:'Slack Incoming Webhooks ou Teams Connectors · alertas de aprovações pendentes e urgências',
       endpoints:['POST webhook.slack.com/services/...','POST outlook.office.com/webhook/...'],
       responsavel:'Dev BidFlow'}
    ]},
    {cat:'IA & Automação',icon:'🤖',itens:[
      {logo:'AI', logoClass:'ai',  nome:'Análise de Contratos IA',desc:'Extração e revisão de cláusulas',       status:'idle', tag:'Roadmap',
       detalhes:'LLM para análise automática de contratos · extração de datas, valores, SLAs, penalidades · alertas de cláusulas de risco',
       endpoints:['Anthropic Claude API · POST /v1/messages'],
       responsavel:'Dev BidFlow'},
      {logo:'AI', logoClass:'ai',  nome:'3-Way Matching IA',      desc:'NF × PO × Recebimento automático',      status:'idle', tag:'Roadmap',
       detalhes:'Comparação automática entre nota fiscal, pedido de compra e recebimento · detecção de divergências de valor, quantidade e fornecedor',
       endpoints:['Interno BidFlow · engine de reconciliação'],
       responsavel:'Dev BidFlow'}
    ]}
  ]
};

const brl = v => 'R$ ' + (v>=1000?(v/1000).toFixed(0)+'K':v.toLocaleString('pt-BR'));
const brlFull = v => 'R$ ' + v.toLocaleString('pt-BR',{minimumFractionDigits:2});

// ---- NAVIGATION ----
const pageNames = {dashboard:'Dashboard',requisitions:'Requisições',rfq:'Cotações (RFQ)',orders:'Pedidos de Compra',approvals:'Aprovações',contracts:'Contratos',invoices:'Notas Fiscais (Conciliação)',suppliers:'Fornecedores',analytics:'Analytics',integrations:'Integrações',users:'Usuários & Acessos','portal-fornecedor-preview':'Portal Fornecedor'};
let chartsInitted = {};

function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const page = document.getElementById('page-'+id);
  if(page) page.classList.add('active');
  const nav = document.querySelector(`[data-page="${id}"]`);
  if(nav) nav.classList.add('active');
  document.getElementById('breadcrumb').textContent = pageNames[id]||id;
  if(window.innerWidth<=900) document.getElementById('sidebar').classList.remove('open');
  if(!chartsInitted[id]) { renderCharts(id); chartsInitted[id]=true; }
}

document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click',e=>{e.preventDefault();showPage(item.dataset.page);});
});
document.getElementById('sidebarToggle').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));

// ---- MODALS ----
function openModal(id){document.getElementById(id).classList.add('open')}
function closeModal(id){document.getElementById(id).classList.remove('open')}
window.openModal=openModal;window.closeModal=closeModal;

// ---- TOAST ----
function toast(msg,dur=2800){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur)}
window.toast=toast;

// ---- RENDER DASHBOARD ----
function renderDashboard() {
  const now = new Date();
  const h = now.getHours();
  const greet = h<12?'Bom dia':'h<18?Boa tarde':'Boa noite';
  document.getElementById('dash-greeting').textContent = (h<12?'Bom dia':h<18?'Boa tarde':'Boa noite')+', Maria 👋';
  document.getElementById('dash-date').textContent = 'Aqui está o resumo de procurement de hoje — '+now.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});

  // KPIs
  const kpiDef=[
    {key:'pedidosAbertos',   label:'Pedidos em Aberto',      cls:'kpi-blue',  change:'up',  changeText:'+5 esta semana',
     icon:'<svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>'},
    {key:'aguardandoAprovacao',label:'Aguardando Aprovação', cls:'kpi-amber', change:'warn',changeText:'3 urgentes',
     icon:'<svg viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'},
    {key:'economizadoMes',   label:'Economizado (Mar)',       cls:'kpi-green', change:'up',  changeText:'↑ 12% vs fev',
     icon:'<svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'},
    {key:'fornecedoresAtivos',label:'Fornecedores Ativos',   cls:'kpi-purple',change:'up',  changeText:'6 novos',
     icon:'<svg viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'}
  ];
  document.getElementById('kpi-grid').innerHTML = kpiDef.map(k=>`
    <div class="kpi-card ${k.cls}">
      <div class="kpi-icon">${k.icon}</div>
      <div class="kpi-content">
        <span class="kpi-label">${k.label}</span>
        <span class="kpi-value">${k.key==='economizadoMes'?brl(MOCK.kpis[k.key]):MOCK.kpis[k.key]}</span>
        <span class="kpi-change ${k.change}">${k.changeText}</span>
      </div>
    </div>`).join('');

  // Alerts
  document.getElementById('alert-list').innerHTML = MOCK.alertas.map(a=>`
    <div class="alert-item alert-${a.tipo}">
      <div class="alert-icon">${a.icone}</div>
      <div class="alert-content"><span class="alert-title">${a.titulo}</span><span class="alert-sub">${a.sub}</span></div>
      <button class="btn btn-secondary btn-sm" onclick="toast('${a.acao} acionado!')">${a.acao}</button>
    </div>`).join('');

  // Top Suppliers
  document.getElementById('supplier-rank').innerHTML = MOCK.topFornecedores.map((s,i)=>`
    <div class="rank-item">
      <span class="rank-pos ${s.pos}">${i+1}</span>
      <div class="rank-avatar">${s.sigla}</div>
      <div class="rank-info">
        <span class="rank-name">${s.nome}</span>
        <div class="rank-bar-wrap"><div class="rank-bar" style="width:${s.pct}%"></div></div>
      </div>
      <span class="rank-value">${brl(s.valor)}</span>
    </div>`).join('');

  // Activity
  document.getElementById('activity-feed').innerHTML = MOCK.atividades.map(a=>`
    <div class="activity-item">
      <div class="activity-dot ${a.cor}"></div>
      <div class="activity-content">
        <span class="activity-text">${a.texto}</span>
        <span class="activity-time">${a.tempo}</span>
      </div>
    </div>`).join('');
}

// ---- REQUISIÇÕES — estado ----
let reqSelected = new Set();
let reqPage = 1;
const reqPerPage = 8;
let reqFiltered = [...MOCK.requisicoes];

const prioMap = {'Alta':'chip-red','Média':'chip-amber','Baixa':'chip-green'};
const prioColor = {'Alta':'#dc2626','Média':'#d97706','Baixa':'#16a34a'};
const stMap = {'Em análise':'status-amber','Aprovada':'status-blue','Concluída':'status-green','Cancelada':'status-red','Rascunho':'status-gray'};
const stIcon = {'Em análise':'⏳','Aprovada':'✓','Concluída':'✅','Cancelada':'✕','Rascunho':'✎'};
const approvalFlow = [
  {nivel:'Solicitante',papel:'Criação'},
  {nivel:'Gerência',papel:'1ª aprovação'},
  {nivel:'Compras',papel:'Análise técnica'},
  {nivel:'Diretoria',papel:'Aprovação final (>R$50K)'}
];

function renderRequisitions() {
  renderReqStats();
  filterReqs();
}

function renderReqStats() {
  const all = MOCK.requisicoes;
  const stats = [
    {label:'Total', val: all.length,                                color:'#1e3a5f', pct:100},
    {label:'Em análise', val: all.filter(r=>r.status==='Em análise').length, color:'#d97706', pct: Math.round(all.filter(r=>r.status==='Em análise').length/all.length*100)},
    {label:'Aprovadas', val: all.filter(r=>r.status==='Aprovada').length,    color:'#2563a8', pct: Math.round(all.filter(r=>r.status==='Aprovada').length/all.length*100)},
    {label:'Concluídas', val: all.filter(r=>r.status==='Concluída').length,  color:'#16a34a', pct: Math.round(all.filter(r=>r.status==='Concluída').length/all.length*100)}
  ];
  document.getElementById('req-stats').innerHTML = stats.map(s=>`
    <div class="req-stat">
      <span class="req-stat-val">${s.val}</span>
      <span class="req-stat-label">${s.label}</span>
      <div class="req-stat-bar"><div class="req-stat-fill" style="width:${s.pct}%;background:${s.color}"></div></div>
    </div>`).join('');
}

function filterReqs() {
  const search = (document.getElementById('req-search')||{}).value?.toLowerCase()||'';
  const status = (document.getElementById('req-filter-status')||{}).value||'';
  const prio   = (document.getElementById('req-filter-prio')||{}).value||'';
  const sort   = (document.getElementById('req-filter-sort')||{}).value||'date';

  reqFiltered = MOCK.requisicoes.filter(r=>{
    const matchSearch = !search || r.descricao.toLowerCase().includes(search) || r.solicitante.toLowerCase().includes(search) || r.id.toLowerCase().includes(search);
    const matchStatus = !status || r.status === status;
    const matchPrio   = !prio   || r.prioridade === prio;
    return matchSearch && matchStatus && matchPrio;
  });

  if(sort==='valor_desc') reqFiltered.sort((a,b)=>b.valor-a.valor);
  else if(sort==='valor_asc') reqFiltered.sort((a,b)=>a.valor-b.valor);
  else if(sort==='prio') { const o={'Alta':0,'Média':1,'Baixa':2}; reqFiltered.sort((a,b)=>o[a.prioridade]-o[b.prioridade]); }

  reqPage = 1;
  renderReqTable();
}

function renderReqTable() {
  const start = (reqPage-1)*reqPerPage;
  const paged = reqFiltered.slice(start, start+reqPerPage);

  if(!paged.length) {
    document.getElementById('req-tbody').innerHTML = `<tr><td colspan="9"><div class="req-empty">Nenhuma requisição encontrada para os filtros selecionados.</div></td></tr>`;
    document.getElementById('req-info').textContent = '0 resultados';
    document.getElementById('req-pagination').innerHTML = '';
    return;
  }

  document.getElementById('req-tbody').innerHTML = paged.map(r=>{
    const sel = reqSelected.has(r.id);
    const aprovPct = r.status==='Em análise'?33: r.status==='Aprovada'?66: r.status==='Concluída'?100:0;
    return `<tr class="req-row-clickable${sel?' selected':''}">
      <td><input type="checkbox" ${sel?'checked':''} onchange="toggleReqSel('${r.id}',this)" onclick="event.stopPropagation()"></td>
      <td onclick="openReqDetail('${r.id}')">
        <div class="text-mono" style="font-size:11px">${r.id}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px">${r.data||'17 Mar 2026'}</div>
      </td>
      <td onclick="openReqDetail('${r.id}')">
        <div style="font-weight:500;color:var(--text);font-size:13.5px">${r.descricao}</div>
        <div style="font-size:11.5px;color:var(--text-3);margin-top:2px">${r.categoria||'—'}</div>
      </td>
      <td onclick="openReqDetail('${r.id}')">
        <div style="font-size:13px">${r.solicitante.split('·')[0].trim()}</div>
        <div style="font-size:11px;color:var(--text-3)">${r.solicitante.split('·')[1]?.trim()||''}</div>
      </td>
      <td onclick="openReqDetail('${r.id}')" style="font-weight:600;color:var(--text)">${brl(r.valor)}</td>
      <td onclick="openReqDetail('${r.id}')">
        <span class="chip ${prioMap[r.prioridade]}">
          <span class="req-priority-dot" style="background:${prioColor[r.prioridade]}"></span>${r.prioridade}
        </span>
      </td>
      <td onclick="openReqDetail('${r.id}')"><span class="status-badge ${stMap[r.status]}">${stIcon[r.status]} ${r.status}</span></td>
      <td onclick="openReqDetail('${r.id}')">
        <div class="req-progress-wrap">
          <div class="req-progress-bar-outer"><div class="req-progress-bar-inner" style="width:${aprovPct}%;background:${aprovPct===100?'var(--green)':aprovPct>0?'var(--navy-mid)':'var(--bg-4)'}"></div></div>
          <span style="font-size:11px;color:var(--text-3);min-width:28px">${aprovPct}%</span>
        </div>
      </td>
      <td>
        <div class="action-btns" onclick="event.stopPropagation()">
          ${r.status==='Aprovada'?`<button class="btn btn-primary btn-sm" onclick="convertToRFQ('${r.id}')">→ RFQ</button>`:''}
          ${r.status==='Em análise'?`<button class="btn btn-secondary btn-sm" onclick="approveReq('${r.id}')">Aprovar</button>`:''}
        </div>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('req-info').textContent = `${reqFiltered.length} requisição${reqFiltered.length!==1?'ões':''} · página ${reqPage} de ${Math.ceil(reqFiltered.length/reqPerPage)}`;
  document.getElementById('req-subtitle').textContent = `${MOCK.requisicoes.length} requisições · ${MOCK.requisicoes.filter(r=>r.status==='Em análise').length} aguardando análise`;
  renderReqPagination();
}

function renderReqPagination() {
  const total = Math.ceil(reqFiltered.length/reqPerPage);
  if(total<=1){ document.getElementById('req-pagination').innerHTML=''; return; }
  let html = `<button class="page-btn" ${reqPage===1?'disabled':''} onclick="goReqPage(${reqPage-1})">‹</button>`;
  for(let i=1;i<=total;i++) html+=`<button class="page-btn${i===reqPage?' active':''}" onclick="goReqPage(${i})">${i}</button>`;
  html+=`<button class="page-btn" ${reqPage===total?'disabled':''} onclick="goReqPage(${reqPage+1})">›</button>`;
  document.getElementById('req-pagination').innerHTML = html;
}

function goReqPage(p){ reqPage=p; renderReqTable(); }

function toggleReqSel(id, cb) {
  if(cb.checked) reqSelected.add(id); else reqSelected.delete(id);
  updateBulkBar();
}

function toggleAllReqs(cb) {
  const paged = reqFiltered.slice((reqPage-1)*reqPerPage, reqPage*reqPerPage);
  paged.forEach(r=>{ if(cb.checked) reqSelected.add(r.id); else reqSelected.delete(r.id); });
  renderReqTable();
  updateBulkBar();
}

function updateBulkBar() {
  const bar = document.getElementById('req-bulk-bar');
  const n = reqSelected.size;
  bar.classList.toggle('show', n>0);
  document.getElementById('req-bulk-count').textContent = n + (n===1?' selecionada':' selecionadas');
}

function bulkAction(action) {
  const n = reqSelected.size;
  if(action==='rfq')     { toast(`${n} requisição${n>1?'ões':''} convertida${n>1?'s':''} em RFQ!`); showPage('rfq'); }
  if(action==='approve') { toast(`${n} requisição${n>1?'ões':''} aprovada${n>1?'s':''}! ✓`); reqSelected.clear(); updateBulkBar(); renderReqTable(); }
  if(action==='cancel')  { reqSelected.clear(); updateBulkBar(); renderReqTable(); }
}

// ── Detail panel ─────────────────────────────────────────────────────────────
function openReqDetail(id) {
  const r = MOCK.requisicoes.find(x=>x.id===id);
  if(!r) return;
  document.getElementById('detail-id').textContent = r.id + ' · ' + (r.data||'17 Mar 2026');
  document.getElementById('detail-title').textContent = r.descricao;
  const badge = document.getElementById('detail-status-badge');
  badge.textContent = r.status;
  badge.className = 'status-badge ' + (stMap[r.status]||'status-gray');

  const aprovPct = r.status==='Em análise'?33: r.status==='Aprovada'?66: r.status==='Concluída'?100:0;

  document.getElementById('req-detail-body').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Informações Gerais</div>
      <div class="req-field-grid">
        <div class="req-field"><span class="req-field-label">Solicitante</span><span class="req-field-value">${r.solicitante}</span></div>
        <div class="req-field"><span class="req-field-label">Centro de Custo</span><span class="req-field-value">${r.cc||'TI & Tecnologia'}</span></div>
        <div class="req-field"><span class="req-field-label">Categoria</span><span class="req-field-value">${r.categoria||'Equipamentos'}</span></div>
        <div class="req-field"><span class="req-field-label">Prioridade</span><span class="req-field-value"><span class="chip ${prioMap[r.prioridade]}">${r.prioridade}</span></span></div>
        <div class="req-field"><span class="req-field-label">Data Necessária</span><span class="req-field-value">${r.dataNecessaria||'31/03/2026'}</span></div>
        <div class="req-field"><span class="req-field-label">Valor Estimado</span><span class="req-field-value" style="color:var(--navy);font-size:15px">${brlFull(r.valor)}</span></div>
      </div>
    </div>

    <div class="req-detail-section">
      <div class="req-detail-section-title">Itens Solicitados</div>
      <table class="req-items-table">
        <thead><tr><th>Descrição</th><th>Qtd.</th><th>Unit.</th><th>Total</th></tr></thead>
        <tbody>
          ${(r.itens||[{desc:r.descricao,qtd:1,unit:'UN',valor:r.valor}]).map(i=>`
          <tr>
            <td>${i.desc||i.descricao||r.descricao}</td>
            <td>${i.qtd||1}</td>
            <td>${i.unit||'UN'}</td>
            <td style="font-weight:600">${brlFull(i.valor||r.valor)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="req-detail-section">
      <div class="req-detail-section-title">Justificativa</div>
      <p style="font-size:13.5px;color:var(--text-2);line-height:1.6">${r.justificativa||'Necessário para suporte às atividades operacionais do departamento. Equipamentos atuais estão obsoletos e impactando a produtividade da equipe.'}</p>
      ${r.fornecedorSugerido?`<div style="margin-top:10px;font-size:12.5px;color:var(--text-3)">Fornecedor sugerido: <strong style="color:var(--text)">${r.fornecedorSugerido}</strong></div>`:''}
    </div>

    <div class="req-detail-section">
      <div class="req-detail-section-title">Fluxo de Aprovação</div>
      <div style="margin-bottom:12px">
        <div class="req-progress-wrap" style="gap:10px">
          <div class="req-progress-bar-outer" style="height:6px"><div class="req-progress-bar-inner" style="width:${aprovPct}%;height:6px;background:${aprovPct===100?'var(--green)':'var(--navy-mid)'}"></div></div>
          <span style="font-size:12px;color:var(--text-3);font-weight:500">${aprovPct}% concluído</span>
        </div>
      </div>
      <div class="req-timeline">
        ${approvalFlow.map((a,i)=>{
          const done = (r.status==='Concluída')||(r.status==='Aprovada'&&i<2)||(r.status==='Em análise'&&i<1);
          const active = (r.status==='Em análise'&&i===1)||(r.status==='Aprovada'&&i===2);
          return `<div class="req-timeline-item">
            <div class="req-timeline-dot ${done?'green':active?'amber':'gray'}"></div>
            <div class="req-timeline-content">
              <div class="req-timeline-title">${a.nivel} <span style="font-weight:400;color:var(--text-3)">— ${a.papel}</span></div>
              <div class="req-timeline-sub">${done?'Aprovado':'active'===''?'':'Pendente'}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  const footerBtns = [];
  if(r.status==='Em análise') {
    footerBtns.push(`<button class="btn btn-secondary" onclick="rejectReq('${r.id}')">Reprovar</button>`);
    footerBtns.push(`<button class="btn btn-primary" onclick="approveReq('${r.id}')">✓ Aprovar</button>`);
  }
  if(r.status==='Aprovada') {
    footerBtns.push(`<button class="btn btn-primary" onclick="convertToRFQ('${r.id}')">→ Converter em RFQ</button>`);
  }
  footerBtns.push(`<button class="btn btn-secondary" onclick="editReq('${r.id}')">Editar</button>`);
  document.getElementById('req-detail-footer').innerHTML = footerBtns.join('');

  document.getElementById('reqDetailOverlay').classList.add('open');
}

function closeReqDetail(e) {
  if(!e||e.target===document.getElementById('reqDetailOverlay')) {
    document.getElementById('reqDetailOverlay').classList.remove('open');
  }
}

// ── Actions ──────────────────────────────────────────────────────────────────
function approveReq(id) {
  const r = MOCK.requisicoes.find(x=>x.id===id);
  if(r){ r.status='Aprovada'; toast('Requisição '+id+' aprovada! ✓'); renderRequisitions(); closeReqDetail(); }
}

function rejectReq(id) {
  const r = MOCK.requisicoes.find(x=>x.id===id);
  if(r){ r.status='Cancelada'; toast('Requisição '+id+' reprovada.'); renderRequisitions(); closeReqDetail(); }
}

function convertToRFQ(id) {
  toast('Requisição '+id+' convertida em RFQ! Redirecionando...');
  setTimeout(()=>showPage('rfq'), 1200);
  closeReqDetail();
}

function editReq(id) {
  toast('Edição da '+id+' — funcionalidade em breve');
}

// ── Modal nova requisição ────────────────────────────────────────────────────
function openReqModal() {
  document.getElementById('req-modal-title').textContent = 'Nova Requisição de Compra';
  document.getElementById('req-f-titulo').value='';
  document.getElementById('req-f-just').value='';
  document.getElementById('req-f-forn').value='';
  document.getElementById('req-items-list').innerHTML = buildItemRow();
  calcReqTotal();
  openModal('reqModal');
}

function buildItemRow() {
  return `<div class="req-item-row">
    <input type="text" class="form-input" placeholder="Descrição do item" style="font-size:12.5px">
    <input type="number" class="form-input" placeholder="Qtd." min="1" value="1" style="font-size:12.5px">
    <input type="text" class="form-input" placeholder="UN" style="font-size:12.5px">
    <input type="number" class="form-input" placeholder="R$ unit." style="font-size:12.5px" oninput="calcReqTotal()">
    <button class="req-item-del" onclick="removeReqItem(this)">×</button>
  </div>`;
}

function addReqItem() {
  document.getElementById('req-items-list').insertAdjacentHTML('beforeend', buildItemRow());
}

function removeReqItem(btn) {
  const rows = document.querySelectorAll('#req-items-list .req-item-row');
  if(rows.length>1) { btn.closest('.req-item-row').remove(); calcReqTotal(); }
  else toast('Mantenha ao menos 1 item');
}

function calcReqTotal() {
  let total = 0;
  document.querySelectorAll('#req-items-list .req-item-row').forEach(row=>{
    const inputs = row.querySelectorAll('input');
    const qtd   = parseFloat(inputs[1].value)||0;
    const unit  = parseFloat(inputs[3].value)||0;
    total += qtd * unit;
  });
  const el = document.getElementById('req-total-display');
  if(el) el.textContent = total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function saveReqDraft() {
  toast('Rascunho salvo! Você pode continuar depois.');
  closeModal('reqModal');
}

function submitReq() {
  const titulo = document.getElementById('req-f-titulo').value.trim();
  const cc     = document.getElementById('req-f-cc').value;
  const just   = document.getElementById('req-f-just').value.trim();
  if(!titulo){ toast('Preencha o título da requisição'); return; }
  if(!cc)    { toast('Selecione o centro de custo'); return; }
  if(!just)  { toast('Informe a justificativa'); return; }

  let total = 0;
  const itens = [];
  document.querySelectorAll('#req-items-list .req-item-row').forEach(row=>{
    const inputs = row.querySelectorAll('input');
    const desc=inputs[0].value||titulo, qtd=parseFloat(inputs[1].value)||1, unit=parseFloat(inputs[3].value)||0;
    total += qtd*unit;
    itens.push({desc,qtd,unit:'UN',valor:qtd*unit});
  });

  const newId = 'REQ-'+(2205+MOCK.requisicoes.length);
  MOCK.requisicoes.unshift({
    id:newId, descricao:titulo, solicitante:'Maria Ribeiro · '+cc,
    valor:total||1000, prioridade:document.getElementById('req-f-prio').value,
    status:'Em análise', cc, categoria:document.getElementById('req-f-cat').value||'Outros',
    data:'17 Mar 2026', dataNecessaria:document.getElementById('req-f-data').value||'31/03/2026',
    justificativa:just, fornecedorSugerido:document.getElementById('req-f-forn').value, itens
  });
  closeModal('reqModal');
  toast('Requisição '+newId+' criada e enviada para aprovação! ✓');
  renderRequisitions();
}

function exportReqCSV() {
  const rows = [['ID','Descrição','Solicitante','Valor','Prioridade','Status']];
  MOCK.requisicoes.forEach(r=>rows.push([r.id,r.descricao,r.solicitante,r.valor,r.prioridade,r.status]));
  const csv = rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
  a.download='requisicoes-bidflow.csv'; a.click();
  toast('CSV exportado!');
}

// ── RFQ state ────────────────────────────────────────────────────
let rfqFiltered = [...MOCK.rfqs];
let currentRFQ  = null;
let currentRFQTab = 'resumo';
let rfqModalStep = 1;

const rfqStatusMap = {
  'Rascunho'    :{cls:'status-gray', icon:'✎', color:'var(--text-3)'},
  'Em andamento':{cls:'status-blue', icon:'⏳', color:'var(--navy-mid)'},
  'Análise'     :{cls:'status-amber',icon:'🔍', color:'var(--amber)'},
  'Concluída'   :{cls:'status-green',icon:'✅', color:'var(--green)'},
  'Cancelada'   :{cls:'status-red',  icon:'✕', color:'var(--red)'}
};

// ── Render list ───────────────────────────────────────────────────
function renderRFQ() {
  renderRFQStats();
  filterRFQs();
}

function renderRFQStats() {
  const all = MOCK.rfqs;
  const totalValor = all.reduce((s,r)=>s+r.valorEstimado,0);
  const stats = [
    {label:'Total de RFQs',  val:all.length,                                           color:'#1e3a5f'},
    {label:'Em andamento',   val:all.filter(r=>r.status==='Em andamento').length,       color:'#2563a8'},
    {label:'Aguardando análise',val:all.filter(r=>r.status==='Análise').length,         color:'#d97706'},
    {label:'Valor total est.',val:brl(totalValor),                                      color:'#16a34a'}
  ];
  document.getElementById('rfq-stats').innerHTML = stats.map(s=>`
    <div class="rfq-stat">
      <span class="rfq-stat-val">${s.val}</span>
      <span class="rfq-stat-label">${s.label}</span>
      <div style="height:3px;border-radius:2px;background:${s.color};margin-top:8px;opacity:.4"></div>
    </div>`).join('');
}

function filterRFQs() {
  const search = (document.getElementById('rfq-search')||{}).value?.toLowerCase()||'';
  const status = (document.getElementById('rfq-filter-status')||{}).value||'';
  const sort   = (document.getElementById('rfq-filter-sort')||{}).value||'date';

  rfqFiltered = MOCK.rfqs.filter(r=>{
    const ms = !search || r.titulo.toLowerCase().includes(search)||r.id.toLowerCase().includes(search)||(r.comprador||'').toLowerCase().includes(search);
    const mst= !status || r.status===status;
    return ms && mst;
  });
  if(sort==='valor_desc') rfqFiltered.sort((a,b)=>b.valorEstimado-a.valorEstimado);
  if(sort==='respostas')  rfqFiltered.sort((a,b)=>b.respostas-a.respostas);

  document.getElementById('rfq-subtitle').textContent =
    `${MOCK.rfqs.length} cotações · ${MOCK.rfqs.filter(r=>r.status==='Em andamento').length} em andamento · ${MOCK.rfqs.filter(r=>r.status==='Análise').length} aguardando análise`;
  renderRFQList();
}

function renderRFQList() {
  const list = document.getElementById('rfq-list');
  if(!rfqFiltered.length){ list.innerHTML=`<div style="text-align:center;padding:48px;color:var(--text-3)">Nenhuma cotação encontrada.</div>`; return; }

  list.innerHTML = rfqFiltered.map(r=>{
    const st = rfqStatusMap[r.status]||rfqStatusMap['Rascunho'];
    const totalProp = calcRFQTotals(r);
    const hasProp = r.propostas.length>0;

    // countdown
    let countdownHtml='';
    if(r.vence && r.status==='Em andamento') {
      const diff = new Date(r.vence)-new Date();
      if(diff>0){
        const h=Math.floor(diff/3600000), d=Math.floor(diff/86400000);
        const label = d>1?`${d} dias`:(h>0?`${h}h restantes`:'Expira em breve');
        countdownHtml=`<span class="rfq-countdown ${d<1?'urgent':'ok'}">${label}</span>`;
      } else {
        countdownHtml=`<span class="rfq-countdown ended">Encerrado</span>`;
      }
    } else if(r.status==='Rascunho'){
      countdownHtml=`<span class="rfq-countdown ended">Não enviado</span>`;
    } else if(r.status==='Análise'){
      countdownHtml=`<span class="rfq-countdown ended">Encerrado — em análise</span>`;
    }

    const faces = r.fornecedoresConvidados.slice(0,4).map(f=>`
      <div class="rfq-resp-face" title="${f.nome}" style="${f.status==='Respondeu'?'background:var(--navy);color:#fff':''}">${f.nome.slice(0,2).toUpperCase()}</div>`).join('');

    return `<div class="rfq-item" onclick="openRFQDetail('${r.id}')">
      <div class="rfq-item-top">
        <div class="rfq-item-icon">${r.status==='Rascunho'?'📝':r.status==='Análise'?'🔍':'📋'}</div>
        <div class="rfq-item-main">
          <div class="rfq-item-id">${r.id} · ${r.comprador||'—'} · ${r.cc||'—'}</div>
          <div class="rfq-item-title">${r.titulo}</div>
          <div class="rfq-item-meta">
            <span>📅 ${r.prazo||'—'}</span>
            <span>📦 ${r.itens.length} item${r.itens.length!==1?'s':''}</span>
            <span>🏢 ${r.respostas}/${r.totalFornecedores} respostas</span>
            ${r.requisicaoOrigem?`<span>🔗 ${r.requisicaoOrigem}</span>`:''}
          </div>
        </div>
        <div class="rfq-item-right">
          <span class="status-badge ${st.cls}">${st.icon} ${r.status}</span>
          <span class="rfq-item-valor">${brl(r.valorEstimado)}</span>
          ${countdownHtml}
        </div>
      </div>
      <div class="rfq-item-bottom">
        <div class="rfq-resp-faces">${faces}</div>
        <span style="font-size:12px;color:var(--text-3);margin-left:8px">${r.fornecedoresConvidados.length} fornecedor${r.fornecedoresConvidados.length!==1?'es':''} convidado${r.fornecedoresConvidados.length!==1?'s':''}</span>
        ${hasProp?`<span style="font-size:12px;color:var(--green);font-weight:500">✓ ${r.propostas.length} proposta${r.propostas.length!==1?'s':''} recebida${r.propostas.length!==1?'s':''}</span>`:''}
        <div class="rfq-actions-bar" onclick="event.stopPropagation()" style="margin-left:auto">
          ${r.status==='Rascunho'?`<button class="btn btn-primary btn-sm" onclick="sendRFQ('${r.id}')">Enviar RFQ</button>`:''}
          ${r.status==='Em andamento'?`<button class="btn btn-secondary btn-sm" onclick="remindSuppliers('${r.id}')">Lembrar fornecedores</button>`:''}
          ${r.status==='Análise'?`<button class="btn btn-primary btn-sm" onclick="openRFQDetail('${r.id}');setTimeout(()=>switchRFQTab('vencedor'),300)">Selecionar Vencedor</button>`:''}
          <button class="btn btn-secondary btn-sm" onclick="openRFQDetail('${r.id}')">Ver detalhes →</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── Helpers ───────────────────────────────────────────────────────
function calcRFQTotals(rfq) {
  const totals = {};
  rfq.propostas.forEach(p=>{
    let t=0;
    p.itens.forEach(pi=>{ const item=rfq.itens.find(i=>i.id===pi.id); t+=pi.valor*(item?item.qtd:1); });
    totals[p.fornId]=t;
  });
  return totals;
}

function getWinnerForn(rfq) {
  const totals = calcRFQTotals(rfq);
  if(!Object.keys(totals).length) return null;
  const winId = Object.entries(totals).sort((a,b)=>a[1]-b[1])[0][0];
  return rfq.propostas.find(p=>p.fornId===winId);
}

// ── Detail panel ──────────────────────────────────────────────────
function openRFQDetail(id) {
  currentRFQ = MOCK.rfqs.find(r=>r.id===id);
  if(!currentRFQ) return;
  const r = currentRFQ;
  const st = rfqStatusMap[r.status]||rfqStatusMap['Rascunho'];

  document.getElementById('rfq-detail-id').textContent    = r.id+' · '+r.comprador+' · '+r.cc;
  document.getElementById('rfq-detail-title').textContent = r.titulo;
  document.getElementById('rfq-detail-badge').textContent = r.status;
  document.getElementById('rfq-detail-badge').className   = 'status-badge '+st.cls;
  document.getElementById('rfq-detail-meta').innerHTML    = [
    `<span style="font-size:12px;color:var(--text-3)">📅 Prazo: <strong style="color:var(--text)">${r.prazo}</strong></span>`,
    `<span style="font-size:12px;color:var(--text-3)">💰 Est.: <strong style="color:var(--navy)">${brl(r.valorEstimado)}</strong></span>`,
    `<span style="font-size:12px;color:var(--text-3)">📦 ${r.itens.length} itens</span>`,
    `<span style="font-size:12px;color:var(--text-3)">🏢 ${r.respostas}/${r.totalFornecedores} respostas</span>`
  ].join('');

  // Build footer
  const footer = [];
  if(r.status==='Rascunho')     footer.push(`<button class="btn btn-primary" onclick="sendRFQ('${r.id}')">Enviar para Fornecedores</button>`);
  if(r.status==='Em andamento') footer.push(`<button class="btn btn-secondary" onclick="remindSuppliers('${r.id}')">Lembrar Fornecedores</button>`,`<button class="btn btn-secondary" onclick="encerrarRFQ('${r.id}')">Encerrar Cotação</button>`);
  if(r.status==='Análise')      footer.push(`<button class="btn btn-primary" onclick="switchRFQTab('vencedor')">Selecionar Vencedor →</button>`);
  footer.push(`<button class="btn btn-secondary" onclick="closeRFQDetail()">Fechar</button>`);
  document.getElementById('rfq-detail-footer').innerHTML = footer.join('');

  switchRFQTab('resumo');
  document.getElementById('rfqDetailOverlay').classList.add('open');
}

function closeRFQDetail(e) {
  if(!e||e.target===document.getElementById('rfqDetailOverlay'))
    document.getElementById('rfqDetailOverlay').classList.remove('open');
}

function switchRFQTab(tab) {
  currentRFQTab = tab;
  document.querySelectorAll('.rfq-tab').forEach((t,i)=>{
    const tabs=['resumo','comparativo','fornecedores','historico','vencedor'];
    t.classList.toggle('active', tabs[i]===tab);
  });
  document.querySelectorAll('.rfq-tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById('rfq-tab-'+tab).classList.add('active');
  const r = currentRFQ; if(!r) return;

  if(tab==='resumo')       renderRFQTabResumo(r);
  if(tab==='comparativo')  renderRFQTabComparativo(r);
  if(tab==='fornecedores') renderRFQTabFornecedores(r);
  if(tab==='historico')    renderRFQTabHistorico(r);
  if(tab==='vencedor')     renderRFQTabVencedor(r);
}

// ── TAB: Resumo ───────────────────────────────────────────────────
function renderRFQTabResumo(r) {
  document.getElementById('rfq-tab-resumo').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Dados Gerais</div>
      <div class="req-field-grid">
        <div class="req-field"><span class="req-field-label">Comprador</span><span class="req-field-value">${r.comprador}</span></div>
        <div class="req-field"><span class="req-field-label">Centro de Custo</span><span class="req-field-value">${r.cc}</span></div>
        <div class="req-field"><span class="req-field-label">Categoria</span><span class="req-field-value">${r.categoria}</span></div>
        <div class="req-field"><span class="req-field-label">Requisição de origem</span><span class="req-field-value">${r.requisicaoOrigem||'—'}</span></div>
        <div class="req-field"><span class="req-field-label">Prazo de resposta</span><span class="req-field-value">${r.prazo}</span></div>
        <div class="req-field"><span class="req-field-label">Valor estimado</span><span class="req-field-value" style="color:var(--navy);font-size:15px">${brl(r.valorEstimado)}</span></div>
      </div>
    </div>
    ${r.observacoes?`<div class="req-detail-section">
      <div class="req-detail-section-title">Observações para Fornecedores</div>
      <p style="font-size:13.5px;color:var(--text-2);line-height:1.6">${r.observacoes}</p>
    </div>`:''}
    <div class="req-detail-section">
      <div class="req-detail-section-title">Itens Solicitados</div>
      <table class="req-items-table">
        <thead><tr><th>#</th><th>Descrição</th><th>Qtd.</th><th>Unid.</th><th>Valor Ref.</th></tr></thead>
        <tbody>${r.itens.map(i=>`<tr>
          <td>${i.id}</td><td>${i.desc}</td><td>${i.qtd}</td><td>${i.unid}</td>
          <td>${i.valorRef?brl(i.valorRef*i.qtd):'—'}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div>
    <div class="req-detail-section" style="background:var(--navy-light);border-radius:8px;padding:12px 14px;border:1px solid rgba(30,58,95,0.15)">
      <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--navy);margin-bottom:6px">🔗 Integração Datasul</div>
      <div style="font-size:12.5px;color:var(--navy-2);line-height:1.6">
        <strong>Quando ativada:</strong> esta RFQ será sincronizada com a ordem de compra
        <code style="background:rgba(30,58,95,0.15);padding:1px 5px;border-radius:3px">${r.requisicaoOrigem||'—'}</code>
        no módulo MCC via <code style="background:rgba(30,58,95,0.15);padding:1px 5px;border-radius:3px">purchOrderPublic</code>.
        A cotação vencedora retornará automaticamente ao Datasul.
      </div>
    </div>`;
}

// ── TAB: Comparativo ──────────────────────────────────────────────
function renderRFQTabComparativo(r) {
  const el = document.getElementById('rfq-tab-comparativo');
  if(!r.propostas.length){
    el.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-3)">Nenhuma proposta recebida ainda.</div>`;
    return;
  }
  const totals = calcRFQTotals(r);
  const minTotal = Math.min(...Object.values(totals));
  const winner = getWinnerForn(r);
  const saving = r.propostas.length>1 ? Math.max(...Object.values(totals))-minTotal : 0;

  let header = `<th>Item</th><th>Qtd.</th>`;
  r.propostas.forEach(p=>{
    const isWinner = totals[p.fornId]===minTotal;
    header += `<th class="${isWinner?'winner-col':''}">${p.fornNome}${isWinner?' ⭐':''}</th>`;
  });

  let rows = r.itens.map(item=>{
    const vals = r.propostas.map(p=>{ const pi=p.itens.find(i=>i.id===item.id); return pi?pi.valor*item.qtd:null; });
    const minV = Math.min(...vals.filter(v=>v!==null));
    const maxV = Math.max(...vals.filter(v=>v!==null));
    let row = `<td>${item.desc}</td><td style="text-align:center">${item.qtd} ${item.unid}</td>`;
    vals.forEach(v=>{
      row += v===null?`<td>—</td>`:
        `<td class="${v===minV?'best-cell':v===maxV&&vals.length>2?'worst-cell':''}">${brlFull(v)}</td>`;
    });
    return `<tr>${row}</tr>`;
  }).join('');

  let totalRow = `<td colspan="2"><strong>Total Geral</strong></td>`;
  r.propostas.forEach(p=>{
    const t=totals[p.fornId];
    const isWinner=t===minTotal;
    const savText = isWinner&&saving>0?`<span class="compare-saving">-${brl(saving)}</span>`:'';
    totalRow+=`<td class="${isWinner?'best-cell':''}">${brlFull(t)}${savText}</td>`;
  });

  el.innerHTML = `
    ${winner&&saving>0?`<div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:var(--green-light);border-radius:8px;margin-bottom:16px;border:1px solid rgba(22,163,74,0.2)">
      <span class="winner-badge">⭐ Menor preço: ${winner.fornNome}</span>
      <span style="font-size:13px;color:var(--green)">Economia de <strong>${brl(saving)}</strong> vs proposta mais cara</span>
    </div>`:''}
    <div class="compare-wrap">
      <table class="compare-tbl">
        <thead><tr>${header}</tr>
          <tr style="background:var(--bg-3)">
            <td colspan="2" style="font-size:11px;color:var(--text-3);text-align:left;padding:6px 12px">Condição pagto</td>
            ${r.propostas.map(p=>`<td style="font-size:12px;color:var(--text-3)">${p.condicaoPagto}</td>`).join('')}
          </tr>
          <tr style="background:var(--bg-3)">
            <td colspan="2" style="font-size:11px;color:var(--text-3);text-align:left;padding:6px 12px">Entrega</td>
            ${r.propostas.map(p=>`<td style="font-size:12px;color:var(--text-3)">${p.prazoEntrega}</td>`).join('')}
          </tr>
          <tr style="background:var(--bg-3)">
            <td colspan="2" style="font-size:11px;color:var(--text-3);text-align:left;padding:6px 12px">Garantia</td>
            ${r.propostas.map(p=>`<td style="font-size:12px;color:var(--text-3)">${p.garantia}</td>`).join('')}
          </tr>
          <tr style="background:var(--bg-3)">
            <td colspan="2" style="font-size:11px;color:var(--text-3);text-align:left;padding:6px 12px">Frete</td>
            ${r.propostas.map(p=>`<td style="font-size:12px;color:var(--text-3)">${p.frete}</td>`).join('')}
          </tr>
        </thead>
        <tbody>${rows}<tr class="total-row">${totalRow}</tr></tbody>
      </table>
    </div>
    <div style="margin-top:12px;display:flex;gap:10px;justify-content:flex-end">
      <button class="btn btn-secondary btn-sm" onclick="exportComparativo()">Exportar Excel</button>
      ${r.status==='Análise'?`<button class="btn btn-primary btn-sm" onclick="switchRFQTab('vencedor')">Selecionar Vencedor →</button>`:''}
    </div>`;
}

// ── TAB: Fornecedores ─────────────────────────────────────────────
function renderRFQTabFornecedores(r) {
  document.getElementById('rfq-tab-fornecedores').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Fornecedores Convidados — ${r.fornecedoresConvidados.length} total</div>
      <div class="forn-status-list">
        ${r.fornecedoresConvidados.map(f=>{
          const prop = r.propostas.find(p=>p.fornId===f.id);
          return `<div class="forn-status-item">
            <div class="forn-avatar">${f.nome.slice(0,2).toUpperCase()}</div>
            <div class="forn-info">
              <div class="forn-name">${f.nome}</div>
              <div class="forn-cnpj">${f.cnpj} · ${f.contato}</div>
              ${prop?`<div style="font-size:12px;color:var(--text-3);margin-top:3px">Proposta recebida em ${prop.recebida} · Válida até ${prop.validade}</div>`:''}
            </div>
            <div style="text-align:right">
              <span class="forn-resp-status ${f.status==='Respondeu'?'forn-resp-ok':'forn-resp-wait'}">${f.status==='Respondeu'?'✓ Respondeu':'⏳ Aguardando'}</span>
              ${prop?`<div style="font-size:13px;font-weight:600;color:var(--navy);margin-top:4px">${brl(Object.entries(calcRFQTotals(r)).find(([id])=>id===f.id)?.[1]||0)}</div>`:''}
            </div>
            ${f.status!=='Respondeu'?`<button class="btn btn-secondary btn-sm" onclick="toast('Lembrete enviado para ${f.nome}!')">Lembrar</button>`:''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

// ── TAB: Histórico ────────────────────────────────────────────────
function renderRFQTabHistorico(r) {
  document.getElementById('rfq-tab-historico').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Linha do Tempo</div>
      <div class="req-timeline">
        ${r.historico.map(h=>`
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

// ── TAB: Selecionar Vencedor ──────────────────────────────────────
function renderRFQTabVencedor(r) {
  const el = document.getElementById('rfq-tab-vencedor');
  if(!r.propostas.length){
    el.innerHTML=`<div style="text-align:center;padding:40px;color:var(--text-3)">Nenhuma proposta recebida. Aguarde os fornecedores responderem.</div>`;
    return;
  }
  const totals = calcRFQTotals(r);
  const minTotal = Math.min(...Object.values(totals));
  let selId = null;

  el.innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Selecione o Fornecedor Vencedor</div>
      <div id="winner-cards">
        ${r.propostas.map(p=>{
          const t=totals[p.fornId];
          const isMin=t===minTotal;
          return `<div class="winner-select-card${isMin?' selected':''}" id="wcard-${p.fornId}" onclick="selectWinner('${p.fornId}','${r.id}')">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="radio-dot" id="wdot-${p.fornId}" style="${isMin?'background:var(--navy);border-color:var(--navy)':''}"></div>
              <div class="forn-avatar">${p.fornNome.slice(0,2).toUpperCase()}</div>
              <div style="flex:1">
                <div style="font-weight:500;font-size:14px">${p.fornNome}</div>
                <div style="font-size:12px;color:var(--text-3);margin-top:2px">${p.prazoEntrega} · ${p.condicaoPagto} · Garantia: ${p.garantia}</div>
              </div>
              <div style="text-align:right">
                <div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--navy)">${brlFull(t)}</div>
                ${isMin?`<div style="font-size:11px;color:var(--green);font-weight:600">✓ Menor preço</div>`:''}
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="form-group" style="margin-top:16px">
        <label>Justificativa da escolha (opcional)</label>
        <textarea class="form-input" id="winner-just" rows="2" placeholder="Ex: Melhor custo-benefício, prazo de entrega adequado..."></textarea>
      </div>
      <div style="background:var(--navy-light);border:1px solid rgba(30,58,95,0.2);border-radius:8px;padding:12px 14px;margin-top:12px;font-size:12.5px;color:var(--navy)">
        🔗 <strong>Integração Datasul:</strong> quando ativada, ao confirmar o vencedor o BidFlow enviará automaticamente a cotação aprovada via
        <code style="background:rgba(30,58,95,0.15);padding:1px 5px;border-radius:3px">POST /mcc/v1/purchQuotationPublic</code>
        e criará o pedido de compra no Datasul.
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px;gap:10px">
        <button class="btn btn-secondary" onclick="switchRFQTab('comparativo')">← Voltar ao Comparativo</button>
        <button class="btn btn-primary" id="btn-confirm-winner" onclick="confirmWinner('${r.id}')">✓ Confirmar Vencedor e Gerar PO</button>
      </div>
    </div>`;

  // set initial selection state
  window._rfqSelectedWinner = r.propostas.find(p=>calcRFQTotals(r)[p.fornId]===minTotal)?.fornId || null;
}

function selectWinner(fornId, rfqId) {
  window._rfqSelectedWinner = fornId;
  document.querySelectorAll('.winner-select-card').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('[id^="wdot-"]').forEach(d=>{ d.style.background=''; d.style.borderColor=''; });
  const card = document.getElementById('wcard-'+fornId);
  const dot  = document.getElementById('wdot-'+fornId);
  if(card) card.classList.add('selected');
  if(dot)  { dot.style.background='var(--navy)'; dot.style.borderColor='var(--navy)'; }
}

function confirmWinner(rfqId) {
  const r = MOCK.rfqs.find(x=>x.id===rfqId);
  const fornId = window._rfqSelectedWinner;
  if(!r||!fornId) return;
  const prop = r.propostas.find(p=>p.fornId===fornId);
  const forn = r.fornecedoresConvidados.find(f=>f.id===fornId);
  r.status = 'Concluída';
  r.vencedor = fornId;
  r.historico.push({data:'Agora', acao:`Vencedor selecionado: ${forn?.nome||fornId}`, user:'Maria Ribeiro', cor:'green'});
  r.historico.push({data:'Agora', acao:'Pedido de Compra gerado — aguardando aprovação MLA no Datasul', user:'Sistema', cor:'blue'});
  toast(`✓ ${forn?.nome||fornId} selecionado! PO gerado e enviado para aprovação.`);

  // Add to pedidos
  const newPO = {id:'PC-2024-'+(1109+Math.floor(Math.random()*10)), titulo:r.titulo, fornecedor:forn?.nome||'—', valor:calcRFQTotals(r)[fornId], status:'Aprovacao', urgente:false};
  MOCK.pedidos.unshift(newPO);

  closeRFQDetail();
  renderRFQ();
  setTimeout(()=>{ toast('🔗 Datasul: POST /purchQuotationPublic — simulado (fase 3)'); },1500);
}

// ── Actions ───────────────────────────────────────────────────────
function sendRFQ(id) {
  const r = MOCK.rfqs.find(x=>x.id===id);
  if(!r) return;
  r.status='Em andamento';
  r.historico.push({data:'Agora',acao:'RFQ enviada para fornecedores',user:'Sistema',cor:'blue'});
  toast('RFQ enviada para '+(r.fornecedoresConvidados.length||0)+' fornecedores!');
  closeRFQDetail();
  renderRFQ();
}

function remindSuppliers(id) {
  const r = MOCK.rfqs.find(x=>x.id===id);
  const pending = (r?.fornecedoresConvidados||[]).filter(f=>f.status!=='Respondeu');
  toast(`Lembrete enviado para ${pending.length} fornecedor${pending.length!==1?'es':''}!`);
  r?.historico.push({data:'Agora',acao:`Lembrete enviado para ${pending.length} fornecedor${pending.length!==1?'es':''}`,user:'Sistema',cor:'amber'});
}

function encerrarRFQ(id) {
  const r = MOCK.rfqs.find(x=>x.id===id);
  if(!r) return;
  r.status='Análise';
  r.historico.push({data:'Agora',acao:'RFQ encerrada manualmente',user:'Maria Ribeiro',cor:'amber'});
  toast('Cotação encerrada. Analise as propostas e selecione o vencedor.');
  closeRFQDetail();
  renderRFQ();
}

function exportComparativo() {
  if(!currentRFQ) return;
  toast('Comparativo exportado em Excel!');
}

function exportRFQCSV() {
  const rows=[['ID','Título','Status','Comprador','Valor Est.','Respostas','Prazo']];
  MOCK.rfqs.forEach(r=>rows.push([r.id,r.titulo,r.status,r.comprador,r.valorEstimado,r.respostas,r.prazo]));
  const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('\uFEFF'+csv);
  a.download='cotacoes-bidflow.csv';a.click();
  toast('CSV exportado!');
}

// ── Modal new RFQ ─────────────────────────────────────────────────
function openRFQModal() {
  rfqModalStep=1;
  updateRFQModalStep();
  openModal('rfqModal');
}

function updateRFQModalStep() {
  for(let i=1;i<=4;i++){
    document.getElementById('rfq-step-'+i).classList.toggle('active',i===rfqModalStep);
    const lbl=document.getElementById('rfq-step-lbl-'+i);
    lbl.classList.toggle('active',i===rfqModalStep);
    lbl.classList.toggle('done',i<rfqModalStep);
  }
  document.getElementById('rfq-btn-back').style.display = rfqModalStep>1?'':'none';
  document.getElementById('rfq-btn-next').textContent   = rfqModalStep===4?'Criar RFQ':'Próximo →';
}

function rfqStepNext() {
  if(rfqModalStep===1){
    if(!document.getElementById('rfq-f-titulo').value.trim()){ toast('Informe o título da cotação'); return; }
    if(!document.getElementById('rfq-f-cc').value){ toast('Selecione o centro de custo'); return; }
    if(!document.getElementById('rfq-f-prazo').value){ toast('Informe o prazo de resposta'); return; }
  }
  if(rfqModalStep===4){ submitRFQ(); return; }
  if(rfqModalStep===3) buildRFQReview();
  rfqModalStep++; updateRFQModalStep();
}

function rfqStepPrev() {
  if(rfqModalStep>1){ rfqModalStep--; updateRFQModalStep(); }
}

function buildRFQReview() {
  const titulo = document.getElementById('rfq-f-titulo').value;
  const cc     = document.getElementById('rfq-f-cc').value;
  const prazo  = document.getElementById('rfq-f-prazo').value;
  const sel    = [...document.querySelectorAll('.forn-invite-check.on')].length;
  document.getElementById('rfq-review-content').innerHTML = `
    <div class="req-field-grid" style="margin-bottom:16px">
      <div class="req-field"><span class="req-field-label">Título</span><span class="req-field-value">${titulo}</span></div>
      <div class="req-field"><span class="req-field-label">Centro de Custo</span><span class="req-field-value">${cc}</span></div>
      <div class="req-field"><span class="req-field-label">Prazo</span><span class="req-field-value">${new Date(prazo).toLocaleString('pt-BR')}</span></div>
      <div class="req-field"><span class="req-field-label">Fornecedores</span><span class="req-field-value">${sel} selecionados</span></div>
    </div>
    <div style="background:var(--navy-light);border:1px solid rgba(30,58,95,0.2);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--navy)">
      🔗 Ao criar, o BidFlow enviará e-mail + WhatsApp para todos os fornecedores selecionados.<br>
      Quando a integração Datasul estiver ativa, a RFQ também será vinculada à ordem de compra no MCC.
    </div>`;
}

function saveRFQDraft() {
  toast('Rascunho salvo! Continue depois.');
  closeModal('rfqModal');
}

function submitRFQ() {
  const titulo = document.getElementById('rfq-f-titulo').value.trim();
  const cc     = document.getElementById('rfq-f-cc').value;
  const prazo  = document.getElementById('rfq-f-prazo').value;
  if(!titulo||!cc||!prazo){ toast('Preencha todos os campos obrigatórios'); return; }
  const newId = 'RFQ-2024-0'+(893+MOCK.rfqs.length);
  MOCK.rfqs.unshift({
    id:newId, titulo, status:'Em andamento',
    vence:prazo, prazo:new Date(prazo).toLocaleString('pt-BR'),
    respostas:0, totalFornecedores:3, valorEstimado:0, pct:0,
    requisicaoOrigem:document.getElementById('rfq-f-req').value||null,
    comprador:'Maria Ribeiro', cc, categoria:document.getElementById('rfq-f-cat').value||'Outros',
    observacoes:document.getElementById('rfq-f-obs').value,
    itens:[], fornecedoresConvidados:[], propostas:[],
    historico:[{data:'Agora',acao:'RFQ criada e enviada',user:'Maria Ribeiro',cor:'blue'}]
  });
  closeModal('rfqModal');
  toast(newId+' criado e enviado para fornecedores! ✓');
  renderRFQ();
}

function toggleFornInvite(el) {
  el.classList.toggle('on');
  el.closest('.forn-invite-item').style.opacity = el.classList.contains('on')?'1':'0.5';
}

function addRFQItem() {
  document.getElementById('rfq-items-list').insertAdjacentHTML('beforeend',`
    <div class="req-item-row" style="grid-template-columns:1fr 70px 60px 90px 36px">
      <input type="text" class="form-input" placeholder="Descrição do item" style="font-size:12.5px">
      <input type="number" class="form-input" placeholder="Qtd." value="1" style="font-size:12.5px">
      <input type="text" class="form-input" placeholder="UN" style="font-size:12.5px">
      <input type="number" class="form-input" placeholder="R$ ref." style="font-size:12.5px">
      <button class="req-item-del" onclick="removeRFQItem(this)">×</button>
    </div>`);
}

function removeRFQItem(btn) {
  const rows=document.querySelectorAll('#rfq-items-list .req-item-row');
  if(rows.length>1) btn.closest('.req-item-row').remove();
  else toast('Mantenha ao menos 1 item');
}

// renderKanban() moved to orders.module.js

// ---- RENDER APPROVALS ----
function renderApprovals() {
  document.getElementById('approval-list').innerHTML = MOCK.aprovacoes.map(a=>`
    <div class="approval-item${a.urgente?' urgent':''}">
      <div style="min-width:70px">
        <span class="status-badge ${a.urgente?'status-red':'status-amber'}" style="font-size:11px">${a.tipo}</span>
        <div style="font-family:monospace;font-size:11px;color:var(--text-3);margin-top:4px">${a.id}</div>
      </div>
      <div class="approval-info">
        <div class="approval-title">${a.solicitante} — ${a.fornecedor}</div>
        <div class="approval-sub">Alçada: ${a.alca} · Prazo: ${a.prazo}</div>
      </div>
      <div style="text-align:right">
        <div class="approval-valor">${brl(a.valor)}</div>
      </div>
      <div class="approval-btns">
        <button class="btn-approve" onclick="toast('${a.id} aprovado! ✓')">Aprovar</button>
        <button class="btn-reject" onclick="toast('${a.id} rejeitado')">Rejeitar</button>
      </div>
    </div>`).join('');
}

// ---- RENDER CONTRACTS ----
function renderContracts() {
  document.getElementById('contract-list').innerHTML = MOCK.contratos.map(c=>`
    <div class="contract-item${c.status==='Vencendo'?' vencendo':''}">
      <div class="contract-info">
        <div class="contract-id">${c.id}</div>
        <div class="contract-obj">${c.objeto} — ${c.fornecedor}</div>
        <div class="contract-meta">Vigência: ${c.inicio} → ${c.fim}</div>
      </div>
      <span class="status-badge ${c.status==='Vencendo'?'status-amber':'status-green'}">${c.status}</span>
      <div>
        <div class="contract-valor">${brl(c.valor)}/ano</div>
        <div class="contract-periodo">&nbsp;</div>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="toast('Contrato ${c.id} aberto')">Ver</button>
    </div>`).join('');
}

// renderNFs() moved to invoices.module.js

// ---- RENDER SUPPLIERS ----
function renderSuppliers() {
  document.getElementById('supplier-subtitle').textContent = `${MOCK.fornecedores.length} fornecedores · ${MOCK.fornecedores.filter(f=>f.status==='Homologando').length} em homologação`;
  document.getElementById('supplier-tbody').innerHTML = MOCK.fornecedores.map(s=>`
    <tr>
      <td><input type="checkbox"></td>
      <td><div class="table-entity">
        <div class="entity-avatar ${s.cor}">${s.sigla}</div>
        <div><span class="entity-name">${s.nome}</span><span class="entity-sub">${s.cnpj}</span></div>
      </div></td>
      <td class="text-mono" style="font-size:11.5px">${s.cnpj}</td>
      <td><span class="chip ${s.catClass}">${s.categoria}</span></td>
      <td><div class="score-wrap"><div class="score-bar"><div class="score-fill" style="width:${s.score*10}%"></div></div><span class="score-num">${s.score}</span></div></td>
      <td><span class="status-badge ${s.statusClass}">${s.status}</span></td>
      <td>${s.contratos}</td>
      <td>${s.ultimo}</td>
      <td><div class="action-btns">
        <button class="icon-btn" onclick="toast('Perfil ${s.nome}')"><svg viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
        <button class="icon-btn" onclick="openModal('rfqModal');toast('RFQ para ${s.nome}')"><svg viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></button>
      </div></td>
    </tr>`).join('');
  document.getElementById('supplier-info').textContent = `Mostrando ${MOCK.fornecedores.length} de ${MOCK.fornecedores.length} fornecedores`;
}

// ---- RENDER INTEGRATIONS ----
function renderIntegrations() {
  const grid = document.getElementById('int-grid');
  grid.style.display = 'flex';
  grid.style.flexDirection = 'column';
  grid.style.gap = '28px';

  grid.innerHTML = MOCK.integracoes.map(cat => `
    <div class="int-category-block">
      <div class="int-category-header">
        <span class="int-category-icon">${cat.icon||'🔗'}</span>
        <span class="int-category-title" style="margin-bottom:0">${cat.cat}</span>
        <span class="int-cat-count">${cat.itens.length} integração${cat.itens.length>1?'ões':''}</span>
      </div>
      <div class="int-cards-grid">
        ${cat.itens.map(i => {
          const statusLabel = i.status==='mock'?'Mock ativo': i.status==='pending'?i.tag||'Pendente': i.status==='connected'?'Conectado': i.tag||'Disponível';
          const statusCls   = i.status==='mock'?'int-tag-mock': i.status==='pending'?'int-tag-pending': i.status==='connected'?'int-tag-ok': 'int-tag-idle';
          const cardCls     = i.status==='mock'?'connected': i.status==='pending'?'pending-api': i.status==='connected'?'connected':'';
          return `
          <div class="int-card-rich ${cardCls}" onclick="openIntDetail('${i.nome.replace(/'/g,"\\'")}')">
            <div class="int-card-top">
              <div class="int-logo ${i.logoClass||''}">${i.logo}</div>
              <span class="int-status-pill ${statusCls}">${statusLabel}</span>
            </div>
            <div class="int-card-info">
              <span class="int-name">${i.nome}</span>
              <span class="int-desc">${i.desc}</span>
            </div>
            <div class="int-card-endpoints">
              ${(i.endpoints||[]).slice(0,2).map(e=>`<code class="int-endpoint">${e.length>42?e.slice(0,42)+'…':e}</code>`).join('')}
            </div>
            <div class="int-card-footer">
              <span class="int-resp">Resp: ${i.responsavel||'—'}</span>
              <button class="int-detail-btn" onclick="event.stopPropagation();openIntDetail('${i.nome.replace(/'/g,"\\'")}')">Ver detalhes →</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function openIntDetail(nome) {
  let found = null;
  MOCK.integracoes.forEach(cat => cat.itens.forEach(i => { if(i.nome===nome) found=i; }));
  if(!found) return;

  const statusLabel = found.status==='mock'?'Mock ativo (simulado)': found.status==='pending'?'Aguardando configuração': found.status==='connected'?'Conectado e ativo': 'Disponível — não configurado';
  const statusCls   = found.status==='mock'?'status-amber': found.status==='pending'?'status-amber': found.status==='connected'?'status-green':'status-gray';

  document.getElementById('int-detail-nome').textContent  = found.nome;
  document.getElementById('int-detail-badge').textContent = statusLabel;
  document.getElementById('int-detail-badge').className   = 'status-badge '+statusCls;
  document.getElementById('int-detail-body').innerHTML = `
    <div class="req-detail-section">
      <div class="req-detail-section-title">Descrição</div>
      <p style="font-size:13.5px;color:var(--text-2);line-height:1.6">${found.detalhes||found.desc}</p>
    </div>
    <div class="req-detail-section">
      <div class="req-detail-section-title">Endpoints / Rotas</div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${(found.endpoints||['Não documentado']).map(e=>`
        <div style="background:var(--navy-3);border-radius:6px;padding:8px 12px;font-family:monospace;font-size:12px;color:#93c5fd;word-break:break-all">${e}</div>`).join('')}
      </div>
    </div>
    <div class="req-detail-section">
      <div class="req-detail-section-title">Status de Implementação</div>
      <div class="req-timeline">
        <div class="req-timeline-item">
          <div class="req-timeline-dot ${found.status!=='idle'?'green':'gray'}"></div>
          <div class="req-timeline-content"><div class="req-timeline-title">Mapeamento de endpoints</div><div class="req-timeline-sub">${found.status!=='idle'?'Concluído':'Pendente'}</div></div>
        </div>
        <div class="req-timeline-item">
          <div class="req-timeline-dot ${found.status==='mock'||found.status==='connected'?'green':'gray'}"></div>
          <div class="req-timeline-content"><div class="req-timeline-title">Dados mock implementados</div><div class="req-timeline-sub">${found.status==='mock'?'Ativo — substituir por chamada real':'Pendente'}</div></div>
        </div>
        <div class="req-timeline-item">
          <div class="req-timeline-dot ${found.status==='connected'?'green':'gray'}"></div>
          <div class="req-timeline-content"><div class="req-timeline-title">Conexão com sistema real</div><div class="req-timeline-sub">${found.status==='connected'?'Ativo':'Aguardando credenciais'}</div></div>
        </div>
        <div class="req-timeline-item">
          <div class="req-timeline-dot ${found.status==='connected'?'green':'gray'}"></div>
          <div class="req-timeline-content"><div class="req-timeline-title">Testes em produção</div><div class="req-timeline-sub">${found.status==='connected'?'Aprovado':'Não iniciado'}</div></div>
        </div>
      </div>
    </div>
    <div class="req-detail-section">
      <div class="req-detail-section-title">Responsável pela Configuração</div>
      <div style="font-size:13.5px;font-weight:500;color:var(--text)">${found.responsavel||'—'}</div>
    </div>`;

  const footer = found.status==='idle'||found.status==='pending' ?
    `<button class="btn btn-secondary" onclick="closeModal('intDetailModal')">Fechar</button>
     <button class="btn btn-primary" onclick="toast('Configuração de ${found.nome} iniciada!');closeModal('intDetailModal')">Iniciar Configuração</button>` :
    `<button class="btn btn-secondary" onclick="closeModal('intDetailModal')">Fechar</button>
     <button class="btn btn-secondary" onclick="toast('Testando conexão com ${found.nome}...')">Testar Conexão</button>`;
  document.getElementById('int-detail-footer').innerHTML = footer;
  openModal('intDetailModal');
}

// ---- CHARTS ----
const chartDefaults = {
  responsive:true, maintainAspectRatio:false,
  plugins:{legend:{display:false}},
  scales:{
    x:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#8892a8',font:{size:11}}},
    y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{color:'#8892a8',font:{size:11}}}
  }
};
const sparkOpts = {
  responsive:true,maintainAspectRatio:false,
  plugins:{legend:{display:false},tooltip:{mode:'index'}},
  scales:{x:{display:false},y:{display:false}},
  elements:{point:{radius:2,hoverRadius:4}}
};

let spendChartInst = null;
function renderCharts(page) {
  if(page==='dashboard') {
    const ctx = document.getElementById('spendChart');
    if(!ctx) return;
    if(spendChartInst) spendChartInst.destroy();
    spendChartInst = new Chart(ctx, {
      type:'bar',
      data:{
        labels:MOCK.spendMensal.labels,
        datasets:[
          {label:'TI & Tecnologia',data:MOCK.spendMensal.ti,      backgroundColor:'rgba(30,58,95,0.8)',  borderRadius:4},
          {label:'MRO',            data:MOCK.spendMensal.mro,     backgroundColor:'rgba(37,99,168,0.75)',borderRadius:4},
          {label:'Serviços',       data:MOCK.spendMensal.servicos, backgroundColor:'rgba(96,165,250,0.7)',borderRadius:4},
          {label:'Logística',      data:MOCK.spendMensal.logistica,backgroundColor:'rgba(186,212,245,0.8)',borderRadius:4}
        ]
      },
      options:{...chartDefaults,plugins:{legend:{position:'right',labels:{color:'#8892a8',font:{size:11},padding:12,boxWidth:12}},tooltip:{mode:'index'}},scales:{...chartDefaults.scales,x:{...chartDefaults.scales.x,stacked:true},y:{...chartDefaults.scales.y,stacked:true,ticks:{callback:v=>'R$'+v+'K',color:'#8892a8',font:{size:11}}}}}
    });
  }
  if(page==='analytics') {
    const mk = (id,data,color) => {
      const c = document.getElementById(id); if(!c) return;
      new Chart(c,{type:'line',data:{labels:MOCK.spendMensal.labels,datasets:[{data,borderColor:color,backgroundColor:color.replace('1)','0.08)'),fill:true,tension:.4,borderWidth:2}]},options:sparkOpts});
    };
    mk('savingsChart',   MOCK.spendMensal.ti.map((v,i)=>v+MOCK.spendMensal.mro[i]), 'rgba(22,163,74,1)');
    mk('leadChart',      [11.2,10.8,10.1,9.5,9.6,8.2], 'rgba(30,58,95,1)');
    mk('complianceChart',[88,90,91,92,93,94.3],          'rgba(124,58,237,1)');
    mk('srmChart',       [7.2,7.5,7.6,7.8,7.8,8.1],     'rgba(217,119,6,1)');
  }
}

// ---- INIT ALL ----
renderDashboard();
renderRequisitions();
renderRFQ();
renderKanban();
renderApprovals();
renderContracts();
renderNFs();
renderSuppliers();
renderIntegrations();

// razzo-data injected
// ============================================================
// BidFlow — Dados reais importados da Razzo (base 10_03.xlsx)
// Período: Abr/2023 → Mar/2026
// 40 fornecedores · 80 pedidos · 20 requisições
// ============================================================

const RAZZO_DATA = {
  fornecedores: [
    {id:'F2260',sigla:'C',razaoSocial:'CRILTINTAS',nomeFantasia:'CRILTINTAS',cnpj:'',ie:'',email:'alcinei.tintas@gmail.com',emailNF:'alcinei.tintas@gmail.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:9.2,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2260',portalSenha:'',portalAtivo:false,datasulCode:'2260',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2196',sigla:'C',razaoSocial:'CONTROLID',nomeFantasia:'CONTROLID',cnpj:'',ie:'',email:'albert@controlid.com.br',emailNF:'albert@controlid.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:8.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2196',portalSenha:'',portalAtivo:false,datasulCode:'2196',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0320',sigla:'4S',razaoSocial:'4DS SOLUCOES',nomeFantasia:'4DS SOLUCOES',cnpj:'',ie:'',email:'carla.sinhori@4ds.com.br; luis.arao@4ds.com.br',emailNF:'carla.sinhori@4ds.com.br; luis.arao@4ds.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:7.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_320',portalSenha:'',portalAtivo:false,datasulCode:'320',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30676',sigla:'KS',razaoSocial:'KALUNGA SA',nomeFantasia:'KALUNGA SA',cnpj:'',ie:'',email:'thaistelevendas@kalunga.com.br',emailNF:'thaistelevendas@kalunga.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:8.1,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30676',portalSenha:'',portalAtivo:false,datasulCode:'30676',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F29953',sigla:'SM',razaoSocial:'SUPLLIES MAN',nomeFantasia:'SUPLLIES MAN',cnpj:'',ie:'',email:'supllies@supllies.com.br',emailNF:'supllies@supllies.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:7.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_29953',portalSenha:'',portalAtivo:false,datasulCode:'29953',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0747',sigla:'A',razaoSocial:'AUSTINACESS',nomeFantasia:'AUSTINACESS',cnpj:'',ie:'',email:'tiago.tavares@austincomercio.com.br',emailNF:'tiago.tavares@austincomercio.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:9.0,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_747',portalSenha:'',portalAtivo:false,datasulCode:'747',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1144',sigla:'B',razaoSocial:'BRASILCENTE',nomeFantasia:'BRASILCENTE',cnpj:'',ie:'',email:'sac@brasilcentertruck.com.br',emailNF:'sac@brasilcentertruck.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:6.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1144',portalSenha:'',portalAtivo:false,datasulCode:'1144',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F4374',sigla:'M',razaoSocial:'MODALMARCAS',nomeFantasia:'MODALMARCAS',cnpj:'',ie:'',email:'modal@modalmarcas.com.br',emailNF:'modal@modalmarcas.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:8.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_4374',portalSenha:'',portalAtivo:false,datasulCode:'4374',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F3101',sigla:'G',razaoSocial:'GVSLOGR',nomeFantasia:'GVSLOGR',cnpj:'',ie:'',email:'atendimento@gvslog.com.br',emailNF:'atendimento@gvslog.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:7.2,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_3101',portalSenha:'',portalAtivo:false,datasulCode:'3101',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1271',sigla:'C',razaoSocial:'CACIQUE',nomeFantasia:'CACIQUE',cnpj:'',ie:'',email:'financeiro@molassupercacique.com.br; oss@molassupe',emailNF:'financeiro@molassupercacique.com.br; oss@molassupe',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:9.1,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1271',portalSenha:'',portalAtivo:false,datasulCode:'1271',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2364',sigla:'D',razaoSocial:'DELL1',nomeFantasia:'DELL1',cnpj:'',ie:'',email:'tassiane.costa@dell.com',emailNF:'tassiane.costa@dell.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:9.2,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2364',portalSenha:'',portalAtivo:false,datasulCode:'2364',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F4444',sigla:'M',razaoSocial:'MWITACOGRAF',nomeFantasia:'MWITACOGRAF',cnpj:'',ie:'',email:'vdi@tacografos.com.br',emailNF:'vdi@tacografos.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:8.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_4444',portalSenha:'',portalAtivo:false,datasulCode:'4444',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1437',sigla:'C',razaoSocial:'CASANANCY',nomeFantasia:'CASANANCY',cnpj:'',ie:'',email:'vendas@casanancy.com.br',emailNF:'vendas@casanancy.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:7.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1437',portalSenha:'',portalAtivo:false,datasulCode:'1437',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2262',sigla:'C',razaoSocial:'CRISTALDISEL',nomeFantasia:'CRISTALDISEL',cnpj:'',ie:'',email:'laercio.cristaldiesel@gmail.com; cristaldiesel@uol',emailNF:'laercio.cristaldiesel@gmail.com; cristaldiesel@uol',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:8.1,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2262',portalSenha:'',portalAtivo:false,datasulCode:'2262',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1408',sigla:'C',razaoSocial:'CARTREG',nomeFantasia:'CARTREG',cnpj:'',ie:'',email:'contato@cartoriodalapa.com.br',emailNF:'contato@cartoriodalapa.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:7.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1408',portalSenha:'',portalAtivo:false,datasulCode:'1408',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30292',sigla:'BM',razaoSocial:'BIANCOS MANU',nomeFantasia:'BIANCOS MANU',cnpj:'',ie:'',email:'rafaela@biancosmanutencao.com.br; david@biancosman',emailNF:'rafaela@biancosmanutencao.com.br; david@biancosman',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:9.0,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30292',portalSenha:'',portalAtivo:false,datasulCode:'30292',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F5852',sigla:'S',razaoSocial:'SABESP',nomeFantasia:'SABESP',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:6.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_5852',portalSenha:'',portalAtivo:false,datasulCode:'5852',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0796',sigla:'B',razaoSocial:'BALJUNDIAI',nomeFantasia:'BALJUNDIAI',cnpj:'',ie:'',email:'faturamento@bjjundiai.com.br',emailNF:'faturamento@bjjundiai.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:8.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_796',portalSenha:'',portalAtivo:false,datasulCode:'796',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0794',sigla:'B',razaoSocial:'BALANCASJUN',nomeFantasia:'BALANCASJUN',cnpj:'',ie:'',email:'faturamento@bjjundiai.com.br',emailNF:'faturamento@bjjundiai.com.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:7.2,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_794',portalSenha:'',portalAtivo:false,datasulCode:'794',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2429',sigla:'D',razaoSocial:'DIGICROM',nomeFantasia:'DIGICROM',cnpj:'',ie:'',email:'engenharia@digimed.ind.br',emailNF:'engenharia@digimed.ind.br',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:9.1,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2429',portalSenha:'',portalAtivo:false,datasulCode:'2429',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F3211',sigla:'I',razaoSocial:'IDEALMAKUSI',nomeFantasia:'IDEALMAKUSI',cnpj:'',ie:'',email:'comprasidealmak98@hotmail.com',emailNF:'comprasidealmak98@hotmail.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:9.2,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_3211',portalSenha:'',portalAtivo:false,datasulCode:'3211',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F3847',sigla:'M',razaoSocial:'MARCAL&AZE',nomeFantasia:'MARCAL&AZE',cnpj:'',ie:'',email:'btscampinas@hotmail.com',emailNF:'btscampinas@hotmail.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:8.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_3847',portalSenha:'',portalAtivo:false,datasulCode:'3847',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1304',sigla:'C',razaoSocial:'CAMPSELOS1',nomeFantasia:'CAMPSELOS1',cnpj:'',ie:'',email:'vendas@campselos.com.br; eduardo.rigoleto@campselo',emailNF:'vendas@campselos.com.br; eduardo.rigoleto@campselo',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:7.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1304',portalSenha:'',portalAtivo:false,datasulCode:'1304',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F29997',sigla:'GB',razaoSocial:'GLOBAL BELT',nomeFantasia:'GLOBAL BELT',cnpj:'',ie:'',email:'vendas1@globalcorreias.com.br;comercial@globalcorr',emailNF:'vendas1@globalcorreias.com.br;comercial@globalcorr',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:8.1,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_29997',portalSenha:'',portalAtivo:false,datasulCode:'29997',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0735',sigla:'A',razaoSocial:'ATIBRASIL',nomeFantasia:'ATIBRASIL',cnpj:'',ie:'',email:'ronaldo.sp@atibrasil.com.br;renata.sp@atibrasil.co',emailNF:'ronaldo.sp@atibrasil.com.br;renata.sp@atibrasil.co',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:7.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_735',portalSenha:'',portalAtivo:false,datasulCode:'735',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F3820',sigla:'M',razaoSocial:'MAKSIWA',nomeFantasia:'MAKSIWA',cnpj:'',ie:'',email:'lauanda.pires@maksiwa.com.br; nivaldo@maksiwa.com.',emailNF:'lauanda.pires@maksiwa.com.br; nivaldo@maksiwa.com.',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:9.0,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_3820',portalSenha:'',portalAtivo:false,datasulCode:'3820',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F3209',sigla:'I',razaoSocial:'ICONIC',nomeFantasia:'ICONIC',cnpj:'',ie:'',email:'lubrificantes@ipiranga.ipiranga; Larissa.santos.ex',emailNF:'lubrificantes@ipiranga.ipiranga; Larissa.santos.ex',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:6.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_3209',portalSenha:'',portalAtivo:false,datasulCode:'3209',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F5256',sigla:'R',razaoSocial:'R.O.L.',nomeFantasia:'R.O.L.',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:8.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_5256',portalSenha:'',portalAtivo:false,datasulCode:'5256',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F0880',sigla:'B',razaoSocial:'BIADOLA',nomeFantasia:'BIADOLA',cnpj:'',ie:'',email:'olivia.biadolatintas@hotmail.com',emailNF:'olivia.biadolatintas@hotmail.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:7.2,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_880',portalSenha:'',portalAtivo:false,datasulCode:'880',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2716',sigla:'F',razaoSocial:'F.M.G.CORRE',nomeFantasia:'F.M.G.CORRE',cnpj:'',ie:'',email:'vendasfmg02@gmail.com',emailNF:'vendasfmg02@gmail.com',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:9.1,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2716',portalSenha:'',portalAtivo:false,datasulCode:'2716',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30702',sigla:'MG',razaoSocial:'M.A.F. GARCI',nomeFantasia:'M.A.F. GARCI',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:9.2,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30702',portalSenha:'',portalAtivo:false,datasulCode:'30702',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F6637',sigla:'T',razaoSocial:'TOTVS',nomeFantasia:'TOTVS',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:8.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_6637',portalSenha:'',portalAtivo:false,datasulCode:'6637',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30565',sigla:'GL',razaoSocial:'GI LOSCHIAVO',nomeFantasia:'GI LOSCHIAVO',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:7.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30565',portalSenha:'',portalAtivo:false,datasulCode:'30565',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F2238',sigla:'C',razaoSocial:'CORREIO',nomeFantasia:'CORREIO',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:8.1,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_2238',portalSenha:'',portalAtivo:false,datasulCode:'2238',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F6547',sigla:'T',razaoSocial:'TELEFONICA1',nomeFantasia:'TELEFONICA1',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Equipamentos',score:7.5,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_6547',portalSenha:'',portalAtivo:false,datasulCode:'6547',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F29961',sigla:'A-',razaoSocial:'ARPAC - TECN',nomeFantasia:'ARPAC - TECN',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Material de Escritório',score:9.0,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_29961',portalSenha:'',portalAtivo:false,datasulCode:'29961',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30718',sigla:'NF',razaoSocial:'NEW FENIX FU',nomeFantasia:'NEW FENIX FU',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'MRO',score:6.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30718',portalSenha:'',portalAtivo:false,datasulCode:'30718',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F29935',sigla:'MF',razaoSocial:'MC FIBRA IND',nomeFantasia:'MC FIBRA IND',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'TI & Tecnologia',score:8.8,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_29935',portalSenha:'',portalAtivo:false,datasulCode:'29935',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F1333',sigla:'C',razaoSocial:'CARMAGNANIS',nomeFantasia:'CARMAGNANIS',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Serviços',score:7.2,status:'Homologando',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_1333',portalSenha:'',portalAtivo:false,datasulCode:'1333',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}},
    {id:'F30689',sigla:'CI',razaoSocial:'CONFOR INSTR',nomeFantasia:'CONFOR INSTR',cnpj:'',ie:'',email:'',emailNF:'',telefone:'',celular:'',contato:'',cargo:'',categoria:'Logística',score:9.1,status:'Aprovado',contratos:'—',ultimo:'—',banco:'',agencia:'',conta:'',pix:'',portalToken:'tkn_30689',portalSenha:'',portalAtivo:false,datasulCode:'30689',criadoEm:'01/01/2023',homologadoEm:'',docs:{contratSocial:false,certidaoNegativa:false,alvara:false,regularidadeFiscal:false}}
  ],
  pedidos: [
    {id:'PC-298348',titulo:'ANALISADOR DE ENERGIA BLUE BOX D500A 120775 ISSO',fornecedor:'ISSO',valor:850,status:'Aprovacao',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'27/03/2026',datasulPOId:'298348',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ANALISADOR DE ENERGIA BLUE BOX D500A 120775 ISSO',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298345',titulo:'SERVICOS INFORMATICA S ISS RATEIO',fornecedor:'TOTVS FILIAL',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'09/03/2026',previsaoEntrega:'21/03/2026',datasulPOId:'298345',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS INFORMATICA S ISS RATEIO',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298341',titulo:'ENVOLTORIO SABONETE  LIVY CAMOMILA',fornecedor:'PAPAMALIA1',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'10/04/2026',datasulPOId:'298341',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ENVOLTORIO SABONETE  LIVY CAMOMILA',qtd:1000,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298340',titulo:'SORBITOL LIQUIDO 70',fornecedor:'QANASTACIO4',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'09/03/2026',datasulPOId:'298340',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SORBITOL LIQUIDO 70',qtd:2200,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298337',titulo:'BOMBONA PLASTICA',fornecedor:'GOLPACK',valor:1700,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'05/05/2026',datasulPOId:'298337',rfqOrigem:'—',nfUpload:null,itens:[{desc:'BOMBONA PLASTICA',qtd:125,unid:'UN',valor:850},{desc:'BOMBONA PLASTICA',qtd:125,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298336',titulo:'AUXILIAR FILTRANTE',fornecedor:'IMERYS 2',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'06/05/2026',datasulPOId:'298336',rfqOrigem:'—',nfUpload:null,itens:[{desc:'AUXILIAR FILTRANTE',qtd:2000,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298335',titulo:'TABULEIRO 1 150 X 0,984 GCAS 9545189',fornecedor:'MAET',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'04/05/2026',datasulPOId:'298335',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TABULEIRO 1 150 X 0,984 GCAS 9545189',qtd:3200,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298334',titulo:'RIBBON PARA ETIQUETADORA 104MM X 153M',fornecedor:'MASTERCORP',valor:850,status:'Aprovacao',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'24/04/2026',datasulPOId:'298334',rfqOrigem:'—',nfUpload:null,itens:[{desc:'RIBBON PARA ETIQUETADORA 104MM X 153M',qtd:504,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298333',titulo:'PERFIL CARTOLA 20X35X50X35X20 X2000 1 8 GALVANIZA',fornecedor:'PERCAPI',valor:3400,status:'Aprovacao',urgente:true,cc:'QUALIDADE' ,emissao:'25/02/2026',previsaoEntrega:'26/02/2026',datasulPOId:'298333',rfqOrigem:'—',nfUpload:null,itens:[{desc:'PERFIL CARTOLA 20X35X50X35X20 X2000 1 8 GALVANIZA',qtd:48,unid:'UN',valor:850},{desc:'ACAB SUPERIOR DAS LAT 70 X 45 X 70 X 6000 X 1 8',qtd:8,unid:'UN',valor:850},{desc:'PERFIL ESTRUTURA PISO SUP 40X60X40X60X6000X1 8',qtd:24,unid:'UN',valor:850},{desc:'CHAPA XADREZ DO TETO GALVANIZADA 3000 X 1200 X 1 8',qtd:4,unid:'UN',valor:850}],historico:[{data:'25/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298332',titulo:'FITA VEDA ROSCA TEFLON  3M  19MM X 50M',fornecedor:'GERAIS6',valor:5100,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298332',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FITA VEDA ROSCA TEFLON  3M  19MM X 50M',qtd:24,unid:'UN',valor:850},{desc:'JOGO DE CHAVE BIELA VAZADA COM FURO PASSANTE GEDOR',qtd:1,unid:'UN',valor:850},{desc:'FITA OLEADA DE CAMBRAIA 3M 19MM X 18M',qtd:12,unid:'UN',valor:850},{desc:'LAMINA SERRA RS 1218',qtd:10,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298331',titulo:'SACO PLASTICO TRANSP 40 X 60 X 0,15',fornecedor:'PREMIUMPACK',valor:1700,status:'Aprovacao',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'17/04/2026',datasulPOId:'298331',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SACO PLASTICO TRANSP 40 X 60 X 0,15',qtd:20000,unid:'UN',valor:850},{desc:'SACO PLASTICO TRANSP 30 X 40 X 0 15',qtd:20000,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298330',titulo:'SACO PLASTICO RECICLADO 52X90 0,10 MM USO NA FABR',fornecedor:'SPACK',valor:850,status:'Aprovacao',urgente:false,cc:'PCP' ,emissao:'09/03/2026',previsaoEntrega:'06/04/2026',datasulPOId:'298330',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SACO PLASTICO RECICLADO 52X90 0,10 MM USO NA FABR',qtd:20000,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298329',titulo:'TUBO TERMINAL CURTO PONTEIRA',fornecedor:'CARDAN',valor:10200,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298329',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TUBO TERMINAL CURTO PONTEIRA',qtd:1,unid:'UN',valor:850},{desc:'LUVA CARDAN',qtd:1,unid:'UN',valor:850},{desc:'CRUZETA DO CARDAN VW 10 160',qtd:2,unid:'UN',valor:850},{desc:'ROLAMENTO DE CENTRO DO CARDAN P VW 13 150',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298323',titulo:'SERVICO DE MAO DE OBRA DE TROCA DE PECAS',fornecedor:'VALEX',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298323',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICO DE MAO DE OBRA DE TROCA DE PECAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298322',titulo:'CAIXA ORGANIZADORA 13 L',fornecedor:'Femapel Pape',valor:4250,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298322',rfqOrigem:'—',nfUpload:null,itens:[{desc:'CAIXA ORGANIZADORA 13 L',qtd:2,unid:'UN',valor:850},{desc:'CAIXA ORGANIZADORA ALTA 25 L',qtd:2,unid:'UN',valor:850},{desc:'CAIXA ORGANIZADORA 42 L',qtd:1,unid:'UN',valor:850},{desc:'CADEADO E-25',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298321',titulo:'BLOCO MOVIMENTO DE PORTARIA',fornecedor:'KRATOS',valor:2550,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'14/03/2026',datasulPOId:'298321',rfqOrigem:'—',nfUpload:null,itens:[{desc:'BLOCO MOVIMENTO DE PORTARIA',qtd:100,unid:'UN',valor:850},{desc:'BLOCO P ANEXO DAS FICHAS DE PESAGEM',qtd:200,unid:'UN',valor:850},{desc:'BLOCO DE ENT SAIDA DE FUNCIONARIOS',qtd:40,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298317',titulo:'SELO MECANICO 35,0MM AGUA QUENTE',fornecedor:'FLUID SYSTEM',valor:2550,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298317',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SELO MECANICO 35,0MM AGUA QUENTE',qtd:2,unid:'UN',valor:850},{desc:'SELO MECANICO 35MM SODA',qtd:2,unid:'UN',valor:850},{desc:'SELO MECANICO 35,0MM GORDURA',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298316',titulo:'LUVA PARA SELO MECANICO 35 X 61,7MM',fornecedor:'FLUID SYSTEM',valor:850,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298316',rfqOrigem:'—',nfUpload:null,itens:[{desc:'LUVA PARA SELO MECANICO 35 X 61,7MM',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298315',titulo:'LUVA PARA SELO MECANICO 35 X 61,6MM',fornecedor:'FLUID SYSTEM',valor:1700,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298315',rfqOrigem:'—',nfUpload:null,itens:[{desc:'LUVA PARA SELO MECANICO 35 X 61,6MM',qtd:2,unid:'UN',valor:850},{desc:'SELO MECANICO 1 3 4',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298307',titulo:'SERVICO DE APP E MONITORAMENTO DA FROTA',fornecedor:'SMARTEC INFO',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298307',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICO DE APP E MONITORAMENTO DA FROTA',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298306',titulo:'SERVICO DE CONSERTO EM PNEUS',fornecedor:'PNEUCARGO',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298306',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICO DE CONSERTO EM PNEUS',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298305',titulo:'REFORMA DE PNEU 215 / 75R 17,5',fornecedor:'PNEUCARGO',valor:1700,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298305',rfqOrigem:'—',nfUpload:null,itens:[{desc:'REFORMA DE PNEU 215 / 75R 17,5',qtd:4,unid:'UN',valor:850},{desc:'REFORMA DE PNEU 295 / 80R 22,5',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298304',titulo:'SERVICO DE CONSERTO DE TACOGRAFO',fornecedor:'DNS',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298304',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICO DE CONSERTO DE TACOGRAFO',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298302',titulo:'OLEO PARA MOTOR DIESEL 15W40',fornecedor:'VALEX',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298302',rfqOrigem:'—',nfUpload:null,itens:[{desc:'OLEO PARA MOTOR DIESEL 15W40',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298301',titulo:'FILTRO LUBRIFICANTE LF16015 FLET GUARD',fornecedor:'VALEX',valor:1700,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298301',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FILTRO LUBRIFICANTE LF16015 FLET GUARD',qtd:1,unid:'UN',valor:850},{desc:'OLEO IPITUR AW 68 HIDRAULICO',qtd:1,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298298',titulo:'VOLANTE DE DIRECAO',fornecedor:'ANCHIETA PE',valor:850,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'09/03/2026',previsaoEntrega:'10/03/2026',datasulPOId:'298298',rfqOrigem:'—',nfUpload:null,itens:[{desc:'VOLANTE DE DIRECAO',qtd:2,unid:'UN',valor:850}],historico:[{data:'09/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298294',titulo:'LUVA PARA SELO MECANICO 35 X 123MM',fornecedor:'FLUID SYSTEM',valor:1700,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298294',rfqOrigem:'—',nfUpload:null,itens:[{desc:'LUVA PARA SELO MECANICO 35 X 123MM',qtd:1,unid:'UN',valor:850},{desc:'SELO MECANICO 35MM LIXIVIA GLICERINA',qtd:2,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298293',titulo:'SERVICOS ADMINISTRATIVOS CONSULTORIA S ISS',fornecedor:'MARINELLO',valor:850,status:'Aprovacao',urgente:false,cc:'P & D' ,emissao:'01/01/2026',previsaoEntrega:'05/01/2026',datasulPOId:'298293',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS ADMINISTRATIVOS CONSULTORIA S ISS',qtd:12,unid:'UN',valor:850}],historico:[{data:'01/01/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298289',titulo:'SERVICOS ADMINISTRATIVOS CONSULTORIA TRIBUTA',fornecedor:'VALIDEINFOW',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298289',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS ADMINISTRATIVOS CONSULTORIA TRIBUTA',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298288',titulo:'FILTRO DE AR PARA PEGADOR DE CAIXAS B39188 IMA',fornecedor:'I.M.A. INDUS',valor:1700,status:'Recebido',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'06/03/2026',previsaoEntrega:'08/04/2026',datasulPOId:'298288',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FILTRO DE AR PARA PEGADOR DE CAIXAS B39188 IMA',qtd:10,unid:'UN',valor:850},{desc:'SPESE12 COSTOMS E PACKAGIN CHARGES',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298287',titulo:'SERVICOS INFORMATICA S ISS RATEIO',fornecedor:'TOTVS',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'18/03/2026',datasulPOId:'298287',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS INFORMATICA S ISS RATEIO',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298285',titulo:'TELEFONIA',fornecedor:'TELEFONICA1',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298285',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TELEFONIA',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298279',titulo:'SERVICOS INFORMATICA S ISS RATEIO',fornecedor:'TOTVS',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'18/03/2026',datasulPOId:'298279',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS INFORMATICA S ISS RATEIO',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298277',titulo:'FRETES SOBRE COMPRAS',fornecedor:'GVSLOGR',valor:850,status:'Recebido',urgente:false,cc:'P & D' ,emissao:'04/03/2026',previsaoEntrega:'04/03/2026',datasulPOId:'298277',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FRETES SOBRE COMPRAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'04/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298275',titulo:'SERVICOS INFORMATICA S ISS',fornecedor:'4DS CLOUD &',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298275',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS INFORMATICA S ISS',qtd:12,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298274',titulo:'FECHO PADRAO COM CHAVE 0320221 NILKO',fornecedor:'NILKO',valor:3400,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'04/03/2026',previsaoEntrega:'10/04/2026',datasulPOId:'298274',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FECHO PADRAO COM CHAVE 0320221 NILKO',qtd:75,unid:'UN',valor:850},{desc:'ESCUDO PARA ARMARIOS COR BEGE NILKO',qtd:75,unid:'UN',valor:850},{desc:'CHAPA REFORCO FECHO CADEADO NILKO',qtd:75,unid:'UN',valor:850},{desc:'CHAPA REFORCO FECHO CADEADO NILKO',qtd:75,unid:'UN',valor:850}],historico:[{data:'04/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298272',titulo:'VIBRADOR PNEUMATICO ROTATIVO DE ROLOS UCVR 1 4',fornecedor:'M.V.L. MAQUI',valor:850,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'06/03/2026',previsaoEntrega:'21/03/2026',datasulPOId:'298272',rfqOrigem:'—',nfUpload:null,itens:[{desc:'VIBRADOR PNEUMATICO ROTATIVO DE ROLOS UCVR 1 4',qtd:2,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298271',titulo:'FILTRO DE CARVAO 10  PURIFICADOR GEHAKA',fornecedor:'AVANCINI EQU',valor:2550,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/12/2025',previsaoEntrega:'30/12/2025',datasulPOId:'298271',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FILTRO DE CARVAO 10  PURIFICADOR GEHAKA',qtd:1,unid:'UN',valor:850},{desc:'MEMBRANA DE OSMOSE REVERSA  PURIFICADOR GEHAKA',qtd:1,unid:'UN',valor:850},{desc:'FILTRO DEIONIZADOR 10  PURIFICADOR GEHAKA',qtd:1,unid:'UN',valor:850}],historico:[{data:'01/12/2025',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298269',titulo:'LUBRIFICADOR AUTOMATICO LAGD 125/WA2 SKF',fornecedor:'THEVAL PRODU',valor:1700,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'06/03/2026',previsaoEntrega:'11/03/2026',datasulPOId:'298269',rfqOrigem:'—',nfUpload:null,itens:[{desc:'LUBRIFICADOR AUTOMATICO LAGD 125/WA2 SKF',qtd:3,unid:'UN',valor:850},{desc:'GRAXA LGHB 2/18 SKF - ALTA TEMPERATURA  18KG',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298265',titulo:'CARTUCHO DE TINTA SP4',fornecedor:'PACKFAI',valor:850,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'06/03/2026',previsaoEntrega:'11/03/2026',datasulPOId:'298265',rfqOrigem:'—',nfUpload:null,itens:[{desc:'CARTUCHO DE TINTA SP4',qtd:3,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298263',titulo:'OLEO MEROPA 320 TEXACO 20L',fornecedor:'ORIGINAL',valor:1700,status:'Recebido',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'06/03/2026',previsaoEntrega:'19/03/2026',datasulPOId:'298263',rfqOrigem:'—',nfUpload:null,itens:[{desc:'OLEO MEROPA 320 TEXACO 20L',qtd:2,unid:'UN',valor:850},{desc:'OLEO MEROPA 320 TEXACO 20L',qtd:8,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298255',titulo:'TIOSSULFATO DE SODIO 0,01N',fornecedor:'SINERGIA COM',valor:3400,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/01/2026',previsaoEntrega:'28/02/2026',datasulPOId:'298255',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TIOSSULFATO DE SODIO 0,01N',qtd:1,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,01N',qtd:1,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,01N',qtd:1,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,01N',qtd:1,unid:'UN',valor:850}],historico:[{data:'01/01/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298254',titulo:'MANGUEIRA DA TORRE',fornecedor:'GOLDWORK',valor:1700,status:'Aprovacao',urgente:false,cc:'QUALIDADE' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298254',rfqOrigem:'—',nfUpload:null,itens:[{desc:'MANGUEIRA DA TORRE',qtd:2,unid:'UN',valor:850},{desc:'SERVICO DE MANUTENCAO CORRETIVA EM EMPILHADEIRA',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298251',titulo:'SMARTPHONE SAMSUNG GALAXY A03',fornecedor:'MAGALU226',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'06/03/2026',previsaoEntrega:'07/03/2026',datasulPOId:'298251',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SMARTPHONE SAMSUNG GALAXY A03',qtd:1,unid:'UN',valor:850}],historico:[{data:'06/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298250',titulo:'BEQUER 1000ML',fornecedor:'SINERGIA COM',valor:850,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298250',rfqOrigem:'—',nfUpload:null,itens:[{desc:'BEQUER 1000ML',qtd:25,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298249',titulo:'BLEND 67 33 BRANQUEADO OLEO DE PALMA ESTEARIN',fornecedor:'A. AZEVEDO',valor:850,status:'Aprovacao',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'16/03/2026',datasulPOId:'298249',rfqOrigem:'—',nfUpload:null,itens:[{desc:'BLEND 67 33 BRANQUEADO OLEO DE PALMA ESTEARIN',qtd:35000,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298248',titulo:'MULTAS TRABALHISTAS',fornecedor:'SECRETARI DS',valor:1700,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'05/03/2026',previsaoEntrega:'05/03/2026',datasulPOId:'298248',rfqOrigem:'—',nfUpload:null,itens:[{desc:'MULTAS TRABALHISTAS',qtd:1,unid:'UN',valor:850},{desc:'MULTAS TRABALHISTAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298247',titulo:'JALECO AZUL  N 64 C BOLSO',fornecedor:'MARIUSA',valor:7650,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298247',rfqOrigem:'—',nfUpload:null,itens:[{desc:'JALECO AZUL  N 64 C BOLSO',qtd:4,unid:'UN',valor:850},{desc:'CAMISA  POLO AZUL P 40 FROTA',qtd:20,unid:'UN',valor:850},{desc:'CAMISA  POLO AZUL M 42 FROTA',qtd:20,unid:'UN',valor:850},{desc:'CAMISA  POLO AZUL GG 46 48 FROTA',qtd:20,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298244',titulo:'COMBI TITRANT 5',fornecedor:'SINERGIA COM',valor:9350,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/02/2026',previsaoEntrega:'02/02/2026',datasulPOId:'298244',rfqOrigem:'—',nfUpload:null,itens:[{desc:'COMBI TITRANT 5',qtd:3,unid:'UN',valor:850},{desc:'COMBI TITRANT 5',qtd:3,unid:'UN',valor:850},{desc:'COMBI TITRANT 5',qtd:3,unid:'UN',valor:850},{desc:'COMBI TITRANT 5',qtd:3,unid:'UN',valor:850}],historico:[{data:'01/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298243',titulo:'ALCOOL ISOPROPILICO P.A',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/03/2026',previsaoEntrega:'02/03/2026',datasulPOId:'298243',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ALCOOL ISOPROPILICO P.A',qtd:17,unid:'UN',valor:850},{desc:'ALCOOL ISOPROPILICO P.A',qtd:17,unid:'UN',valor:850},{desc:'ALCOOL ISOPROPILICO P.A',qtd:17,unid:'UN',valor:850},{desc:'ALCOOL ISOPROPILICO P.A',qtd:17,unid:'UN',valor:850}],historico:[{data:'01/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298242',titulo:'TIOSSULFATO DE SODIO 0,1N',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'28/02/2026',previsaoEntrega:'28/02/2026',datasulPOId:'298242',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TIOSSULFATO DE SODIO 0,1N',qtd:3,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,1N',qtd:3,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,1N',qtd:3,unid:'UN',valor:850},{desc:'TIOSSULFATO DE SODIO 0,1N',qtd:3,unid:'UN',valor:850}],historico:[{data:'28/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298241',titulo:'NITRATO DE PRATA P.A',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/03/2026',previsaoEntrega:'02/03/2026',datasulPOId:'298241',rfqOrigem:'—',nfUpload:null,itens:[{desc:'NITRATO DE PRATA P.A',qtd:2,unid:'UN',valor:850},{desc:'NITRATO DE PRATA P.A',qtd:2,unid:'UN',valor:850},{desc:'NITRATO DE PRATA P.A',qtd:2,unid:'UN',valor:850},{desc:'NITRATO DE PRATA P.A',qtd:2,unid:'UN',valor:850}],historico:[{data:'01/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298240',titulo:'VALVULA ESFERA A C 1 1 2 SOLDA',fornecedor:'OCTAL VALV',valor:6800,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'08/03/2026',datasulPOId:'298240',rfqOrigem:'—',nfUpload:null,itens:[{desc:'VALVULA ESFERA A C 1 1 2 SOLDA',qtd:6,unid:'UN',valor:850},{desc:'VALVULA ESFERA A C 2 SOLDA',qtd:10,unid:'UN',valor:850},{desc:'CAP DN 8'' SCHD 40S',qtd:2,unid:'UN',valor:850},{desc:'TUBO A/C SCHD-40 S/ COSTURA 1.1/2" X 6000MM',qtd:4,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298239',titulo:'OLEO 100 VEGETAL BLEND 45 45 10 RSPO',fornecedor:'CRA 2',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'05/03/2026',datasulPOId:'298239',rfqOrigem:'—',nfUpload:null,itens:[{desc:'OLEO 100 VEGETAL BLEND 45 45 10 RSPO',qtd:35000,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298238',titulo:'SERVICOS MANUTENCAO DE MAQUINAS',fornecedor:'CAMPSELOSA',valor:850,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298238',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS MANUTENCAO DE MAQUINAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298237',titulo:'SERVICOS - MAO DE OBRA',fornecedor:'SOCADEIRAS',valor:850,status:'Recebido',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298237',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS - MAO DE OBRA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298236',titulo:'SERVICOS MANUT DE MAQUINAS MANUTENCAO ELETRICA',fornecedor:'YES ROBOTICA',valor:850,status:'Aprovacao',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298236',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS MANUT DE MAQUINAS MANUTENCAO ELETRICA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298235',titulo:'BRACO DOBRADOR DE ABA DO CARTUCHO RZ-DE-112-ME-00074',fornecedor:'FUSH FERRAME',valor:850,status:'Recebido',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'05/03/2026',previsaoEntrega:'27/03/2026',datasulPOId:'298235',rfqOrigem:'—',nfUpload:null,itens:[{desc:'BRACO DOBRADOR DE ABA DO CARTUCHO RZ-DE-112-ME-000',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298234',titulo:'HEXANO PA',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'02/02/2026',previsaoEntrega:'02/03/2026',datasulPOId:'298234',rfqOrigem:'—',nfUpload:null,itens:[{desc:'HEXANO PA',qtd:10,unid:'UN',valor:850},{desc:'HEXANO PA',qtd:10,unid:'UN',valor:850},{desc:'HEXANO PA',qtd:10,unid:'UN',valor:850},{desc:'HEXANO PA',qtd:10,unid:'UN',valor:850}],historico:[{data:'02/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298233',titulo:'SERVICOS MANUT DE MAQUINAS MANUTENCAO ELETRICA',fornecedor:'NEXIS SISTEM',valor:850,status:'Aprovacao',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298233',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS MANUT DE MAQUINAS MANUTENCAO ELETRICA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298231',titulo:'SERVICOS - MAO DE OBRA',fornecedor:'STELLA',valor:850,status:'Recebido',urgente:false,cc:'MANUTENCAO PREDIAL' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298231',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS - MAO DE OBRA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298229',titulo:'CLOROFORMIO P.A',fornecedor:'SINERGIA COM',valor:9350,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'01/02/2026',previsaoEntrega:'02/02/2026',datasulPOId:'298229',rfqOrigem:'—',nfUpload:null,itens:[{desc:'CLOROFORMIO P.A',qtd:3,unid:'UN',valor:850},{desc:'CLOROFORMIO P.A',qtd:3,unid:'UN',valor:850},{desc:'CLOROFORMIO P.A',qtd:3,unid:'UN',valor:850},{desc:'CLOROFORMIO P.A',qtd:3,unid:'UN',valor:850}],historico:[{data:'01/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298227',titulo:'ALCOOL METILICO P.A',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'20/02/2026',previsaoEntrega:'20/02/2026',datasulPOId:'298227',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ALCOOL METILICO P.A',qtd:4,unid:'UN',valor:850},{desc:'ALCOOL METILICO P.A',qtd:4,unid:'UN',valor:850},{desc:'ALCOOL METILICO P.A',qtd:4,unid:'UN',valor:850},{desc:'ALCOOL METILICO P.A',qtd:4,unid:'UN',valor:850}],historico:[{data:'20/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298226',titulo:'SERVICOS - MAO DE OBRA',fornecedor:'IMAUTOMATICH',valor:850,status:'Recebido',urgente:false,cc:'SABONETE' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298226',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS - MAO DE OBRA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298224',titulo:'CATRACA DE FREIO TRASEIRA MBB 1418 ATEGO',fornecedor:'MORELATE SUD',valor:850,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298224',rfqOrigem:'—',nfUpload:null,itens:[{desc:'CATRACA DE FREIO TRASEIRA MBB 1418 ATEGO',qtd:2,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298223',titulo:'APARELHO CELULAR',fornecedor:'MAGALU226',valor:850,status:'Aprovacao',urgente:false,cc:'INFORMATICA' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298223',rfqOrigem:'—',nfUpload:null,itens:[{desc:'APARELHO CELULAR',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298222',titulo:'ACIDO SULFURICO 0,5N',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'08/02/2026',previsaoEntrega:'02/03/2026',datasulPOId:'298222',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ACIDO SULFURICO 0,5N',qtd:2,unid:'UN',valor:850},{desc:'ACIDO SULFURICO 0,5N',qtd:2,unid:'UN',valor:850},{desc:'ACIDO SULFURICO 0,5N',qtd:2,unid:'UN',valor:850},{desc:'ACIDO SULFURICO 0,5N',qtd:2,unid:'UN',valor:850}],historico:[{data:'08/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298221',titulo:'SERVICOS LOCACAO DE EQUIP P RESIDUOS ORGANICOS',fornecedor:'LUVITECHAMB',valor:1700,status:'Recebido',urgente:false,cc:'SESMT' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298221',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS LOCACAO DE EQUIP P RESIDUOS ORGANICOS',qtd:1,unid:'UN',valor:850},{desc:'SERVICOS DESCARTE DE RESIDUOS C ISS',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298219',titulo:'TINTA PARA INKJET DOMINO',fornecedor:'SUNNYVALE',valor:1700,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298219',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TINTA PARA INKJET DOMINO',qtd:24,unid:'UN',valor:850},{desc:'SOLVENTE PARA INKJET DOMINO',qtd:24,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298218',titulo:'FRETES SOBRE COMPRAS',fornecedor:'GVSLOGR',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'05/03/2026',datasulPOId:'298218',rfqOrigem:'—',nfUpload:null,itens:[{desc:'FRETES SOBRE COMPRAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298217',titulo:'ACIDO CLORIDRICO 0,1N',fornecedor:'SINERGIA COM',valor:3400,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'02/02/2026',previsaoEntrega:'02/02/2026',datasulPOId:'298217',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ACIDO CLORIDRICO 0,1N',qtd:1,unid:'UN',valor:850},{desc:'ACIDO CLORIDRICO 0,1N',qtd:1,unid:'UN',valor:850},{desc:'ACIDO CLORIDRICO 0,1N',qtd:1,unid:'UN',valor:850},{desc:'ACIDO CLORIDRICO 0,1N',qtd:1,unid:'UN',valor:850}],historico:[{data:'02/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298216',titulo:'ACIDO ACETICO GLACIAL P.A',fornecedor:'SINERGIA COM',valor:8500,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'02/03/2026',previsaoEntrega:'02/03/2026',datasulPOId:'298216',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ACIDO ACETICO GLACIAL P.A',qtd:1,unid:'UN',valor:850},{desc:'ACIDO ACETICO GLACIAL P.A',qtd:1,unid:'UN',valor:850},{desc:'ACIDO ACETICO GLACIAL P.A',qtd:1,unid:'UN',valor:850},{desc:'ACIDO ACETICO GLACIAL P.A',qtd:1,unid:'UN',valor:850}],historico:[{data:'02/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298215',titulo:'ANEL VEDACAO P/ BACIA CERA ESTEVES',fornecedor:'CASANANCY',valor:5100,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298215',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ANEL VEDACAO P/ BACIA CERA ESTEVES',qtd:2,unid:'UN',valor:850},{desc:'PARAFUSO LUXO S-12 FIXAR BACIA (PAR)',qtd:2,unid:'UN',valor:850},{desc:'REPARO PARA CAIXA ACOPLADA DECA',qtd:2,unid:'UN',valor:850},{desc:'BROCA DE WIDEA SDS PLUS ROCAST 8 X160',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298214',titulo:'ACETONA P.A',fornecedor:'SINERGIA COM',valor:3400,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'02/02/2026',previsaoEntrega:'02/02/2026',datasulPOId:'298214',rfqOrigem:'—',nfUpload:null,itens:[{desc:'ACETONA P.A',qtd:1,unid:'UN',valor:850},{desc:'ACETONA P.A',qtd:1,unid:'UN',valor:850},{desc:'ACETONA P.A',qtd:1,unid:'UN',valor:850},{desc:'ACETONA P.A',qtd:11,unid:'UN',valor:850}],historico:[{data:'02/02/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298213',titulo:'SERVICOS MANUTENCAO MAQUINAS',fornecedor:'SMARTLIFTEL',valor:10200,status:'Aprovacao',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'04/04/2026',datasulPOId:'298213',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS MANUTENCAO MAQUINAS',qtd:1,unid:'UN',valor:850},{desc:'SERVICOS MANUTENCAO MAQUINAS',qtd:1,unid:'UN',valor:850},{desc:'SERVICOS MANUTENCAO MAQUINAS',qtd:1,unid:'UN',valor:850},{desc:'SERVICOS MANUTENCAO MAQUINAS',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298212',titulo:'SODA CAUSTICA EM ESCAMAS',fornecedor:'UNIPAR',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'04/05/2026',datasulPOId:'298212',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SODA CAUSTICA EM ESCAMAS',qtd:1650,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298211',titulo:'PLANTAPON LGC SORB',fornecedor:'BASF S.A.',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'04/05/2026',datasulPOId:'298211',rfqOrigem:'—',nfUpload:null,itens:[{desc:'PLANTAPON LGC SORB',qtd:2240,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298210',titulo:'POLISSORBATO 60',fornecedor:'CRODA',valor:850,status:'Recebido',urgente:false,cc:'PCP' ,emissao:'05/03/2026',previsaoEntrega:'04/05/2026',datasulPOId:'298210',rfqOrigem:'—',nfUpload:null,itens:[{desc:'POLISSORBATO 60',qtd:1700,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298209',titulo:'SERVICOS - MAO DE OBRA',fornecedor:'AGUAVITALMA',valor:850,status:'Recebido',urgente:false,cc:'PCM' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298209',rfqOrigem:'—',nfUpload:null,itens:[{desc:'SERVICOS - MAO DE OBRA',qtd:1,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]},
    {id:'PC-298208',titulo:'TAMBOR VAZIO DE 200 LITROS COM TAMPA',fornecedor:'VICTOR YUDI',valor:850,status:'Recebido',urgente:false,cc:'QUALIDADE' ,emissao:'05/03/2026',previsaoEntrega:'06/03/2026',datasulPOId:'298208',rfqOrigem:'—',nfUpload:null,itens:[{desc:'TAMBOR VAZIO DE 200 LITROS COM TAMPA',qtd:30,unid:'UN',valor:850}],historico:[{data:'05/03/2026',acao:'Pedido importado do Datasul',user:'Sistema',cor:'blue'}]}
  ],
  requisicoes: [
    {id:'REQ-51813',descricao:'SERVICOS CONTRATADOS',solicitante:'vvidotto · INFORMATICA',valor:3200,prioridade:'Alta',status:'Aprovada',cc:'INFORMATICA',categoria:'MRO',data:'17/04/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-53002',descricao:'GAS GLP ENVASADO',solicitante:'nalves · FREGUESIA CAMPINAS',valor:6400,prioridade:'Média',status:'Em análise',cc:'FREGUESIA CAMPINAS',categoria:'MRO',data:'07/05/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-61781',descricao:'GAIOLA PARA ARMAZENAMENTO P/ ARAMADA DIVISORIA',solicitante:'lteixeira · SABONETE',valor:9600,prioridade:'Baixa',status:'Aprovada',cc:'SABONETE',categoria:'MRO',data:'05/09/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-62170',descricao:'ADESIVO DE PERIGO',solicitante:'nsantana · QUALIDADE',valor:12800,prioridade:'Alta',status:'Aprovada',cc:'QUALIDADE',categoria:'MRO',data:'11/09/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-63500',descricao:'SLIDING BLOCK REXROTH KWD 025 SNS C1 N 1 5122348 IMA',solicitante:'nsalles · PCM',valor:16000,prioridade:'Média',status:'Em análise',cc:'PCM',categoria:'MRO',data:'01/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-63500',descricao:'MOBILE CLAMP DOWEL COD B582296 IMA',solicitante:'nsalles · PCM',valor:19200,prioridade:'Baixa',status:'Em análise',cc:'PCM',categoria:'MRO',data:'01/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-63500',descricao:'INNER TUBE VEROL CL15CAGS COD 5934289 IMA',solicitante:'nsalles · PCM',valor:22400,prioridade:'Alta',status:'Em análise',cc:'PCM',categoria:'MRO',data:'01/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-63897',descricao:'SERVICOS DESCARTE DE RESIDUOS C ISS IR PCC',solicitante:'mcesario · SESMT',valor:25600,prioridade:'Média',status:'Aprovada',cc:'SESMT',categoria:'MRO',data:'08/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-64721',descricao:'RODO EM PLASTICO',solicitante:'jhalmeida · QUALIDADE',valor:28800,prioridade:'Baixa',status:'Aprovada',cc:'QUALIDADE',categoria:'MRO',data:'20/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-64772',descricao:'ÓCULOS SEG GRAD MULTIFOCAL ICARO CA 20406',solicitante:'asilva · SESMT',valor:32000,prioridade:'Alta',status:'Aprovada',cc:'SESMT',categoria:'MRO',data:'21/10/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-65675',descricao:'RETENTOR 45X65X10MM NBR',solicitante:'nsalles · PCM',valor:35200,prioridade:'Média',status:'Aprovada',cc:'PCM',categoria:'MRO',data:'03/11/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-65942',descricao:'SERVICOS - ADMINISTRATIVO INFORMATICA -S/ISS',solicitante:'vvidotto · INFORMATICA',valor:38400,prioridade:'Baixa',status:'Em análise',cc:'INFORMATICA',categoria:'MRO',data:'06/11/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-66419',descricao:'PASTA DE SILICONE VERONESI',solicitante:'nsalles · PCM',valor:41600,prioridade:'Alta',status:'Em análise',cc:'PCM',categoria:'MRO',data:'13/11/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-66725',descricao:'REFLETOR LED 100W 6000K 7500LM IP65',solicitante:'nsalles · PCM',valor:44800,prioridade:'Média',status:'Aprovada',cc:'PCM',categoria:'MRO',data:'18/11/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'},
    {id:'REQ-66952',descricao:'PERFIL CARTOLA 20X35X50X35X20 X2000 1 8 GALVANIZA',solicitante:'nsantana · QUALIDADE',valor:48000,prioridade:'Baixa',status:'Em análise',cc:'QUALIDADE',categoria:'MRO',data:'21/11/2025',dataNecessaria:'31/03/2026',justificativa:'Solicitação importada do Datasul.'}
  ],
  usuarios: [
    {id:'U001',nome:'Carlos Dantas',email:'cdantas@razzo.com.br',perfil:'Admin',cc:'Compras',status:'Ativo',criadoEm:'01/04/2023',avatar:'CD',ultimoAcesso:'Há 1 dias'},
    {id:'U002',nome:'Lina Sousa',email:'linsousa@razzo.com.br',perfil:'Comprador',cc:'Produção',status:'Ativo',criadoEm:'01/04/2023',avatar:'LS',ultimoAcesso:'Há 2 dias'},
    {id:'U003',nome:'Felipe Juca',email:'fjuca@razzo.com.br',perfil:'Comprador',cc:'TI & Tecnologia',status:'Ativo',criadoEm:'01/04/2023',avatar:'FJ',ultimoAcesso:'Há 3 dias'},
    {id:'U004',nome:'Eduardo Rossi',email:'erossi@razzo.com.br',perfil:'Aprovador',cc:'Administrativo',status:'Ativo',criadoEm:'01/04/2023',avatar:'ER',ultimoAcesso:'Há 4 dias'},
    {id:'U005',nome:'Rafael Macena',email:'rmacena@razzo.com.br',perfil:'Comprador',cc:'Logística',status:'Ativo',criadoEm:'01/04/2023',avatar:'RM',ultimoAcesso:'Há 5 dias'},
    {id:'U006',nome:'João Cavalcante',email:'jvcavalcante@razzo.com.br',perfil:'Comprador',cc:'PCM',status:'Ativo',criadoEm:'01/04/2023',avatar:'JC',ultimoAcesso:'Há 6 dias'},
    {id:'U007',nome:'José Cardinale',email:'jcardinale@razzo.com.br',perfil:'Comprador',cc:'Manutenção',status:'Ativo',criadoEm:'01/04/2023',avatar:'JC',ultimoAcesso:'Há 7 dias'},
    {id:'U008',nome:'Fernando Santos',email:'fsantos@razzo.com.br',perfil:'Comprador',cc:'Compras',status:'Ativo',criadoEm:'01/04/2023',avatar:'FS',ultimoAcesso:'Há 8 dias'},
    {id:'U009',nome:'Eduardo Viana',email:'eviana@razzo.com.br',perfil:'Solicitante',cc:'Produção',status:'Ativo',criadoEm:'01/04/2023',avatar:'EV',ultimoAcesso:'Há 9 dias'},
    {id:'U010',nome:'Lara Dias',email:'ladias@razzo.com.br',perfil:'Solicitante',cc:'TI & Tecnologia',status:'Ativo',criadoEm:'01/04/2023',avatar:'LD',ultimoAcesso:'Há 10 dias'},
    {id:'U011',nome:'Nelson Bessa',email:'nbessa@razzo.com.br',perfil:'Aprovador',cc:'Administrativo',status:'Ativo',criadoEm:'01/04/2023',avatar:'NB',ultimoAcesso:'Há 11 dias'},
    {id:'U012',nome:'Diego Medeiros',email:'dmedeiros@razzo.com.br',perfil:'Comprador',cc:'Logística',status:'Ativo',criadoEm:'01/04/2023',avatar:'DM',ultimoAcesso:'Há 12 dias'}
  ],
};

// Injetar na base do BidFlow
if (typeof MOCK !== 'undefined') {
  MOCK.fornecedores = RAZZO_DATA.fornecedores;
  MOCK.pedidos      = [...RAZZO_DATA.pedidos, ...MOCK.pedidos].slice(0, 100);
  MOCK.requisicoes  = [...RAZZO_DATA.requisicoes, ...MOCK.requisicoes].slice(0, 30);
  MOCK.usuarios     = RAZZO_DATA.usuarios;
  if (typeof BF !== 'undefined') {
    BF.db.fornecedores = MOCK.fornecedores;
    BF.db.pedidos      = MOCK.pedidos;
    BF.db.requisicoes  = MOCK.requisicoes;
    BF.db.usuarios     = MOCK.usuarios;
  }
  console.log('[BidFlow] Base Razzo carregada:', {
    fornecedores: MOCK.fornecedores.length,
    pedidos: MOCK.pedidos.length,
    requisicoes: MOCK.requisicoes.length,
    usuarios: MOCK.usuarios.length,
  });
}

showPage('dashboard');
// ══════════════════════════════════════════════════════════════════
// COMPONENTES EXTERNOS (inline para single-file)
// Em produção: <script src="components/db.js">
// ══════════════════════════════════════════════════════════════════
/**
 * BidFlow — Mock Database
 * ─────────────────────────────────────────────────────────────────
 * Fonte única de dados para todos os componentes.
 * Quando integrar com Datasul/Supabase, substituir cada
 * objeto por uma chamada à função correspondente em api.js.
 * ─────────────────────────────────────────────────────────────────
 */

// BF already declared

BF.db = {

  // ── USUÁRIOS INTERNOS ──────────────────────────────────────────
  usuarios: [
    { id:'U001', nome:'Maria Ribeiro',  email:'maria.ribeiro@razzo.com.br',  perfil:'Admin',    cc:'Compras',           status:'Ativo',  criadoEm:'01/01/2026', avatar:'MR', ultimoAcesso:'Hoje 09:14' },
    { id:'U002', nome:'Ana Ferreira',   email:'ana.ferreira@razzo.com.br',   perfil:'Comprador',cc:'TI & Tecnologia',   status:'Ativo',  criadoEm:'01/02/2026', avatar:'AF', ultimoAcesso:'Hoje 08:50' },
    { id:'U003', nome:'Carlos Mendes',  email:'carlos.mendes@razzo.com.br',  perfil:'Aprovador',cc:'Administrativo',    status:'Ativo',  criadoEm:'01/02/2026', avatar:'CM', ultimoAcesso:'Ontem 17:30' },
    { id:'U004', nome:'João Souza',     email:'joao.souza@razzo.com.br',     perfil:'Comprador',cc:'TI & Tecnologia',   status:'Ativo',  criadoEm:'15/02/2026', avatar:'JS', ultimoAcesso:'Ontem 16:00' },
    { id:'U005', nome:'Paula Lima',     email:'paula.lima@razzo.com.br',     perfil:'Solicitante',cc:'Produção',        status:'Ativo',  criadoEm:'15/02/2026', avatar:'PL', ultimoAcesso:'Há 3 dias' },
    { id:'U006', nome:'Roberto Alves',  email:'roberto.alves@razzo.com.br',  perfil:'Diretor',  cc:'Diretoria',         status:'Ativo',  criadoEm:'01/01/2026', avatar:'RA', ultimoAcesso:'Hoje 10:00' },
    { id:'U007', nome:'Fernanda Costa', email:'fernanda.costa@razzo.com.br', perfil:'Solicitante',cc:'RH',              status:'Inativo',criadoEm:'01/03/2026', avatar:'FC', ultimoAcesso:'Há 7 dias' },
  ],

  perfis: [
    { id:'Admin',      label:'Administrador', desc:'Acesso total ao portal',                     cor:'chip-red'   },
    { id:'Comprador',  label:'Comprador',      desc:'Cria RFQs, gerencia pedidos',                cor:'chip-blue'  },
    { id:'Aprovador',  label:'Aprovador',      desc:'Aprova pedidos e cotações por alçada',       cor:'chip-amber' },
    { id:'Diretor',    label:'Diretor',        desc:'Aprovação final acima de R$ 50K',            cor:'chip-purple'},
    { id:'Solicitante',label:'Solicitante',    desc:'Cria requisições de compra',                 cor:'chip-green' },
  ],

  // ── FORNECEDORES ───────────────────────────────────────────────
  // [Datasul] GET /dts/datasul-rest/resources/prg/fin/v1/holderPublic
  fornecedores: [
    {
      id:'F001', sigla:'TS', razaoSocial:'TechSupply LTDA', nomeFantasia:'TechSupply',
      cnpj:'12.345.678/0001-90', ie:'123.456.789.000', im:'',
      email:'vendas@techsupply.com.br', emailNF:'nf@techsupply.com.br',
      telefone:'(11) 3333-4444', celular:'(11) 99999-1111',
      contato:'Pedro Henrique', cargo:'Gerente Comercial',
      cep:'01310-100', logradouro:'Av. Paulista', numero:'1000', complemento:'CJ 51',
      bairro:'Bela Vista', cidade:'São Paulo', uf:'SP',
      categoria:'TI & Tecnologia', score:9.2, status:'Aprovado',
      contratos:'3 ativos', ultimo:'12 Mar 2026',
      banco:'Itaú', agencia:'1234', conta:'56789-0', pix:'12345678000190',
      // Portal fornecedor
      portalToken:'tkn_F001_abc123', portalSenha:'$2b$10$hash', portalAtivo:true,
      // [Datasul] holderCode mapeado ao ser sincronizado
      datasulCode:'0012345',
      criadoEm:'10/01/2026', homologadoEm:'15/01/2026',
      docs:{ contratSocial:true, certidaoNegativa:true, alvara:true, regularidadeFiscal:true },
    },
    {
      id:'F002', sigla:'OP', razaoSocial:'OfficePro Express LTDA', nomeFantasia:'OfficePro',
      cnpj:'98.765.432/0001-11', ie:'987.654.321.000', im:'',
      email:'comercial@officepro.com.br', emailNF:'fiscal@officepro.com.br',
      telefone:'(11) 4444-5555', celular:'(11) 98888-2222',
      contato:'Marina Souza', cargo:'Diretora Comercial',
      cep:'04538-133', logradouro:'Av. Brigadeiro Faria Lima', numero:'2100', complemento:'',
      bairro:'Jardim Paulistano', cidade:'São Paulo', uf:'SP',
      categoria:'MRO', score:8.5, status:'Aprovado',
      contratos:'1 ativo', ultimo:'10 Mar 2026',
      banco:'Bradesco', agencia:'5678', conta:'12345-6', pix:'98765432000111',
      portalToken:'tkn_F002_def456', portalSenha:'$2b$10$hash2', portalAtivo:true,
      datasulCode:'0098765',
      criadoEm:'12/01/2026', homologadoEm:'20/01/2026',
      docs:{ contratSocial:true, certidaoNegativa:true, alvara:false, regularidadeFiscal:true },
    },
    {
      id:'F003', sigla:'LM', razaoSocial:'LogiMaster Transportes LTDA', nomeFantasia:'LogiMaster',
      cnpj:'55.111.222/0001-33', ie:'555.111.222.000', im:'',
      email:'licitacao@logimaster.com.br', emailNF:'nfe@logimaster.com.br',
      telefone:'(11) 5555-6666', celular:'',
      contato:'Roberto Farias', cargo:'Coordenador Comercial',
      cep:'09210-580', logradouro:'Rua Industrial', numero:'500', complemento:'Galpão 3',
      bairro:'Centro', cidade:'Santo André', uf:'SP',
      categoria:'Logística', score:7.0, status:'Homologando',
      contratos:'—', ultimo:'08 Mar 2026',
      banco:'', agencia:'', conta:'', pix:'',
      portalToken:'tkn_F003_ghi789', portalSenha:'', portalAtivo:false,
      datasulCode:'',
      criadoEm:'01/03/2026', homologadoEm:'',
      docs:{ contratSocial:true, certidaoNegativa:false, alvara:false, regularidadeFiscal:false },
    },
  ],

  // Convites de cadastro pendentes
  convitesCadastro: [
    { token:'invite_new_001', email:'compras@datamax.com.br',   nome:'DataMax Informática',    enviadoPor:'Maria Ribeiro', enviadoEm:'17/03/2026 10:00', expiraEm:'20/03/2026 10:00', usado:false },
    { token:'invite_new_002', email:'adm@servilimpo.com.br',    nome:'ServiLimpo LTDA',         enviadoPor:'Carlos Mendes', enviadoEm:'17/03/2026 14:00', expiraEm:'20/03/2026 14:00', usado:false },
  ],

  // ── RFQs ───────────────────────────────────────────────────────
  // [Datasul] GET/POST /dts/datasul-rest/resources/prg/mcc/v1/purchQuotationPublic
  rfqs: [
    {
      id:'RFQ-2024-0891', titulo:'Notebooks e Periféricos TI',
      status:'Em andamento', prazo:'20/03/2026 18:00', vence:'2026-03-20T18:00',
      respostas:3, totalFornecedores:5, valorEstimado:45000,
      requisicaoOrigem:'REQ-2204', comprador:'Ana Ferreira', cc:'TI & Tecnologia', categoria:'Equipamentos',
      observacoes:'Garantia mínima 12 meses. Entrega em até 15 dias úteis.',
      datasulOrdemId:'OC-2024-0450',
      itens:[
        { id:1, desc:'Notebook Dell i7 16GB 512SSD', qtd:10, unid:'UN', valorRef:7000 },
        { id:2, desc:'Mouse sem fio Logitech M330',  qtd:20, unid:'UN', valorRef:95   },
        { id:3, desc:'Monitor 27" 4K LG UHD',        qtd:5,  unid:'UN', valorRef:2200 },
      ],
      fornecedoresConvidados:[
        { id:'F001', nome:'TechSupply LTDA',    email:'vendas@techsupply.com.br',  status:'Respondeu',  linkToken:'link_rfq891_F001' },
        { id:'F002', nome:'OfficePro Express',  email:'comercial@officepro.com.br',status:'Aguardando', linkToken:'link_rfq891_F002' },
        { id:'F004', nome:'DataMax Informática',email:'compras@datamax.com.br',    status:'Respondeu',  linkToken:'link_rfq891_F004' },
        { id:'F005', nome:'InfoCorp Solutions', email:'rh@infocorp.com.br',        status:'Respondeu',  linkToken:'link_rfq891_F005' },
        { id:'F006', nome:'ByteStore',          email:'vendas@bytestore.com.br',   status:'Aguardando', linkToken:'link_rfq891_F006' },
      ],
      propostas:[
        { fornId:'F001', fornNome:'TechSupply',  recebida:'16/03 14h', validade:'30/03/2026', prazoEntrega:'10 dias úteis', frete:'Incluso', condicaoPagto:'30 ddl', garantia:'12 meses',
          itens:[{id:1,valor:7200,obs:''},{id:2,valor:89,obs:''},{id:3,valor:2100,obs:'LG 27UL550'}] },
        { fornId:'F004', fornNome:'DataMax',     recebida:'16/03 16h', validade:'28/03/2026', prazoEntrega:'12 dias úteis', frete:'R$ 350',  condicaoPagto:'28 ddl', garantia:'12 meses',
          itens:[{id:1,valor:7650,obs:''},{id:2,valor:89,obs:''},{id:3,valor:1980,obs:'Samsung 27"'}] },
        { fornId:'F005', fornNome:'InfoCorp',    recebida:'17/03 09h', validade:'25/03/2026', prazoEntrega:'15 dias úteis', frete:'Incluso', condicaoPagto:'21 ddl', garantia:'6 meses',
          itens:[{id:1,valor:7950,obs:''},{id:2,valor:110,obs:''},{id:3,valor:2250,obs:''}] },
      ],
      historico:[
        { data:'14/03 10h', acao:'RFQ criada', user:'Ana Ferreira', cor:'blue' },
        { data:'14/03 10h', acao:'5 fornecedores convidados por e-mail + WhatsApp', user:'Sistema', cor:'blue' },
        { data:'16/03 14h', acao:'TechSupply enviou proposta via portal', user:'Sistema', cor:'green' },
        { data:'16/03 16h', acao:'DataMax enviou proposta via portal',    user:'Sistema', cor:'green' },
        { data:'17/03 09h', acao:'InfoCorp enviou proposta via portal',   user:'Sistema', cor:'green' },
        { data:'17/03 11h', acao:'Lembrete enviado para OfficePro e ByteStore', user:'Sistema', cor:'amber' },
      ]
    },
    {
      id:'RFQ-2024-0890', titulo:'Serviços de Limpeza — Contrato Anual',
      status:'Análise', prazo:'15/03/2026 — Encerrado', vence:'2026-03-15T18:00',
      respostas:3, totalFornecedores:3, valorEstimado:120000,
      requisicaoOrigem:'REQ-2199', comprador:'Carlos Mendes', cc:'Administrativo', categoria:'Serviços',
      observacoes:'Contrato anual com visitas diárias. Incluso material de limpeza.',
      datasulOrdemId:'OC-2024-0448',
      itens:[
        { id:1, desc:'Limpeza diária escritórios (12 meses)', qtd:1,  unid:'CONTRATO', valorRef:100000 },
        { id:2, desc:'Material de limpeza mensal',            qtd:12, unid:'KIT',      valorRef:1500   },
      ],
      fornecedoresConvidados:[
        { id:'F007', nome:'LimpFácil Serviços', email:'licitacao@limpfacil.com.br', status:'Respondeu', linkToken:'link_rfq890_F007' },
        { id:'F008', nome:'CleanPro',           email:'vendas@cleanpro.com.br',     status:'Respondeu', linkToken:'link_rfq890_F008' },
        { id:'F009', nome:'HigieneMax',         email:'rh@higienemax.com.br',       status:'Respondeu', linkToken:'link_rfq890_F009' },
      ],
      propostas:[
        { fornId:'F007', fornNome:'LimpFácil',  recebida:'14/03 10h', validade:'30/03', prazoEntrega:'Imediato', frete:'—', condicaoPagto:'30 ddl', garantia:'—',
          itens:[{id:1,valor:96000,obs:''},{id:2,valor:1200,obs:'Material incluso'}] },
        { fornId:'F008', fornNome:'CleanPro',   recebida:'14/03 14h', validade:'31/03', prazoEntrega:'Imediato', frete:'—', condicaoPagto:'28 ddl', garantia:'—',
          itens:[{id:1,valor:102000,obs:''},{id:2,valor:1400,obs:''}] },
        { fornId:'F009', fornNome:'HigieneMax', recebida:'15/03 09h', validade:'28/03', prazoEntrega:'5 dias',   frete:'—', condicaoPagto:'30 ddl', garantia:'—',
          itens:[{id:1,valor:94000,obs:'10% antecipado'},{id:2,valor:1100,obs:''}] },
      ],
      historico:[
        { data:'10/03 09h', acao:'RFQ criada e enviada', user:'Carlos Mendes', cor:'blue' },
        { data:'14/03 10h', acao:'LimpFácil enviou proposta', user:'Sistema', cor:'green' },
        { data:'14/03 14h', acao:'CleanPro enviou proposta',  user:'Sistema', cor:'green' },
        { data:'15/03 09h', acao:'HigieneMax enviou proposta',user:'Sistema', cor:'green' },
        { data:'15/03 18h', acao:'RFQ encerrada automaticamente', user:'Sistema', cor:'amber' },
      ]
    },
  ],

  // ── PEDIDOS DE COMPRA ──────────────────────────────────────────
  pedidos: [
    { id:'PC-2024-1104', titulo:'Servidor Dell PowerEdge R740', fornecedor:'TechSupply LTDA',   valor:87400, status:'Aprovacao', urgente:true,
      rfqOrigem:'—', datasulPOId:'', previsaoEntrega:'30/03/2026',
      itens:[{ desc:'Servidor Dell PowerEdge R740', qtd:1, unid:'UN', valor:87400 }],
      nfUpload: null,
    },
    { id:'PC-2024-1102', titulo:'Licenças Microsoft 365',       fornecedor:'TechSupply LTDA',   valor:24000, status:'Aprovado',  urgente:false,
      rfqOrigem:'RFQ-2024-0887', datasulPOId:'PO-2024-1102', previsaoEntrega:'25/03/2026',
      itens:[{ desc:'Microsoft 365 Business (50 licenças)', qtd:50, unid:'LIC', valor:480 }],
      nfUpload: null,
    },
    { id:'PC-2024-1099', titulo:'Cabos e Conectores',           fornecedor:'OfficePro Express', valor:3100,  status:'Transito',  urgente:false,
      rfqOrigem:'RFQ-2024-0885', datasulPOId:'PO-2024-1099', previsaoEntrega:'18/03/2026',
      itens:[{ desc:'Cabo HDMI 2m', qtd:20, unid:'UN', valor:45 }, { desc:'Adaptador USB-C', qtd:30, unid:'UN', valor:65 }],
      nfUpload: { numero:'NF-4522', valor:3100, arquivo:'nf_4522.xml', status:'Aguardando conciliação' },
    },
    { id:'PC-2024-1095', titulo:'Impressoras HP A4',            fornecedor:'OfficePro Express', valor:6800,  status:'Recebido',  urgente:false,
      rfqOrigem:'RFQ-2024-0880', datasulPOId:'PO-2024-1095', previsaoEntrega:'14/03/2026',
      itens:[{ desc:'Impressora HP LaserJet Pro M404n', qtd:2, unid:'UN', valor:3200 }, { desc:'Toner HP CF259A', qtd:4, unid:'UN', valor:250 }],
      nfUpload: { numero:'NF-4520', valor:6800, arquivo:'nf_4520.xml', status:'Conciliada' },
    },
  ],

  // ── NOTAS FISCAIS ──────────────────────────────────────────────
  notasFiscais: [
    { id:'NF001', numero:'NF-4522', fornecedor:'OfficePro Express', fornId:'F002', pedidoId:'PC-2024-1099', valor:3100,  emissao:'16/03/2026', status:'Aguardando', matching:'Pendente', arquivo:'nf_4522.xml', chaveNFe:'' },
    { id:'NF002', numero:'NF-4521', fornecedor:'TechSupply LTDA',   fornId:'F001', pedidoId:'',             valor:3200,  emissao:'01/03/2026', status:'Vencida',    matching:'Pendente', arquivo:'nf_4521.xml', chaveNFe:'' },
    { id:'NF003', numero:'NF-4520', fornecedor:'OfficePro Express', fornId:'F002', pedidoId:'PC-2024-1095', valor:6800,  emissao:'14/03/2026', status:'Conciliada', matching:'OK',       arquivo:'nf_4520.xml', chaveNFe:'' },
    { id:'NF004', numero:'NF-4519', fornecedor:'TechSupply LTDA',   fornId:'F001', pedidoId:'PC-2024-1102', valor:24000, emissao:'14/03/2026', status:'Aguardando', matching:'Pendente', arquivo:'nf_4519.xml', chaveNFe:'' },
  ],

  // ── PORTAL FORNECEDOR — propostas recebidas ────────────────────
  propostasFornecedor: [],

  // Sessão atual do portal do fornecedor (simulada por token na URL)
  sessaoFornecedor: null,
};

// ─── Helpers globais ─────────────────────────────────────────────
BF.fmt = {
  brl:     v => 'R$ ' + (v >= 1000 ? (v/1000).toFixed(0)+'K' : Number(v).toLocaleString('pt-BR')),
  brlFull: v => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits:2 }),
  date:    d => d,
};

BF.token = {
  // Gera token único para convites (em produção: UUID v4 no backend)
  generate: () => 'tkn_' + Math.random().toString(36).slice(2) + '_' + Date.now(),
};

BF.notify = {
  // Em produção: chama api.js enviarConviteRFQ / enviarLinkCadastroFornecedor
  email: (para, assunto, msg) => console.log(`[Email] Para:${para} | ${assunto} | ${msg}`),
  whatsapp: (para, msg) => console.log(`[WhatsApp] Para:${para} | ${msg}`),
};


// ── Users Module ──────────────────────────────────────────────────
/**
 * BidFlow — Componente: Gestão de Usuários
 * ─────────────────────────────────────────────────────────────────
 * Responsável por: listar, criar, editar, desativar usuários internos
 * e gerenciar convites de cadastro para fornecedores.
 *
 * Manutenção: se algo der errado em usuários, procure aqui.
 * ─────────────────────────────────────────────────────────────────
 */

const UsersModule = (function () {

  // ── Perfis e permissões ──────────────────────────────────────────
  const PERFIS = [
    { id:'Admin',       label:'Administrador', cor:'chip-red',    permissoes:['tudo']                        },
    { id:'Comprador',   label:'Comprador',      cor:'chip-blue',   permissoes:['rfq','pedidos','fornecedores'] },
    { id:'Aprovador',   label:'Aprovador',      cor:'chip-amber',  permissoes:['aprovacoes']                  },
    { id:'Diretor',     label:'Diretor',        cor:'chip-purple', permissoes:['aprovacoes_alto_valor']       },
    { id:'Solicitante', label:'Solicitante',    cor:'chip-green',  permissoes:['requisicoes']                 },
  ];

  const ALCADAS = [
    { perfil:'Solicitante', limite:0 },
    { perfil:'Comprador',   limite:10000 },
    { perfil:'Aprovador',   limite:50000 },
    { perfil:'Diretor',     limite:999999999 },
  ];

  // ── CSS ──────────────────────────────────────────────────────────
  const CSS = `
  .usr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-bottom:20px}
  .usr-card{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px;box-shadow:var(--shadow);position:relative;transition:border-color .15s}
  .usr-card:hover{border-color:var(--navy-mid)}
  .usr-card.inactive{opacity:.6}
  .usr-card-header{display:flex;align-items:center;gap:12px;margin-bottom:12px}
  .usr-avatar{width:40px;height:40px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#fff;flex-shrink:0}
  .usr-name{font-size:14px;font-weight:600;color:var(--text)}
  .usr-email{font-size:12px;color:var(--text-3)}
  .usr-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
  .usr-meta{font-size:12px;color:var(--text-3);margin-bottom:12px;line-height:1.6}
  .usr-actions{display:flex;gap:8px}
  .usr-status-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:5px}
  .usr-status-dot.ativo{background:var(--green)}
  .usr-status-dot.inativo{background:var(--text-3)}

  .invite-card{background:var(--amber-light);border:1px solid rgba(217,119,6,.3);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:10px}
  .invite-info{flex:1}
  .invite-title{font-size:13.5px;font-weight:500;color:var(--text)}
  .invite-sub{font-size:12px;color:var(--text-3);margin-top:2px}
  .invite-exp{font-size:11.5px;color:var(--amber);font-weight:600}

  .alcada-table{width:100%;border-collapse:collapse}
  .alcada-table th{background:var(--bg-3);padding:10px 14px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--text-3);font-weight:600;border-bottom:1px solid var(--border)}
  .alcada-table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13.5px;color:var(--text-2)}
  `;

  // ── HTML: página completa ─────────────────────────────────────────
  function renderHTML() {
    return `
    <div class="page-header">
      <div>
        <h1 class="page-title">Usuários & Acessos</h1>
        <p class="page-subtitle" id="usr-subtitle">Gerencie usuários internos, perfis e convites de fornecedores</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="UsersModule.abrirConviteFornecedor()">Convidar Fornecedor</button>
        <button class="btn btn-primary" onclick="UsersModule.abrirModal()">+ Novo Usuário</button>
      </div>
    </div>

    <!-- Sub-abas -->
    <div style="display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px">
      <button class="rfq-tab active" id="usr-tab-usuarios" onclick="UsersModule.subTab('usuarios')">Usuários Internos</button>
      <button class="rfq-tab" id="usr-tab-perfis" onclick="UsersModule.subTab('perfis')">Perfis & Alçadas</button>
      <button class="rfq-tab" id="usr-tab-convites" onclick="UsersModule.subTab('convites')">Convites Fornecedor <span class="badge badge-warn" id="convites-badge">0</span></button>
    </div>

    <!-- Usuarios -->
    <div id="usr-sec-usuarios">
      <div class="filter-bar" style="margin-bottom:16px">
        <div class="filter-search">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="usr-search" placeholder="Buscar por nome ou e-mail..." oninput="UsersModule.filtrar()">
        </div>
        <select class="filter-select" id="usr-filter-perfil" onchange="UsersModule.filtrar()">
          <option value="">Todos os perfis</option>
          ${PERFIS.map(p=>`<option value="${p.id}">${p.label}</option>`).join('')}
        </select>
        <select class="filter-select" id="usr-filter-status" onchange="UsersModule.filtrar()">
          <option value="">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>
      <div class="usr-grid" id="usr-grid"></div>
    </div>

    <!-- Perfis & Alçadas -->
    <div id="usr-sec-perfis" style="display:none">
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><h3 class="card-title">Perfis de Acesso</h3></div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
          ${PERFIS.map(p=>`
          <div style="background:var(--bg-3);border:1px solid var(--border);border-radius:10px;padding:14px">
            <span class="chip ${p.cor}" style="margin-bottom:8px;display:inline-block">${p.label}</span>
            <div style="font-size:12.5px;color:var(--text-2);line-height:1.5">${
              p.id==='Admin'?'Acesso total ao portal':
              p.id==='Comprador'?'Cria RFQs, cotações e pedidos':
              p.id==='Aprovador'?'Aprova documentos por alçada':
              p.id==='Diretor'?'Aprovação final acima de R$ 50K':
              'Cria requisições de compra'
            }</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">Alçadas de Aprovação</h3></div>
        <table class="alcada-table">
          <thead><tr><th>Perfil</th><th>Limite de Aprovação</th><th>Aprovação Automática</th></tr></thead>
          <tbody>
            ${ALCADAS.map(a=>`<tr>
              <td><span class="chip ${PERFIS.find(p=>p.id===a.perfil)?.cor||'chip-blue'}">${a.perfil}</span></td>
              <td style="font-weight:600">${a.limite===0?'Apenas criação':a.limite===999999999?'Sem limite':'Até '+BF.fmt.brl(a.limite)}</td>
              <td>${a.limite===0?'—':'Dentro do limite'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Convites -->
    <div id="usr-sec-convites" style="display:none">
      <div style="margin-bottom:16px;font-size:13.5px;color:var(--text-2)">
        Envie links de cadastro para novos fornecedores. O link expira em 72h e permite que o fornecedor se cadastre no portal.
        Após aprovação, os dados são enviados automaticamente ao Datasul.
      </div>
      <div id="convites-list"></div>
      <button class="btn btn-primary" style="margin-top:8px" onclick="UsersModule.abrirConviteFornecedor()">+ Novo Convite</button>
    </div>

    <!-- Modal Usuário -->
    <div class="modal-overlay" id="usrModal" onclick="if(event.target===this)UsersModule.fecharModal()">
      <div class="modal" style="width:560px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2 id="usr-modal-title">Novo Usuário</h2>
          <button class="modal-close" onclick="UsersModule.fecharModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label>Nome Completo *</label><input type="text" class="form-input" id="usr-f-nome" placeholder="Nome do colaborador"></div>
            <div class="form-group"><label>E-mail corporativo *</label><input type="email" class="form-input" id="usr-f-email" placeholder="nome@razzo.com.br"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Perfil de Acesso *</label>
              <select class="form-input" id="usr-f-perfil">
                <option value="">Selecione...</option>
                ${PERFIS.map(p=>`<option value="${p.id}">${p.label}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label>Centro de Custo</label>
              <select class="form-input" id="usr-f-cc">
                <option value="">Selecione...</option>
                <option>TI & Tecnologia</option><option>Administrativo</option><option>Produção</option>
                <option>Logística</option><option>RH</option><option>Financeiro</option><option>Compras</option><option>Diretoria</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label>Senha temporária *</label>
            <input type="password" class="form-input" id="usr-f-senha" placeholder="Mínimo 8 caracteres">
            <span style="font-size:11.5px;color:var(--text-3)">O usuário será solicitado a trocar na 1ª entrada.</span>
          </div>
          <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--navy);margin-top:4px">
            📧 Um e-mail de boas-vindas com link de acesso será enviado automaticamente após a criação.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="UsersModule.fecharModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="UsersModule.criarUsuario()">Criar Usuário</button>
        </div>
      </div>
    </div>

    <!-- Modal Convite Fornecedor -->
    <div class="modal-overlay" id="conviteModal" onclick="if(event.target===this)UsersModule.fecharConviteModal()">
      <div class="modal" style="width:500px" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Convidar Fornecedor</h2>
          <button class="modal-close" onclick="UsersModule.fecharConviteModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label>Nome da Empresa *</label><input type="text" class="form-input" id="conv-nome" placeholder="Razão social ou nome fantasia"></div>
          <div class="form-group"><label>E-mail do Contato Comercial *</label><input type="email" class="form-input" id="conv-email" placeholder="comercial@fornecedor.com.br"></div>
          <div class="form-group"><label>Categoria Esperada</label>
            <select class="form-input" id="conv-cat">
              <option value="">Selecione...</option>
              <option>TI & Tecnologia</option><option>MRO</option><option>Serviços</option>
              <option>Logística</option><option>Material de Escritório</option><option>Outros</option>
            </select>
          </div>
          <div class="form-group"><label>Mensagem personalizada (opcional)</label>
            <textarea class="form-input" id="conv-msg" rows="3" placeholder="Ex: Você foi indicado para nosso processo de homologação de fornecedores..."></textarea>
          </div>
          <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;font-size:13px;color:var(--navy)">
            🔗 Será gerado um link único válido por 72h.<br>
            O fornecedor preencherá o cadastro completo e os dados serão enviados ao Datasul após aprovação.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="UsersModule.fecharConviteModal()">Cancelar</button>
          <button class="btn btn-primary" onclick="UsersModule.enviarConvite()">Gerar e Enviar Link</button>
        </div>
      </div>
    </div>
    `;
  }

  // ── Render usuários ───────────────────────────────────────────────
  function renderUsuarios(lista) {
    const grid = document.getElementById('usr-grid');
    if (!grid) return;
    if (!lista.length) {
      grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-3)">Nenhum usuário encontrado.</div>';
      return;
    }
    const perfilMap = Object.fromEntries(PERFIS.map(p=>[p.id,p]));
    grid.innerHTML = lista.map(u => {
      const p = perfilMap[u.perfil] || { cor:'chip-blue', label:u.perfil };
      return `
      <div class="usr-card ${u.status==='Inativo'?'inactive':''}">
        <div class="usr-card-header">
          <div class="usr-avatar" style="background:${u.perfil==='Admin'?'#dc2626':u.perfil==='Diretor'?'#7c3aed':'var(--navy)'}">${u.avatar}</div>
          <div>
            <div class="usr-name">${u.nome}</div>
            <div class="usr-email">${u.email}</div>
          </div>
        </div>
        <div class="usr-badges">
          <span class="chip ${p.cor}">${p.label}</span>
          ${u.cc?`<span class="chip chip-green">${u.cc}</span>`:''}
          <span style="font-size:11.5px;color:${u.status==='Ativo'?'var(--green)':'var(--text-3)'}">
            <span class="usr-status-dot ${u.status.toLowerCase()}"></span>${u.status}
          </span>
        </div>
        <div class="usr-meta">
          Criado em: ${u.criadoEm}<br>
          Último acesso: ${u.ultimoAcesso}
        </div>
        <div class="usr-actions">
          <button class="btn btn-secondary btn-sm" onclick="UsersModule.editarUsuario('${u.id}')">Editar</button>
          <button class="btn btn-secondary btn-sm" onclick="UsersModule.toggleStatus('${u.id}')">${u.status==='Ativo'?'Desativar':'Ativar'}</button>
          <button class="btn btn-secondary btn-sm" onclick="UsersModule.resetarSenha('${u.id}')">Reset Senha</button>
        </div>
      </div>`;
    }).join('');

    document.getElementById('usr-subtitle').textContent =
      `${BF.db.usuarios.length} usuários · ${BF.db.usuarios.filter(u=>u.status==='Ativo').length} ativos`;
  }

  // ── Render convites ───────────────────────────────────────────────
  function renderConvites() {
    const lista = BF.db.convitesCadastro;
    const el    = document.getElementById('convites-list');
    if (!el) return;
    document.getElementById('convites-badge').textContent = lista.filter(c=>!c.usado).length;
    if (!lista.length) {
      el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-3)">Nenhum convite enviado ainda.</div>';
      return;
    }
    el.innerHTML = lista.map(c => {
      const link = `${window.location.origin}/portal-fornecedor/index.html?token=${c.token}`;
      return `
      <div class="invite-card">
        <div style="font-size:20px">${c.usado?'✅':'📧'}</div>
        <div class="invite-info">
          <div class="invite-title">${c.nome}</div>
          <div class="invite-sub">${c.email} · Enviado por ${c.enviadoPor} em ${c.enviadoEm}</div>
          <div class="invite-exp">${c.usado?'Cadastro concluído':'Expira em: '+c.expiraEm}</div>
          ${!c.usado?`<div style="font-size:11px;color:var(--text-3);margin-top:4px;font-family:monospace;word-break:break-all">${link}</div>`:''}
        </div>
        ${!c.usado?`
          <div style="display:flex;flex-direction:column;gap:6px">
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${link}');toast('Link copiado!')">Copiar Link</button>
            <button class="btn btn-secondary btn-sm" onclick="UsersModule.reenviarConvite('${c.token}')">Reenviar</button>
          </div>`:``}
      </div>`;
    }).join('');
  }

  // ── Public API ────────────────────────────────────────────────────
  return {

    init(containerEl) {
      if (!document.getElementById('usr-css')) {
        const s = document.createElement('style');
        s.id = 'usr-css'; s.textContent = CSS;
        document.head.appendChild(s);
      }
      containerEl.innerHTML = renderHTML();
      this.filtrar();
      renderConvites();
    },

    filtrar() {
      const search = document.getElementById('usr-search')?.value?.toLowerCase()||'';
      const perfil = document.getElementById('usr-filter-perfil')?.value||'';
      const status = document.getElementById('usr-filter-status')?.value||'';
      const lista  = BF.db.usuarios.filter(u => {
        const ms = !search || u.nome.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
        const mp = !perfil || u.perfil === perfil;
        const mst= !status || u.status === status;
        return ms && mp && mst;
      });
      renderUsuarios(lista);
    },

    subTab(tab) {
      ['usuarios','perfis','convites'].forEach(t => {
        document.getElementById('usr-sec-'+t).style.display    = t===tab?'':'none';
        document.getElementById('usr-tab-'+t)?.classList.toggle('active', t===tab);
      });
      if (tab==='convites') renderConvites();
    },

    abrirModal(id) {
      document.getElementById('usr-modal-title').textContent = id ? 'Editar Usuário' : 'Novo Usuário';
      document.getElementById('usr-f-nome').value   = '';
      document.getElementById('usr-f-email').value  = '';
      document.getElementById('usr-f-perfil').value = '';
      document.getElementById('usr-f-cc').value     = '';
      document.getElementById('usr-f-senha').value  = '';
      document.getElementById('usrModal').classList.add('open');
    },

    fecharModal() { document.getElementById('usrModal').classList.remove('open'); },

    criarUsuario() {
      const nome  = document.getElementById('usr-f-nome').value.trim();
      const email = document.getElementById('usr-f-email').value.trim();
      const perfil= document.getElementById('usr-f-perfil').value;
      const cc    = document.getElementById('usr-f-cc').value;
      const senha = document.getElementById('usr-f-senha').value;
      if (!nome)   { window.toast('Informe o nome completo'); return; }
      if (!email)  { window.toast('Informe o e-mail'); return; }
      if (!perfil) { window.toast('Selecione o perfil'); return; }
      if (!senha || senha.length < 8) { window.toast('Senha mínimo 8 caracteres'); return; }
      const av = nome.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const id = 'U' + Date.now();
      BF.db.usuarios.push({ id, nome, email, perfil, cc, status:'Ativo', criadoEm:new Date().toLocaleDateString('pt-BR'), avatar:av, ultimoAcesso:'Nunca' });
      this.fecharModal();
      this.filtrar();
      window.toast('Usuário '+nome+' criado! E-mail de boas-vindas enviado.');
    },

    editarUsuario(id) {
      const u = BF.db.usuarios.find(x=>x.id===id); if(!u) return;
      document.getElementById('usr-modal-title').textContent = 'Editar Usuário';
      document.getElementById('usr-f-nome').value   = u.nome;
      document.getElementById('usr-f-email').value  = u.email;
      document.getElementById('usr-f-perfil').value = u.perfil;
      document.getElementById('usr-f-cc').value     = u.cc;
      document.getElementById('usrModal').classList.add('open');
    },

    toggleStatus(id) {
      const u = BF.db.usuarios.find(x=>x.id===id); if(!u) return;
      u.status = u.status==='Ativo'?'Inativo':'Ativo';
      this.filtrar();
      window.toast(u.nome+' '+u.status.toLowerCase()+'.');
    },

    resetarSenha(id) {
      const u = BF.db.usuarios.find(x=>x.id===id); if(!u) return;
      window.toast('E-mail de reset de senha enviado para '+u.email);
    },

    abrirConviteFornecedor() {
      document.getElementById('conv-nome').value  = '';
      document.getElementById('conv-email').value = '';
      document.getElementById('conv-cat').value   = '';
      document.getElementById('conv-msg').value   = '';
      document.getElementById('conviteModal').classList.add('open');
    },

    fecharConviteModal() { document.getElementById('conviteModal').classList.remove('open'); },

    enviarConvite() {
      const nome  = document.getElementById('conv-nome').value.trim();
      const email = document.getElementById('conv-email').value.trim();
      if (!nome)  { window.toast('Informe o nome da empresa'); return; }
      if (!email) { window.toast('Informe o e-mail'); return; }
      const token = 'invite_' + Math.random().toString(36).slice(2) + '_' + Date.now();
      const agora = new Date();
      const exp   = new Date(agora.getTime() + 72*3600000);
      BF.db.convitesCadastro.unshift({
        token, email, nome, usado:false,
        enviadoPor:'Maria Ribeiro',
        enviadoEm:agora.toLocaleString('pt-BR'),
        expiraEm:exp.toLocaleString('pt-BR'),
      });
      // Em produção: chama BF.notify.email() e BF.notify.whatsapp()
      console.log('[BidFlow] Convite enviado para', email, '— link: /portal-fornecedor/index.html?token='+token);
      this.fecharConviteModal();
      this.subTab('convites');
      window.toast('✓ Link de cadastro enviado para ' + email + '!');
    },

    reenviarConvite(token) {
      const c = BF.db.convitesCadastro.find(x=>x.token===token); if(!c) return;
      window.toast('Convite reenviado para ' + c.email);
    },
  };

})();



// ══════════════════════════════════════════════════════════════════
// orders.module.js — Pedidos de Compra
// ══════════════════════════════════════════════════════════════════
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


// ══════════════════════════════════════════════════════════════════
// invoices.module.js — Notas Fiscais & Conciliação
// ══════════════════════════════════════════════════════════════════
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



// ══════════════════════════════════════════════════════════════════
// contracts.module.js — Contratos
// ══════════════════════════════════════════════════════════════════
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


// ── Sync MOCK data to BF.db ───────────────────────────────────────
function syncMockToBF() {
  BF.db.usuarios      = MOCK.usuarios      || BF.db.usuarios;
  BF.db.fornecedores  = MOCK.fornecedores  || BF.db.fornecedores;
  BF.db.rfqs          = MOCK.rfqs          || BF.db.rfqs;
  BF.db.pedidos       = MOCK.pedidos       || BF.db.pedidos;
  BF.db.notasFiscais  = MOCK.notasFiscais  || BF.db.notasFiscais;
}

// ── Hook page rendering for all modules ──────────────────────────
const _origShowPage = showPage;
const _moduleInitted = {};
function showPage(id) {
  _origShowPage(id);
  syncMockToBF();
  if (id === 'users' && !_moduleInitted.users) {
    _moduleInitted.users = true;
    UsersModule.init(document.getElementById('users-module-container'));
  }
  if (id === 'orders') {
    if (!_moduleInitted.orders) {
      _moduleInitted.orders = true;
      window.OrdersModule.init(document.getElementById('orders-module-container'));
    } else { window.OrdersModule.filter(); }
  }
  if (id === 'invoices') {
    if (!_moduleInitted.invoices) {
      _moduleInitted.invoices = true;
      window.InvoicesModule.init(document.getElementById('invoices-module-container'));
    } else { window.InvoicesModule.filter(); }
  }
  if (id === 'contracts') {
    if (!_moduleInitted.contracts) {
      _moduleInitted.contracts = true;
      window.ContractsModule.init(document.getElementById('contracts-module-container'));
    } else { window.ContractsModule.filter(); }
  }
}

// ── RFQ: hook envio de proposta recebida ─────────────────────────
window.addEventListener('propostaEnviada', (e) => {
  const { rfqId, proposta } = e.detail;
  const rfq = MOCK.rfqs.find(r => r.id === rfqId);
  if (!rfq) return;
  rfq.propostas.push(proposta);
  rfq.respostas = rfq.propostas.length;
  rfq.historico.push({
    data: new Date().toLocaleTimeString('pt-BR'),
    acao: proposta.fornNome + ' enviou proposta via portal',
    user: 'Sistema', cor: 'green'
  });
  toast('✓ Proposta de ' + proposta.fornNome + ' recebida no portal!');
});

</script>

<!-- INTEGRATION DETAIL MODAL -->
<div class="modal-overlay" id="intDetailModal" onclick="closeModal('intDetailModal')">
  <div class="modal" style="width:580px" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div>
        <h2 id="int-detail-nome">Integração</h2>
        <span class="status-badge" id="int-detail-badge" style="margin-top:4px;display:inline-block"></span>
      </div>
      <button class="modal-close" onclick="closeModal('intDetailModal')">✕</button>
    </div>
    <div class="modal-body" id="int-detail-body"></div>
    <div class="modal-footer" id="int-detail-footer"></div>
  </div>
</div>

</body>
</html>
