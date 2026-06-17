// Agilize Tech - Lógica da Gestão de Clientes
(function () {
    'use strict';

    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');

    document.addEventListener('DOMContentLoaded', function () {
        // Usar getElementById com o novo ID fixo
        var tableBody = document.getElementById('customers-tbody');
        var countEl = document.getElementById('customers-count');
        var searchInput = document.querySelector('.p-6.border-b input');
        var statusSelect = document.querySelectorAll('.p-6.border-b select')[0];
        var industrySelect = document.querySelectorAll('.p-6.border-b select')[1];
        var newClientBtn = document.querySelector('button.bg-secondary');

        var searchQuery = '';
        var statusFilter = '';
        var industryFilter = '';

        // Cores dos logos baseadas no índice para variar
        var logoColors = [
            'background:#d8e2ff;color:#0058be;',
            'background:#fde8d8;color:#c2410c;',
            'background:#e9d5ff;color:#7c3aed;',
            'background:#dbeafe;color:#1d4ed8;',
            'background:#d1fae5;color:#059669;',
            'background:#fef3c7;color:#d97706;',
            'background:#fce7f3;color:#be185d;'
        ];

        // Atualizar KPIs com dados reais
        function updateKPIs() {
            var customers = window.TechSupportDB.getCustomers();
            var contracts = window.TechSupportDB.getContracts();
            var tickets = window.TechSupportDB.getTickets();

            var totalClientes = document.getElementById('kpi-total-clientes');
            var contratosAtivos = document.getElementById('kpi-contratos-ativos');
            var ticketsCriticos = document.getElementById('kpi-tickets-criticos');

            if (totalClientes) totalClientes.textContent = customers.length;
            if (contratosAtivos) {
                var ativos = contracts.filter(function (c) { return c.status === 'Ativo'; }).length;
                contratosAtivos.textContent = ativos;
            }
            if (ticketsCriticos) {
                var criticos = tickets.filter(function (t) {
                    return (t.priority === 'critical' || t.priority === 'crítica') &&
                           t.status !== 'resolved' && t.status !== 'resolvido';
                }).length;
                ticketsCriticos.textContent = criticos;
            }
        }

        // Renderizar tabela de clientes
        function renderCustomers() {
            if (!tableBody) return;

            var customers = window.TechSupportDB.getCustomers();

            // Filtrar
            var filtered = customers.filter(function (c) {
                // Filtro de Busca
                if (searchQuery) {
                    var q = searchQuery.toLowerCase();
                    var name = (c.name || '').toLowerCase();
                    var industry = (c.industry || '').toLowerCase();
                    var contactName = (c.contactName || c.contact_name || '').toLowerCase();
                    if (name.indexOf(q) === -1 && industry.indexOf(q) === -1 && contactName.indexOf(q) === -1) {
                        return false;
                    }
                }

                // Filtro de Status (baseado em tickets ativos)
                if (statusFilter && statusFilter.toLowerCase() !== '' && statusFilter.toLowerCase() !== 'status: todos') {
                    var activeTickets = c.activeTickets || c.active_tickets || 0;
                    var customerStatus = activeTickets > 0 ? 'ativo' : 'inativo';
                    if (statusFilter.toLowerCase() === 'ativo' && customerStatus !== 'ativo') return false;
                    if (statusFilter.toLowerCase() === 'inativo' && customerStatus !== 'inativo') return false;
                }

                // Filtro de Indústria
                if (industryFilter && industryFilter.toLowerCase() !== '' && industryFilter.toLowerCase() !== 'indústria: todas') {
                    var ind = (c.industry || '').toLowerCase();
                    if (ind !== industryFilter.toLowerCase()) return false;
                }

                return true;
            });

            // Atualizar contagem
            if (countEl) {
                countEl.textContent = 'Mostrando ' + filtered.length + ' de ' + customers.length + ' cliente' + (customers.length !== 1 ? 's' : '');
            }

            // Renderizar vazio
            if (filtered.length === 0) {
                tableBody.innerHTML =
                    '<tr>' +
                    '<td colspan="7" class="px-6 py-12 text-center">' +
                    '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">' +
                    '<span class="material-symbols-outlined" style="font-size:40px;opacity:0.3;">search_off</span>' +
                    '<p style="color:#76777d;font-weight:500;">Nenhum cliente encontrado para os filtros aplicados.</p>' +
                    '</div>' +
                    '</td>' +
                    '</tr>';
                return;
            }

            tableBody.innerHTML = '';

            filtered.forEach(function (c, idx) {
                var name = c.name || '—';
                var industry = c.industry || '—';
                var activeTickets = c.activeTickets !== undefined ? c.activeTickets : (c.active_tickets || 0);
                var totalTickets = c.totalTickets !== undefined ? c.totalTickets : (c.total_tickets || 0);
                var slaStatus = c.slaStatus || c.sla_status || 'No Prazo';
                var contactName = c.contactName || c.contact_name || '—';
                var contactEmail = c.contactEmail || c.contact_email || '—';
                var logoText = c.logoText || c.logo_text || name.substring(0, 2).toUpperCase();
                var logoStyle = logoColors[idx % logoColors.length];

                var slaColor = 'background:#dcfce7;color:#15803d;';
                if (slaStatus.toLowerCase().indexOf('atrasado') !== -1) {
                    slaColor = 'background:#ffdad6;color:#93000a;';
                } else if (slaStatus.toLowerCase().indexOf('alerta') !== -1 || slaStatus.toLowerCase().indexOf('aten') !== -1) {
                    slaColor = 'background:#fef9c3;color:#854d0e;';
                }

                var tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-low/30 transition-colors group';
                tr.innerHTML =
                    '<td class="px-6 py-4">' +
                        '<div class="flex items-center gap-3">' +
                            '<div style="width:40px;height:40px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;' + logoStyle + '">' + logoText + '</div>' +
                            '<div>' +
                                '<p class="font-body-md text-body-md font-bold text-on-surface">' + name + '</p>' +
                                '<p class="text-[11px] text-outline">ID: #' + c.id + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4 font-body-md text-body-md">' + industry + '</td>' +
                    '<td class="px-6 py-4 font-mono-sm text-mono-sm text-center">' + String(activeTickets).padStart(2, '0') + '</td>' +
                    '<td class="px-6 py-4 font-mono-sm text-mono-sm text-center">' + totalTickets + '</td>' +
                    '<td class="px-6 py-4">' +
                        '<span style="display:inline-flex;align-items:center;padding:2px 10px;border-radius:999px;font-size:11px;font-weight:700;' + slaColor + '">' + slaStatus + '</span>' +
                    '</td>' +
                    '<td class="px-6 py-4">' +
                        '<div class="text-body-md">' + contactName + '</div>' +
                        '<div class="text-[11px] text-outline">' + contactEmail + '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-right">' +
                        '<button onclick="window.location.href=\'../ficha_do_cliente_techsupport_pro/index.html?id=' + c.id + '\'" ' +
                        'class="text-secondary font-bold hover:underline font-label-md text-label-md">VER DETALHES</button>' +
                    '</td>';
                tableBody.appendChild(tr);
            });
        }

        // Eventos de Filtro
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = this.value;
                renderCustomers();
            });
        }

        if (statusSelect) {
            statusSelect.addEventListener('change', function () {
                statusFilter = this.value;
                renderCustomers();
            });
        }

        if (industrySelect) {
            industrySelect.addEventListener('change', function () {
                industryFilter = this.value;
                renderCustomers();
            });
        }

        // Novo Cliente
        if (newClientBtn) {
            newClientBtn.addEventListener('click', function () {
                var name = prompt('Nome da empresa:');
                if (!name || !name.trim()) return;
                var industry = prompt('Setor/Indústria:', 'Tecnologia');
                if (!industry) return;
                var contact = prompt('Nome do contato principal:');
                if (!contact) return;
                var email = prompt('E-mail do contato:');
                if (!email) return;

                var customers = window.TechSupportDB.getCustomers();
                var nextId = 'C' + (1001 + customers.length);

                var newC = {
                    id: nextId,
                    name: name.trim(),
                    industry: industry.trim(),
                    activeTickets: 0,
                    totalTickets: 0,
                    slaStatus: 'No Prazo',
                    contactName: contact.trim(),
                    contactEmail: email.trim(),
                    logoText: name.trim().substring(0, 2).toUpperCase()
                };

                customers.push(newC);
                window.TechSupportDB.saveCustomers(customers);
                window.TechSupportDB.addLog('[SYSTEM] Novo cliente cadastrado: ' + name + ' (ID: #' + nextId + ').');

                alert('Cliente "' + name + '" cadastrado com sucesso! Protocolo: #' + nextId);
                updateKPIs();
                renderCustomers();
            });
        }

        // Inicializar
        updateKPIs();
        renderCustomers();

        // Escutar sincronização com Supabase
        window.addEventListener('techsupport_db_synced', function () {
            updateKPIs();
            renderCustomers();
        });
    });
})();
