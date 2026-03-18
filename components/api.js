/**
 * BidFlow — API Adapter
 * ─────────────────────────────────────────────────────────────────
 * ÚNICO ARQUIVO A MODIFICAR quando integrar com Datasul.
 * Cada função tem comentário com o endpoint REST correspondente.
 *
 * MODO: 'mock' | 'live'
 * Para ativar Datasul: trocar BIDFLOW_MODE para 'live' e preencher DATASUL_BASE.
 * ─────────────────────────────────────────────────────────────────
 */

const BIDFLOW_MODE  = 'mock';           // <- trocar para 'live' quando Datasul estiver pronto
const DATASUL_BASE  = '';               // <- ex: 'https://datasul.razzo.com.br:8080'
const DATASUL_TOKEN = '';               // <- Basic Auth token (base64 user:sha1pass)

// ─── Helper de chamada REST ──────────────────────────────────────
async function datasulFetch(method, path, body = null) {
  if (BIDFLOW_MODE === 'mock') {
    console.warn('[BidFlow API] Mock mode — chamada ignorada:', method, path);
    return null;
  }
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + DATASUL_TOKEN,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(DATASUL_BASE + path, opts);
  if (!res.ok) throw new Error(`Datasul ${res.status}: ${await res.text()}`);
  return res.json();
}

// ═══════════════════════════════════════════════════════════════════
// FORNECEDORES
// Datasul endpoint: /dts/datasul-rest/resources/prg/fin/v1/holderPublic
// ═══════════════════════════════════════════════════════════════════
export async function getFornecedores() {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.fornecedores;
  return datasulFetch('GET', '/dts/datasul-rest/resources/prg/fin/v1/holderPublic');
}

export async function getFornecedorByCNPJ(cnpj) {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.fornecedores.find(f => f.cnpj === cnpj) || null;
  return datasulFetch('GET', `/dts/datasul-rest/resources/prg/fin/v1/holderPublic?cnpj=${cnpj}`);
}

/**
 * Cria fornecedor no Datasul após aprovação do cadastro no BidFlow.
 * Datasul: POST /dts/datasul-rest/resources/prg/fin/v1/holderPublic
 */
export async function criarFornecedorDatasul(payload) {
  if (BIDFLOW_MODE === 'mock') {
    const id = 'F' + (100 + MOCK_DB.fornecedores.length);
    MOCK_DB.fornecedores.push({ ...payload, id, status: 'Aprovado', score: 0, contratos: '—', ultimo: '—' });
    return { id, success: true };
  }
  return datasulFetch('POST', '/dts/datasul-rest/resources/prg/fin/v1/holderPublic', {
    holderCode:  payload.cnpj.replace(/\D/g,''),
    holderName:  payload.razaoSocial,
    cnpj:        payload.cnpj,
    email:       payload.email,
    phone:       payload.telefone,
    address:     payload.endereco,
    // campos adicionais conforme estrutura Datasul
  });
}

// ═══════════════════════════════════════════════════════════════════
// ORDENS DE COMPRA (MCC)
// Datasul: GET /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic
// ═══════════════════════════════════════════════════════════════════
export async function getOrdensCompra(filtros = {}) {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.ordensCompra;
  const params = new URLSearchParams(filtros).toString();
  return datasulFetch('GET', `/dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic?${params}`);
}

// ═══════════════════════════════════════════════════════════════════
// COTAÇÕES / RFQ
// Datasul: POST /dts/datasul-rest/resources/prg/mcc/v1/purchQuotationPublic
// ═══════════════════════════════════════════════════════════════════
export async function getRFQs() {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.rfqs;
  return datasulFetch('GET', '/dts/datasul-rest/resources/prg/mcc/v1/purchQuotationPublic');
}

export async function criarRFQ(payload) {
  if (BIDFLOW_MODE === 'mock') {
    const id = 'RFQ-' + Date.now();
    const rfq = { ...payload, id, status: 'Em andamento', respostas: 0, propostas: [], historico: [] };
    MOCK_DB.rfqs.unshift(rfq);
    return { id, success: true };
  }
  return datasulFetch('POST', '/dts/datasul-rest/resources/prg/mcc/v1/purchQuotationPublic', payload);
}

/**
 * Envia cotação vencedora de volta ao Datasul criando o PO.
 * Datasul: POST /dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic
 */
export async function confirmarVencedor(rfqId, fornecedorId, proposta) {
  if (BIDFLOW_MODE === 'mock') {
    const rfq = MOCK_DB.rfqs.find(r => r.id === rfqId);
    if (rfq) { rfq.status = 'Concluída'; rfq.vencedor = fornecedorId; }
    const po = {
      id: 'PC-' + Date.now(), rfqOrigem: rfqId,
      fornecedor: proposta.fornNome, valor: proposta.totalGeral,
      status: 'Aprovacao', urgente: false,
      titulo: rfq?.titulo || '—',
    };
    MOCK_DB.pedidos.unshift(po);
    return { poId: po.id, success: true };
  }
  return datasulFetch('POST', '/dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic', {
    quotationId:  rfqId,
    supplierId:   fornecedorId,
    items:        proposta.itens,
    totalValue:   proposta.totalGeral,
  });
}

// ═══════════════════════════════════════════════════════════════════
// PEDIDOS DE COMPRA
// ═══════════════════════════════════════════════════════════════════
export async function getPedidos() {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.pedidos;
  return datasulFetch('GET', '/dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic');
}

export async function atualizarStatusPedido(pedidoId, status) {
  if (BIDFLOW_MODE === 'mock') {
    const p = MOCK_DB.pedidos.find(x => x.id === pedidoId);
    if (p) p.status = status;
    return { success: true };
  }
  return datasulFetch('PUT', `/dts/datasul-rest/resources/prg/mcc/v1/purchOrderPublic/${pedidoId}`, { status });
}

// ═══════════════════════════════════════════════════════════════════
// NOTAS FISCAIS (conciliação manual — sem SEFAZ)
// O fornecedor faz upload da NF no portal.
// BidFlow faz a conciliação NF x PO internamente.
// ═══════════════════════════════════════════════════════════════════
export async function getNotasFiscais() {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.notasFiscais;
  return datasulFetch('GET', '/dts/datasul-rest/resources/prg/fin/v1/receivableDocumentPublic');
}

export async function conciliarNF(nfId, pedidoId) {
  if (BIDFLOW_MODE === 'mock') {
    const nf = MOCK_DB.notasFiscais.find(n => n.id === nfId);
    const po = MOCK_DB.pedidos.find(p => p.id === pedidoId);
    if (!nf || !po) return { success: false, erro: 'NF ou PO não encontrado' };
    const divergencia = Math.abs(nf.valor - po.valor) > 0.01;
    nf.status    = divergencia ? 'Divergência' : 'Conciliada';
    nf.matching  = divergencia ? 'Divergência' : 'OK';
    nf.pedidoId  = pedidoId;
    return { success: true, divergencia, diferenca: nf.valor - po.valor };
  }
  return datasulFetch('POST', '/dts/datasul-rest/resources/prg/fin/v1/receivableDocumentPublic', { nfId, pedidoId });
}

// ═══════════════════════════════════════════════════════════════════
// USUÁRIOS INTERNOS (BidFlow)
// Gerenciados no próprio BidFlow — sem espelho Datasul
// ═══════════════════════════════════════════════════════════════════
export async function getUsuarios() {
  if (BIDFLOW_MODE === 'mock') return MOCK_DB.usuarios;
  return MOCK_DB.usuarios; // backend próprio futuro
}

export async function criarUsuario(payload) {
  if (BIDFLOW_MODE === 'mock') {
    const id = 'U' + Date.now();
    MOCK_DB.usuarios.push({ ...payload, id, status: 'Ativo', criadoEm: new Date().toLocaleDateString('pt-BR') });
    return { id, success: true };
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// E-mail: SendGrid / SMTP
// WhatsApp: Meta Cloud API
// ═══════════════════════════════════════════════════════════════════
export async function enviarConviteRFQ(fornecedorId, rfqId, token) {
  /* Em produção:
     POST https://api.sendgrid.com/v3/mail/send
     body: { to: fornecedor.email, template_id: 'rfq-invite', dynamic_data: { link, rfqId, prazo } }
  */
  if (BIDFLOW_MODE === 'mock') {
    console.log('[Mock Email] Convite RFQ enviado para fornecedor', fornecedorId, '— link:', `/portal-fornecedor?token=${token}&rfq=${rfqId}`);
    return { sent: true, channel: 'email+whatsapp' };
  }
}

export async function enviarLinkCadastroFornecedor(email, token) {
  /* Em produção:
     POST SendGrid com link: /portal-fornecedor/cadastro?token={token}
     Token único, expira em 72h, gerado no backend BidFlow
  */
  if (BIDFLOW_MODE === 'mock') {
    console.log('[Mock Email] Link de cadastro enviado para', email, '— token:', token);
    return { sent: true };
  }
}

// ─── MOCK DATABASE ───────────────────────────────────────────────
// Este bloco é substituído pelo banco real (Supabase/PostgreSQL)
export const MOCK_DB = {
  fornecedores: [], rfqs: [], pedidos: [],
  notasFiscais: [], usuarios: [], ordensCompra: [],
  convitesCadastro: [], propostasFornecedor: [],
};
