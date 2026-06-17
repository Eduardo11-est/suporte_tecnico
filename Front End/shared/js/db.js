// TechSupport Pro - Banco de Dados Local Simulado (localStorage)
(function() {
    const DB_KEY_PREFIX = 'techsupport_pro_';

    const getStorage = (key, defaultVal) => {
        const data = localStorage.getItem(DB_KEY_PREFIX + key);
        return data ? JSON.parse(data) : defaultVal;
    };

    const setStorage = (key, val) => {
        localStorage.setItem(DB_KEY_PREFIX + key, JSON.stringify(val));
    };

    // 1. Clientes Iniciais
    const initialCustomers = [
        { id: 'C1001', name: 'Global Corp', industry: 'Tecnologia', activeTickets: 4, totalTickets: 156, slaStatus: 'No Prazo', contactName: 'Ana Martins', contactEmail: 'ana.m@global.com', logoText: 'GC' },
        { id: 'C1002', name: 'Safe Med', industry: 'Saúde', activeTickets: 12, totalTickets: 432, slaStatus: 'Atrasado (3)', contactName: 'Carlos Souza', contactEmail: 'carlos.s@safemed.com', logoText: 'SM' },
        { id: 'C1003', name: 'Vanguard Bank', industry: 'Financeiro', activeTickets: 1, totalTickets: 89, slaStatus: 'No Prazo', contactName: 'Juliana Lima', contactEmail: 'j.lima@vanguard.com', logoText: 'VB' },
        { id: 'C1004', name: 'Apex Retail', industry: 'Varejo', activeTickets: 0, totalTickets: 215, slaStatus: 'No Prazo', contactName: 'Roberto Dias', contactEmail: 'roberto@apex.com', logoText: 'AR' }
    ];

    // 2. Contratos Iniciais
    const initialContracts = [
        { id: 'CON-8841', customerId: 'C1001', customerName: 'Global Corp', plan: 'Enterprise Gold', value: 'R$ 15.000/mês', startDate: '2025-01-10', endDate: '2026-06-30', status: 'Ativo', slaTarget: '99.9%' },
        { id: 'CON-4521', customerId: 'C1002', customerName: 'Safe Med', plan: 'Enterprise Platinum', value: 'R$ 28.000/mês', startDate: '2024-03-15', endDate: '2026-07-15', status: 'Ativo', slaTarget: '99.99%' },
        { id: 'CON-7712', customerId: 'C1003', customerName: 'Vanguard Bank', plan: 'Professional Silver', value: 'R$ 8.500/mês', startDate: '2025-05-01', endDate: '2026-05-01', status: 'Em Renovação', slaTarget: '99.5%' },
        { id: 'CON-9031', customerId: 'C1004', customerName: 'Apex Retail', plan: 'Standard', value: 'R$ 4.200/mês', startDate: '2024-11-20', endDate: '2025-11-20', status: 'Expirado', slaTarget: '98.0%' }
    ];

    // 3. Chamados Iniciais
    const initialTickets = [
        {
            id: 'TK-2045',
            subject: 'Manutenção de Ar-condicionado',
            description: 'O aparelho de ar-condicionado da sala 202 (Bloco A) está vazando água e não está resfriando adequadamente.',
            category: 'predial',
            categoryName: 'Predial/Civil',
            priority: 'medium',
            priorityName: 'Média',
            status: 'in-progress',
            statusName: 'Em Progresso',
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
            author: 'Maria Clara',
            location: 'Bloco A, Sala 202',
            customerId: 'C1001',
            customerName: 'Global Corp',
            messages: [
                { sender: 'Maria Clara', role: 'client', text: 'Ar-condicionado vazando e não resfria.', time: new Date(Date.now() - 2 * 3600000).toISOString() },
                { sender: 'Ricardo Silva', role: 'agent', text: 'Olá Maria, um técnico foi designado para verificar o gotejamento e o compressor.', time: new Date(Date.now() - 1.5 * 3600000).toISOString() }
            ]
        },
        {
            id: 'TK-2046',
            subject: 'Servidor de Backup Offline',
            description: 'O servidor de backup secundário na nuvem local não está respondendo às requisições de sincronização. Alerta de storage offline.',
            category: 'it',
            categoryName: 'Informática/TI',
            priority: 'critical',
            priorityName: 'Crítica',
            status: 'pending',
            statusName: 'Pendente',
            createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
            author: 'Roberto Junqueira',
            location: 'Data Center local, Rack 04',
            customerId: 'C1002',
            customerName: 'Safe Med',
            messages: [
                { sender: 'Roberto Junqueira', role: 'client', text: 'Servidor de backup offline. Armazenamento local sem sincronização secundária.', time: new Date(Date.now() - 45 * 60000).toISOString() }
            ]
        },
        {
            id: 'TK-2047',
            subject: 'Troca de Cabeamento de Rede',
            description: 'Solicitação de substituição do cabo de par trançado Cat5e por Cat6 na sala de reuniões principal devido a instabilidade.',
            category: 'telecom',
            categoryName: 'Telecomunicações',
            priority: 'low',
            priorityName: 'Baixa',
            status: 'waiting-parts',
            statusName: 'Aguardando Peça',
            createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
            author: 'Ana Luiza',
            location: 'Sala de Reuniões Central',
            customerId: 'C1003',
            customerName: 'Vanguard Bank',
            messages: [
                { sender: 'Ana Luiza', role: 'client', text: 'Instabilidade na rede física. Solicitamos troca para cabo Cat6 blindado.', time: new Date(Date.now() - 5 * 3600000).toISOString() }
            ]
        },
        {
            id: 'TK-2048',
            subject: 'Reparo em Circuito de Câmeras',
            description: 'Câmera externa 08 do estacionamento norte apresenta tela cinza sem sinal de vídeo.',
            category: 'security',
            categoryName: 'Segurança Eletrônica',
            priority: 'medium',
            priorityName: 'Média',
            status: 'resolved',
            statusName: 'Resolvido',
            createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
            author: 'Segurança Interna',
            location: 'Estacionamento Norte',
            customerId: 'C1004',
            customerName: 'Apex Retail',
            messages: [
                { sender: 'Segurança Interna', role: 'client', text: 'Câmera 08 sem sinal de vídeo.', time: new Date(Date.now() - 24 * 3600000).toISOString() },
                { sender: 'Técnico Felipe', role: 'agent', text: 'Substituição da fonte de alimentação queimada efetuada com sucesso. Sinal reestabelecido.', time: new Date(Date.now() - 22 * 3600000).toISOString() }
            ]
        }
    ];

    // 4. Configurações Iniciais
    const defaultSettings = {
        slaCritical: 2,
        slaHigh: 4,
        slaMedium: 12,
        slaLow: 48,
        categories: ['Informática/TI', 'Elétrica', 'Predial/Civil', 'Segurança Eletrônica', 'Telecomunicações'],
        notificationsEnabled: true
    };

    // 5. FAQ Inicial
    const defaultFaq = [
        { id: 1, title: 'Como resetar o roteador corporativo?', category: 'infra', content: 'Para resetar o roteador corporativo, localize o pequeno botão de reset no painel traseiro e mantenha pressionado por 10 segundos utilizando um clipe de papel.', views: 342, likes: 28 },
        { id: 2, title: 'Política de backup e retenção de dados', category: 'seguranca', content: 'Os backups são realizados diariamente às 03:00h e retidos por um período de 30 dias em nosso storage e replicados para nuvem.', views: 512, likes: 45 },
        { id: 3, title: 'Instalação de ramal VOIP no celular', category: 'telecom', content: 'Para configurar o seu ramal VOIP corporativo no aplicativo móvel, siga os passos de instalação e escaneie o código QR fornecido pelo setor de TI.', views: 189, likes: 12 }
    ];

    // 6. Logs Iniciais
    const defaultLogs = [
        '[SYSTEM] Monitoramento iniciado. Conexões ativas estabelecidas.',
        '[HTTP] GET /api/v1/health - Status 200 OK - 12ms',
        '[DB] Pool de conexões do cluster verificado (18 conexões ativas)',
        '[SMTP] Alerta: Atraso de 4m na fila de despacho de emails de notificação',
        '[HTTP] POST /api/v1/tickets/new - Status 201 Created - 42ms',
        '[AUTH] Usuário Ricardo Silva (Engenheiro) autenticado com sucesso'
    ];

    // Inicialização se vazios
    if (!localStorage.getItem(DB_KEY_PREFIX + 'customers')) setStorage('customers', initialCustomers);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'contracts')) setStorage('contracts', initialContracts);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'tickets')) setStorage('tickets', initialTickets);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'settings')) setStorage('settings', defaultSettings);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'faq')) setStorage('faq', defaultFaq);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'logs')) setStorage('logs', defaultLogs);

    // Métodos expostos globalmente
    window.TechSupportDB = {
        getCustomers: () => getStorage('customers', []),
        getCustomerById: (id) => getStorage('customers', []).find(c => c.id === id),
        saveCustomers: (customers) => setStorage('customers', customers),

        getContracts: () => getStorage('contracts', []),
        saveContracts: (contracts) => setStorage('contracts', contracts),

        getTickets: () => getStorage('tickets', []),
        getTicketById: (id) => getStorage('tickets', []).find(t => t.id === id),
        addTicket: (ticket) => {
            const tickets = getStorage('tickets', []);
            tickets.unshift(ticket);
            setStorage('tickets', tickets);
            
            // Incrementar contador de tickets do cliente correspondente
            const customers = getStorage('customers', []);
            const customer = customers.find(c => c.id === ticket.customerId || c.name === ticket.customerName);
            if (customer) {
                customer.activeTickets++;
                customer.totalTickets++;
                setStorage('customers', customers);
            }
        },
        updateTicket: (updatedTicket) => {
            const tickets = getStorage('tickets', []);
            const index = tickets.findIndex(t => t.id === updatedTicket.id);
            if (index !== -1) {
                tickets[index] = updatedTicket;
                setStorage('tickets', tickets);
            }
        },

        getSettings: () => getStorage('settings', {}),
        saveSettings: (settings) => setStorage('settings', settings),

        getFaq: () => getStorage('faq', []),
        saveFaq: (faq) => setStorage('faq', faq),

        getLogs: () => getStorage('logs', []),
        addLog: (logText) => {
            const logs = getStorage('logs', []);
            logs.push(logText);
            if (logs.length > 50) logs.shift();
            setStorage('logs', logs);
        }
    };
})();
