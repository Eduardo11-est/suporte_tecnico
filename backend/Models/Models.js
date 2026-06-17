// TechSupport Pro - Camada Models do MVC
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
        { id: 1, title: 'Como resetar o roteador corporativo?', category: 'infra', content: 'Para resetar o roteador corporativo, locate o pequeno botão de reset no painel traseiro e mantenha pressionado por 10 segundos utilizando um clipe de papel.', views: 342, likes: 28 },
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

    // Inicialização LocalStorage se vazio
    if (!localStorage.getItem(DB_KEY_PREFIX + 'customers')) setStorage('customers', initialCustomers);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'contracts')) setStorage('contracts', initialContracts);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'tickets')) setStorage('tickets', initialTickets);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'settings')) setStorage('settings', defaultSettings);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'faq')) setStorage('faq', defaultFaq);
    if (!localStorage.getItem(DB_KEY_PREFIX + 'logs')) setStorage('logs', defaultLogs);

    const isSupabaseActive = () => {
        return window.SupabaseConnector && window.SupabaseConnector.isActive();
    };

    const getProjectRef = () => {
        if (!isSupabaseActive()) return '';
        const url = window.SupabaseConnector.url;
        const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
        return match ? match[1] : '';
    };

    // AuthModel
    const AuthModel = {
        getSession: () => {
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
                const mockSession = localStorage.getItem(DB_KEY_PREFIX + 'session');
                return mockSession ? JSON.parse(mockSession) : null;
            } else {
                const session = localStorage.getItem(DB_KEY_PREFIX + 'session');
                return session ? JSON.parse(session) : null;
            }
        },
        setSessionLocal: (user) => {
            setStorage('session', user);
        },
        clearSessionLocal: () => {
            localStorage.removeItem(DB_KEY_PREFIX + 'session');
        },
        signInSupabase: async (email, password) => {
            if (!isSupabaseActive()) throw new Error("Supabase inativo.");
            const { data, error } = await window.SupabaseConnector.client.auth.signInWithPassword({
                email: email,
                password: password
            });
            if (error) throw error;
            return data.user;
        },
        signOutSupabase: async () => {
            if (isSupabaseActive()) {
                try {
                    await window.SupabaseConnector.client.auth.signOut();
                } catch (e) {}
            }
        }
    };

    const defaultProfile = {
        name: "Ricardo Silva",
        email: "ricardo.silva@techsupport.pro",
        role: "Engenheiro de Suporte",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAEeZRrkIWG4UabBHoIIs0kVuXjEMjvMoekVgyoEjYUCJYUqkl82uXxjTJ9KVMwrynP6CXwUUBqGdQpUBzfMtpr3qLzHkQLjVCT2mI5CF40WCfl3oP1n9z6lh4A2VaK6pPMbl5iV5EEPHf4esg2GsTYADaP7uXEAxHbjRixFweAKGbum-iXpO6dQPvp0RUqv-NSFKzeKCSQxnjt12zDGJJnpMoSBacbeSm6vTZj9RWNRaJwjmhpHXw8eCv_tAq9o1IifDbYQHK2m0"
    };

    const ProfileModel = {
        get: () => {
            const session = AuthModel.getSession();
            const localProfile = getStorage('profile', null);
            
            if (session) {
                if (session.user_metadata) {
                    return {
                        name: session.user_metadata.full_name || session.email || "Usuário",
                        email: session.email,
                        role: session.user_metadata.role || (localProfile ? localProfile.role : "Engenheiro de Suporte"),
                        avatar: session.user_metadata.avatar_url || (localProfile ? localProfile.avatar : defaultProfile.avatar)
                    };
                } else {
                    return {
                        name: session.name || (localProfile ? localProfile.name : defaultProfile.name),
                        email: session.email || (localProfile ? localProfile.email : defaultProfile.email),
                        role: session.role || (localProfile ? localProfile.role : defaultProfile.role),
                        avatar: localProfile ? localProfile.avatar : defaultProfile.avatar
                    };
                }
            }
            return localProfile || defaultProfile;
        },
        save: async (profile) => {
            setStorage('profile', profile);

            const session = AuthModel.getSession();
            if (session && !session.user_metadata) {
                session.name = profile.name;
                session.email = profile.email;
                session.role = profile.role;
                AuthModel.setSessionLocal(session);
            }

            if (isSupabaseActive()) {
                const client = window.SupabaseConnector.client;
                if (client && client.auth) {
                    let hasSession = false;
                    try {
                        const { data } = await client.auth.getSession();
                        if (data && data.session) {
                            hasSession = true;
                        }
                    } catch (e) {}

                    if (hasSession) {
                        const { data, error } = await client.auth.updateUser({
                            email: profile.email,
                            data: {
                                full_name: profile.name,
                                avatar_url: profile.avatar,
                                role: profile.role
                            }
                        });
                        if (error) {
                            console.error("Erro ao atualizar perfil no Supabase Auth:", error);
                            throw error;
                        }
                    }
                }
            }
        }
    };

    // CustomerModel
    const CustomerModel = {
        getAll: () => getStorage('customers', []),
        getById: (id) => getStorage('customers', []).find(c => c.id === id),
        saveAllLocal: (customers) => setStorage('customers', customers),
        upsertSupabase: async (customer) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('customers').upsert({
                id: customer.id,
                name: customer.name,
                industry: customer.industry,
                active_tickets: customer.activeTickets,
                total_tickets: customer.totalTickets,
                sla_status: customer.slaStatus,
                contact_name: customer.contactName,
                contact_email: customer.contactEmail,
                logo_text: customer.logoText
            });
        },
        updateCountersSupabase: async (id, active, total) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('customers').update({
                active_tickets: active,
                total_tickets: total
            }).eq('id', id);
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('customers').select('*');
        }
    };

    // ContractModel
    const ContractModel = {
        getAll: () => getStorage('contracts', []),
        saveAllLocal: (contracts) => setStorage('contracts', contracts),
        upsertSupabase: async (contract) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('contracts').upsert({
                id: contract.id,
                customer_id: contract.customerId,
                customer_name: contract.customerName,
                plan: contract.plan,
                value: contract.value,
                start_date: contract.startDate,
                end_date: contract.endDate,
                status: contract.status,
                sla_target: contract.slaTarget
            });
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('contracts').select('*');
        }
    };

    // TicketModel
    const TicketModel = {
        getAll: () => getStorage('tickets', []),
        getById: (id) => getStorage('tickets', []).find(t => t.id === id),
        saveAllLocal: (tickets) => setStorage('tickets', tickets),
        addLocal: (ticket) => {
            const tickets = getStorage('tickets', []);
            tickets.unshift(ticket);
            setStorage('tickets', tickets);
        },
        updateLocal: (updatedTicket) => {
            const tickets = getStorage('tickets', []);
            const index = tickets.findIndex(t => t.id === updatedTicket.id);
            if (index !== -1) {
                tickets[index] = updatedTicket;
                setStorage('tickets', tickets);
            }
        },
        insertSupabase: async (ticket) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('tickets').insert([{
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
            }]);
        },
        insertSupabaseMessages: async (ticketId, messages) => {
            if (!isSupabaseActive() || !messages || messages.length === 0) return;
            const client = window.SupabaseConnector.client;
            const messagesToInsert = messages.map(m => ({
                ticket_id: ticketId,
                sender: m.sender,
                role: m.role,
                text: m.text
            }));
            return client.from('ticket_messages').insert(messagesToInsert);
        },
        insertSupabaseSingleMessage: async (ticketId, message) => {
            if (!isSupabaseActive() || !message) return;
            const client = window.SupabaseConnector.client;
            return client.from('ticket_messages').insert([{
                ticket_id: ticketId,
                sender: message.sender,
                role: message.role,
                text: message.text
            }]);
        },
        updateSupabase: async (ticket) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('tickets').update({
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
                assigned_to: ticket.assignedTo
            }).eq('id', ticket.id);
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('tickets').select('*').order('created_at', { ascending: false });
        },
        fetchSupabaseMessages: async (ticketId) => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
        }
    };

    // SettingsModel
    const SettingsModel = {
        get: () => getStorage('settings', {}),
        saveLocal: (settings) => setStorage('settings', settings),
        updateSupabase: async (settings) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('system_settings').update({
                sla_critical: settings.slaCritical,
                sla_high: settings.slaHigh,
                sla_medium: settings.slaMedium,
                sla_low: settings.slaLow,
                categories: settings.categories,
                notifications_enabled: settings.notificationsEnabled,
                updated_at: new Date().toISOString()
            }).eq('id', 1);
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('system_settings').select('*').maybeSingle();
        }
    };

    // FaqModel
    const FaqModel = {
        getAll: () => getStorage('faq', []),
        saveAllLocal: (faq) => setStorage('faq', faq),
        upsertSupabase: async (faqItem) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('faq').upsert({
                id: faqItem.id,
                title: faqItem.title,
                category: faqItem.category,
                content: faqItem.content,
                views: faqItem.views,
                likes: faqItem.likes
            });
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('faq').select('*');
        }
    };

    // LogModel
    const LogModel = {
        getAll: () => getStorage('logs', []),
        saveAllLocal: (logs) => setStorage('logs', logs),
        addLocal: (logText) => {
            const logs = getStorage('logs', []);
            logs.push(logText);
            if (logs.length > 50) logs.shift();
            setStorage('logs', logs);
        },
        insertSupabase: async (logText) => {
            if (!isSupabaseActive()) return;
            const client = window.SupabaseConnector.client;
            return client.from('system_logs').insert([{
                log_text: logText
            }]);
        },
        fetchSupabase: async () => {
            if (!isSupabaseActive()) return null;
            return window.SupabaseConnector.client.from('system_logs').select('*').order('created_at', { ascending: false }).limit(50);
        }
    };

    // Exportar Modelos Globalmente para o MVC
    window.TechSupportModels = {
        isSupabaseActive: isSupabaseActive,
        AuthModel: AuthModel,
        ProfileModel: ProfileModel,
        CustomerModel: CustomerModel,
        ContractModel: ContractModel,
        TicketModel: TicketModel,
        SettingsModel: SettingsModel,
        FaqModel: FaqModel,
        LogModel: LogModel
    };
})();
