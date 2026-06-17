// Agilize Tech - Lógica da Gestão de Contratos
(function () {
    'use strict';

    // Verificar sessão ativa
    window.TechSupportDB.checkAuth('../');

    document.addEventListener('DOMContentLoaded', function () {
        var tableBody = document.getElementById('contracts-tbody');
        var countEl = document.getElementById('contracts-count');
        var searchInput = document.querySelector('input[placeholder*="Buscar"]');
        // Usar seletores mais robustos para as abas de filtro
        var filterLinks = document.querySelectorAll('.hidden.md\\:flex a, .hidden.md\\:flex a');

        var currentFilter = 'todos'; // todos, renovacoes, arquivados
        var searchQuery = '';

        // Cores e estilos de plano
        var planColors = {
            'enterprise': 'background:#fef3c7;color:#92400e;',
            'platinum': 'background:#fef3c7;color:#92400e;',
            'gold': 'background:#fef9c3;color:#854d0e;',
            'silver': 'background:#f1f5f9;color:#475569;',
            'basic': 'background:#e0f2fe;color:#0369a1;',
            'premium': 'background:#f0fdf4;color:#15803d;'
        };

        function getPlanColor(plan) {
            if (!plan) return 'background:#f1f5f9;color:#475569;';
            var p = plan.toLowerCase();
            for (var key in planColors) {
                if (p.indexOf(key) !== -1) return planColors[key];
            }
            return 'background:#f1f5f9;color:#475569;';
        }

        // Calcular MRR total
        function calcMRR(contracts) {
            var total = 0;
            contracts.forEach(function (c) {
                if (c.status === 'Ativo' || c.status === 'Em Renovação') {
                    var val = parseFloat(String(c.value || c.monthly_value || 0).replace(/[^0-9,\.]/g, '').replace(',', '.'));
                    if (!isNaN(val)) total += val;
                }
            });
            return total;
        }

        // Calcular contratos a vencer nos próximos 30 dias
        function calcAVencer(contracts) {
            var count = 0;
            var now = Date.now();
            var thirtyDays = 30 * 24 * 3600 * 1000;
            contracts.forEach(function (c) {
                var end = new Date(c.endDate || c.end_date || '2099-01-01').getTime();
                if (end > now && end - now < thirtyDays) count++;
            });
            return count;
        }

        // Atualizar KPIs com dados reais
        function updateKPIs() {
            var contracts = window.TechSupportDB.getContracts();

            var kpiTotal = document.getElementById('kpi-total-contratos');
            var kpiMRR = document.getElementById('kpi-mrr');
            var kpiVencer = document.getElementById('kpi-a-vencer');

            if (kpiTotal) kpiTotal.textContent = contracts.length;
            if (kpiMRR) {
                var mrr = calcMRR(contracts);
                kpiMRR.textContent = mrr > 0
                    ? 'R$ ' + mrr.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    : 'R$ —';
            }
            if (kpiVencer) kpiVencer.textContent = calcAVencer(contracts);
        }

        // Renderizar tabela de contratos
        function renderContracts() {
            if (!tableBody) return;

            var contracts = window.TechSupportDB.getContracts();

            // Filtrar
            var filtered = contracts.filter(function (c) {
                // Busca
                if (searchQuery) {
                    var q = searchQuery.toLowerCase();
                    var id = (c.id || '').toLowerCase();
                    var customerName = (c.customerName || c.customer_name || '').toLowerCase();
                    var plan = (c.plan || '').toLowerCase();
                    if (id.indexOf(q) === -1 && customerName.indexOf(q) === -1 && plan.indexOf(q) === -1) {
                        return false;
                    }
                }

                // Filtros de aba
                if (currentFilter === 'renovacoes') {
                    return c.status === 'Em Renovação' || c.status === 'A Vencer';
                } else if (currentFilter === 'arquivados') {
                    return c.status === 'Expirado' || c.status === 'Inativo';
                }

                return true;
            });

            // Atualizar contagem
            if (countEl) {
                countEl.textContent = 'Mostrando ' + filtered.length + ' de ' + contracts.length + ' contrato' + (contracts.length !== 1 ? 's' : '');
            }

            // Estado vazio
            if (filtered.length === 0) {
                tableBody.innerHTML =
                    '<tr>' +
                    '<td colspan="6" class="px-6 py-12 text-center">' +
                    '<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">' +
                    '<span class="material-symbols-outlined" style="font-size:40px;opacity:0.3;">search_off</span>' +
                    '<p style="color:#76777d;font-weight:500;">Nenhum contrato encontrado para os filtros aplicados.</p>' +
                    '</div>' +
                    '</td>' +
                    '</tr>';
                return;
            }

            tableBody.innerHTML = '';

            filtered.forEach(function (c) {
                var customerName = c.customerName || c.customer_name || '—';
                var initials = customerName.substring(0, 2).toUpperCase();
                var plan = c.plan || '—';
                var planStyle = getPlanColor(plan);
                var startDate = c.startDate || c.start_date || '';
                var endDate = c.endDate || c.end_date || '';
                var value = c.value || c.monthly_value || '—';
                var status = c.status || 'Ativo';
                var customerId = c.customerId || c.customer_id || '';

                var startDateStr = startDate ? new Date(startDate).toLocaleDateString('pt-BR') : '—';
                var endDateStr = endDate ? new Date(endDate).toLocaleDateString('pt-BR') : '—';

                var statusStyle = 'background:#dcfce7;color:#15803d;';
                var statusLabel = status;
                if (status === 'Expirado' || status === 'Inativo') {
                    statusStyle = 'background:#fee2e2;color:#991b1b;';
                } else if (status === 'Em Renovação' || status === 'A Vencer') {
                    statusStyle = 'background:#fef3c7;color:#92400e;';
                } else if (status === 'Renovado') {
                    statusStyle = 'background:#dbeafe;color:#1d4ed8;';
                }

                var tr = document.createElement('tr');
                tr.className = 'hover:bg-surface-container-low transition-colors group';
                tr.innerHTML =
                    '<td class="px-6 py-4">' +
                        '<div class="flex items-center gap-3">' +
                            '<div style="width:32px;height:32px;border-radius:4px;background:rgba(0,88,190,0.1);display:flex;align-items:center;justify-content:center;color:#0058be;font-weight:700;font-size:12px;flex-shrink:0;">' + initials + '</div>' +
                            '<div>' +
                                '<div style="font-weight:600;color:#191c1e;">' + customerName + '</div>' +
                                '<div style="font-size:12px;color:#45464d;">' + c.id + '</div>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4">' +
                        '<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;text-transform:uppercase;' + planStyle + '">' + plan + '</span>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-center">' +
                        '<div class="text-body-md text-primary">' + startDateStr + '</div>' +
                        '<div style="font-size:12px;color:#45464d;">' + endDateStr + '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-right">' +
                        '<div class="font-mono-sm text-mono-sm font-semibold">' + value + '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4">' +
                        '<span style="display:inline-flex;align-items:center;padding:2px 10px;border-radius:2px;font-size:11px;font-weight:700;text-transform:uppercase;' + statusStyle + '">' + statusLabel + '</span>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-right">' +
                        (customerId
                            ? '<button onclick="window.location.href=\'../ficha_do_cliente_techsupport_pro/index.html?id=' + customerId + '\'" class="opacity-0 group-hover:opacity-100 text-secondary text-[12px] font-bold hover:underline transition-all">Ver Cliente</button>'
                            : '<button class="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-secondary transition-all"><span class="material-symbols-outlined">more_vert</span></button>'
                        ) +
                    '</td>';
                tableBody.appendChild(tr);
            });
        }

        // Evento de Busca
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = this.value;
                renderContracts();
            });
        }

        // Filtros de Aba (usando event delegation para robustez)
        document.addEventListener('click', function (e) {
            var link = e.target.closest('header .hidden a, header a.text-secondary, header a.text-on-surface-variant');
            if (!link) return;
            var text = link.textContent.trim().toLowerCase();

            // Reset estilos de todas as abas
            var allLinks = document.querySelectorAll('header .hidden a');
            allLinks.forEach(function (l) {
                l.style.color = '';
                l.style.borderBottom = '';
                l.style.fontWeight = '';
            });

            // Aplicar estilo ativo
            link.style.color = '#0058be';
            link.style.borderBottom = '2px solid #0058be';
            link.style.fontWeight = '700';

            if (text.indexOf('renovação') !== -1 || text.indexOf('renovac') !== -1 || text.indexOf('renewal') !== -1) {
                currentFilter = 'renovacoes';
            } else if (text.indexOf('arquivado') !== -1 || text.indexOf('archived') !== -1) {
                currentFilter = 'arquivados';
            } else {
                currentFilter = 'todos';
            }

            renderContracts();
        });

        // Inicializar
        updateKPIs();
        renderContracts();

        // Escutar sincronização com Supabase
        window.addEventListener('techsupport_db_synced', function () {
            updateKPIs();
            renderContracts();
        });
    });
})();
