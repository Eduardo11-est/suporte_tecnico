// TechSupport Pro - Lógica da Base de Conhecimento
(function() {
    // Verificar sessão ativa do usuário
    window.TechSupportDB.checkAuth('../');
    document.addEventListener('DOMContentLoaded', function() {
        const faqContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3') || document.querySelector('.grid');
        const searchInput = document.querySelector('header input');
        const categoryPills = document.querySelectorAll('.flex.flex-wrap.gap-2 button');

        let searchQuery = '';
        let selectedCategory = 'todos';

        // Renderizar FAQ
        function renderFaq() {
            if (!faqContainer) return;
            faqContainer.innerHTML = '';

            const articles = window.TechSupportDB.getFaq();

            const filtered = articles.filter(art => {
                // Filtro de Categoria
                if (selectedCategory !== 'todos' && art.category !== selectedCategory) {
                    return false;
                }

                // Filtro de Busca
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    const titleMatch = art.title.toLowerCase().includes(q);
                    const contentMatch = art.content.toLowerCase().includes(q);
                    if (!titleMatch && !contentMatch) return false;
                }

                return true;
            });

            if (filtered.length === 0) {
                faqContainer.innerHTML = `
                    <div class="col-span-full py-8 text-center text-on-surface-variant font-medium">
                        Nenhum artigo encontrado com os critérios de busca.
                    </div>
                `;
                return;
            }

            filtered.forEach(art => {
                const card = document.createElement('div');
                card.className = 'bg-surface-container-lowest p-6 rounded-xl border border-outline-variant hover:border-secondary hover:shadow-sm transition-all group flex flex-col justify-between';

                card.innerHTML = `
                    <div>
                        <div class="flex justify-between items-start mb-4">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container/10 text-secondary uppercase">${art.category}</span>
                            <div class="flex items-center gap-1 text-[11px] text-outline">
                                <span class="material-symbols-outlined text-sm">visibility</span>
                                <span>${art.views}</span>
                            </div>
                        </div>
                        <h3 class="font-bold text-on-surface text-body-lg group-hover:text-secondary transition-colors mb-2">${art.title}</h3>
                        <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-3 mb-4">${art.content}</p>
                    </div>
                    <div class="flex justify-between items-center border-t border-outline-variant/30 pt-3 mt-auto">
                        <button class="text-xs text-secondary font-bold hover:underline read-more-btn" data-id="${art.id}">Ler Artigo</button>
                        <button class="flex items-center gap-1 text-xs text-on-surface-variant hover:text-secondary like-btn" data-id="${art.id}">
                            <span class="material-symbols-outlined text-sm">thumb_up</span>
                            <span>${art.likes}</span>
                        </button>
                    </div>
                `;
                faqContainer.appendChild(card);
            });

            // Eventos dos botões de ler mais e curtir
            document.querySelectorAll('.read-more-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    const allFaq = window.TechSupportDB.getFaq();
                    const art = allFaq.find(a => a.id === id);
                    if (art) {
                        art.views++;
                        window.TechSupportDB.saveFaq(allFaq);
                        alert(`=== ${art.title} ===\n\n${art.content}`);
                        renderFaq();
                    }
                });
            });

            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    const allFaq = window.TechSupportDB.getFaq();
                    const art = allFaq.find(a => a.id === id);
                    if (art) {
                        art.likes++;
                        window.TechSupportDB.saveFaq(allFaq);
                        renderFaq();
                    }
                });
            });
        }

        // Evento de Busca
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchQuery = this.value;
                renderFaq();
            });
        }

        // Filtros de Categoria (Pills)
        categoryPills.forEach(pill => {
            pill.addEventListener('click', function() {
                categoryPills.forEach(p => {
                    p.classList.remove('bg-secondary', 'text-on-secondary');
                    p.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                });
                this.classList.add('bg-secondary', 'text-on-secondary');
                this.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

                const text = this.innerText.toLowerCase();
                if (text.includes('todos')) selectedCategory = 'todos';
                else if (text.includes('infraestrutura') || text.includes('infra')) selectedCategory = 'infra';
                else if (text.includes('segurança')) selectedCategory = 'seguranca';
                else if (text.includes('telecom')) selectedCategory = 'telecom';

                renderFaq();
            });
        });

        // Adicionar Novo Artigo Action
        const addArtBtn = document.querySelector('button.bg-secondary');
        if (addArtBtn) {
            addArtBtn.addEventListener('click', function() {
                const title = prompt('Digite o título do artigo:');
                if (!title) return;
                const category = prompt('Digite a categoria (infra, seguranca, telecom):', 'infra');
                if (!category) return;
                const content = prompt('Digite o conteúdo do artigo:');
                if (!content) return;

                const allFaq = window.TechSupportDB.getFaq();
                const nextId = allFaq.length + 1;
                allFaq.push({
                    id: nextId,
                    title: title,
                    category: category,
                    content: content,
                    views: 0,
                    likes: 0
                });

                window.TechSupportDB.saveFaq(allFaq);
                window.TechSupportDB.addLog(`[SYSTEM] Novo artigo adicionado à Base de Conhecimento: "${title}".`);
                alert('Artigo publicado com sucesso!');
                renderFaq();
            });
        }

        // Inicializar
        renderFaq();
    });
})();
