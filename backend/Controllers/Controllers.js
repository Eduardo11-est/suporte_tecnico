// TechSupport Pro - Camada Controllers do MVC
(function() {
    // AuthController
    const AuthController = {
        checkAuth: (relativePath = './') => {
            if (window.location.pathname.includes('/login/')) {
                return;
            }
            const session = window.TechSupportModels.AuthModel.getSession();
            if (!session) {
                window.location.href = relativePath + 'login/index.html';
            }
        },

        signIn: async (email, password) => {
            const AuthModel = window.TechSupportModels.AuthModel;
            if (window.TechSupportModels.isSupabaseActive()) {
                try {
                    const user = await AuthModel.signInSupabase(email, password);
                    return user;
                } catch (err) {
                    console.warn("Autenticação Supabase falhou. Tentando login local admin mock...");
                    if (email === 'admin@techsupport.com' && password === 'admin123') {
                        const sessionUser = { email: email, name: 'Admin Ricardo (Local)', role: 'admin' };
                        AuthModel.setSessionLocal(sessionUser);
                        return sessionUser;
                    } else {
                        throw err;
                    }
                }
            } else {
                if (email === 'admin@techsupport.com' && password === 'admin123') {
                    const sessionUser = { email: email, name: 'Admin Ricardo', role: 'admin' };
                    AuthModel.setSessionLocal(sessionUser);
                    return sessionUser;
                } else {
                    throw new Error('E-mail ou senha inválidos.');
                }
            }
        },

        signOut: async (relativePath = '../') => {
            const AuthModel = window.TechSupportModels.AuthModel;
            await AuthModel.signOutSupabase();
            AuthModel.clearSessionLocal();
            window.location.href = relativePath + 'login/index.html';
        }
    };

    // CustomerController
    const CustomerController = {
        getCustomers: () => window.TechSupportModels.CustomerModel.getAll(),
        getCustomerById: (id) => window.TechSupportModels.CustomerModel.getById(id),
        saveCustomers: (customers) => {
            const CustomerModel = window.TechSupportModels.CustomerModel;
            CustomerModel.saveAllLocal(customers);
            customers.forEach(customer => {
                CustomerModel.upsertSupabase(customer).catch(err => console.error(err));
            });
        }
    };

    // ContractController
    const ContractController = {
        getContracts: () => window.TechSupportModels.ContractModel.getAll(),
        saveContracts: (contracts) => {
            const ContractModel = window.TechSupportModels.ContractModel;
            ContractModel.saveAllLocal(contracts);
            contracts.forEach(contract => {
                ContractModel.upsertSupabase(contract).catch(err => console.error(err));
            });
        }
    };

    // TicketController
    const TicketController = {
        getTickets: () => window.TechSupportModels.TicketModel.getAll(),
        getTicketById: (id) => window.TechSupportModels.TicketModel.getById(id),
        addTicket: (ticket) => {
            const TicketModel = window.TechSupportModels.TicketModel;
            const CustomerModel = window.TechSupportModels.CustomerModel;

            TicketModel.addLocal(ticket);

            const customers = CustomerModel.getAll();
            const customer = customers.find(c => c.id === ticket.customerId || c.name === ticket.customerName);
            if (customer) {
                customer.activeTickets++;
                customer.totalTickets++;
                CustomerModel.saveAllLocal(customers);
            }

            // Enviar para o Supabase
            TicketModel.insertSupabase(ticket).catch(err => {
                console.error("Erro no insert do ticket no Supabase:", err);
            });

            if (ticket.messages && ticket.messages.length > 0) {
                TicketModel.insertSupabaseMessages(ticket.id, ticket.messages).catch(err => {
                    console.error("Erro no insert das mensagens no Supabase:", err);
                });
            }

            if (customer) {
                CustomerModel.updateCountersSupabase(customer.id, customer.activeTickets, customer.totalTickets).catch(err => {
                    console.error("Erro ao atualizar contadores do cliente no Supabase:", err);
                });
            }
        },
        updateTicket: (updatedTicket) => {
            const TicketModel = window.TechSupportModels.TicketModel;
            TicketModel.updateLocal(updatedTicket);

            TicketModel.updateSupabase(updatedTicket).catch(err => {
                console.error("Erro ao atualizar chamado no Supabase:", err);
            });

            if (updatedTicket.messages && updatedTicket.messages.length > 0) {
                const lastMessage = updatedTicket.messages[updatedTicket.messages.length - 1];
                if (lastMessage) {
                    TicketModel.insertSupabaseSingleMessage(updatedTicket.id, lastMessage).catch(err => {
                        console.error("Erro ao inserir mensagem de chat no Supabase:", err);
                    });
                }
            }
        }
    };

    // SettingsController
    const SettingsController = {
        getSettings: () => window.TechSupportModels.SettingsModel.get(),
        saveSettings: (settings) => {
            const SettingsModel = window.TechSupportModels.SettingsModel;
            SettingsModel.saveLocal(settings);
            SettingsModel.updateSupabase(settings).catch(err => {
                console.error("Erro ao salvar configurações no Supabase:", err);
            });
        }
    };

    // ProfileController
    const ProfileController = {
        getProfile: () => window.TechSupportModels.ProfileModel.get(),
        saveProfile: (profile) => window.TechSupportModels.ProfileModel.save(profile)
    };

    // FaqController
    const FaqController = {
        getFaq: () => window.TechSupportModels.FaqModel.getAll(),
        saveFaq: (faq) => {
            const FaqModel = window.TechSupportModels.FaqModel;
            FaqModel.saveAllLocal(faq);
            faq.forEach(f => {
                FaqModel.upsertSupabase(f).catch(err => console.error(err));
            });
        }
    };

    // LogController
    const LogController = {
        getLogs: () => window.TechSupportModels.LogModel.getAll(),
        addLog: (logText) => {
            const LogModel = window.TechSupportModels.LogModel;
            LogModel.addLocal(logText);
            LogModel.insertSupabase(logText).catch(err => {
                console.error("Erro ao salvar log no Supabase:", err);
            });
        }
    };

    // SyncController
    const SyncController = {
        syncFromSupabase: async () => {
            const Models = window.TechSupportModels;
            if (!Models.isSupabaseActive() || !Models.AuthModel.getSession()) return;

            try {
                console.log("Sincronizando cache local com o Supabase Cloud...");

                // Clientes
                const { data: customers } = await Models.CustomerModel.fetchSupabase();
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
                    Models.CustomerModel.saveAllLocal(mapped);
                }

                // Contratos
                const { data: contracts } = await Models.ContractModel.fetchSupabase();
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
                    Models.ContractModel.saveAllLocal(mapped);
                }

                // Chamados (Tickets) + Mensagens
                const { data: tickets } = await Models.TicketModel.fetchSupabase();
                if (tickets) {
                    for (let ticket of tickets) {
                        const { data: messages } = await Models.TicketModel.fetchSupabaseMessages(ticket.id);
                        ticket.messages = messages || [];
                        ticket.categoryName = ticket.category_name;
                        ticket.priorityName = ticket.priority_name;
                        ticket.statusName = ticket.status_name;
                        ticket.customerId = ticket.customer_id;
                        ticket.customerName = ticket.customer_name;
                        ticket.createdAt = ticket.created_at;
                        ticket.assignedTo = ticket.assigned_to;
                    }
                    if (tickets.length > 0) Models.TicketModel.saveAllLocal(tickets);
                }

                // Configurações
                const { data: settings } = await Models.SettingsModel.fetchSupabase();
                if (settings) {
                    Models.SettingsModel.saveLocal({
                        slaCritical: settings.sla_critical,
                        slaHigh: settings.sla_high,
                        slaMedium: settings.sla_medium,
                        slaLow: settings.sla_low,
                        categories: settings.categories,
                        notificationsEnabled: settings.notifications_enabled
                    });
                }

                // FAQ
                const { data: faq } = await Models.FaqModel.fetchSupabase();
                if (faq && faq.length > 0) Models.FaqModel.saveAllLocal(faq);

                // Logs
                const { data: logs } = await Models.LogModel.fetchSupabase();
                if (logs && logs.length > 0) {
                    const logTexts = logs.map(l => l.log_text).reverse();
                    Models.LogModel.saveAllLocal(logTexts);
                }

                console.log("Sincronização com o Supabase concluída!");
                window.dispatchEvent(new CustomEvent('techsupport_db_synced'));
            } catch (err) {
                console.error("Erro na sincronização em background com o Supabase:", err);
            }
        }
    };

    // Exportar Controladores Globalmente para o MVC
    window.TechSupportControllers = {
        AuthController: AuthController,
        ProfileController: ProfileController,
        CustomerController: CustomerController,
        ContractController: ContractController,
        TicketController: TicketController,
        SettingsController: SettingsController,
        FaqController: FaqController,
        LogController: LogController,
        SyncController: SyncController
    };
})();
