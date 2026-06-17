// TechSupport Pro - Lógica das Configurações do Sistema
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    document.addEventListener('DOMContentLoaded', function() {
        const tabs = document.querySelectorAll('.settings-tab');
        const saveBtn = document.querySelector('header button.bg-secondary') || document.querySelector('main button.bg-secondary');

        // Carregar configurações do localStorage
        const settings = window.TechSupportDB.getSettings();

        // Mapear elementos e preencher valores de configuração (se existirem)
        // Por exemplo, SLAs
        const slaCriticalInput = document.getElementById('sla-critical');
        if (slaCriticalInput) slaCriticalInput.value = settings.slaCritical || 2;
        
        const slaHighInput = document.getElementById('sla-high');
        if (slaHighInput) slaHighInput.value = settings.slaHigh || 4;

        // Gerenciar Alternância de Abas
        window.switchTab = function(tabId) {
            // Update Tab Styles
            tabs.forEach(tab => {
                tab.classList.remove('bg-secondary-container', 'text-on-secondary-container', 'font-semibold');
                tab.classList.add('text-on-surface-variant', 'hover:bg-surface-container');
            });

            const activeTab = document.getElementById(`tab-${tabId}`);
            if (activeTab) {
                activeTab.classList.add('bg-secondary-container', 'text-on-secondary-container', 'font-semibold');
                activeTab.classList.remove('text-on-surface-variant', 'hover:bg-surface-container');
            }

            // Update Pane Visibility
            const panes = document.querySelectorAll('.settings-pane');
            panes.forEach(pane => {
                pane.classList.add('hidden-pane');
                pane.classList.remove('visible-pane');
            });

            const activePane = document.getElementById(`pane-${tabId}`);
            if (activePane) {
                activePane.classList.remove('hidden-pane');
                activePane.classList.add('visible-pane');
            }

            // Update Header Meta
            const title = document.getElementById('current-pane-title');
            const desc = document.getElementById('current-pane-desc');

            const contentMap = {
                'perfil': { title: 'Perfil do Usuário', desc: 'Gerencie suas informações pessoais e cargo na plataforma.' },
                'sistema': { title: 'Preferências do Sistema', desc: 'Configure o idioma, tema e fuso horário da aplicação.' },
                'notificacoes': { title: 'Notificações', desc: 'Personalize como e quando você recebe alertas e relatórios.' },
                'seguranca': { title: 'Segurança', desc: 'Gerencie sua senha e métodos de autenticação.' }
            };

            if (title && desc && contentMap[tabId]) {
                title.innerText = contentMap[tabId].title;
                desc.innerText = contentMap[tabId].desc;
            }
        };

        // Salvar Configurações
        window.saveSettings = function() {
            // Salvar valores no banco de dados local
            const newSettings = {
                slaCritical: slaCriticalInput ? parseInt(slaCriticalInput.value) : (settings.slaCritical || 2),
                slaHigh: slaHighInput ? parseInt(slaHighInput.value) : (settings.slaHigh || 4),
                slaMedium: settings.slaMedium || 12,
                slaLow: settings.slaLow || 48,
                categories: settings.categories || ['Informática/TI', 'Elétrica', 'Predial/Civil', 'Segurança Eletrônica', 'Telecomunicações'],
                notificationsEnabled: settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true
            };

            window.TechSupportDB.saveSettings(newSettings);
            window.TechSupportDB.addLog('[SYSTEM] Configurações globais do sistema atualizadas por Ricardo Silva.');

            // Toast feedback
            const toast = document.getElementById('save-toast');
            if (toast) {
                toast.classList.remove('translate-y-20', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');

                setTimeout(() => {
                    toast.classList.add('translate-y-20', 'opacity-0');
                    toast.classList.remove('translate-y-0', 'opacity-100');
                }, 3000);
            }
        };

        // Vincular clique no botão Salvar (se houver na barra superior)
        if (saveBtn) {
            saveBtn.addEventListener('click', window.saveSettings);
        }
    });
})();
