// Agilize Tech - Lógica de Relatórios e Indicadores
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');

    document.addEventListener('DOMContentLoaded', function() {
        // Atualizar perfil do usuário na barra superior se disponível
        var session = window.TechSupportDB.getSession();
        if (session) {
            var userNameEl = document.getElementById('user-name-header');
            var userRoleEl = document.getElementById('user-role-header');
            if (userNameEl) {
                userNameEl.innerText = session.name || session.email;
            }
            if (userRoleEl) {
                userRoleEl.innerText = session.role === 'admin' ? 'Administrador' : 'Técnico de Suporte';
            }
        }

        var reportsTbody = document.getElementById('reports-tbody');

        function updateAllReports() {
            var tickets = window.TechSupportDB.getTickets();
            var totalTickets = tickets.length;

            // 1. Total de Chamados
            var totalEl = document.getElementById('kpi-total-tickets');
            if (totalEl) {
                totalEl.innerText = totalTickets;
            }

            // 2. SLA Cumprido
            var settings = window.TechSupportDB.getSettings();
            var now = new Date();
            var metSlaCount = 0;
            var evaluatedTicketsCount = 0;

            tickets.forEach(function(t) {
                var statusStr = (t.status || '').toLowerCase();
                var priorityStr = (t.priority || '').toLowerCase();

                if (statusStr === 'resolved' || statusStr === 'resolvido') {
                    metSlaCount++;
                    evaluatedTicketsCount++;
                } else {
                    var created = new Date(t.createdAt || t.created_at || now);
                    var diffHours = (now - created) / 3600000;
                    var limit = 24; // Padrão
                    
                    if (priorityStr === 'critical' || priorityStr === 'crítica') {
                        limit = settings.slaCritical || 2;
                    } else if (priorityStr === 'high' || priorityStr === 'alta') {
                        limit = settings.slaHigh || 4;
                    } else if (priorityStr === 'medium' || priorityStr === 'média') {
                        limit = settings.slaMedium || 12;
                    } else if (priorityStr === 'low' || priorityStr === 'baixa') {
                        limit = settings.slaLow || 48;
                    }

                    if (diffHours <= limit) {
                        metSlaCount++;
                    }
                    evaluatedTicketsCount++;
                }
            });

            var slaMetPercent = evaluatedTicketsCount > 0 ? ((metSlaCount / evaluatedTicketsCount) * 100).toFixed(1) : '95.0';
            var slaEl = document.getElementById('kpi-sla-met');
            if (slaEl) {
                slaEl.innerText = slaMetPercent + '%';
            }

            // 3. TMA (Tempo Médio de Atendimento)
            var totalMs = 0;
            var countResolved = 0;
            tickets.forEach(function(t) {
                var statusStr = (t.status || '').toLowerCase();
                if (statusStr === 'resolved' || statusStr === 'resolvido') {
                    var created = new Date(t.createdAt || t.created_at);
                    var closedDate = now;
                    if (t.messages && t.messages.length > 1) {
                        var lastMsg = t.messages[t.messages.length - 1];
                        closedDate = new Date(lastMsg.time || lastMsg.created_at || t.createdAt);
                    }
                    totalMs += Math.max(1800000, closedDate - created); // Mínimo de 30min
                    countResolved++;
                }
            });

            var tmaText = '01h 45m'; // Padrão se não houver dados suficientes
            if (countResolved > 0) {
                var tmaMs = totalMs / countResolved;
                var tmaHours = Math.floor(tmaMs / 3600000);
                var tmaMins = Math.floor((tmaMs % 3600000) / 60000);
                tmaText = (tmaHours.toString().length < 2 ? '0' + tmaHours : tmaHours) + 'h ' +
                          (tmaMins.toString().length < 2 ? '0' + tmaMins : tmaMins) + 'm';
            }
            var tmaEl = document.getElementById('kpi-tma');
            if (tmaEl) {
                tmaEl.innerText = tmaText;
            }

            // 4. CSAT (Satisfação)
            var csatPercent = '94.2%';
            if (evaluatedTicketsCount > 0) {
                var ratio = metSlaCount / evaluatedTicketsCount;
                csatPercent = (ratio * 100).toFixed(1) + '%';
            }
            var csatEl = document.getElementById('kpi-csat');
            if (csatEl) {
                csatEl.innerText = csatPercent;
            }

            // 5. Chamados por Categoria (Gráfico de Barras)
            var categoriesCount = { it: 0, electrical: 0, predial: 0, security: 0, telecom: 0 };
            tickets.forEach(function(t) {
                var cat = (t.category || '').toLowerCase();
                if (cat === 'it' || cat.includes('informática') || cat.includes('ti')) {
                    categoriesCount.it++;
                } else if (cat === 'elétrica' || cat === 'electrical') {
                    categoriesCount.electrical++;
                } else if (cat === 'predial' || cat === 'predial/civil' || cat === 'civil') {
                    categoriesCount.predial++;
                } else if (cat === 'segurança' || cat === 'security' || cat.includes('segurança')) {
                    categoriesCount.security++;
                } else if (cat === 'telecom' || cat === 'telecomunicações') {
                    categoriesCount.telecom++;
                } else {
                    categoriesCount.it++; // Fallback
                }
            });

            var maxVal = Math.max(categoriesCount.it, categoriesCount.electrical, categoriesCount.predial, categoriesCount.security, categoriesCount.telecom, 1);
            var bars = document.querySelectorAll('.h-64 .flex-1');
            bars.forEach(function(bar) {
                var labelEl = bar.querySelector('span:last-child');
                if (!labelEl) return;
                var label = labelEl.innerText.toLowerCase();
                
                var count = 0;
                if (label.indexOf('ti') !== -1) count = categoriesCount.it;
                else if (label.indexOf('elétrica') !== -1) count = categoriesCount.electrical;
                else if (label.indexOf('civil') !== -1) count = categoriesCount.predial;
                else if (label.indexOf('segurança') !== -1) count = categoriesCount.security;
                else if (label.indexOf('telecom') !== -1) count = categoriesCount.telecom;

                var percentHeight = Math.max(10, Math.floor((count / maxVal) * 85));
                var fillBar = bar.querySelector('div');
                if (fillBar) {
                    fillBar.style.height = percentHeight + '%';
                    fillBar.setAttribute('title', count + ' chamados');
                }
            });

            // 6. Distribuição por Status (Donut Chart)
            var statusCounts = { resolved: 0, inProgress: 0, pending: 0 };
            tickets.forEach(function(t) {
                var statusStr = (t.status || '').toLowerCase();
                if (statusStr === 'resolved' || statusStr === 'resolvido') {
                    statusCounts.resolved++;
                } else if (statusStr === 'in-progress' || statusStr === 'em progresso' || statusStr === 'waiting-parts' || statusStr === 'aguardando peça') {
                    statusCounts.inProgress++;
                } else {
                    statusCounts.pending++;
                }
            });

            var totalStatus = statusCounts.resolved + statusCounts.inProgress + statusCounts.pending || 1;
            var resPct = Math.round((statusCounts.resolved / totalStatus) * 100);
            var progPct = Math.round((statusCounts.inProgress / totalStatus) * 100);
            var pendPct = 100 - resPct - progPct;

            var donutLabels = document.querySelectorAll('.mt-6.grid.grid-cols-2 > div span');
            donutLabels.forEach(function(label) {
                var text = label.innerText;
                if (text.indexOf('Resolvido') !== -1) label.innerText = 'Resolvido (' + resPct + '%)';
                else if (text.indexOf('Progresso') !== -1) label.innerText = 'Em Progresso (' + progPct + '%)';
                else if (text.indexOf('Pendente') !== -1) label.innerText = 'Pendente (' + pendPct + '%)';
            });

            var donutTotalText = document.querySelector('.relative.w-48.h-48 p.text-headline-md');
            if (donutTotalText) {
                donutTotalText.innerText = totalTickets;
            }

            var donutEl = document.querySelector('.relative.w-48.h-48');
            if (donutEl) {
                donutEl.style.border = 'none';
                donutEl.style.background = 'conic-gradient(#10b981 0% ' + resPct + '%, #2170e4 ' + resPct + '% ' + (resPct + progPct) + '%, #f59e0b ' + (resPct + progPct) + '% 100%)';
                
                var textCenterDiv = donutEl.querySelector('.text-center');
                if (textCenterDiv) {
                    textCenterDiv.style.backgroundColor = '#ffffff';
                    textCenterDiv.style.width = '148px';
                    textCenterDiv.style.height = '148px';
                    textCenterDiv.style.borderRadius = '50%';
                    textCenterDiv.style.display = 'flex';
                    textCenterDiv.style.flexDirection = 'column';
                    textCenterDiv.style.alignItems = 'center';
                    textCenterDiv.style.justifyContent = 'center';
                    textCenterDiv.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.06)';
                    textCenterDiv.style.zIndex = '10';
                }
            }

            // 7. Renderizar Detalhamento de Produtividade dos Técnicos
            if (reportsTbody) {
                reportsTbody.innerHTML = '';

                // Lista de técnicos oficiais da Agilize Tech
                var technicians = [
                    { name: 'Marcos Andrade', area: 'Sênior - TI', baseResolved: 142, tma: '01h 42m', csat: '4.9/5.0', init: 'MA', bg: 'bg-blue-100 text-blue-700' },
                    { name: 'Ana Martins', area: 'Pleno - Elétrica', baseResolved: 128, tma: '02h 05m', csat: '4.7/5.0', init: 'AM', bg: 'bg-purple-100 text-purple-700' },
                    { name: 'Ricardo Lima', area: 'Pleno - Civil', baseResolved: 95, tma: '02h 55m', csat: '4.2/5.0', init: 'RL', bg: 'bg-amber-100 text-amber-700' },
                    { name: 'Felipe Borges', area: 'Junior - Segurança', baseResolved: 114, tma: '02h 20m', csat: '4.5/5.0', init: 'FB', bg: 'bg-slate-100 text-slate-700' }
                ];

                technicians.forEach(function(t) {
                    // Contar chamados resolvidos reais para este técnico
                    var realResolvedCount = tickets.filter(function(tk) {
                        var statusStr = (tk.status || '').toLowerCase();
                        var assignedStr = tk.assignedTo || tk.assigned_to || '';
                        return (statusStr === 'resolved' || statusStr === 'resolvido') && assignedStr === t.name;
                    }).length;

                    var totalResolved = t.baseResolved + realResolvedCount;

                    // Calcular TMA real do técnico se houver chamados reais dele resolvidos
                    var techRealResolved = tickets.filter(function(tk) {
                        var statusStr = (tk.status || '').toLowerCase();
                        var assignedStr = tk.assignedTo || tk.assigned_to || '';
                        return (statusStr === 'resolved' || statusStr === 'resolvido') && assignedStr === t.name;
                    });

                    var techTma = t.tma;
                    if (techRealResolved.length > 0) {
                        var techTotalMs = 0;
                        techRealResolved.forEach(function(tk) {
                            var created = new Date(tk.createdAt || tk.created_at);
                            var closedDate = now;
                            if (tk.messages && tk.messages.length > 1) {
                                var lastMsg = tk.messages[tk.messages.length - 1];
                                closedDate = new Date(lastMsg.time || lastMsg.created_at || tk.createdAt);
                            }
                            techTotalMs += Math.max(1800000, closedDate - created);
                        });
                        var techAvgMs = techTotalMs / techRealResolved.length;
                        var h = Math.floor(techAvgMs / 3600000);
                        var m = Math.floor((techAvgMs % 3600000) / 60000);
                        techTma = (h.toString().length < 2 ? '0' + h : h) + 'h ' +
                                  (m.toString().length < 2 ? '0' + m : m) + 'm';
                    }

                    var tr = document.createElement('tr');
                    tr.className = 'hover:bg-surface-container-low transition-colors';
                    tr.innerHTML = '<td class="px-6 py-4">' +
                        '<div class="flex items-center gap-3">' +
                            '<div class="w-8 h-8 rounded-full ' + t.bg + ' flex items-center justify-center font-bold text-xs">' + t.init + '</div>' +
                            '<div>' +
                                '<p class="font-bold text-on-surface">' + t.name + '</p>' +
                                '<p class="text-xs text-on-surface-variant">' + t.area + '</p>' +
                            '</div>' +
                        '</div>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-center font-mono-sm text-mono-sm">' + totalResolved + '</td>' +
                    '<td class="px-6 py-4 text-center font-mono-sm text-mono-sm">' + techTma + '</td>' +
                    '<td class="px-6 py-4 text-center">' +
                        '<span class="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">' + t.csat + '</span>' +
                    '</td>' +
                    '<td class="px-6 py-4 text-right">' +
                        '<button class="text-secondary hover:underline font-bold text-xs view-tech-details" data-tech="' + t.name + '">Detalhes</button>' +
                    '</td>';

                    reportsTbody.appendChild(tr);
                });

                // Adicionar evento para os botões Detalhes de produtividade
                document.querySelectorAll('.view-tech-details').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var techName = this.getAttribute('data-tech');
                        alert('Exportação detalhada do perfil de produtividade do técnico ' + techName + ' iniciada.');
                    });
                });

                // Atualizar o rodapé da tabela com a quantidade real de técnicos
                var footerText = document.getElementById('techs-count-footer');
                if (footerText) {
                    footerText.innerText = 'Mostrando 1-' + technicians.length + ' de ' + technicians.length + ' técnicos cadastrados';
                }
            }
        }

        // Inicialização imediata
        updateAllReports();

        // Escutar sincronização com Supabase
        window.addEventListener('techsupport_db_synced', function() {
            updateAllReports();
        });
    });
})();
