// TechSupport Pro - Conector de Banco de Dados Supabase
(function() {
    // Configurações do Supabase (Substitua pelos dados do seu projeto do Supabase)
    const SUPABASE_URL = "https://zcfhfsrusvvirsirbozg.supabase.co"; 
    const SUPABASE_KEY = "sb_publishable_H_4R6lQUDyB2S4fZxM8XMg_J2lwu_eu";

    let supabaseClient = null;

    if (SUPABASE_URL && SUPABASE_KEY) {
        try {
            if (typeof window.supabase !== 'undefined') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                console.log("Supabase inicializado com sucesso!");
            } else {
                console.warn("A biblioteca Supabase (CDN) não foi carregada no navegador.");
            }
        } catch (err) {
            console.error("Falha ao inicializar o cliente Supabase:", err);
        }
    } else {
        console.log("Supabase: Credenciais não configuradas. Usando modo de simulação LocalStorage.");
    }

    // Exportar para escopo global do navegador
    window.SupabaseConnector = {
        client: supabaseClient,
        isActive: () => supabaseClient !== null,
        url: SUPABASE_URL,
        key: SUPABASE_KEY
    };
})();
