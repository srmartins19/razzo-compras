/**
 * BidFlow — Mock Database
 * ─────────────────────────────────────────────────────────────────
 * Fonte única de dados para todos os componentes.
 * Quando integrar com Datasul/Supabase, substituir cada
 * objeto por uma chamada à função correspondente em api.js.
 * ─────────────────────────────────────────────────────────────────
 */

window.BF = window.BF || {};

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
