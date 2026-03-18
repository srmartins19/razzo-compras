/**
 * BidFlow — Componente: Gestão de Usuários
 * ─────────────────────────────────────────────────────────────────
 * Responsável por: listar, criar, editar, desativar usuários internos
 * e gerenciar convites de cadastro para fornecedores.
 *
 * Manutenção: se algo der errado em usuários, procure aqui.
 * ─────────────────────────────────────────────────────────────────
 */

window.UsersModule = (function () {

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
