// TechSupport Pro - Lógica de Saúde do Sistema
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    document.addEventListener('DOMContentLoaded', function() {
        const logList = document.getElementById('log-list');
        const clearBtn = document.getElementById('clear-console');

        // Carregar logs iniciais do localStorage
        function loadInitialLogs() {
            if (!logList) return;
            logList.innerHTML = '';
            
            const logs = window.TechSupportDB.getLogs();
            // Renderizar em ordem reversa para o terminal
            logs.forEach(log => {
                const logDiv = document.createElement('div');
                let colorClass = 'text-gray-400';
                if (log.includes('Alerta') || log.includes('falhou')) colorClass = 'text-amber-400';
                else if (log.includes('[SYSTEM]')) colorClass = 'text-blue-400';
                
                logDiv.className = colorClass;
                logDiv.innerText = log;
                logList.appendChild(logDiv);
            });
        }

        const logTemplates = [
            { type: 'HTTP', level: 'info', text: 'GET /api/v1/tickets - 200 OK - 8ms' },
            { type: 'HTTP', level: 'info', text: 'GET /api/v1/clients - 200 OK - 15ms' },
            { type: 'HTTP', level: 'info', text: 'PUT /api/v1/tickets/2023-8821 - 200 OK - 28ms' },
            { type: 'DB', level: 'info', text: 'Query EXPLAIN SELECT * FROM tickets WHERE status = "open"' },
            { type: 'DB', level: 'info', text: 'Conexões no pool de leitura recicladas com sucesso' },
            { type: 'SYSTEM', level: 'info', text: 'CronJob: Limpeza de sessões expiradas completada (12 removidas)' },
            { type: 'SYSTEM', level: 'info', text: 'Garbage Collector: 184MB liberados de heap RAM' },
            { type: 'SMTP', level: 'warn', text: 'Tentativa de re-envio falhou para email id=4481. Re-agendado.' },
            { type: 'SMTP', level: 'info', text: 'Email enviado com sucesso: Notificação de Abertura #2023-8821' },
            { type: 'HTTP', level: 'warn', text: 'GET /api/v1/reports/pdf - 499 Client Closed Request' }
        ];

        function formatTime(d) {
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            const s = String(d.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }

        function appendLog() {
            if (!logList) return;
            const now = new Date();
            const timeStr = formatTime(now);
            const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            
            const logText = `[${timeStr}] [${template.type}] ${template.text}`;
            
            // Salvar na base
            window.TechSupportDB.addLog(logText);

            const logDiv = document.createElement('div');
            let colorClass = 'text-gray-400';
            if (template.level === 'warn') {
                colorClass = 'text-amber-400';
            } else if (template.type === 'SYSTEM') {
                colorClass = 'text-blue-400';
            }

            logDiv.className = colorClass;
            logDiv.innerText = logText;
            
            logList.appendChild(logDiv);
            
            // Limitar logs no DOM
            if (logList.children.length > 50) {
                logList.removeChild(logList.firstChild);
            }

            // Scroll to bottom
            const terminal = document.getElementById('console-stream');
            if (terminal) terminal.scrollTop = terminal.scrollHeight;
        }

        // Adicionar log a cada 3 segundos
        setInterval(appendLog, 3000);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                logList.innerHTML = '<div class="text-green-400">[' + formatTime(new Date()) + '] [SYSTEM] Console limpo pelo usuário.</div>';
            });
        }

        // Flutuação das métricas de desempenho de recursos
        const cpuGauge = document.getElementById('cpu-gauge');
        const cpuText = document.getElementById('cpu-text');
        
        const ramGauge = document.getElementById('ram-gauge');
        const ramText = document.getElementById('ram-text');
        const ramDetails = document.getElementById('ram-details');

        const netSpeed = document.getElementById('network-speed');
        const netBar = document.getElementById('network-bar');

        function updateMetrics() {
            if (!cpuGauge || !ramGauge || !netBar) return;

            // CPU
            const cpuVal = Math.floor(Math.random() * 45) + 25;
            cpuGauge.setAttribute('stroke-dasharray', `${cpuVal}, 100`);
            if (cpuText) cpuText.innerText = `${cpuVal}%`;

            // RAM
            const ramVal = Math.floor(Math.random() * 6) + 62;
            ramGauge.setAttribute('stroke-dasharray', `${ramVal}, 100`);
            if (ramText) ramText.innerText = `${ramVal}%`;
            const ramGb = ((ramVal / 100) * 16).toFixed(1);
            if (ramDetails) ramDetails.innerText = `${ramGb} GB / 16 GB`;

            // Network traffic
            const dlSpeed = (Math.random() * 50 + 60).toFixed(1);
            const ulSpeed = (Math.random() * 60 + 90).toFixed(1);
            if (netSpeed) netSpeed.innerText = `↓ ${dlSpeed} Mbps | ↑ ${ulSpeed} Mbps`;
            const trafficPercent = Math.min(100, Math.floor(((parseFloat(dlSpeed) + parseFloat(ulSpeed)) / 400) * 100));
            netBar.style.width = `${trafficPercent}%`;
        }

        setInterval(updateMetrics, 2000);

        // Inicializar
        loadInitialLogs();
    });
})();
