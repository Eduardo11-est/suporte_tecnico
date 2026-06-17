// TechSupport Pro - Lógica dos Detalhes do Chamado
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    document.addEventListener('DOMContentLoaded', function() {
        const params = new URLSearchParams(window.location.search);
        let ticketId = params.get('id') || 'TK-2045';

        const ticket = window.TechSupportDB.getTicketById(ticketId);
        if (!ticket) {
            alert('Chamado não encontrado.');
            window.location.href = '../index.html';
            return;
        }

        // 1. Renderizar Detalhes
        const idTitle = document.querySelector('h1.font-headline-lg') || document.querySelector('.flex.items-center.gap-4 h2') || document.querySelector('.bg-surface-container-lowest h2');
        if (idTitle) {
            idTitle.innerText = `${ticket.id} - ${ticket.subject}`;
        }

        // Injetar Descrição
        const descEl = document.querySelector('.p-6.bg-surface-container-lowest.border p') || document.querySelector('#ticket-description') || document.querySelector('.space-y-4 p.text-on-surface');
        if (descEl) {
            descEl.innerText = ticket.description;
        }

        // Detalhes da Lateral / Meta-dados do Chamado
        document.querySelectorAll('.space-y-6 .flex.justify-between').forEach(row => {
            const labelEl = row.querySelector('span:first-child') || row.querySelector('p:first-child');
            if (!labelEl) return;
            const label = labelEl.innerText.toLowerCase();
            const valEl = row.querySelector('span:last-child') || row.querySelector('p:last-child');
            if (!valEl) return;

            if (label.includes('status')) {
                let statusColor = 'bg-blue-500';
                if (ticket.status === 'pending') statusColor = 'bg-red-500';
                else if (ticket.status === 'waiting-parts') statusColor = 'bg-orange-500';
                else if (ticket.status === 'resolved') statusColor = 'bg-green-500';

                valEl.innerHTML = `
                    <div class="flex items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full ${statusColor}"></div>
                        <span class="font-bold text-on-surface">${ticket.statusName || ticket.status}</span>
                    </div>
                `;
            } else if (label.includes('prioridade')) {
                let prioColor = 'bg-amber-100 text-amber-800';
                if (ticket.priority === 'critical') prioColor = 'bg-red-100 text-red-800';
                else if (ticket.priority === 'low') prioColor = 'bg-green-100 text-green-800';
                valEl.innerHTML = `<span class="px-2.5 py-0.5 rounded text-xs font-bold ${prioColor} uppercase">${ticket.priorityName || ticket.priority}</span>`;
            } else if (label.includes('categoria')) {
                valEl.innerText = ticket.categoryName || ticket.category;
                valEl.className = "font-bold text-on-surface uppercase text-xs";
            } else if (label.includes('abertura') || label.includes('criado')) {
                valEl.innerText = new Date(ticket.createdAt).toLocaleString('pt-BR');
            } else if (label.includes('cliente')) {
                valEl.innerHTML = `<a href="../ficha_do_cliente_techsupport_pro/index.html?id=${ticket.customerId}" class="text-secondary font-bold hover:underline">${ticket.customerName}</a>`;
            } else if (label.includes('local') || label.includes('setor')) {
                valEl.innerText = ticket.location || 'Não informado';
            }
        });

        // 2. Renderizar Histórico de Mensagens (Chat)
        const chatContainer = document.querySelector('.flex-1.overflow-y-auto.p-6') || document.querySelector('#chat-messages-container');
        const messageInput = document.querySelector('footer input') || document.querySelector('#message-input');
        const sendBtn = document.querySelector('footer button') || document.querySelector('#send-message-btn');

        function renderMessages() {
            if (!chatContainer) return;
            chatContainer.innerHTML = '';

            ticket.messages.forEach(msg => {
                const isAgent = msg.role === 'agent';
                const msgDiv = document.createElement('div');
                msgDiv.className = `flex gap-3 max-w-[80%] ${isAgent ? 'ml-auto flex-row-reverse' : ''}`;

                const initial = msg.sender.substring(0, 2).toUpperCase();
                const avatarColor = isAgent ? 'bg-secondary text-on-secondary' : 'bg-primary-container text-on-primary-container';
                const bubbleColor = isAgent ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface';

                const timeStr = new Date(msg.time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                msgDiv.innerHTML = `
                    <div class="w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center font-bold text-xs shrink-0">${initial}</div>
                    <div class="space-y-1">
                        <div class="flex items-center gap-2 ${isAgent ? 'flex-row-reverse' : ''}">
                            <span class="text-xs font-bold text-on-surface">${msg.sender}</span>
                            <span class="text-[10px] text-on-surface-variant">${timeStr}</span>
                        </div>
                        <div class="p-3 ${bubbleColor} rounded-xl text-body-md leading-relaxed shadow-sm">${msg.text}</div>
                    </div>
                `;
                chatContainer.appendChild(msgDiv);
            });

            // Rolar para o final
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        // Enviar Mensagem
        function sendMessage() {
            if (!messageInput || !messageInput.value.trim()) return;

            const text = messageInput.value.trim();
            const now = new Date().toISOString();

            ticket.messages.push({
                sender: 'Ricardo Silva', // Técnico logado
                role: 'agent',
                text: text,
                time: now
            });

            // Mudar o status do chamado para "Em Progresso" ao responder
            if (ticket.status === 'pending') {
                ticket.status = 'in-progress';
                ticket.statusName = 'Em Progresso';
                // Recarregar os detalhes do status na lateral
                setTimeout(() => {
                    location.reload();
                }, 100);
            }

            window.TechSupportDB.updateTicket(ticket);
            window.TechSupportDB.addLog(`[SYSTEM] Resposta enviada no chamado ${ticket.id} por Ricardo Silva.`);

            messageInput.value = '';
            renderMessages();
        }

        if (sendBtn && messageInput) {
            sendBtn.addEventListener('click', sendMessage);
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });
        }

        // Resolver Chamado Action
        const resolveBtn = document.querySelector('button.bg-green-600') || document.querySelector('button.text-green-600') || document.querySelector('.bg-success');
        if (resolveBtn) {
            resolveBtn.addEventListener('click', function() {
                if (confirm('Deseja realmente marcar este chamado como Resolvido?')) {
                    ticket.status = 'resolved';
                    ticket.statusName = 'Resolvido';
                    ticket.messages.push({
                        sender: 'Ricardo Silva',
                        role: 'agent',
                        text: 'Chamado resolvido e encerrado pelo técnico.',
                        time: new Date().toISOString()
                    });
                    window.TechSupportDB.updateTicket(ticket);
                    window.TechSupportDB.addLog(`[SYSTEM] Chamado ${ticket.id} marcado como Resolvido por Ricardo Silva.`);
                    alert('Chamado resolvido com sucesso!');
                    location.reload();
                }
            });
        }

        // Inicializar
        renderMessages();
    });
})();
