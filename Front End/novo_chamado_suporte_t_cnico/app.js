// TechSupport Pro - Lógica da Criação de Novo Chamado
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');

    document.addEventListener('DOMContentLoaded', function() {
        const dropZone = document.getElementById('drop-zone');
        const fileInput = document.getElementById('file-upload');
        const previewArea = document.getElementById('file-previews');
        const form = document.getElementById('new-ticket-form');

        // Drag & Drop
        if (dropZone && fileInput) {
            dropZone.addEventListener('click', () => fileInput.click());

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('bg-secondary-container/10', 'border-secondary');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('bg-secondary-container/10', 'border-secondary');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('bg-secondary-container/10', 'border-secondary');
                handleFiles(e.dataTransfer.files);
            });

            fileInput.addEventListener('change', () => {
                handleFiles(fileInput.files);
            });
        }

        function handleFiles(files) {
            if (files.length > 0 && previewArea) {
                previewArea.classList.remove('hidden');
                Array.from(files).forEach(file => {
                    const div = document.createElement('div');
                    div.className = "p-3 bg-white border border-outline-variant rounded flex items-center gap-2 group relative";
                    div.innerHTML = `
                        <span class="material-symbols-outlined text-secondary">description</span>
                        <span class="text-label-md truncate max-w-[120px]">${file.name}</span>
                        <button type="button" class="absolute -top-2 -right-2 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform shadow-sm remove-file-btn">
                            <span class="material-symbols-outlined text-[12px]">close</span>
                        </button>
                    `;
                    previewArea.appendChild(div);

                    // Remover arquivo da pré-visualização
                    div.querySelector('.remove-file-btn').addEventListener('click', function() {
                        div.remove();
                        if (previewArea.children.length === 0) {
                            previewArea.classList.add('hidden');
                        }
                    });
                });
            }
        }

        // Submissão do Formulário
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const subject = document.getElementById('subject').value;
                const categorySelect = document.getElementById('category');
                const category = categorySelect.value;
                const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
                
                const prioritySelect = document.getElementById('priority');
                const priority = prioritySelect.value;
                const priorityName = prioritySelect.options[prioritySelect.selectedIndex].text;

                const description = document.getElementById('description').value;
                const location = document.getElementById('location').value;

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalContent = submitBtn.innerHTML;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> Processando...`;

                setTimeout(() => {
                    const tickets = window.TechSupportDB.getTickets();
                    const nextIdNum = 2045 + tickets.length;
                    const ticketId = `TK-${nextIdNum}`;

                    const newTicket = {
                        id: ticketId,
                        subject: subject,
                        description: description,
                        category: category,
                        categoryName: categoryName,
                        priority: priority,
                        priorityName: priorityName,
                        status: 'pending',
                        statusName: 'Pendente',
                        createdAt: new Date().toISOString(),
                        author: 'Ricardo Silva', // Técnico logado
                        location: location,
                        customerId: 'C1001', // Associar a um cliente padrão para o demo
                        customerName: 'Global Corp',
                        messages: [
                            { sender: 'Ricardo Silva', role: 'agent', text: `Chamado aberto: ${subject}. Descrição: ${description}`, time: new Date().toISOString() }
                        ]
                    };

                    // Salvar no Banco
                    window.TechSupportDB.addTicket(newTicket);
                    
                    // Adicionar Log de Auditoria
                    window.TechSupportDB.addLog(`[SYSTEM] Novo chamado criado: ${ticketId} - ${subject} por Ricardo Silva.`);

                    alert(`Chamado criado com sucesso! Protocolo: #${ticketId}`);

                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    form.reset();
                    if (previewArea) {
                        previewArea.innerHTML = '';
                        previewArea.classList.add('hidden');
                    }

                    // Redirecionar para o Painel Geral
                    window.location.href = '../index.html';
                }, 1000);
            });
        }
    });
})();
