// TechSupport Pro - Banco de Dados Híbrido com Sincronização Local-First (LocalStorage & Supabase)
(function() {
    const DB_KEY_PREFIX = 'techsupport_pro_';

    const getStorage = (key, defaultVal) => {
        const data = localStorage.getItem(DB_KEY_PREFIX + key);
        return data ? JSON.parse(data) : defaultVal;
    };

    const setStorage = (key, val) => {
        localStorage.setItem(DB_KEY_PREFIX + key, JSON.stringify(val));
    };

    // 1. Dados Iniciais de Simulação (Mock Local)
    const initialCustomers = [
        { id: 'C1001', name: 'Global Corp', industry: 'Tecnologia', activeTickets: 4, totalTickets: 156, slaStatus: 'No Prazo', contactName: 'Ana Martins', contactEmail: 'ana.m@global.com', logoText: 'GC' },
        { id: 'C1002', name: 'Safe Med', industry: 'Saúde', activeTickets: 12, totalTickets: 432, slaStatus: 'Atrasado (3)', contactName: 'Carlos Souza', contactEmail: 'carlos.s@safemed.com', logoText: 'SM' },
        { id: 'C1003', name: 'Vanguard Bank', industry: 'Financeiro', activeTickets: 1, totalTickets: 89, slaStatus: 'No Prazo', contactName: 'Juliana Lima', contactEmail: 'j.lima@vanguard.com', logoText: 'VB' },
        { id: 'C1004', name: 'Apex Retail', industry: 'Varejo', activeTickets: 0, totalTickets: 215, slaStatus: 'No Prazo', contactName: 'Roberto Dias', contactEmail: 'roberto@apex.com', logoText: 'AR' }
    ];

    const initialContracts = [
        { id: 'CON-8841', customerId: 'C1001', customerName: 'Global Corp', plan: 'Enterprise Gold', value: 'R$ 15.000/mês', startDate: '2025-01-10', endDate: '2026-06-30', status: 'Ativo', slaTarget: '99.9%' },
        { id: 'CON-4521', customerId: 'C1002', customerName: 'Safe Med', plan: 'Enterprise Platinum', value: 'R$ 28.000/mês', startDate: '2024-03-15', endDate: '2026-07-15', status: 'Ativo', slaTarget: '99.99%' },
        { id: 'CON-7712', customerId: 'C1003', customerName: 'Vanguard Bank', plan: 'Professional Silver', value: 'R$ 8.500/mês', startDate: '2025-05-01', endDate: '2026-05-01', status: 'Em Renovação', slaTarget: '99.5%' },
        { id: 'CON-9031', customerId: 'C1004', customerName: 'Apex Retail', plan: 'Standard', value: 'R$ 4.200/mês', startDate: '2024-11-20', endDate: '2025-11-20', status: 'Expirado', slaTarget: '98.0%' }
    ];

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

    const defaultSettings = {
        slaCritical: 2,
        slaHigh: 4,
        slaMedium: 12,
        slaLow: 48,
        categories: ['Informática/TI', 'Elétrica', 'Predial/Civil', 'Segurança Eletrônica', 'Telecomunicações'],
        notificationsEnabled: true
    };

    const defaultFaq = [
        { id: 1, title: 'Como resetar o roteador corporativo?', category: 'infra', content: 'Para resetar o roteador corporativo, localize o pequeno botão de reset no painel traseiro e mantenha pressionado por 10 segundos utilizando um clipe de papel.', views: 342, likes: 28 },
        { id: 2, title: 'Política de backup e retenção de dados', category: 'seguranca', content: 'Os backups são realizados diariamente às 03:00h e retidos por um período de 30 dias em nosso storage e replicados para nuvem.', views: 512, likes: 45 },
        { id: 3, title: 'Instalação de ramal VOIP no celular', category: 'telecom', content: 'Para configurar o seu ramal VOIP corporativo no aplicativo móvel, siga os passos de instalação e escaneie o código QR fornecido pelo setor de TI.', views: 189, likes: 12 }
    ];

    const defaultLogs = [
        '[SYSTEM] Monitoramento iniciado. Conexões ativas estabelecidas.',
        '[HTTP] GET /api/v1/health - Status 200 OK - 12ms',
        '[DB] Pool de conexões do cluster verificado (18 conexões ativas)',
        '[SMTP] Alerta: Atraso de 4m na fila de despacho de emails de notificação',
        '[HTTP] POST /api/v1/tickets/new - Status 201 Created - 42ms',
        '[AUTH] Usuário Ricardo Silva (Engenheiro) autenticado com sucesso'
    ];

    // Inicialização LocalStorage
    if (!localStorage.getItem(DB_KEY_PREFIX + 'customers')) setStorage('customers', initialCustomers);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'contracts')) setStorage('contracts', initialContracts);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'tickets')) setStorage('tickets', initialTickets);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'settings')) setStorage('settings', defaultSettings);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'faq')) setStorage('faq', defaultFaq);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'logs')) setStorage('logs', defaultLogs);

    // Métodos Auxiliares do Supabase
    const isSupabaseActive = () => {
        return window.SupabaseConnector && window.SupabaseConnector.isActive();
    };

    const getProjectRef = () => {
        if (!isSupabaseActive()) return '';
        const url = window.SupabaseConnector.url;
        const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
        return match ? match[1] : '';
    };

    // Obter sessão ativa de forma síncrona
    const getSession = () => {
        if (isSupabaseActive()) {
            const ref = getProjectRef();
            const sessionStr = localStorage.getItem(`sb-${ref}-auth-token`);
            if (sessionStr) {
                try {
                    const session = JSON.parse(sessionStr);
                    if (session && session.expires_at) {
                        const isExpired = session.expires_at * 1000 < Date.now();
                        if (!isExpired) return session.user || session;
                    }
                } catch (e) {
                    console.error("Erro ao decodificar sessão do Supabase:", e);
                }
            }
            // Fallback para login mock local mesmo se chave sup ativa
            const mockSession = localStorage.getItem(DB_KEY_PREFIX + 'session');
            return mockSession ? JSON.parse(mockSession) : null;
        } else {
            const session = localStorage.getItem(DB_KEY_PREFIX + 'session');
            return session ? JSON.parse(session) : null;
        }
    };

    // Métodos de Autenticação Híbrida
    const checkAuth = (relativePath = './') => {
        if (window.location.pathname.includes('/login/')) {
            return;
        }

        const session = getSession();
        if (!session) {
            window.location.href = relativePath + 'login/index.html';
        }
    };

    const signIn = async (email, password) => {
        if (isSupabaseActive()) {
            try {
                // Tenta autenticar via Supabase Auth
                const { data, error } = await window.SupabaseConnector.client.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                if (error) throw error;
                return data.user;
            } catch (err) {
                console.warn("Autenticação Supabase falhou. Tentando login local admin mock...");
                // Se der erro de usuário não cadastrado no Supabase, permitimos login mock como fallback local
                if (email === 'admin@techsupport.com' && password === 'admin123') {
                    const sessionUser = { email: email, name: 'Admin Ricardo (Local)', role: 'admin' };
                    localStorage.setItem(DB_KEY_PREFIX + 'session', JSON.stringify(sessionUser));
                    return sessionUser;
                } else {
                    throw err;
                }
            }
        } else {
            // Login Mock tradicional
            if (email === 'admin@techsupport.com' && password === 'admin123') {
                const sessionUser = { email: email, name: 'Admin Ricardo', role: 'admin' };
                localStorage.setItem(DB_KEY_PREFIX + 'session', JSON.stringify(sessionUser));
                return sessionUser;
            } else {
                throw new Error('E-mail ou senha inválidos.');
            }
        }
    };

    const signOut = async (relativePath = '../') => {
        if (isSupabaseActive()) {
            try {
                await window.SupabaseConnector.client.auth.signOut();
            } catch(e) {}
        }
        localStorage.removeItem(DB_KEY_PREFIX + 'session');
        window.location.href = relativePath + 'login/index.html';
    };

    // 2. Sincronização Assíncrona em Background do Supabase para o LocalStorage
    const syncFromSupabase = async () => {
        if (!isSupabaseActive() || !getSession()) return;
        const client = window.SupabaseConnector.client;

        try {
            console.log("Sincronizando cache local com o Supabase Cloud...");

            // Clientes
            const { data: customers } = await client.from('customers').select('*');
            if (customers && customers.length > 0) {
                const mapped = customers.map(c => ({
                    ...c,
                    activeTickets: c.active_tickets !== undefined ? c.active_tickets : (c.activeTickets || 0),
                    totalTickets: c.total_tickets !== undefined ? c.total_tickets : (c.totalTickets || 0),
                    slaStatus: c.sla_status || c.slaStatus || 'No Prazo',
                    contactName: c.contact_name || c.contactName || '',
                    contactEmail: c.contact_email || c.contactEmail || '',
                    logoText: c.logo_text || c.logoText || (c.name || 'X').substring(0, 2).toUpperCase()
                }));
                setStorage('customers', mapped);
            }

            // Contratos
            const { data: contracts } = await client.from('contracts').select('*');
            if (contracts && contracts.length > 0) {
                const mapped = contracts.map(c => ({
                    ...c,
                    customerId: c.customer_id || c.customerId || '',
                    customerName: c.customer_name || c.customerName || '',
                    startDate: c.start_date || c.startDate || '',
                    endDate: c.end_date || c.endDate || '',
                    slaTarget: c.sla_target || c.slaTarget || '',
                    value: c.value || c.monthly_value || '—'
                }));
                setStorage('contracts', mapped);
            }

            // Chamados (Tickets) + Mensagens
            const { data: tickets } = await client.from('tickets').select('*').order('created_at', { ascending: false });
            if (tickets) {
                for (let ticket of tickets) {
                    const { data: messages } = await client.from('ticket_messages').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
                    ticket.messages = messages || [];
                    // Adaptar campos snake_case para camelCase esperados pelo Front End
                    ticket.categoryName = ticket.category_name;
                    ticket.priorityName = ticket.priority_name;
                    ticket.statusName = ticket.status_name;
                    ticket.customerId = ticket.customer_id;
                    ticket.customerName = ticket.customer_name;
                    ticket.createdAt = ticket.created_at;
                    ticket.assignedTo = ticket.assigned_to;
                }
                if (tickets.length > 0) setStorage('tickets', tickets);
            }

            // Configurações
            const { data: settings } = await client.from('system_settings').select('*').maybeSingle();
            if (settings) {
                setStorage('settings', {
                    slaCritical: settings.sla_critical,
                    slaHigh: settings.sla_high,
                    slaMedium: settings.sla_medium,
                    slaLow: settings.sla_low,
                    categories: settings.categories,
                    notificationsEnabled: settings.notifications_enabled
                });
            }

            // FAQ
            const { data: faq } = await client.from('faq').select('*');
            if (faq && faq.length > 0) setStorage('faq', faq);

            // Logs
            const { data: logs } = await client.from('system_logs').select('*').order('created_at', { ascending: false }).limit(50);
            if (logs && logs.length > 0) {
                const logTexts = logs.map(l => l.log_text).reverse();
                setStorage('logs', logTexts);
            }

            console.log("Sincronização com o Supabase concluída!");
            
            // Disparar evento para que a página possa escutar e atualizar dinamicamente se necessário
            window.dispatchEvent(new CustomEvent('techsupport_db_synced'));
        } catch (err) {
            console.error("Erro na sincronização em background com o Supabase:", err);
        }
    };

    // Disparar sincronização em background imediata se estiver logado
    if (getSession()) {
        syncFromSupabase();
    }

    // Métodos expostos globalmente
    window.TechSupportDB = {
        checkAuth: checkAuth,
        signIn: signIn,
        signOut: signOut,
        getSession: getSession,
        syncFromSupabase: syncFromSupabase,

        getCustomers: () => getStorage('customers', []),
        getCustomerById: (id) => getStorage('customers', []).find(c => c.id === id),
        saveCustomers: (customers) => {
            setStorage('customers', customers);
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                customers.forEach(customer => {
                    client.from('customers').upsert({
                        id: customer.id,
                        name: customer.name,
                        industry: customer.industry,
                        active_tickets: customer.activeTickets,
                        total_tickets: customer.totalTickets,
                        sla_status: customer.slaStatus,
                        contact_name: customer.contactName,
                        contact_email: customer.contactEmail,
                        logo_text: customer.logoText
                    }).then(({ error }) => { if (error) console.error(error); });
                });
            }
        },

        getContracts: () => getStorage('contracts', []),
        saveContracts: (contracts) => {
            setStorage('contracts', contracts);
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                contracts.forEach(contract => {
                    client.from('contracts').upsert({
                        id: contract.id,
                        customer_id: contract.customerId,
                        customer_name: contract.customerName,
                        plan: contract.plan,
                        value: contract.value,
                        start_date: contract.startDate,
                        end_date: contract.endDate,
                        status: contract.status,
                        sla_target: contract.slaTarget
                    }).then(({ error }) => { if (error) console.error(error); });
                });
            }
        },

        getTickets: () => getStorage('tickets', []),
        getTicketById: (id) => getStorage('tickets', []).find(t => t.id === id),
        addTicket: (ticket) => {
            const tickets = getStorage('tickets', []);
            tickets.unshift(ticket);
            setStorage('tickets', tickets);
            
            const customers = getStorage('customers', []);
            const customer = customers.find(c => c.id === ticket.customerId || c.name === ticket.customerName);
            if (customer) {
                customer.activeTickets++;
                customer.totalTickets++;
                setStorage('customers', customers);
            }

            // Gravar no Supabase
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                client.from('tickets').insert([{
                    id: ticket.id,
                    subject: ticket.subject,
                    description: ticket.description,
                    category: ticket.category,
                    category_name: ticket.categoryName,
                    priority: ticket.priority,
                    priority_name: ticket.priorityName,
                    status: ticket.status,
                    status_name: ticket.statusName,
                    author: ticket.author,
                    location: ticket.location,
                    customer_id: ticket.customerId,
                    customer_name: ticket.customerName,
                    assigned_to: ticket.assignedTo
                }]).then(({ error }) => {
                    if (error) console.error("Erro no insert do ticket no Supabase:", error);
                });

                if (ticket.messages && ticket.messages.length > 0) {
                    const messagesToInsert = ticket.messages.map(m => ({
                        ticket_id: ticket.id,
                        sender: m.sender,
                        role: m.role,
                        text: m.text
                    }));
                    client.from('ticket_messages').insert(messagesToInsert).then(({ error }) => {
                        if (error) console.error("Erro no insert das mensagens no Supabase:", error);
                    });
                }

                if (customer) {
                    client.from('customers').update({
                        active_tickets: customer.activeTickets,
                        total_tickets: customer.totalTickets
                    }).eq('id', customer.id).then(({ error }) => {
                        if (error) console.error("Erro ao atualizar contadores do cliente no Supabase:", error);
                    });
                }
            }
        },
        updateTicket: (updatedTicket) => {
            const tickets = getStorage('tickets', []);
            const index = tickets.findIndex(t => t.id === updatedTicket.id);
            if (index !== -1) {
                tickets[index] = updatedTicket;
                setStorage('tickets', tickets);
            }

            // Gravar no Supabase
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                client.from('tickets').update({
                    subject: updatedTicket.subject,
                    description: updatedTicket.description,
                    category: updatedTicket.category,
                    category_name: updatedTicket.categoryName,
                    priority: updatedTicket.priority,
                    priority_name: updatedTicket.priorityName,
                    status: updatedTicket.status,
                    status_name: updatedTicket.statusName,
                    author: updatedTicket.author,
                    location: updatedTicket.location,
                    assigned_to: updatedTicket.assignedTo
                }).eq('id', updatedTicket.id).then(({ error }) => {
                    if (error) console.error("Erro ao atualizar chamado no Supabase:", error);
                });

                // Salvar a última mensagem adicionada no chat (se houver)
                if (updatedTicket.messages && updatedTicket.messages.length > 0) {
                    const lastMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
                    if (lastMessage) {
                        client.from('ticket_messages').insert([{
                            ticket_id: updatedTicket.id,
                            sender: lastMessage.sender,
                            role: lastMessage.role,
                            text: lastMessage.text
                        }]).then(({ error }) => {
                            if (error) console.error("Erro ao inserir mensagem de chat no Supabase:", error);
                        });
                    }
                }
            }
        },

        getSettings: () => getStorage('settings', {}),
        saveSettings: (settings) => {
            setStorage('settings', settings);
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                client.from('system_settings').update({
                    sla_critical: settings.slaCritical,
                    sla_high: settings.slaHigh,
                    sla_medium: settings.slaMedium,
                    sla_low: settings.slaLow,
                    categories: settings.categories,
                    notifications_enabled: settings.notificationsEnabled,
                    updated_at: new Date().toISOString()
                }).eq('id', 1).then(({ error }) => {
                    if (error) console.error("Erro ao salvar configurações no Supabase:", error);
                });
            }
        },

        getFaq: () => getStorage('faq', []),
        saveFaq: (faq) => {
            setStorage('faq', faq);
            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                faq.forEach(f => {
                    client.from('faq').upsert({
                        id: f.id,
                        title: f.title,
                        category: f.category,
                        content: f.content,
                        views: f.views,
                        likes: f.likes
                    }).then(({ error }) => { if (error) console.error(error); });
                });
            }
        },

        getLogs: () => getStorage('logs', []),
        addLog: (logText) => {
            const logs = getStorage('logs', []);
            logs.push(logText);
            if (logs.length > 50) logs.shift();
            setStorage('logs', logs);

            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                client.from('system_logs').insert([{
                    log_text: logText
                }]).then(({ error }) => {
                    if (error) console.error("Erro ao salvar log no Supabase:", error);
                });
            }
        }
    };
})();
