// TechSupport Pro - Controle da Tela de Login
(function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const errorMessageDiv = document.getElementById('error-message');
    const errorTextSpan = document.getElementById('error-text');
    const submitBtn = document.getElementById('submit-btn');

    const dbIndicatorDot = document.getElementById('db-indicator-dot');
    const dbIndicatorText = document.getElementById('db-indicator-text');

    // 1. Atualizar Indicador de Conexão com o Banco
    if (window.SupabaseConnector && window.SupabaseConnector.isActive()) {
        dbIndicatorDot.className = "w-2 h-2 rounded-full bg-blue-500 animate-pulse";
        dbIndicatorText.innerText = "Supabase Cloud Conectado";
    } else {
        dbIndicatorDot.className = "w-2 h-2 rounded-full bg-emerald-500 animate-pulse";
        dbIndicatorText.innerText = "Modo LocalStorage Ativo";
    }

    // 2. Alternar Visibilidade da Senha
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            
            const icon = togglePasswordBtn.querySelector('span');
            if (icon) {
                icon.innerText = isPassword ? 'visibility_off' : 'visibility';
            }
        });
    }

    // 3. Submeter Formulário de Login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Limpar erros
            errorMessageDiv.classList.add('hidden');
            
            // Desabilitar botão para feedback visual
            submitBtn.disabled = true;
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <span>Validando...</span>
            `;

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            try {
                // Chamar método híbrido de autenticação do backend
                await window.TechSupportDB.signIn(email, password);

                // Adicionar log de auditoria local
                window.TechSupportDB.addLog(`[AUTH] Login efetuado com sucesso por ${email}`);

                // Redirecionar para o dashboard principal
                window.location.href = '../index.html';
            } catch (err) {
                // Exibir erro
                errorTextSpan.innerText = err.message || "Erro ao conectar. Verifique os dados.";
                errorMessageDiv.classList.remove('hidden');
                
                // Restaurar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
})();
