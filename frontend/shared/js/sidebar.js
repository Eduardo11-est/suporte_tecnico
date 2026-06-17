// Agilize Tech - Barra Lateral (Sidebar)
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        try {
            var container = document.getElementById('sidebar-container');
            if (!container) return;

            // ─── Detectar prefix de navegação ─────────────────────────────────────
            // O servidor serve os arquivos a partir de "08 Suporte Tecnico"
            // Páginas na raiz do frontend: /frontend/index.html        → prefix = "./"
            // Páginas em subpastas:         /frontend/chamados/...      → prefix = "../"
            var rawPath = window.location.pathname;

            // Normaliza barras e remove query/hash
            var pathParts = rawPath.replace(/\\/g, '/').split('/').filter(function (p) { return p !== ''; });
            // pathParts para raiz: ["frontend", "index.html"]        → 2 partes
            // pathParts para sub:  ["frontend", "chamados", "index.html"] → 3+ partes

            // Se existir o segmento "frontend" e logo após "index.html" (sem pasta intermediária)
            // OU se não houver pasta intermediária conhecida → é raiz
            var isRoot = false;

            // Checar se é raiz verificando se o arquivo index.html está direto no "frontend"
            if (pathParts.length <= 2) {
                isRoot = true;
            } else if (pathParts.length === 2 && pathParts[1] === 'index.html') {
                isRoot = true;
            } else {
                // Verificar se a pasta intermediária é conhecida como subpasta
                var subFolders = [
                    'chamados', 'login', 'gest_o_de_clientes_techsupport_pro',
                    'gest_o_de_contratos_techsupport_pro', 'relat_rios_suporte_t_cnico',
                    'base_de_conhecimento_techsupport_pro', 'technical_support_system',
                    'configura_es_suporte_t_cnico', 'novo_chamado_suporte_t_cnico',
                    'detalhes_do_chamado_suporte_t_cnico', 'ficha_do_cliente_techsupport_pro'
                ];
                var hasSubFolder = false;
                for (var i = 0; i < pathParts.length; i++) {
                    var part = decodeURIComponent(pathParts[i]);
                    for (var j = 0; j < subFolders.length; j++) {
                        if (part.indexOf(subFolders[j]) !== -1) {
                            hasSubFolder = true;
                            break;
                        }
                    }
                    if (hasSubFolder) break;
                }
                isRoot = !hasSubFolder;
            }

            var prefix = isRoot ? './' : '../';

            // ─── Detectar aba ativa ────────────────────────────────────────────────
            var fullPath = decodeURIComponent(rawPath);
            var activeTab = 'dashboard';

            if (fullPath.indexOf('chamados') !== -1 &&
                fullPath.indexOf('novo_chamado') === -1 &&
                fullPath.indexOf('detalhes_do_chamado') === -1) {
                activeTab = 'chamados';
            } else if (fullPath.indexOf('gest_o_de_clientes') !== -1 || fullPath.indexOf('ficha_do_cliente') !== -1) {
                activeTab = 'clientes';
            } else if (fullPath.indexOf('gest_o_de_contratos') !== -1) {
                activeTab = 'contratos';
            } else if (fullPath.indexOf('relat_rios') !== -1) {
                activeTab = 'relatorios';
            } else if (fullPath.indexOf('base_de_conhecimento') !== -1) {
                activeTab = 'faq';
            } else if (fullPath.indexOf('technical_support_system') !== -1) {
                activeTab = 'saude';
            } else if (fullPath.indexOf('configura_es') !== -1) {
                activeTab = 'configuracoes';
            } else if (fullPath.indexOf('novo_chamado') !== -1 || fullPath.indexOf('detalhes_do_chamado') !== -1) {
                activeTab = 'chamados';
            }

            // ─── Badge de chamados abertos ─────────────────────────────────────────
            var openBadge = '';
            try {
                if (window.TechSupportDB) {
                    var tickets = window.TechSupportDB.getTickets();
                    var openCount = 0;
                    for (var t = 0; t < tickets.length; t++) {
                        if (tickets[t].status !== 'resolved' && tickets[t].status !== 'resolvido') {
                            openCount++;
                        }
                    }
                    if (openCount > 0) openBadge = String(openCount);
                }
            } catch (e) { /* silencia erros de badge */ }

            // ─── Helper: gerar item de menu ────────────────────────────────────────
            function menuItem(id, href, icon, label, badge) {
                var isActive = (activeTab === id);
                var badgeHTML = badge ? ('<span style="margin-left:auto;background:#ba1a1a;color:#fff;font-size:9px;font-weight:700;padding:1px 6px;border-radius:99px;">' + badge + '</span>') : '';

                var activeStyle = 'background:rgba(0,88,190,0.85);color:#fff;';
                var normalStyle = 'color:rgba(190,198,224,0.85);';
                var hoverClass = isActive ? '' : 'menu-item-hover';

                return '<a href="' + prefix + href + '" class="sidebar-link ' + hoverClass + '" style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:10px;text-decoration:none;margin-bottom:2px;transition:background 0.15s ease;' + (isActive ? activeStyle : normalStyle) + '">' +
                    '<span class="material-symbols-outlined" style="font-size:20px;' + (isActive ? "font-variation-settings:'FILL' 1;" : '') + '">' + icon + '</span>' +
                    '<span style="font-size:12px;font-weight:600;letter-spacing:0.03em;">' + label + '</span>' +
                    badgeHTML +
                    '</a>';
            }

            // ─── Montar o HTML da Sidebar ──────────────────────────────────────────
            var html = '' +
                '<aside id="sidebar" style="position:fixed;left:0;top:0;height:100%;width:260px;display:flex;flex-direction:column;z-index:50;' +
                'background:linear-gradient(180deg,#0b1526 0%,#0d1a35 50%,#091222 100%);' +
                'border-right:1px solid rgba(255,255,255,0.06);">' +

                    /* ── Logo ── */
                    '<div style="padding:18px 16px 14px;border-bottom:1px solid rgba(255,255,255,0.07);">' +
                        '<div style="display:flex;align-items:center;gap:12px;">' +
                            /* SVG Logo */
                            '<div style="width:42px;height:42px;flex-shrink:0;position:relative;">' +
                                '<svg viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">' +
                                    '<defs>' +
                                        '<linearGradient id="sblg" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">' +
                                            '<stop offset="0%" stop-color="#0058BE"/>' +
                                            '<stop offset="100%" stop-color="#00C4FF"/>' +
                                        '</linearGradient>' +
                                    '</defs>' +
                                    '<polygon points="21,2 37,11 37,31 21,40 5,31 5,11" fill="url(#sblg)"/>' +
                                    '<path d="M24 7L13 23h9l-4 12 15-18h-10l3-10z" fill="white" opacity="0.95"/>' +
                                '</svg>' +
                                '<div id="logo-pulse-ring" style="position:absolute;inset:-6px;border-radius:50%;border:1.5px solid rgba(0,88,190,0.4);animation:sidebarPulse 2.5s ease-out infinite;pointer-events:none;"></div>' +
                            '</div>' +
                            /* Nome */
                            '<div>' +
                                '<div style="font-size:15px;font-weight:800;color:#ffffff;line-height:1;letter-spacing:-0.01em;">Agilize Tech</div>' +
                                '<div style="font-size:9px;font-weight:700;color:rgba(147,197,253,0.5);text-transform:uppercase;letter-spacing:0.15em;margin-top:3px;">Support Console</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    /* ── Status Online ── */
                    '<div style="padding:8px 12px;">' +
                        '<div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border-radius:8px;padding:8px 12px;">' +
                            '<div style="width:7px;height:7px;border-radius:50%;background:#4ade80;animation:sbpulse 2s ease-in-out infinite;flex-shrink:0;"></div>' +
                            '<span style="font-size:10px;color:rgba(255,255,255,0.5);font-weight:500;">Todos os sistemas OK</span>' +
                        '</div>' +
                    '</div>' +

                    /* ── Nav Principal ── */
                    '<nav style="flex:1;padding:8px 12px;overflow-y:auto;">' +
                        '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.15em;padding:8px 4px 6px;">PRINCIPAL</div>' +
                        menuItem('dashboard', 'index.html', 'dashboard', 'Painel Geral', '') +
                        menuItem('chamados', 'chamados/index.html', 'confirmation_number', 'Chamados', openBadge) +
                        menuItem('clientes', 'gest_o_de_clientes_techsupport_pro/index.html', 'group', 'Clientes', '') +
                        menuItem('contratos', 'gest_o_de_contratos_techsupport_pro/index.html', 'description', 'Contratos', '') +
                        '<div style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.25);text-transform:uppercase;letter-spacing:0.15em;padding:12px 4px 6px;">OPERAÇÕES</div>' +
                        menuItem('relatorios', 'relat_rios_suporte_t_cnico/index.html', 'analytics', 'Relatórios', '') +
                        menuItem('faq', 'base_de_conhecimento_techsupport_pro/index.html', 'menu_book', 'Base de Conhecimento', '') +
                        menuItem('saude', 'technical_support_system/index.html', 'health_and_safety', 'Saúde do Sistema', '') +
                    '</nav>' +

                    /* ── Rodapé ── */
                    '<div style="padding:8px 12px;border-top:1px solid rgba(255,255,255,0.07);">' +
                        menuItem('configuracoes', 'configura_es_suporte_t_cnico/index.html', 'settings', 'Configurações', '') +
                        '<a href="#" id="sidebar-logout" style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:10px;text-decoration:none;color:rgba(248,113,113,0.8);transition:background 0.15s ease;margin-bottom:2px;" class="menu-item-hover">' +
                            '<span class="material-symbols-outlined" style="font-size:20px;">logout</span>' +
                            '<span style="font-size:12px;font-weight:600;letter-spacing:0.03em;">Sair</span>' +
                        '</a>' +
                    '</div>' +

                '</aside>' +

                /* ── Estilos CSS embutidos ── */
                '<style>' +
                    '.menu-item-hover:hover { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.95) !important; }' +
                    '.sidebar-link { font-family: Inter, sans-serif; }' +
                    '@keyframes sidebarPulse { 0% { transform:scale(0.85);opacity:0.8; } 100% { transform:scale(1.3);opacity:0; } }' +
                    '@keyframes sbpulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }' +
                    '#sidebar { animation: sidebarSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both; }' +
                    '@keyframes sidebarSlideIn { from { transform:translateX(-20px);opacity:0; } to { transform:translateX(0);opacity:1; } }' +
                '</style>';

            container.innerHTML = html;

            // ─── Lógica de Logout ──────────────────────────────────────────────────
            var logoutBtn = document.getElementById('sidebar-logout');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (confirm('Deseja realmente sair?')) {
                        if (window.TechSupportDB && typeof window.TechSupportDB.signOut === 'function') {
                            window.TechSupportDB.signOut(prefix);
                        } else {
                            localStorage.removeItem('techsupport_pro_session');
                            window.location.href = prefix + 'login/index.html';
                        }
                    }
                });
            }

            // ─── Atualizar Cabeçalho (Header Profile) Dinamicamente ──────────────
            function updateHeaderProfile() {
                try {
                    if (!window.TechSupportDB || typeof window.TechSupportDB.getProfile !== 'function') return;
                    var profile = window.TechSupportDB.getProfile();
                    if (!profile) return;

                    var header = document.querySelector('header');
                    if (!header) return;

                    // 1. Procurar elementos do nome do usuário no cabeçalho
                    var nameEl = header.querySelector('#header-username');
                    if (!nameEl) {
                        var textEls = header.querySelectorAll('p, span');
                        for (var i = 0; i < textEls.length; i++) {
                            var text = textEls[i].textContent.trim();
                            if (text === 'Ricardo Silva' || text === 'Ricardo Mendes' || text === 'Usuário') {
                                nameEl = textEls[i];
                                break;
                            }
                        }
                    }
                    if (nameEl) {
                        nameEl.textContent = profile.name;
                    }

                    // 2. Procurar elementos de cargo do usuário no cabeçalho
                    var roleEl = null;
                    var textEls = header.querySelectorAll('p, span');
                    for (var i = 0; i < textEls.length; i++) {
                        var text = textEls[i].textContent.trim();
                        if (text === 'Engenheiro de Suporte' || text === 'Técnico Nível 2' || text === 'Engenheiro Sênior' || text === 'Online' || text === 'ENGENHEIRO DE SUPORTE' || text === 'TÉCNICO NÍVEL 2' || text === 'ENGENHEIRO SÊNIOR') {
                            roleEl = textEls[i];
                            break;
                        }
                    }
                    if (roleEl) {
                        roleEl.textContent = profile.role;
                    }

                    // 3. Procurar imagem de perfil (avatar) no cabeçalho
                    var avatarEl = header.querySelector('#header-avatar');
                    var imgEl = header.querySelector('img[class*="rounded-full"], img[alt*="Avatar"], img[alt*="Profile"], img[alt*="Technician"]');
                    
                    if (profile.avatar) {
                        if (imgEl) {
                            imgEl.src = profile.avatar;
                            if (avatarEl) {
                                avatarEl.style.display = 'none';
                                imgEl.style.display = '';
                            }
                        } else if (avatarEl) {
                            // Se tiver a div fallback, tenta atualizar as iniciais
                            avatarEl.textContent = profile.name.substring(0, 2).toUpperCase();
                        }
                    }
                } catch (ex) {
                    console.warn('[Agilize Tech Sidebar] Falha ao atualizar cabeçalho:', ex);
                }
            }

            // Executar imediatamente e escutar atualizações
            updateHeaderProfile();
            window.addEventListener('techsupport_profile_updated', updateHeaderProfile);

        } catch (err) {
            console.error('[Agilize Tech Sidebar] Erro crítico:', err);
            // Fallback mínimo para não quebrar o layout
            var fallbackContainer = document.getElementById('sidebar-container');
            if (fallbackContainer) {
                fallbackContainer.innerHTML = '<aside style="position:fixed;left:0;top:0;height:100%;width:260px;background:#0d1a35;z-index:50;display:flex;align-items:center;justify-content:center;"><span style="color:red;font-size:11px;padding:20px;">Erro no sidebar.<br/>Recarregue a página.</span></aside>';
            }
        }
    });
})();
