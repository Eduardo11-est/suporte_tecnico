// TechSupport Pro - Camada Views do MVC
(function() {
    // TicketView - Formatação e Badges Visuais para Chamados
    const TicketView = {
        // Obter classe CSS de fundo/texto para a badge da categoria
        getCategoryBadgeClass: (category) => {
            const cat = (category || '').toLowerCase();
            if (cat === 'predial' || cat === 'predial/civil') return 'bg-slate-100 text-slate-700';
            if (cat === 'electrical' || cat === 'elétrica') return 'bg-amber-100 text-amber-700';
            if (cat === 'security' || cat === 'segurança' || cat === 'segurança eletrônica') return 'bg-purple-100 text-purple-700';
            if (cat === 'telecom' || cat === 'telecomunicações') return 'bg-indigo-100 text-indigo-700';
            return 'bg-blue-100 text-blue-700'; // padrão informática / ti
        },

        // Obter classe CSS de fundo/texto para a prioridade
        getPriorityBadgeClass: (priority) => {
            const prio = (priority || '').toLowerCase();
            if (prio === 'critical' || prio === 'crítica') return 'bg-red-100 text-red-700';
            if (prio === 'high' || prio === 'alta') return 'bg-orange-100 text-orange-700';
            if (prio === 'medium' || prio === 'média') return 'bg-amber-100 text-amber-700';
            if (prio === 'low' || prio === 'baixa') return 'bg-green-100 text-green-700';
            return 'bg-slate-100 text-slate-700';
        },

        // Obter cor do indicador/ponto de status
        getStatusDotClass: (status) => {
            const stat = (status || '').toLowerCase();
            if (stat === 'pending' || stat === 'pendente') return 'bg-red-500';
            if (stat === 'waiting-parts' || stat === 'aguardando peça' || stat === 'aguardando peças') return 'bg-orange-500';
            if (stat === 'resolved' || stat === 'resolvido') return 'bg-green-500';
            return 'bg-blue-500'; // em progresso / in-progress
        },

        // Formatação de data relativa amigável
        formatRelativeDate: (dateString, authorName) => {
            if (!dateString) return authorName ? `por ${authorName}` : '';
            const createdDate = new Date(dateString);
            const diffMs = Date.now() - createdDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let timeStr = 'Aberto agora';
            if (diffDays > 0) timeStr = `Aberto há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
            else if (diffHours > 0) timeStr = `Aberto há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
            else if (diffMins > 0) timeStr = `Aberto há ${diffMins} min`;

            return authorName ? `${timeStr} por ${authorName}` : timeStr;
        }
    };

    // CustomerView - Formatação e Apresentação de Clientes
    const CustomerView = {
        // Obter badge do SLA
        getSlaBadgeClass: (slaStatus) => {
            const status = (slaStatus || '').toLowerCase();
            if (status.includes('atrasado')) return 'bg-red-100 text-red-700 border border-red-200';
            return 'bg-green-100 text-green-700 border border-green-200';
        }
    };

    // ContractView - Formatação e Apresentação de Contratos
    const ContractView = {
        // Obter badge do status do contrato
        getStatusBadgeClass: (status) => {
            const stat = (status || '').toLowerCase();
            if (stat === 'ativo') return 'bg-green-100 text-green-700';
            if (stat === 'em renovação') return 'bg-amber-100 text-amber-700';
            return 'bg-red-100 text-red-700'; // Expirado / Cancelado
        },
        
        // Formatar valor monetário do contrato
        formatCurrency: (value) => {
            if (!value) return '—';
            if (typeof value === 'number') {
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) + '/mês';
            }
            return value;
        }
    };

    // Exportar Views Globalmente para o MVC
    window.TechSupportViews = {
        TicketView: TicketView,
        CustomerView: CustomerView,
        ContractView: ContractView
    };
})();
