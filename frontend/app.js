// TechSupport Pro - Lógica do Dashboard Raiz
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('./');

    document.addEventListener('DOMContentLoaded', function() {
        const ticketsTableBody = document.querySelector('table tbody');
        const searchInput = document.querySelector('header input');
        const pillFilters = document.querySelectorAll('.flex.flex-wrap.gap-2 button');

        let currentCategoryFilter = 'todos';
        let currentSearchQuery = '';

        // Renderizar Métricas
        function renderMetrics() {
            const tickets = window.TechSupportDB.getTickets();
            
            const openCount = tickets.filter(t => t.status !== 'resolved').length;
            const inProgressCount = tickets.filter(t => t.status === 'in-progress').length;
            const waitingPartsCount = tickets.filter(t => t.status === 'waiting-parts').length;
            const resolvedCount = tickets.filter(t => t.status === 'resolved').length;

            // Injetar nos elementos correspondentes do DOM
            // Usamos seletores baseados no texto do card
            document.querySelectorAll('.grid > div').forEach(card => {
                const titleEl = card.querySelector('p');
                if (!titleEl) return;
                const title = titleEl.innerText;
                const valueEl = card.querySelector('h3');
                if (!valueEl) return;

                if (title.includes('Chamados Abertos')) {
                    valueEl.innerText = openCount;
                } else if (title.includes('Em Atendimento')) {
                    valueEl.innerText = inProgressCount;
                } else if (title.includes('Aguardando Peças')) {
                    valueEl.innerText = waitingPartsCount;
                } else if (title.includes('Concluídos Hoje')) {
                    valueEl.innerText = resolvedCount;
                }
            });
        }

        // Traduzir categorias do banco para o filtro de texto
        const categoryMap = {
            'informática/ti': 'it',
            'ti': 'it',
            'informática': 'it',
            'elétrica': 'electrical',
            'predial/civil': 'predial',
            'predial': 'predial',
            'civil': 'predial',
            'segurança eletrônica': 'security',
            'segurança': 'security',
            'telecomunicações': 'telecom',
            'telecom': 'telecom'
        };

        // Renderizar Tabela de Chamados
        function renderTickets() {
            if (!ticketsTableBody) return;
            ticketsTableBody.innerHTML = '';

            const tickets = window.TechSupportDB.getTickets();

            // Filtrar chamados
            const filteredTickets = tickets.filter(ticket => {
                // Filtro de Categoria
                if (currentCategoryFilter !== 'todos') {
                    const ticketCat = categoryMap[ticket.category.toLowerCase()] || ticket.category.toLowerCase();
                    const filterCat = categoryMap[currentCategoryFilter.toLowerCase()] || currentCategoryFilter.toLowerCase();
                    if (ticketCat !== filterCat) return false;
                }

                // Filtro de Busca por Texto
                if (currentSearchQuery) {
                    const q = currentSearchQuery.toLowerCase();
                    const subjectMatch = ticket.subject.toLowerCase().includes(q);
                    const authorMatch = ticket.author.toLowerCase().includes(q);
                    const idMatch = ticket.id.toLowerCase().includes(q);
                    if (!subjectMatch && !authorMatch && !idMatch) return false;
                }

                return true;
            });

            if (filteredTickets.length === 0) {
                ticketsTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-6 py-8 text-center text-on-surface-variant font-medium">
                            Nenhum chamado encontrado para os filtros aplicados.
                        </td>
                    </tr>
                `;
                return;
            }

            // Injetar linhas na tabela
            filteredTickets.forEach(ticket => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-low transition-colors group';

                // Badge de Categoria
                let catBadgeColor = 'bg-blue-100 text-blue-700';
                if (ticket.category === 'predial') catBadgeColor = 'bg-slate-100 text-slate-700';
                else if (ticket.category === 'electrical') catBadgeColor = 'bg-amber-100 text-amber-700';
                else if (ticket.category === 'security') catBadgeColor = 'bg-purple-100 text-purple-700';
                else if (ticket.category === 'telecom') catBadgeColor = 'bg-indigo-100 text-indigo-700';

                // Badge de Prioridade
                let prioBadgeColor = 'bg-slate-100 text-slate-700';
                if (ticket.priority === 'critical') prioBadgeColor = 'bg-red-100 text-red-700';
                else if (ticket.priority === 'high') prioBadgeColor = 'bg-orange-100 text-orange-700';
                else if (ticket.priority === 'medium') prioBadgeColor = 'bg-amber-100 text-amber-700';
                else if (ticket.priority === 'low') prioBadgeColor = 'bg-green-100 text-green-700';

                // Status Indicator
                let statusDotColor = 'bg-blue-500';
                if (ticket.status === 'pending') statusDotColor = 'bg-red-500';
                else if (ticket.status === 'waiting-parts') statusDotColor = 'bg-orange-500';
                else if (ticket.status === 'resolved') statusDotColor = 'bg-green-500';

                // Formatar Data Relativa Simplificada
                const createdDate = new Date(ticket.createdAt);
                const diffMs = Date.now() - createdDate.getTime();
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                let timeStr = 'Aberto agora';
                if (diffDays > 0) timeStr = `Aberto há ${diffDays} dia${diffDays > 1 ? 's' : ''} por ${ticket.author}`;
                else if (diffHours > 0) timeStr = `Aberto há ${diffHours} hora${diffHours > 1 ? 's' : ''} por ${ticket.author}`;
                else if (diffMins > 0) timeStr = `Aberto há ${diffMins} min por ${ticket.author}`;
                else timeStr = `Aberto por ${ticket.author}`;

                tr.innerHTML = `
                    <td class="px-6 py-4 font-mono-sm text-mono-sm text-secondary font-semibold">${ticket.id}</td>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="text-on-surface font-semibold">${ticket.subject}</span>
                            <span class="text-[11px] text-on-surface-variant">${timeStr}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="${catBadgeColor} px-3 py-1 rounded text-[11px] font-bold uppercase">${ticket.categoryName || ticket.category}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="${prioBadgeColor} px-3 py-1 rounded-full text-[11px] font-bold uppercase">${ticket.priorityName || ticket.priority}</span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <div class="w-2 h-2 rounded-full ${statusDotColor} ${ticket.status === 'in-progress' ? 'animate-pulse' : ''}"></div>
                            <span class="text-body-md text-on-surface">${ticket.statusName || ticket.status}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onclick="window.location.href='./detalhes_do_chamado_suporte_t_cnico/index.html?id=${ticket.id}'" class="p-2 hover:bg-secondary/10 hover:text-secondary rounded transition-colors" title="Visualizar">
                                <span class="material-symbols-outlined">visibility</span>
                            </button>
                            <button class="p-2 hover:bg-secondary/10 hover:text-secondary rounded transition-colors assign-btn" data-id="${ticket.id}" title="Atribuir">
                                <span class="material-symbols-outlined">assignment_ind</span>
                            </button>
                        </div>
                    </td>
                `;
                ticketsTableBody.appendChild(tr);
            });

            // Atribuir evento ao botão de Atribuir
            document.querySelectorAll('.assign-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const ticketId = this.getAttribute('data-id');
                    const ticket = window.TechSupportDB.getTicketById(ticketId);
                    if (ticket) {
                        alert(`Chamado ${ticket.id} atribuído ao engenheiro Ricardo Silva.`);
                        ticket.status = 'in-progress';
                        ticket.statusName = 'Em Progresso';
                        window.TechSupportDB.updateTicket(ticket);
                        renderTickets();
                        renderMetrics();
                    }
                });
            });
        }

        // Inicializar Filtros de Categoria (Pills)
        pillFilters.forEach(pill => {
            pill.addEventListener('click', function() {
                pillFilters.forEach(p => {
                    p.classList.remove('bg-secondary', 'text-on-secondary');
                    p.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                });
                this.classList.add('bg-secondary', 'text-on-secondary');
                this.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

                // Aplicar Filtro
                const text = this.innerText.toLowerCase();
                if (text.includes('todos')) {
                    currentCategoryFilter = 'todos';
                } else if (text.includes('informática')) {
                    currentCategoryFilter = 'it';
                } else if (text.includes('elétrica')) {
                    currentCategoryFilter = 'elétrica';
                } else if (text.includes('predial')) {
                    currentCategoryFilter = 'predial';
                } else if (text.includes('segurança')) {
                    currentCategoryFilter = 'segurança';
                } else if (text.includes('telecom')) {
                    currentCategoryFilter = 'telecom';
                }

                renderTickets();
            });
        });

        // Evento de Busca
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearchQuery = this.value;
                renderTickets();
            });
        }

        // Inicialização
        renderMetrics();
        renderTickets();
    });
})();
