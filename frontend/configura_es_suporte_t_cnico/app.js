// TechSupport Pro - Lógica das Configurações do Sistema
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    
    document.addEventListener('DOMContentLoaded', function() {
        const tabs = document.querySelectorAll('.settings-tab');
        const saveBtn = document.querySelector('header button.bg-secondary') || document.querySelector('main button.bg-secondary') || document.querySelector('button[onclick="saveSettings()"]');

        // Carregar configurações do localStorage
        const settings = window.TechSupportDB.getSettings();

        // Mapear elementos e preencher valores de configuração (se existirem)
        const slaCriticalInput = document.getElementById('sla-critical');
        if (slaCriticalInput) slaCriticalInput.value = settings.slaCritical || 2;
        
        const slaHighInput = document.getElementById('sla-high');
        if (slaHighInput) slaHighInput.value = settings.slaHigh || 4;

        // 1. Carregar Perfil do Usuário
        const profile = window.TechSupportDB.getProfile();
        const profileNameInput = document.getElementById('profile-name-input');
        const profileEmailInput = document.getElementById('profile-email-input');
        const profileRoleSelect = document.getElementById('profile-role-select');
        const profileAvatarPreview = document.getElementById('profile-avatar-preview');
        const inputAvatarFile = document.getElementById('input-avatar-file');
        const btnUploadAvatar = document.getElementById('btn-upload-avatar');
        const btnRemoveAvatar = document.getElementById('btn-remove-avatar');
        const btnEditAvatarTrigger = document.getElementById('btn-edit-avatar-trigger');

        if (profile) {
            if (profileNameInput) profileNameInput.value = profile.name || '';
            if (profileEmailInput) profileEmailInput.value = profile.email || '';
            if (profileRoleSelect) profileRoleSelect.value = profile.role || 'Engenheiro Sênior';
            if (profileAvatarPreview && profile.avatar) profileAvatarPreview.src = profile.avatar;
        }

        // Upload de Foto de Perfil
        if (btnUploadAvatar && inputAvatarFile) {
            btnUploadAvatar.addEventListener('click', () => inputAvatarFile.click());
        }
        if (btnEditAvatarTrigger && inputAvatarFile) {
            btnEditAvatarTrigger.addEventListener('click', () => inputAvatarFile.click());
        }

        if (inputAvatarFile) {
            inputAvatarFile.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                        alert("A foto de perfil não pode exceder 2MB.");
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        if (profileAvatarPreview) {
                            profileAvatarPreview.src = evt.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Remover Foto de Perfil
        if (btnRemoveAvatar) {
            btnRemoveAvatar.addEventListener('click', function() {
                if (profileAvatarPreview) {
                    profileAvatarPreview.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAFUrgCOIah9bvqbifPvMuTlDfISijz8oUnQ-OWNN7PaD-qfaIhB4RgK74mB173_HHOgKPSDJZ3LuH67WQDBDv9aT4lWnkivMG2dPGXa8-qKBNbFrxd-gHW74PGjcBhUirOszXjqfE--1e6DusDPo8Sn-36yD2b3G1UqWTBkyDyQrudK-CLKXe60RM0LWwOGq_sR01thtepe9QNQ50Ysj-9G9nZyZ_2L4P7sJpkneO6Vw0M_kGD8Pxcg8UZxiZmGRDDLoDPrGymvLQ"; // fallback default
                }
            });
        }

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

        // Salvar Configurações & Perfil
        window.saveSettings = async function() {
            const originalBtnText = saveBtn ? saveBtn.innerHTML : '';
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.innerText = "Salvando...";
            }

            try {
                // 1. Salvar configurações gerais
                const newSettings = {
                    slaCritical: slaCriticalInput ? parseInt(slaCriticalInput.value) : (settings.slaCritical || 2),
                    slaHigh: slaHighInput ? parseInt(slaHighInput.value) : (settings.slaHigh || 4),
                    slaMedium: settings.slaMedium || 12,
                    slaLow: settings.slaLow || 48,
                    categories: settings.categories || ['Informática/TI', 'Elétrica', 'Predial/Civil', 'Segurança Eletrônica', 'Telecomunicações'],
                    notificationsEnabled: settings.notificationsEnabled !== undefined ? settings.notificationsEnabled : true
                };

                window.TechSupportDB.saveSettings(newSettings);

                // 2. Salvar Perfil do Usuário
                const updatedProfile = {
                    name: profileNameInput ? profileNameInput.value.trim() : (profile ? profile.name : ''),
                    email: profileEmailInput ? profileEmailInput.value.trim() : (profile ? profile.email : ''),
                    role: profileRoleSelect ? profileRoleSelect.value : (profile ? profile.role : 'Engenheiro Sênior'),
                    avatar: profileAvatarPreview ? profileAvatarPreview.src : (profile ? profile.avatar : '')
                };

                await window.TechSupportDB.saveProfile(updatedProfile);
                window.TechSupportDB.addLog(`[SYSTEM] Configurações globais e perfil de ${updatedProfile.name} atualizados.`);

                // Disparar evento para atualizar o cabeçalho imediatamente na página atual
                window.dispatchEvent(new CustomEvent('techsupport_profile_updated'));

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
            } catch (err) {
                console.error("Erro ao salvar alterações:", err);
                alert("Erro ao salvar alterações: " + err.message);
            } finally {
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = originalBtnText;
                }
            }
        };

        // Vincular clique no botão Salvar (se houver na barra superior)
        if (saveBtn) {
            saveBtn.addEventListener('click', window.saveSettings);
        }
    });
})();
