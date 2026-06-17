// TechSupport Pro - Conector de Banco de Dados Supabase
(function() {
    let url = "";
    let key = "";

    // Tentar carregar as credenciais do .env de forma síncrona
    const possiblePaths = ['.env', '../.env', '../../.env', '../../../.env', '/.env'];
    for (let path of possiblePaths) {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", path, false); // false = síncrono
            xhr.send(null);
            if (xhr.status === 200) {
                const text = xhr.responseText;
                const lines = text.split('\n');
                for (let line of lines) {
                    const trimmed = line.trim();
                    if (trimmed && !trimmed.startsWith('#')) {
                        const parts = trimmed.split('=');
                        const k = parts[0].trim();
                        const v = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
                        if (k === 'SUPABASE_URL') url = v;
                        if (k === 'SUPABASE_KEY') key = v;
                    }
                }
                if (url && key) {
                    console.log(`Configurações do Supabase carregadas de ${path}`);
                    break;
                }
            }
        } catch (e) {
            // Silenciosamente ignorar e tentar o próximo caminho
        }
    }

    // Fallback caso não encontre no .env (para manter o funcionamento se rodar local sem servidor)
    if (!url || !key) {
        url = "https://zcfhfsrusvvirsirbozg.supabase.co";
        key = "sb_publishable_H_4R6lQUDyB2S4fZxM8XMg_J2lwu_eu";
        console.warn("Supabase: Arquivo .env não encontrado ou incompleto. Usando credenciais padrão de fallback.");
    }

    const SUPABASE_URL = url;
    const SUPABASE_KEY = key;

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
