// Agilize Tech - Lógica da Tela de Chamados
(function () {
    // Verificar autenticação
    window.TechSupportDB.checkAuth('../');

    // Exibir nome do usuário no header
    function updateHeader() {
        const session = JSON.parse(localStorage.getItem('techsupport_pro_session') || 'null');
        if (session) {
            const nameEl = document.getElementById('header-username');
            const avatarEl = document.getElementById('header-avatar');
            if (nameEl) nameEl.textContent = session.name || session.email || 'Usuário';
            if (avatarEl) avatarEl.textContent = (session.name || session.email || 'U')[0].toUpperCase();
        }
    }

    // Mapas de categoria e prioridade para badge CSS
    const catBadgeMap = {
        'it': 'bg-blue-100 text-blue-700',
        'informática': 'bg-blue-100 text-blue-700',
        'informática/ti': 'bg-blue-100 text-blue-700',
        'elétrica': 'bg-amber-100 text-amber-700',
        'electrical': 'bg-amber-100 text-amber-700',
        'predial': 'bg-slate-100 text-slate-700',
        'predial/civil': 'bg-slate-100 text-slate-700',
        'security': 'bg-purple-100 text-purple-700',
        'segurança eletrônica': 'bg-purple-100 text-purple-700',
        'segurança': 'bg-purple-100 text-purple-700',
        'telecom': 'bg-indigo-100 text-indigo-700',
        'telecomunicações': 'bg-indigo-100 text-indigo-700'
    };

    const prioBadgeMap = {
        'critical': 'bg-red-100 text-red-700',
        'crítica': 'bg-red-100 text-red-700',
        'high': 'bg-orange-100 text-orange-700',
        'alta': 'bg-orange-100 text-orange-700',
        'medium': 'bg-amber-100 text-amber-700',
        'média': 'bg-amber-100 text-amber-700',
        'low': 'bg-green-100 text-green-700',
        'baixa': 'bg-green-100 text-green-700'
    };

    const statusDotMap = {
        'pending': 'bg-red-500',
        'pendente': 'bg-red-500',
        'in-progress': 'bg-blue-500 animate-pulse',
        'em progresso': 'bg-blue-500 animate-pulse',
        'waiting-parts': 'bg-orange-500',
        'aguardando peça': 'bg-orange-500',
        'resolved': 'bg-green-500',
        'resolvido': 'bg-green-500'
    };

    // Estado dos filtros
    let currentCategoryFilter = 'todos';
    let currentStatusFilter = 'todos';
    let currentPriorityFilter = 'todos';
    let currentSearch = '';

    // KPI counter
    function updateKPIs(tickets) {
        const open = tickets.filter(t => t.status !== 'resolved' && t.status !== 'resolvido').length;
        const inProgress = tickets.filter(t => t.status === 'in-progress' || t.status === 'em progresso').length;
        const waiting = tickets.filter(t => t.status === 'waiting-parts' || t.status === 'aguardando peça').length;
        const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'resolvido').length;

        document.getElementById('kpi-open').textContent = open;
        document.getElementById('kpi-progress').textContent = inProgress;
        document.getElementById('kpi-waiting').textContent = waiting;
        document.getElementById('kpi-resolved').textContent = resolved;
    }

    // Formatar tempo relativo
    function timeAgo(dateStr) {
        if (!dateStr) return 'Data desconhecida';
        const date = new Date(dateStr);
        const diff = Date.now() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
        if (hours > 0) return `há ${hours}h`;
        if (mins > 0) return `há ${mins}min`;
        return 'agora mesmo';
    }

    // Formatar data completa
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    // Renderizar tabela de chamados
    function renderTickets() {
        const tbody = document.getElementById('tickets-tbody');
        if (!tbody) return;

        let tickets = window.TechSupportDB.getTickets();

        // Filtro de categoria
        if (currentCategoryFilter !== 'todos') {
            tickets = tickets.filter(t => {
                const cat = (t.category || '').toLowerCase();
                const catName = (t.categoryName || t.category_name || '').toLowerCase();
                return cat.includes(currentCategoryFilter) || catName.includes(currentCategoryFilter) ||
                    (currentCategoryFilter === 'it' && (cat === 'it' || cat.includes('informática') || cat.includes('ti')));
            });
        }

        // Filtro de status
        if (currentStatusFilter !== 'todos') {
            tickets = tickets.filter(t => (t.status || '').toLowerCase() === currentStatusFilter);
        }

        // Filtro de prioridade
        if (currentPriorityFilter !== 'todos') {
            tickets = tickets.filter(t => (t.priority || '').toLowerCase() === currentPriorityFilter);
        }

        // Filtro de busca
        if (currentSearch) {
            const q = currentSearch.toLowerCase();
            tickets = tickets.filter(t =>
                (t.id || '').toLowerCase().includes(q) ||
                (t.subject || '').toLowerCase().includes(q) ||
                (t.customerName || t.customer_name || '').toLowerCase().includes(q) ||
                (t.author || '').toLowerCase().includes(q)
            );
        }

        // Atualizar contador
        const countEl = document.getElementById('tickets-count');
        if (countEl) countEl.textContent = `${tickets.length} chamado${tickets.length !== 1 ? 's' : ''}`;

        // Atualizar KPIs com todos os chamados (sem filtros)
        updateKPIs(window.TechSupportDB.getTickets());

        if (tickets.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-16 text-center">
                        <div class="flex flex-col items-center gap-3">
                            <span class="material-symbols-outlined text-5xl text-on-surface-variant opacity-30">search_off</span>
                            <p class="text-on-surface-variant font-medium">Nenhum chamado encontrado</p>
                            <p class="text-xs text-on-surface-variant opacity-70">Tente ajustar os filtros ou pesquisar por outro termo.</p>
                        </div>
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = '';

        tickets.forEach(ticket => {
            const catKey = (ticket.category || '').toLowerCase();
            const catName = ticket.categoryName || ticket.category_name || ticket.category || catKey;
            const catBadge = catBadgeMap[catKey] || catBadgeMap[catName.toLowerCase()] || 'bg-gray-100 text-gray-700';

            const prioKey = (ticket.priority || '').toLowerCase();
            const prioName = ticket.priorityName || ticket.priority_name || ticket.priority || prioKey;
            const prioBadge = prioBadgeMap[prioKey] || prioBadgeMap[prioName.toLowerCase()] || 'bg-slate-100 text-slate-700';

            const statusKey = (ticket.status || '').toLowerCase();
            const statusName = ticket.statusName || ticket.status_name || ticket.status || statusKey;
            const statusDot = statusDotMap[statusKey] || statusDotMap[statusName.toLowerCase()] || 'bg-gray-400';

            const customerName = ticket.customerName || ticket.customer_name || '—';
            const createdAt = ticket.createdAt || ticket.created_at || '';

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-surface-container-low transition-colors group';
            tr.innerHTML = `
                <td class="px-6 py-4 font-mono-sm text-mono-sm text-secondary font-semibold whitespace-nowrap">${ticket.id}</td>
                <td class="px-6 py-4 max-w-[260px]">
                    <div class="flex flex-col">
                        <span class="text-on-surface font-semibold truncate">${ticket.subject || '—'}</span>
                        <span class="text-[11px] text-on-surface-variant truncate">${customerName} · ${ticket.author || '—'}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="${catBadge} px-3 py-1 rounded text-[11px] font-bold uppercase">${catName}</span>
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                    <span class="${prioBadge} priority-badge">${prioName}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full ${statusDot} flex-shrink-0"></div>
                        <span class="text-body-md text-on-surface">${statusName}</span>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col">
                        <span class="text-body-md text-on-surface">${timeAgo(createdAt)}</span>
                        <span class="text-[10px] text-on-surface-variant">${formatDate(createdAt)}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                    <div class="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <a href="../detalhes_do_chamado_suporte_t_cnico/index.html?id=${encodeURIComponent(ticket.id)}"
                           class="p-2 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors" title="Visualizar Detalhes">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </a>
                        <button class="p-2 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors assign-btn" 
                                data-id="${ticket.id}" title="Atribuir Técnico">
                            <span class="material-symbols-outlined text-[20px]">assignment_ind</span>
                        </button>
                        <button class="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" 
                                title="Marcar como Resolvido" data-resolve-id="${ticket.id}">
                            <span class="material-symbols-outlined text-[20px]">check_circle</span>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Botões de atribuir
        document.querySelectorAll('.assign-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const modal = document.getElementById('modal-assign');
                const modalId = document.getElementById('modal-ticket-id');
                if (modal && modalId) {
                    modalId.textContent = id;
                    modal.setAttribute('data-ticket-id', id);
                    modal.classList.remove('hidden');
                }
            });
        });

        // Botões de resolver
        document.querySelectorAll('[data-resolve-id]').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-resolve-id');
                const ticket = window.TechSupportDB.getTicketById(id);
                if (ticket && confirm(`Marcar chamado ${id} como Resolvido?`)) {
                    ticket.status = 'resolved';
                    ticket.statusName = 'Resolvido';
                    window.TechSupportDB.updateTicket(ticket);
                    renderTickets();
                    showToast('Chamado marcado como resolvido!', 'success');
                }
            });
        });
    }

    // Toast de notificação
    function showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-secondary' };
        toast.className = `fixed bottom-6 right-6 z-50 ${colors[type] || colors.info} text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-label-md transition-all`;
        toast.innerHTML = `<span class="material-symbols-outlined text-[18px]">${type === 'success' ? 'check_circle' : 'info'}</span> ${msg}`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3000);
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateHeader();
        renderTickets();

        // Filtros de categoria (pills)
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', function () {
                document.querySelectorAll('.filter-pill').forEach(p => {
                    p.classList.remove('bg-secondary', 'text-on-secondary', 'active');
                    p.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                });
                this.classList.add('bg-secondary', 'text-on-secondary', 'active');
                this.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
                currentCategoryFilter = this.getAttribute('data-filter');
                renderTickets();
            });
        });

        // Filtro de status
        const statusSelect = document.getElementById('status-filter');
        if (statusSelect) {
            statusSelect.addEventListener('change', function () {
                currentStatusFilter = this.value;
                renderTickets();
            });
        }

        // Filtro de prioridade
        const prioritySelect = document.getElementById('priority-filter');
        if (prioritySelect) {
            prioritySelect.addEventListener('change', function () {
                currentPriorityFilter = this.value;
                renderTickets();
            });
        }

        // Busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                currentSearch = this.value;
                renderTickets();
            });
        }

        // Botão sincronizar
        const syncBtn = document.getElementById('btn-refresh');
        if (syncBtn) {
            syncBtn.addEventListener('click', async function () {
                syncBtn.classList.add('opacity-50', 'pointer-events-none');
                syncBtn.querySelector('span.material-symbols-outlined').style.animation = 'spin 1s linear infinite';
                await window.TechSupportDB.syncFromSupabase();
                renderTickets();
                syncBtn.classList.remove('opacity-50', 'pointer-events-none');
                syncBtn.querySelector('span.material-symbols-outlined').style.animation = '';
                showToast('Chamados sincronizados com o banco de dados!', 'success');
            });
        }

        // Modal de atribuição
        const modalClose = document.getElementById('modal-close');
        const modalCancel = document.getElementById('modal-cancel');
        const modalConfirm = document.getElementById('modal-confirm');
        const modal = document.getElementById('modal-assign');

        function closeModal() { if (modal) modal.classList.add('hidden'); }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalCancel) modalCancel.addEventListener('click', closeModal);
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) closeModal();
            });
        }

        if (modalConfirm) {
            modalConfirm.addEventListener('click', function () {
                const ticketId = modal.getAttribute('data-ticket-id');
                const engineer = document.getElementById('modal-engineer').value;
                const ticket = window.TechSupportDB.getTicketById(ticketId);
                if (ticket) {
                    ticket.assignedTo = engineer;
                    ticket.status = 'in-progress';
                    ticket.statusName = 'Em Progresso';
                    window.TechSupportDB.updateTicket(ticket);
                    renderTickets();
                    closeModal();
                    showToast(`Chamado ${ticketId} atribuído a ${engineer}!`, 'success');
                }
            });
        }

        // Escutar sincronização com Supabase
        window.addEventListener('techsupport_db_synced', function () {
            renderTickets();
        });
    });
})();
