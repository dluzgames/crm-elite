/* ============================
   MINI CHART ENGINE (Canvas)
   ============================ */

// ============================
// DATA STORE
// ============================
const Store = (() => {
  const KEY_CONTACTS = 'crm_contacts';
  const KEY_DEALS    = 'crm_deals';
  const KEY_TASKS    = 'crm_tasks';
  const KEY_ACTIVITY = 'crm_activity';

  const defaultContacts = [
    { id: 1, name: 'Ana Lima',       company: 'TechBr Soluções',  email: 'ana@techbr.com',   phone:'(11) 99010-2030', status:'client',   value:18500, notes:'Cliente VIP, prefere reuniões às terças.' },
    { id: 2, name: 'Carlos Mendes',  company: 'StartupX',         email: 'carlos@startupx.io',phone:'(21) 98877-6655', status:'prospect',  value:7200,  notes:'Interessado no plano Enterprise.' },
    { id: 3, name: 'Fernanda Rocha', company: 'Agência Pixel',    email: 'fe@pixel.com.br',  phone:'(31) 99834-0011', status:'lead',      value:3100,  notes:'Primeiro contato via LinkedIn.' },
    { id: 4, name: 'Igor Santos',    company: 'Mega Construções', email: 'igor@mega.com.br', phone:'(41) 98765-4321', status:'client',   value:45000, notes:'Contrato anual. Renovação em março.' },
    { id: 5, name: 'Juliana Perez',  company: 'Beauty & Co',      email: 'ju@beautyco.com',  phone:'(51) 97531-2468', status:'lead',      value:1500,  notes:'Indicação do Igor Santos.' },
    { id: 6, name: 'Ricardo Alves',  company: 'Alves Importações',email: 'r.alves@alves.net',phone:'(61) 98888-5577', status:'client',   value:29800, notes:'Está avaliando upgrade de plano.' },
  ];

  const defaultDeals = [
    { id: 1, title:'Licença Anual Enterprise', contactId:1, value:18500, stage:'won',         prob:100, closeDate:'2025-01-15' },
    { id: 2, title:'Módulo de Relatórios',      contactId:2, value:7200,  stage:'proposal',    prob:65,  closeDate:'2025-03-20' },
    { id: 3, title:'Consultoria Inicial',       contactId:3, value:3100,  stage:'qualified',   prob:40,  closeDate:'2025-04-10' },
    { id: 4, title:'Renovação Contrato 2025',   contactId:4, value:45000, stage:'negotiation', prob:85,  closeDate:'2025-03-01' },
    { id: 5, title:'Projeto Website',           contactId:5, value:1500,  stage:'lead',        prob:20,  closeDate:'2025-05-30' },
    { id: 6, title:'Suite Completa Premium',    contactId:6, value:29800, stage:'proposal',    prob:70,  closeDate:'2025-03-15' },
  ];

  const defaultTasks = [
    { id: 1, title:'Ligar para Ana Lima sobre renovação',  contactId:1, due:'2025-02-20', priority:'high',   done:false },
    { id: 2, title:'Enviar proposta para Carlos Mendes',   contactId:2, due:'2025-02-28', priority:'high',   done:false },
    { id: 3, title:'Follow-up com Fernanda Rocha',        contactId:3, due:'2025-03-05', priority:'medium', done:false },
    { id: 4, title:'Reunião mensal com Igor Santos',      contactId:4, due:'2025-03-01', priority:'medium', done:true  },
    { id: 5, title:'Apresentar demo para Juliana Perez',  contactId:5, due:'2025-03-10', priority:'low',    done:false },
    { id: 6, title:'Atualizar CRM com dados do Ricardo',  contactId:6, due:'2025-02-15', priority:'low',    done:false },
  ];

  const defaultActivity = [
    { icon:'📞', text:'<strong>Ana Lima</strong> — Ligação realizada',       time:'há 2 horas' },
    { icon:'📧', text:'<strong>Carlos Mendes</strong> — E-mail enviado',     time:'há 4 horas' },
    { icon:'💼', text:'<strong>Deal</strong> Renovação Contrato atualizado',  time:'há 6 horas' },
    { icon:'✅', text:'<strong>Tarefa</strong> concluída com Igor Santos',    time:'ontem' },
    { icon:'🆕', text:'<strong>Fernanda Rocha</strong> — Novo lead criado',  time:'ontem' },
    { icon:'💰', text:'<strong>Igor Santos</strong> — Contrato assinado',    time:'2 dias atrás' },
  ];

  const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } };
  const save = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch{} };

  let contacts = load(KEY_CONTACTS, defaultContacts);
  let deals    = load(KEY_DEALS,    defaultDeals);
  let tasks    = load(KEY_TASKS,    defaultTasks);
  let activity = load(KEY_ACTIVITY, defaultActivity);

  const nextId = arr => Math.max(0, ...arr.map(x => x.id)) + 1;

  return {
    getContacts:  () => contacts,
    getDeals:     () => deals,
    getTasks:     () => tasks,
    getActivity:  () => activity,

    addContact: c => { c.id = nextId(contacts); contacts.push(c); save(KEY_CONTACTS, contacts); return c; },
    updateContact: c => { const i = contacts.findIndex(x => x.id === c.id); if (i>=0){ contacts[i]=c; save(KEY_CONTACTS,contacts); } },
    deleteContact: id => { contacts = contacts.filter(x => x.id !== id); save(KEY_CONTACTS, contacts); },

    addDeal: d => { d.id = nextId(deals); deals.push(d); save(KEY_DEALS, deals); return d; },
    updateDeal: d => { const i = deals.findIndex(x => x.id === d.id); if (i>=0){ deals[i]=d; save(KEY_DEALS,deals); } },

    addTask: t => { t.id = nextId(tasks); tasks.push(t); save(KEY_TASKS, tasks); return t; },
    updateTask: t => { const i = tasks.findIndex(x => x.id === t.id); if (i>=0){ tasks[i]=t; save(KEY_TASKS,tasks); } },
    deleteTask: id => { tasks = tasks.filter(x => x.id !== id); save(KEY_TASKS, tasks); },

    addActivity: a => { activity.unshift(a); activity = activity.slice(0,20); save(KEY_ACTIVITY,activity); },
  };
})();

// ============================
// UTILS
// ============================
const fmtCurrency = v => `R$ ${Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:0})}`;
const fmtDate = d => d ? new Date(d+'T12:00:00').toLocaleDateString('pt-BR') : '—';
const isOverdue = d => d && new Date(d+'T23:59:59') < new Date() ;
const initials = name => name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

const AVATAR_COLORS = [
  'linear-gradient(135deg,#a78bfa,#38bdf8)',
  'linear-gradient(135deg,#34d399,#38bdf8)',
  'linear-gradient(135deg,#fb923c,#f472b6)',
  'linear-gradient(135deg,#f472b6,#a78bfa)',
  'linear-gradient(135deg,#38bdf8,#34d399)',
  'linear-gradient(135deg,#fb923c,#a78bfa)',
];
const avatarColor = id => AVATAR_COLORS[(id||0) % AVATAR_COLORS.length];

const STATUS_DOT = { client:'#34d399', prospect:'#38bdf8', lead:'#fb923c' };
const STATUS_LABEL = { client:'Cliente', prospect:'Prospect', lead:'Lead' };

const STAGE_INFO = {
  lead:        { label: 'Lead',        color:'#fb923c', dot:'#fb923c' },
  qualified:   { label: 'Qualificado', color:'#38bdf8', dot:'#38bdf8' },
  proposal:    { label: 'Proposta',    color:'#a78bfa', dot:'#a78bfa' },
  negotiation: { label: 'Negociação',  color:'#f472b6', dot:'#f472b6' },
  won:         { label: 'Ganho',       color:'#34d399', dot:'#34d399' },
};

function showToast(msg, type='success') {
  const icons = { success:'✅', error:'❌', info:'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span class="toast-icon">${icons[type]}</span> ${msg}`;
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => {
    t.style.animation = 'slideOutRight .3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ============================
// NAVIGATION
// ============================
const Pages = {
  titles: { dashboard:'Dashboard', contacts:'Contatos', pipeline:'Pipeline de Vendas', tasks:'Tarefas', reports:'Relatórios' },
  current: 'dashboard',

  go(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    document.getElementById(`nav-${page}`).classList.add('active');
    document.getElementById('pageTitle').textContent = this.titles[page];
    this.current = page;
    this.updatePrimaryBtn(page);
    if (page === 'dashboard') Dashboard.render();
    if (page === 'contacts')  Contacts.render();
    if (page === 'pipeline')  Pipeline.render();
    if (page === 'tasks')     Tasks.render();
    if (page === 'reports')   Reports.render();
  },

  updatePrimaryBtn(page) {
    const btn = document.getElementById('primaryActionBtn');
    const labels = { dashboard:'Novo Deal', contacts:'Novo Contato', pipeline:'Novo Deal', tasks:'Nova Tarefa', reports:'Exportar' };
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> ${labels[page]||'Novo'}`;
  }
};

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    Pages.go(btn.dataset.page);
    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
  });
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

document.getElementById('primaryActionBtn').addEventListener('click', () => {
  const p = Pages.current;
  if (p === 'contacts')  Contacts.openModal();
  else if (p === 'tasks') Tasks.openModal();
  else                    Pipeline.openDealModal();
});

// ============================
// DASHBOARD
// ============================
const Dashboard = {
  charts: {},

  render() {
    const contacts = Store.getContacts();
    const deals    = Store.getDeals();
    const tasks    = Store.getTasks();

    // stats
    document.getElementById('stat-clients').textContent = contacts.length;
    const openDeals = deals.filter(d => d.stage !== 'won');
    document.getElementById('stat-deals').textContent = openDeals.length;
    const revenue = openDeals.reduce((s,d) => s + d.value*(d.prob/100), 0);
    document.getElementById('stat-revenue').textContent = fmtCurrency(revenue);
    const pending = tasks.filter(t => !t.done).length;
    document.getElementById('stat-tasks').textContent = pending;

    // badges
    document.getElementById('badge-contacts').textContent = contacts.length;
    document.getElementById('badge-pipeline').textContent = openDeals.length;
    document.getElementById('badge-tasks').textContent = pending;

    this.renderFunnel(deals);
    this.renderActivity();
    this.renderTopContacts(contacts, deals);
    this.renderSalesChart();
  },

  renderFunnel(deals) {
    const stages = ['lead','qualified','proposal','negotiation','won'];
    const counts = {};
    stages.forEach(s => counts[s] = deals.filter(d => d.stage === s).length);
    const max = Math.max(1, ...Object.values(counts));
    const wrap = document.getElementById('funnelWrap');
    wrap.innerHTML = stages.map(s => {
      const info  = STAGE_INFO[s];
      const pct   = Math.round((counts[s]/max)*100);
      return `
        <div class="funnel-stage">
          <span class="funnel-label">${info.label}</span>
          <div class="funnel-bar-wrap">
            <div class="funnel-bar" style="width:${pct}%;background:${info.color}">${counts[s]>0?counts[s]:''}</div>
          </div>
          <span class="funnel-count">${counts[s]}</span>
        </div>`;
    }).join('');
  },

  renderActivity() {
    const list = document.getElementById('activityList');
    const acts = Store.getActivity().slice(0,6);
    if (!acts.length) { list.innerHTML = '<div class="empty-state"><p>Nenhuma atividade</p></div>'; return; }
    list.innerHTML = acts.map(a => `
      <li class="activity-item">
        <div class="act-icon" style="background:rgba(167,139,250,.1)">${a.icon}</div>
        <div class="act-info">
          <div class="act-text">${a.text}</div>
          <div class="act-time">${a.time}</div>
        </div>
      </li>`).join('');
  },

  renderTopContacts(contacts, deals) {
    const list = document.getElementById('topContactsList');
    const sorted = [...contacts].sort((a,b) => b.value - a.value).slice(0,5);
    if (!sorted.length) { list.innerHTML = '<div class="empty-state"><p>Nenhum contato</p></div>'; return; }
    list.innerHTML = sorted.map(c => `
      <li class="top-item">
        <div class="top-avatar" style="background:${avatarColor(c.id)}">${initials(c.name)}</div>
        <div class="top-info">
          <div class="top-name">${c.name}</div>
          <div class="top-company">${c.company||'—'}</div>
        </div>
        <div class="top-value">${fmtCurrency(c.value)}</div>
      </li>`).join('');
  },

  renderSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const pad = { top:20, right:20, bottom:30, left:50 };
    const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const data24 = [12,18,15,22,28,24,30,26,35,32,40,38].map(v=>v*800);
    const data25 = [15,22,19,28,34,0,0,0,0,0,0,0].map(v=>v*800);
    const curMonth = new Date().getMonth();
    const d25 = data25.slice(0, curMonth+1);

    const allVals = [...data24,...d25].filter(v=>v>0);
    const maxVal = Math.max(...allVals, 1);
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;

    ctx.clearRect(0,0,W,H);

    // Grid lines
    ctx.strokeStyle = '#1e2535';
    ctx.lineWidth = 1;
    for (let i=0;i<=4;i++) {
      const y = pad.top + chartH - (i/4)*chartH;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W-pad.right, y); ctx.stroke();
      ctx.fillStyle = '#4a5468';
      ctx.font = '10px Inter';
      ctx.textAlign = 'right';
      ctx.fillText(fmtCurrency((maxVal*i/4)/1000)+'K', pad.left-6, y+3);
    }

    // X labels
    ctx.fillStyle = '#4a5468';
    ctx.font = '10px Inter';
    ctx.textAlign = 'center';
    labels.forEach((l,i) => {
      const x = pad.left + (i/(labels.length-1))*chartW;
      ctx.fillText(l, x, H-8);
    });

    // Draw line
    const drawLine = (data, color, fill) => {
      if (!data.some(v=>v>0)) return;
      const pts = data.map((v,i) => ({
        x: pad.left + (i/(labels.length-1))*chartW,
        y: pad.top  + chartH - (v/maxVal)*chartH
      }));
      // fill
      const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top+chartH);
      grad.addColorStop(0, fill+'33');
      grad.addColorStop(1, fill+'00');
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pad.top+chartH);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length-1].x, pad.top+chartH);
      ctx.closePath();
      ctx.fillStyle = grad; ctx.fill();
      // line
      ctx.beginPath();
      pts.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
      ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();
      // dots
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI*2);
        ctx.fillStyle = color; ctx.fill();
        ctx.strokeStyle = '#141820'; ctx.lineWidth = 2; ctx.stroke();
      });
    };

    drawLine(data24, '#a78bfa', '#a78bfa');
    drawLine(d25,    '#38bdf8', '#38bdf8');
  }
};

// ============================
// CONTACTS
// ============================
const Contacts = {
  editId: null,
  viewMode: 'grid',
  filter: 'all',
  search: '',

  render() {
    const contacts = Store.getContacts();
    const grid = document.getElementById('contactsGrid');
    let filtered = contacts;
    if (this.filter !== 'all') filtered = filtered.filter(c => c.status === this.filter);
    if (this.search) {
      const q = this.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.company||'').toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    grid.className = 'contacts-grid' + (this.viewMode==='list' ? ' list-view' : '');
    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        <h4>Nenhum contato encontrado</h4>
        <p>Adicione um contato usando o botão "Novo Contato"</p>
      </div>`;
      return;
    }
    grid.innerHTML = filtered.map(c => `
      <div class="contact-card" data-id="${c.id}" tabindex="0" role="button" aria-label="Ver ${c.name}">
        <div class="contact-avatar-wrap">
          <div class="contact-avatar" style="background:${avatarColor(c.id)}">${initials(c.name)}</div>
          <div class="contact-status-dot" style="background:${STATUS_DOT[c.status]}"></div>
        </div>
        <div class="contact-body">
          <div class="contact-name">${c.name}</div>
          <div class="contact-company">${c.company||'—'}</div>
          <div class="contact-meta">
            <span class="tag tag-${c.status}">${STATUS_LABEL[c.status]}</span>
            <span class="contact-value">${fmtCurrency(c.value)}</span>
          </div>
          <div class="contact-email">${c.email}</div>
        </div>
      </div>`).join('');

    grid.querySelectorAll('.contact-card').forEach(el => {
      el.addEventListener('click', () => this.openDetail(+el.dataset.id));
      el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') this.openDetail(+el.dataset.id); });
    });
  },

  openModal(id=null) {
    this.editId = id;
    const modal = document.getElementById('contactModal');
    document.getElementById('contactModalTitle').textContent = id ? 'Editar Contato' : 'Novo Contato';
    if (id) {
      const c = Store.getContacts().find(x => x.id === id);
      if (c) {
        document.getElementById('c-name').value    = c.name;
        document.getElementById('c-company').value = c.company||'';
        document.getElementById('c-email').value   = c.email;
        document.getElementById('c-phone').value   = c.phone||'';
        document.getElementById('c-status').value  = c.status;
        document.getElementById('c-value').value   = c.value||0;
        document.getElementById('c-notes').value   = c.notes||'';
      }
    } else {
      ['c-name','c-company','c-email','c-phone','c-notes'].forEach(id => document.getElementById(id).value='');
      document.getElementById('c-status').value = 'lead';
      document.getElementById('c-value').value  = '';
    }
    modal.classList.add('open');
    document.getElementById('c-name').focus();
  },

  closeModal() { document.getElementById('contactModal').classList.remove('open'); this.editId=null; },

  save() {
    const name  = document.getElementById('c-name').value.trim();
    const email = document.getElementById('c-email').value.trim();
    if (!name || !email) { showToast('Nome e e-mail são obrigatórios', 'error'); return; }
    const c = {
      id:      this.editId || null,
      name,
      company: document.getElementById('c-company').value.trim(),
      email,
      phone:   document.getElementById('c-phone').value.trim(),
      status:  document.getElementById('c-status').value,
      value:   Number(document.getElementById('c-value').value)||0,
      notes:   document.getElementById('c-notes').value.trim(),
    };
    if (this.editId) {
      Store.updateContact(c);
      showToast('Contato atualizado!');
      Store.addActivity({ icon:'✏️', text:`<strong>${c.name}</strong> atualizado`, time:'agora' });
    } else {
      Store.addContact(c);
      showToast('Contato criado com sucesso!');
      Store.addActivity({ icon:'🆕', text:`<strong>${c.name}</strong> — Novo contato criado`, time:'agora' });
    }
    this.closeModal();
    this.render();
    Dashboard.render();
    this.updateContactSelects();
  },

  openDetail(id) {
    const c = Store.getContacts().find(x => x.id === id);
    if (!c) return;
    document.getElementById('contactDetailTitle').textContent = c.name;
    document.getElementById('contactDetailBody').innerHTML = `
      <div class="contact-detail-hero">
        <div class="detail-avatar" style="background:${avatarColor(c.id)}">${initials(c.name)}</div>
        <div class="detail-name">${c.name}</div>
        <div class="detail-company">${c.company||'—'}</div>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-item"><span class="detail-info-label">Status</span><span class="detail-info-value"><span class="tag tag-${c.status}">${STATUS_LABEL[c.status]}</span></span></div>
        <div class="detail-info-item"><span class="detail-info-label">Valor</span><span class="detail-info-value" style="color:var(--accent-green);font-weight:700">${fmtCurrency(c.value)}</span></div>
        <div class="detail-info-item"><span class="detail-info-label">E-mail</span><span class="detail-info-value"><a href="mailto:${c.email}" style="color:var(--accent-blue)">${c.email}</a></span></div>
        <div class="detail-info-item"><span class="detail-info-label">Telefone</span><span class="detail-info-value">${c.phone||'—'}</span></div>
      </div>
      ${c.notes ? `<div class="detail-notes"><span class="detail-info-label">Notas</span><p>${c.notes}</p></div>` : ''}
    `;
    document.getElementById('editContactBtn').onclick    = () => { document.getElementById('contactDetailModal').classList.remove('open'); this.openModal(id); };
    document.getElementById('deleteContactBtn').onclick  = () => this.deleteContact(id);
    document.getElementById('contactDetailModal').classList.add('open');
  },

  deleteContact(id) {
    const c = Store.getContacts().find(x => x.id === id);
    Store.deleteContact(id);
    document.getElementById('contactDetailModal').classList.remove('open');
    showToast(`${c?.name||'Contato'} excluído`,'info');
    this.render();
    Dashboard.render();
    this.updateContactSelects();
  },

  updateContactSelects() {
    const contacts = Store.getContacts();
    const opts = '<option value="">Nenhum</option>' + contacts.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
    ['d-contact','t-contact'].forEach(id => { const el = document.getElementById(id); if(el) el.innerHTML = opts; });
  }
};

// Contact event listeners
document.getElementById('saveContact').addEventListener('click',       () => Contacts.save());
document.getElementById('closeContactModal').addEventListener('click', () => Contacts.closeModal());
document.getElementById('cancelContactModal').addEventListener('click',() => Contacts.closeModal());
document.getElementById('closeContactDetail').addEventListener('click',() => document.getElementById('contactDetailModal').classList.remove('open'));
document.getElementById('contactModal').addEventListener('click', e => { if(e.target===e.currentTarget) Contacts.closeModal(); });
document.getElementById('contactDetailModal').addEventListener('click', e => { if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });

document.getElementById('contactSearch').addEventListener('input', e => { Contacts.search = e.target.value; Contacts.render(); });
document.getElementById('contactFilter').addEventListener('change', e => { Contacts.filter = e.target.value; Contacts.render(); });
document.getElementById('viewGrid').addEventListener('click', () => { Contacts.viewMode='grid'; document.getElementById('viewGrid').classList.add('active'); document.getElementById('viewList').classList.remove('active'); Contacts.render(); });
document.getElementById('viewList').addEventListener('click', () => { Contacts.viewMode='list'; document.getElementById('viewList').classList.add('active'); document.getElementById('viewGrid').classList.remove('active'); Contacts.render(); });

// ============================
// PIPELINE (KANBAN)
// ============================
const Pipeline = {
  dragId: null,
  dragStage: null,

  render() {
    const deals = Store.getDeals();
    const contacts = Store.getContacts();
    const stages = Object.keys(STAGE_INFO);
    const board = document.getElementById('kanbanBoard');

    board.innerHTML = stages.map(stage => {
      const info = STAGE_INFO[stage];
      const stageDeals = deals.filter(d => d.stage === stage);
      const total = stageDeals.reduce((s,d)=>s+d.value,0);
      return `
        <div class="kanban-col" data-stage="${stage}" id="kcol-${stage}">
          <div class="kanban-col-header">
            <div class="col-title-wrap">
              <div class="col-dot" style="background:${info.dot}"></div>
              <span class="col-title">${info.label}</span>
              <span class="col-count">${stageDeals.length}</span>
            </div>
            <span class="col-total">${fmtCurrency(total)}</span>
          </div>
          <div class="kanban-cards" id="kcards-${stage}" data-stage="${stage}">
            ${stageDeals.map(d => this.renderCard(d, contacts, info)).join('')}
            <div class="kanban-empty" style="height:60px;display:flex;align-items:center;justify-content:center;">
              <button class="btn btn-ghost" style="font-size:12px;padding:6px 12px;" data-add-stage="${stage}">+ Deal</button>
            </div>
          </div>
        </div>`;
    }).join('');

    // Drag events
    board.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', e => {
        this.dragId = +card.dataset.id;
        this.dragStage = card.dataset.stage;
        card.style.opacity = '.5';
        e.dataTransfer.effectAllowed = 'move';
      });
      card.addEventListener('dragend', () => { card.style.opacity=''; });
    });

    board.querySelectorAll('.kanban-cards').forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.background='rgba(167,139,250,.05)'; });
      zone.addEventListener('dragleave', () => { zone.style.background=''; });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.background = '';
        const newStage = zone.dataset.stage;
        if (this.dragId && newStage !== this.dragStage) {
          const deal = Store.getDeals().find(d => d.id === this.dragId);
          if (deal) {
            deal.stage = newStage;
            Store.updateDeal(deal);
            Store.addActivity({ icon:'🔄', text:`<strong>${deal.title}</strong> movido para ${STAGE_INFO[newStage].label}`, time:'agora' });
            showToast(`Deal movido para "${STAGE_INFO[newStage].label}"`, 'info');
            this.render();
            Dashboard.render();
          }
        }
        this.dragId = null; this.dragStage = null;
      });
    });

    // Add stage buttons
    board.querySelectorAll('[data-add-stage]').forEach(btn => {
      btn.addEventListener('click', () => this.openDealModal(btn.dataset.addStage));
    });
  },

  renderCard(deal, contacts, info) {
    const c = contacts.find(x => x.id === deal.contactId);
    return `
      <div class="kanban-card" draggable="true" data-id="${deal.id}" data-stage="${deal.stage}" style="--col-accent:${info.color}">
        <div class="deal-title">${deal.title}</div>
        <div class="deal-meta">
          <span class="deal-contact">👤 ${c ? c.name : '—'}</span>
          <span class="deal-value">${fmtCurrency(deal.value)}</span>
        </div>
        <div class="deal-prob">
          <div class="deal-prob-bar" style="width:${deal.prob}%"></div>
        </div>
        <div class="deal-footer">
          <span class="deal-date">${fmtDate(deal.closeDate)}</span>
          <span style="font-size:11px;color:var(--text-muted)">${deal.prob}%</span>
        </div>
      </div>`;
  },

  openDealModal(stage='lead') {
    const modal = document.getElementById('dealModal');
    document.getElementById('d-title').value    = '';
    document.getElementById('d-value').value    = '';
    document.getElementById('d-prob').value     = '50';
    document.getElementById('d-close').value    = '';
    document.getElementById('d-stage').value    = stage;
    Contacts.updateContactSelects();
    modal.classList.add('open');
    document.getElementById('d-title').focus();
  },

  saveDeal() {
    const title = document.getElementById('d-title').value.trim();
    const value = Number(document.getElementById('d-value').value)||0;
    if (!title || !value) { showToast('Título e valor são obrigatórios','error'); return; }
    const deal = {
      title,
      contactId: Number(document.getElementById('d-contact').value)||null,
      value,
      stage:     document.getElementById('d-stage').value,
      prob:      Number(document.getElementById('d-prob').value)||50,
      closeDate: document.getElementById('d-close').value,
    };
    Store.addDeal(deal);
    Store.addActivity({ icon:'💼', text:`<strong>Novo deal</strong>: ${deal.title} — ${fmtCurrency(deal.value)}`, time:'agora' });
    showToast('Deal criado!');
    document.getElementById('dealModal').classList.remove('open');
    this.render();
    Dashboard.render();
  }
};

document.getElementById('saveDeal').addEventListener('click', () => Pipeline.saveDeal());
document.getElementById('closeDealModal').addEventListener('click', () => document.getElementById('dealModal').classList.remove('open'));
document.getElementById('cancelDealModal').addEventListener('click', () => document.getElementById('dealModal').classList.remove('open'));
document.getElementById('dealModal').addEventListener('click', e => { if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });

// ============================
// TASKS
// ============================
const Tasks = {
  filter: 'all',

  render() {
    const tasks = Store.getTasks();
    const list  = document.getElementById('tasksList');
    const today = new Date();
    today.setHours(0,0,0,0);

    let filtered = tasks;
    if (this.filter === 'pending')  filtered = tasks.filter(t => !t.done && !isOverdue(t.due));
    if (this.filter === 'done')     filtered = tasks.filter(t => t.done);
    if (this.filter === 'overdue')  filtered = tasks.filter(t => !t.done && isOverdue(t.due));

    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        <h4>Nenhuma tarefa aqui</h4>
        <p>Crie uma nova tarefa!</p>
      </div>`;
      return;
    }

    const contacts = Store.getContacts();
    list.innerHTML = filtered.map(t => {
      const c = contacts.find(x => x.id === t.contactId);
      const overdue = !t.done && isOverdue(t.due);
      return `
        <div class="task-item ${t.done?'done':''} ${overdue?'overdue':''}" data-id="${t.id}">
          <button class="task-check" data-toggle="${t.id}" aria-label="Marcar como ${t.done?'pendente':'concluída'}">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
          <div class="task-info">
            <div class="task-title">${t.title}</div>
            <div class="task-sub">
              ${c ? `<span>👤 ${c.name}</span>` : ''}
              ${t.due ? `<span ${overdue?'style="color:var(--accent-red)"':''}>📅 ${fmtDate(t.due)}${overdue?' • Vencida':''}</span>` : ''}
            </div>
          </div>
          <span class="priority-badge priority-${t.priority}">${{high:'Alta',medium:'Média',low:'Baixa'}[t.priority]}</span>
          <div class="task-actions">
            <button class="task-action-btn" data-delete="${t.id}" aria-label="Excluir tarefa">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
            </button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const task = Store.getTasks().find(t => t.id === +btn.dataset.toggle);
        if (!task) return;
        task.done = !task.done;
        Store.updateTask(task);
        if (task.done) Store.addActivity({ icon:'✅', text:`<strong>Tarefa concluída</strong>: ${task.title}`, time:'agora' });
        this.render();
        Dashboard.render();
      });
    });

    list.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.deleteTask(+btn.dataset.delete);
        showToast('Tarefa removida','info');
        this.render();
        Dashboard.render();
      });
    });
  },

  openModal() {
    const modal = document.getElementById('taskModal');
    document.getElementById('t-title').value    = '';
    document.getElementById('t-due').value      = '';
    document.getElementById('t-priority').value = 'medium';
    Contacts.updateContactSelects();
    modal.classList.add('open');
    document.getElementById('t-title').focus();
  },

  save() {
    const title = document.getElementById('t-title').value.trim();
    if (!title) { showToast('Título é obrigatório','error'); return; }
    const task = {
      title,
      contactId: Number(document.getElementById('t-contact').value)||null,
      due:       document.getElementById('t-due').value,
      priority:  document.getElementById('t-priority').value,
      done:      false,
    };
    Store.addTask(task);
    Store.addActivity({ icon:'📋', text:`<strong>Nova tarefa</strong>: ${task.title}`, time:'agora' });
    showToast('Tarefa criada!');
    document.getElementById('taskModal').classList.remove('open');
    this.render();
    Dashboard.render();
  }
};

document.getElementById('saveTask').addEventListener('click', () => Tasks.save());
document.getElementById('closeTaskModal').addEventListener('click',  () => document.getElementById('taskModal').classList.remove('open'));
document.getElementById('cancelTaskModal').addEventListener('click', () => document.getElementById('taskModal').classList.remove('open'));
document.getElementById('taskModal').addEventListener('click', e => { if(e.target===e.currentTarget) e.currentTarget.classList.remove('open'); });

document.getElementById('taskTabs').querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#taskTabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    Tasks.filter = tab.dataset.filter;
    Tasks.render();
  });
});

// ============================
// REPORTS
// ============================
const Reports = {
  rendered: false,
  render() {
    if (this.rendered) return;
    this.rendered = true;
    setTimeout(() => {
      this.renderConversionChart();
      this.renderStatusChart();
      this.renderPerformanceChart();
    }, 100);
  },

  drawBarChart(canvasId, labels, datasets, opts={}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const pad = { top:20, right:20, bottom:35, left:50 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;
    const allVals = datasets.flatMap(d => d.values);
    const maxVal = Math.max(...allVals, 1);
    const barW = (chartW / labels.length) * 0.55;
    const gap  = (chartW / labels.length) * 0.45;

    ctx.clearRect(0,0,W,H);

    // Grid
    for (let i=0;i<=4;i++) {
      const y = pad.top + chartH - (i/4)*chartH;
      ctx.strokeStyle='#1e2535'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke();
      ctx.fillStyle='#4a5468'; ctx.font='10px Inter'; ctx.textAlign='right';
      ctx.fillText(Math.round(maxVal*i/4), pad.left-6, y+3);
    }

    labels.forEach((lbl,i) => {
      const x = pad.left + i*(chartW/labels.length) + gap/2;
      const val = datasets[0].values[i];
      const barH = (val/maxVal)*chartH;
      const grad = ctx.createLinearGradient(0, pad.top+chartH-barH, 0, pad.top+chartH);
      grad.addColorStop(0, datasets[0].color);
      grad.addColorStop(1, datasets[0].color+'44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, pad.top+chartH-barH, barW, barH, [4,4,0,0]);
      ctx.fill();

      ctx.fillStyle='#4a5468'; ctx.font='10px Inter'; ctx.textAlign='center';
      ctx.fillText(lbl, x+barW/2, H-10);
    });
  },

  drawDoughnut(canvasId, labels, values, colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const cx = W/2, cy = H/2;
    const r = Math.min(W,H)*0.35;
    const total = values.reduce((s,v)=>s+v,0);
    let angle = -Math.PI/2;

    values.forEach((v,i) => {
      const slice = (v/total)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.arc(cx, cy, r, angle, angle+slice);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      angle += slice;
    });

    // hole
    ctx.beginPath();
    ctx.arc(cx, cy, r*0.55, 0, Math.PI*2);
    ctx.fillStyle = '#141820';
    ctx.fill();

    // center text
    ctx.fillStyle = '#eef2ff'; ctx.font = `bold 18px Inter`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(total, cx, cy-6);
    ctx.fillStyle = '#4a5468'; ctx.font = '10px Inter';
    ctx.fillText('total', cx, cy+10);

    // legend
    let ly = H - values.length*16 - 4;
    labels.forEach((l,i) => {
      ctx.fillStyle = colors[i];
      ctx.fillRect(8, ly, 10, 10);
      ctx.fillStyle = '#8892a8'; ctx.font='10px Inter'; ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText(`${l}: ${values[i]}`, 22, ly);
      ly += 16;
    });
  },

  renderConversionChart() {
    const deals = Store.getDeals();
    const stages = Object.keys(STAGE_INFO);
    const values = stages.map(s => deals.filter(d => d.stage===s).length);
    this.drawBarChart('conversionChart',
      stages.map(s => STAGE_INFO[s].label),
      [{ values, color: '#a78bfa' }]
    );
  },

  renderStatusChart() {
    const contacts = Store.getContacts();
    const statuses = ['client','prospect','lead'];
    const values = statuses.map(s => contacts.filter(c => c.status===s).length);
    const colors  = ['#34d399','#38bdf8','#fb923c'];
    this.drawDoughnut('statusChart', statuses.map(s=>STATUS_LABEL[s]), values, colors);
  },

  renderPerformanceChart() {
    const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const values = [8,12,10,18,22,0,0,0,0,0,0,0].map(v=>v*1200);
    const canvas = document.getElementById('performanceChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width  = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width  = rect.width  + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);

    const W = rect.width, H = rect.height;
    const pad = { top:20, right:20, bottom:30, left:60 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top  - pad.bottom;
    const maxVal = Math.max(...values, 1);

    ctx.clearRect(0,0,W,H);
    for (let i=0;i<=4;i++) {
      const y = pad.top + chartH - (i/4)*chartH;
      ctx.strokeStyle='#1e2535'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(pad.left,y); ctx.lineTo(W-pad.right,y); ctx.stroke();
      ctx.fillStyle='#4a5468'; ctx.font='10px Inter'; ctx.textAlign='right';
      ctx.fillText(fmtCurrency(maxVal*i/4/1000)+'K', pad.left-6, y+3);
    }

    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top+chartH);
    grad.addColorStop(0,'#34d39955'); grad.addColorStop(1,'#34d39900');

    const nonZero = values.filter(v=>v>0);
    const pts = nonZero.map((v,i)=>({
      x: pad.left + (i/(months.length-1))*chartW,
      y: pad.top  + chartH - (v/maxVal)*chartH
    }));

    if (pts.length > 1) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pad.top+chartH);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length-1].x, pad.top+chartH);
      ctx.closePath(); ctx.fillStyle=grad; ctx.fill();

      ctx.beginPath();
      pts.forEach((p,i) => i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
      ctx.strokeStyle='#34d399'; ctx.lineWidth=2.5; ctx.lineJoin='round'; ctx.stroke();
    }

    months.forEach((l,i) => {
      ctx.fillStyle='#4a5468'; ctx.font='10px Inter'; ctx.textAlign='center'; ctx.textBaseline='top';
      ctx.fillText(l, pad.left + (i/(months.length-1))*chartW, H-18);
    });
  }
};

// ============================
// GLOBAL SEARCH
// ============================
document.getElementById('globalSearch').addEventListener('input', e => {
  const q = e.target.value.trim();
  if (!q) return;
  Pages.go('contacts');
  Contacts.search = q;
  document.getElementById('contactSearch').value = q;
  Contacts.render();
});

// ============================
// KEYBOARD SHORTCUTS
// ============================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.getElementById('sidebar').classList.remove('open');
  }
  if ((e.ctrlKey||e.metaKey) && e.key==='k') {
    e.preventDefault();
    document.getElementById('globalSearch').focus();
  }
});

// ============================
// INIT
// ============================
(function init() {
  Contacts.updateContactSelects();
  Dashboard.render();
  // Resize charts on window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Pages.current === 'dashboard') Dashboard.renderSalesChart();
      if (Pages.current === 'reports') { Reports.rendered=false; Reports.render(); }
    }, 200);
  });
})();
