// TechSupport Pro - Lógica da Ficha do Cliente
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    document.addEventListener('DOMContentLoaded', function() {
        // Obter id da URL
        const params = new URLSearchParams(window.location.search);
        let customerId = params.get('id') || 'C1001';

        const customer = window.TechSupportDB.getCustomerById(customerId);
        if (!customer) {
            alert('Cliente não encontrado.');
            window.location.href = '../gest_o_de_clientes_techsupport_pro/index.html';
            return;
        }

        // Renderizar Informações do Cliente no Topo
        const nameEl = document.querySelector('h1.font-headline-lg') || document.querySelector('h2.font-headline-lg');
        if (nameEl) nameEl.innerText = customer.name;

        // Injetar nos campos específicos
        // Vamos buscar elementos baseados no texto do campo
        document.querySelectorAll('.bg-surface-container-lowest p').forEach(p => {
            const labelEl = p.previousElementSibling;
            if (!labelEl) return;
            const label = labelEl.innerText.toLowerCase();

            if (label.includes('email')) {
                p.innerText = customer.contactEmail;
            } else if (label.includes('contato') || label.includes('principal')) {
                p.innerText = customer.contactName;
            } else if (label.includes('indústria') || label.includes('setor')) {
                p.innerText = customer.industry;
            } else if (label.includes('status')) {
                p.innerHTML = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-800">Ativo</span>`;
            }
        });

        // Atualizar logo/avatar do cliente
        const avatarEl = document.querySelector('.bg-secondary-fixed.rounded-xl') || document.querySelector('.bg-secondary\\/10');
        if (avatarEl) {
            avatarEl.innerText = customer.logoText || customer.name.substring(0, 2).toUpperCase();
        }

        // Renderizar Histórico de Chamados do Cliente
        const ticketsTable = document.querySelector('table tbody');
        if (ticketsTable) {
            ticketsTable.innerHTML = '';
            const allTickets = window.TechSupportDB.getTickets();
            const customerTickets = allTickets.filter(t => t.customerId === customerId || t.customerName === customer.name);

            if (customerTickets.length === 0) {
                ticketsTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="px-6 py-8 text-center text-on-surface-variant font-medium">
                            Nenhum chamado registrado para este cliente.
                        </td>
                    </tr>
                `;
            } else {
                customerTickets.forEach(ticket => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-surface-container-low transition-colors';

                    let statusDotColor = 'bg-blue-500';
                    if (ticket.status === 'pending') statusDotColor = 'bg-red-500';
                    else if (ticket.status === 'waiting-parts') statusDotColor = 'bg-orange-500';
                    else if (ticket.status === 'resolved') statusDotColor = 'bg-green-500';

                    let prioColor = 'text-amber-600 bg-amber-50';
                    if (ticket.priority === 'critical') prioColor = 'text-red-600 bg-red-50';
                    else if (ticket.priority === 'low') prioColor = 'text-green-600 bg-green-50';

                    const ticketDate = new Date(ticket.createdAt).toLocaleDateString('pt-BR');

                    tr.innerHTML = `
                        <td class="px-6 py-4 font-mono-sm text-mono-sm text-secondary font-semibold">${ticket.id}</td>
                        <td class="px-6 py-4 font-body-md text-body-md font-bold text-on-surface">${ticket.subject}</td>
                        <td class="px-6 py-4">
                            <span class="px-2.5 py-0.5 rounded text-[11px] font-bold ${prioColor} uppercase">${ticket.priorityName || ticket.priority}</span>
                        </td>
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-2">
                                <div class="w-2 h-2 rounded-full ${statusDotColor}"></div>
                                <span class="text-body-md">${ticket.statusName || ticket.status}</span>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-on-surface-variant font-mono-sm">${ticketDate}</td>
                        <td class="px-6 py-4 text-right">
                            <button onclick="window.location.href='../detalhes_do_chamado_suporte_t_cnico/index.html?id=${ticket.id}'" class="text-secondary font-bold hover:underline">Ver Chamado</button>
                        </td>
                    `;
                    ticketsTable.appendChild(tr);
                });
            }
        }

        // Renderizar Contratos do Cliente
        const contractsSection = document.querySelector('.lg\\:col-span-1 .space-y-4') || document.querySelector('.space-y-4.contracts-list');
        if (contractsSection) {
            contractsSection.innerHTML = '';
            const allContracts = window.TechSupportDB.getContracts();
            const customerContracts = allContracts.filter(c => c.customerId === customerId || c.customerName === customer.name);

            if (customerContracts.length === 0) {
                contractsSection.innerHTML = '<p class="text-xs text-on-surface-variant">Nenhum contrato ativo cadastrado.</p>';
            } else {
                customerContracts.forEach(contract => {
                    const div = document.createElement('div');
                    div.className = 'p-4 bg-surface-container-low border border-outline-variant rounded-lg space-y-3';
                    
                    let badgeColor = 'bg-green-100 text-green-800';
                    if (contract.status === 'Expirado') badgeColor = 'bg-red-100 text-red-800';
                    else if (contract.status === 'Em Renovação') badgeColor = 'bg-amber-100 text-amber-800';

                    div.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-body-md font-bold text-on-surface">${contract.plan}</p>
                                <p class="text-xs text-outline">${contract.id}</p>
                            </div>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">${contract.status}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p class="text-outline">Valor mensal</p>
                                <p class="font-bold text-on-surface">${contract.value}</p>
                            </div>
                            <div>
                                <p class="text-outline">SLA Alvo</p>
                                <p class="font-bold text-on-surface">${contract.slaTarget}</p>
                            </div>
                        </div>
                        <div class="text-[11px] text-on-surface-variant border-t border-outline-variant/30 pt-2">
                            Validade: ${new Date(contract.startDate).toLocaleDateString('pt-BR')} até ${new Date(contract.endDate).toLocaleDateString('pt-BR')}
                        </div>
                    `;
                    contractsSection.appendChild(div);
                });
            }
        }

        // Novo Chamado para o cliente
        const newTicketBtn = document.querySelector('button.bg-secondary');
        if (newTicketBtn) {
            newTicketBtn.addEventListener('click', function() {
                window.location.href = `../novo_chamado_suporte_t_cnico/index.html?customerId=${customerId}`;
            });
        }
    });
})();
