# TechSupport Pro - Painel de Gerenciamento de Suporte Técnico

Este é um sistema completo e moderno de gerenciamento de suporte técnico e chamados (Help Desk), desenvolvido para engenheiros de suporte acompanharem atendimentos de clientes, contratos, SLAs e base de conhecimento.

O sistema utiliza um design híbrido **Local-First** (offline first) com cache local em `LocalStorage` e sincronização bidirecional em nuvem com o **Supabase**.

---

## 🚀 Funcionalidades Principais

*   **Autenticação Híbrida:** Integração direta com Supabase Auth e suporte a login local de administrador em modo de simulação (fallback).
*   **Gestão de Chamados (Tickets):** Abertura de chamados com priorização (Baixa, Média, Alta, Crítica), categorização (TI, Elétrica, Predial, Telecom, Segurança) e fluxo de status (Pendente, Em Atendimento, Aguardando Peças, Concluído).
*   **Chat Interativo de Chamados:** Mensagens em tempo real salvas no Supabase associadas a cada ticket.
*   **Controle de SLA Dinâmico:** Monitoramento de prazos de resolução por prioridade configurável.
*   **Gestão de Clientes e Contratos:** Fichas cadastrais completas, contadores automáticos de chamados ativos/totais e valores/status de contratos ativos.
*   **Base de Conhecimento (FAQ):** Biblioteca de soluções rápidas com sistema de contagem de curtidas e visualizações.
*   **Configurações do Sistema:** Parametrização de tempos de SLA por nível, gerenciamento de categorias e preferências de notificações.
*   **Logs do Sistema:** Histórico interno para auditoria de eventos e conexões HTTP.

---

## 🏛️ Arquitetura do Sistema (MVC)

O sistema foi refatorado seguindo o padrão arquitetural **Model-View-Controller (MVC)** para separar as responsabilidades do código e simplificar manutenções futuras:

```
suporte_tecnico/
├── backend/
│   ├── Models/
│   │   └── Models.js         # Camada Model: manipulação de dados locais (LocalStorage) e queries Supabase
│   ├── Views/
│   │   └── Views.js          # Camada View: formatação de dados, datas relativas e estilo de badges visuais
│   ├── Controllers/
│   │   └── Controllers.js    # Camada Controller: regras de negócio, login, logout e lógica de sync
│   ├── supabase.js           # Conector e inicializador do cliente Supabase
│   └── db.js                 # Ponto de entrada (Facade) que expõe a API compatível 'window.TechSupportDB'
│
├── frontend/
│   ├── login/                # Tela de Login e lógica de autenticação
│   ├── chamados/             # Tabela e gerenciamento avançado de chamados
│   ├── detalhes_do_chamado/  # Visualização de chamados e chat interativo
│   ├── gest_o_de_clientes/   # Cadastro e visualização de clientes
│   ├── gest_o_de_contratos/  # Acompanhamento de planos e valores
│   ├── configura_es/         # Painel de parâmetros e regras de SLA
│   ├── base_de_conhecimento/ # FAQ interativo e artigos de apoio
│   ├── shared/               # Recursos compartilhados (CSS, Sidebar)
│   └── index.html            # Dashboard Principal
│
├── old/                      # Códigos originais mantidos como backup de segurança
└── .env                      # Variáveis de ambiente locais (ignorado no Git)
```

---

## 🔑 Segurança e Credenciais (.env)

As chaves do banco de dados e APIs do Supabase foram isoladas no arquivo `.env` para proteção contra vazamentos em repositórios públicos.

Para rodar localmente com sua conta do Supabase, crie um arquivo `.env` na raiz do projeto com o seguinte formato:

```env
SUPABASE_URL=https://seu-projeto-ref.supabase.co
SUPABASE_KEY=sua-chave-anon-public-key
```

*Nota: Se o arquivo `.env` não for detectado ou falhar em carregar (ex: rodando via `file://`), o sistema ativa automaticamente os fallbacks padrão e o banco LocalStorage de simulação.*

---

## 💻 Como Executar o Projeto

Como a aplicação é executada inteiramente no lado do cliente (Client-Side), ela necessita de um servidor estático para funcionar com suporte ao carregamento do arquivo `.env` e Supabase CDN.

### Opção 1: Usando Live Server (VS Code)
1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito no arquivo `frontend/login/index.html` ou `frontend/index.html` e selecione **Open with Live Server**.
3. O projeto abrirá em `http://127.0.0.1:5500/`.

### Opção 2: Via Terminal (Python / NodeJS)
Execute um servidor estático na raiz do projeto:

**Com Python:**
```bash
python -m http.server 8000
```

**Com NodeJS (npx):**
```bash
npx http-server -p 8000
```

Abra seu navegador no endereço: `http://localhost:8000/frontend/login/index.html`.

### Credenciais de Teste (Mock Local)
*   **E-mail:** `admin@techsupport.com`
*   **Senha:** `admin123`
