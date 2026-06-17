// TechSupport Pro - Facade / Bootstrap MVC do Banco de Dados
(function() {
    // Instancia o objeto global TechSupportDB delegando para os Controllers correspondentes
    window.TechSupportDB = {
        checkAuth: (relativePath) => window.TechSupportControllers.AuthController.checkAuth(relativePath),
        signIn: (email, password) => window.TechSupportControllers.AuthController.signIn(email, password),
        signOut: (relativePath) => window.TechSupportControllers.AuthController.signOut(relativePath),
        getSession: () => window.TechSupportModels.AuthModel.getSession(),
        
        syncFromSupabase: () => window.TechSupportControllers.SyncController.syncFromSupabase(),

        getCustomers: () => window.TechSupportControllers.CustomerController.getCustomers(),
        getCustomerById: (id) => window.TechSupportControllers.CustomerController.getCustomerById(id),
        saveCustomers: (customers) => window.TechSupportControllers.CustomerController.saveCustomers(customers),

        getContracts: () => window.TechSupportControllers.ContractController.getContracts(),
        saveContracts: (contracts) => window.TechSupportControllers.ContractController.saveContracts(contracts),

        getTickets: () => window.TechSupportControllers.TicketController.getTickets(),
        getTicketById: (id) => window.TechSupportControllers.TicketController.getTicketById(id),
        addTicket: (ticket) => window.TechSupportControllers.TicketController.addTicket(ticket),
        updateTicket: (ticket) => window.TechSupportControllers.TicketController.updateTicket(ticket),

        getSettings: () => window.TechSupportControllers.SettingsController.getSettings(),
        saveSettings: (settings) => window.TechSupportControllers.SettingsController.saveSettings(settings),

        getProfile: () => window.TechSupportControllers.ProfileController.getProfile(),
        saveProfile: (profile) => window.TechSupportControllers.ProfileController.saveProfile(profile),

        getFaq: () => window.TechSupportControllers.FaqController.getFaq(),
        saveFaq: (faq) => window.TechSupportControllers.FaqController.saveFaq(faq),

        getLogs: () => window.TechSupportControllers.LogController.getLogs(),
        addLog: (logText) => window.TechSupportControllers.LogController.addLog(logText)
    };

    // Disparar sincronização em background imediata se estiver logado
    if (window.TechSupportDB.getSession()) {
        window.TechSupportDB.syncFromSupabase();
    }
})();
