        // Data Migration / Initialization
        const MOCK_VERSION = '3';
        let projects_data = JSON.parse(localStorage.getItem('projects_data'));
        let items_data = JSON.parse(localStorage.getItem('items_data'));
        const storedVersion = localStorage.getItem('mock_version');

        if (storedVersion !== MOCK_VERSION || !projects_data || projects_data.length === 0) {
            projects_data = [
                { id: 1, name: "Residencial Vista Verde", description: "Condomínio residencial de alto padrão com 12 unidades, área de lazer completa e fachada premium." },
                { id: 2, name: "Reforma Comercial Centro", description: "Reforma completa de loja em galeria, incluindo nova fachada, vitrines e iluminação." },
                { id: 3, name: "Galpão Logístico Norte", description: "Construção de galpão industrial de 1500m² com estrutura metálica e cobertura trapezoidal." },
                { id: 4, name: "Casa de Praia Maresias", description: "Construção de casa de veraneio com 4 suítes, piscina e área gourmet beira-mar." },
                { id: 5, name: "Reforma Escolar Municipal", description: "Renovação de escola pública: salas, pintura, mobiliário e instalação elétrica." },
                { id: 6, name: "Estaleiro Marítimo", description: "Manutenção naval e revisão de cascos para frota pesqueira regional." }
            ];

            items_data = [
                // Projeto 1 — Residencial Vista Verde
                { id: 101, projectId: 1, name: "Cimento Portland CP-II", observacoes: "200 sacos para fundação dos blocos A e B.", valor: 8400, valorPago: 4200, deadline: "2026-05-25", badge: "Material", paymentMethod: "Boleto" },
                { id: 102, projectId: 1, name: "Mão de Obra - Pedreiros", observacoes: "Pagamento mensal equipe base (8 pedreiros).", valor: 32000, valorPago: 32000, deadline: "2026-05-10", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 103, projectId: 1, name: "Aço CA-50 12mm", observacoes: "Vergalhões para estrutura de pilares.", valor: 18500, valorPago: 0, deadline: "2026-05-20", badge: "Material", paymentMethod: "Transferência" },
                { id: 104, projectId: 1, name: "Aluguel Betoneira", observacoes: "Locação mensal da betoneira de 400L.", valor: 1200, valorPago: 1200, deadline: "2026-05-05", badge: "Equipamento", paymentMethod: "Boleto" },
                { id: 105, projectId: 1, name: "Tijolos Cerâmicos", observacoes: "12 milheiros de tijolo baiano furado.", valor: 9600, valorPago: 4800, deadline: "2026-06-05", badge: "Material", paymentMethod: "Boleto" },
                { id: 106, projectId: 1, name: "Frete Areia e Brita", observacoes: "Caminhões basculantes para a obra.", valor: 2800, valorPago: 2800, deadline: "2026-04-28", badge: "Transporte", paymentMethod: "Dinheiro" },
                { id: 107, projectId: 1, name: "Marmitas da Equipe", observacoes: "60 marmitas/dia entregues no canteiro.", valor: 4500, valorPago: 2000, deadline: "2026-05-15", badge: "Alimentação", paymentMethod: "PIX" },
                { id: 108, projectId: 1, name: "Eletricista Especializado", observacoes: "Instalação predial completa fase 1.", valor: 14000, valorPago: 0, deadline: "2026-04-30", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 109, projectId: 1, name: "Tinta Acrílica Premium", observacoes: "20 latas para a fachada externa.", valor: 5200, valorPago: 5200, deadline: "2026-04-15", badge: "Material", paymentMethod: "Cartão" },
                { id: 110, projectId: 1, name: "Escavadeira Hidráulica", observacoes: "Locação por 5 dias para terraplanagem.", valor: 7800, valorPago: 7800, deadline: "2026-03-22", badge: "Equipamento", paymentMethod: "Boleto" },

                // Projeto 2 — Reforma Comercial Centro
                { id: 201, projectId: 2, name: "Vidro Temperado Fachada", observacoes: "Vidros 10mm com película de segurança.", valor: 12500, valorPago: 6000, deadline: "2026-05-30", badge: "Material", paymentMethod: "Transferência" },
                { id: 202, projectId: 2, name: "Vidraceiro - Mão de Obra", observacoes: "Instalação dos vidros da fachada.", valor: 4200, valorPago: 0, deadline: "2026-06-02", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 203, projectId: 2, name: "Letreiro Luminoso LED", observacoes: "Letreiro personalizado da marca.", valor: 6800, valorPago: 6800, deadline: "2026-04-20", badge: "Material", paymentMethod: "Cartão" },
                { id: 204, projectId: 2, name: "Piso Porcelanato 80x80", observacoes: "Atraso na entrega do fornecedor.", valor: 9400, valorPago: 4500, deadline: "2026-04-25", badge: "Material", paymentMethod: "Boleto" },
                { id: 205, projectId: 2, name: "Almoço Equipe Reforma", observacoes: "Refeições durante semana de obra.", valor: 1100, valorPago: 1100, deadline: "2026-05-08", badge: "Alimentação", paymentMethod: "Dinheiro" },
                { id: 206, projectId: 2, name: "Furadeira Industrial", observacoes: "Compra de furadeira de impacto SDS Max.", valor: 2300, valorPago: 2300, deadline: "2026-04-10", badge: "Equipamento", paymentMethod: "Cartão" },

                // Projeto 3 — Galpão Logístico Norte
                { id: 301, projectId: 3, name: "Estrutura Metálica", observacoes: "Pilares e treliças de aço pré-fabricadas.", valor: 145000, valorPago: 72500, deadline: "2026-06-20", badge: "Material", paymentMethod: "Transferência" },
                { id: 302, projectId: 3, name: "Telhas Trapezoidais", observacoes: "Cobertura completa do galpão (1500m²).", valor: 38000, valorPago: 0, deadline: "2026-05-18", badge: "Material", paymentMethod: "Boleto" },
                { id: 303, projectId: 3, name: "Concreto Usinado - Piso", observacoes: "Caminhões de concreto para piso industrial.", valor: 22000, valorPago: 22000, deadline: "2026-04-08", badge: "Material", paymentMethod: "Transferência" },
                { id: 304, projectId: 3, name: "Operadores Empilhadeira", observacoes: "Equipe operacional para montagem.", valor: 9800, valorPago: 9800, deadline: "2026-05-01", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 305, projectId: 3, name: "Caminhão Munck", observacoes: "Locação para içamento das treliças.", valor: 5400, valorPago: 0, deadline: "2026-05-22", badge: "Transporte", paymentMethod: "Boleto" },
                { id: 306, projectId: 3, name: "Soldador Especializado", observacoes: "Pagamento atrasado - aguardando NF.", valor: 11200, valorPago: 5600, deadline: "2026-05-02", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 307, projectId: 3, name: "Marmitas Operários", observacoes: "Refeições para 25 operários por 20 dias.", valor: 6800, valorPago: 6800, deadline: "2026-04-30", badge: "Alimentação", paymentMethod: "PIX" },

                // Projeto 4 — Casa de Praia Maresias
                { id: 401, projectId: 4, name: "Cimento e Areia", observacoes: "Material inicial para alicerces.", valor: 6400, valorPago: 3200, deadline: "2026-05-28", badge: "Material", paymentMethod: "PIX" },
                { id: 402, projectId: 4, name: "Pedreiro Chefe", observacoes: "Mestre de obras 1 mês.", valor: 8500, valorPago: 8500, deadline: "2026-05-12", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 403, projectId: 4, name: "Janelas Anti-Corrosão", observacoes: "10 janelas alumínio náutico.", valor: 14500, valorPago: 0, deadline: "2026-07-15", badge: "Material", paymentMethod: "Boleto" },
                { id: 404, projectId: 4, name: "Frete Litoral Norte", observacoes: "Transporte de materiais até Maresias.", valor: 3200, valorPago: 3200, deadline: "2026-04-18", badge: "Transporte", paymentMethod: "Boleto" },
                { id: 405, projectId: 4, name: "Telhas Coloniais", observacoes: "Telhado completo - 380m².", valor: 11200, valorPago: 5600, deadline: "2026-06-10", badge: "Material", paymentMethod: "Cartão" },
                { id: 406, projectId: 4, name: "Almoço Operários", observacoes: "Marmitex equipe de campo.", valor: 1800, valorPago: 1800, deadline: "2026-05-09", badge: "Alimentação", paymentMethod: "Dinheiro" },

                // Projeto 5 — Reforma Escolar Municipal
                { id: 501, projectId: 5, name: "Tinta Lousa Verde", observacoes: "Pintura das salas de aula.", valor: 2400, valorPago: 2400, deadline: "2026-04-22", badge: "Material", paymentMethod: "Transferência" },
                { id: 502, projectId: 5, name: "Carteiras Escolares Novas", observacoes: "120 carteiras + 6 mesas de professor.", valor: 28000, valorPago: 14000, deadline: "2026-06-30", badge: "Material", paymentMethod: "Boleto" },
                { id: 503, projectId: 5, name: "Mão de Obra Pintores", observacoes: "Equipe de 4 pintores - 2 semanas.", valor: 9600, valorPago: 9600, deadline: "2026-05-06", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 504, projectId: 5, name: "Material Elétrico", observacoes: "Atraso na liberação do empenho.", valor: 7800, valorPago: 0, deadline: "2026-04-15", badge: "Material", paymentMethod: "Cartão" },
                { id: 505, projectId: 5, name: "Frete Carteiras", observacoes: "Entrega do fornecedor de SP.", valor: 1900, valorPago: 1900, deadline: "2026-05-04", badge: "Transporte", paymentMethod: "Boleto" },
                { id: 506, projectId: 5, name: "Andaimes Tubulares", observacoes: "Locação para pintura das fachadas.", valor: 3600, valorPago: 1800, deadline: "2026-05-30", badge: "Equipamento", paymentMethod: "Boleto" },

                // Projeto 6 — Estaleiro Marítimo
                { id: 601, projectId: 6, name: "Lixadeira de Casco", observacoes: "Equipamento para preparo dos cascos.", valor: 3400, valorPago: 3400, deadline: "2026-03-15", badge: "Equipamento", paymentMethod: "Cartão" },
                { id: 602, projectId: 6, name: "Tinta Naval Anti-Incrustante", observacoes: "Pintura completa de 3 cascos.", valor: 8900, valorPago: 4450, deadline: "2026-05-26", badge: "Material", paymentMethod: "Transferência" },
                { id: 603, projectId: 6, name: "Mão de Obra Soldagem", observacoes: "Soldador certificado para reparos.", valor: 6200, valorPago: 0, deadline: "2026-05-19", badge: "Mão de Obra", paymentMethod: "PIX" },
                { id: 604, projectId: 6, name: "Almoço Equipe Naval", observacoes: "Refeições mensais da equipe.", valor: 2100, valorPago: 2100, deadline: "2026-04-26", badge: "Alimentação", paymentMethod: "PIX" }
            ];

            localStorage.setItem('projects_data', JSON.stringify(projects_data));
            localStorage.setItem('items_data', JSON.stringify(items_data));
            localStorage.setItem('mock_version', MOCK_VERSION);
            localStorage.removeItem('recentProjectsOrder');
        }

        // Utilities
        const formatMoney = (val) => window.Currency.formatMoney(val);
        const formatDateBR = (dateString) => {
            if(!dateString) return "N/A";
            const parts = dateString.split('-');
            if(parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0].slice(2)}`; // dd/mm/yy
            }
            return dateString;
        };

        function saveProjects() {
            localStorage.setItem('projects_data', JSON.stringify(projects_data));
            renderSidebar();
            renderCards();
        }

        function getProjectStats(projectId) {
            const pItems = items_data.filter(i => i.projectId === projectId);
            let totalValue = 0;
            let paidValue = 0;
            let closestDeadline = Infinity;
            let unpaidItemName = "Sem pendências";

            pItems.forEach(item => {
                const val = parseFloat(item.valor) || 0;
                const paid = parseFloat(item.valorPago) || 0;
                
                totalValue += val;
                paidValue += paid;

                // Any item not fully paid is considered pending/partial for deadline calculation
                if (paid < val) {
                    const itemDeadlineDate = new Date(item.deadline);
                    itemDeadlineDate.setMinutes(itemDeadlineDate.getMinutes() + itemDeadlineDate.getTimezoneOffset());
                    const itemDeadline = itemDeadlineDate.getTime();
                    
                    if (itemDeadline < closestDeadline) {
                        closestDeadline = itemDeadline;
                        unpaidItemName = formatDateBR(item.deadline);
                    }
                }
            });

            const progress = totalValue === 0 ? 0 : Math.round((paidValue / totalValue) * 100);
            const devendo = totalValue - paidValue;
            
            const isExpired = closestDeadline !== Infinity && closestDeadline < new Date().setHours(0,0,0,0);
            const isUrgent = closestDeadline !== Infinity && (closestDeadline - Date.now() < 7 * 24 * 60 * 60 * 1000);

            return {
                progress,
                totalValue,
                devendo,
                closestDeadline,
                unpaidItemName: closestDeadline === Infinity ? "N/A" : unpaidItemName,
                isUrgent: isUrgent,
                isExpired: isExpired
            };
        }

        function renderSidebar() {
            const recentOrder = JSON.parse(localStorage.getItem('recentProjectsOrder')) || [];
            
            const projectsWithStats = projects_data.map(p => ({ ...p, stats: getProjectStats(p.id) }));
            
            // Sort by recent access (most recent first), projects not in recentOrder go to the end
            projectsWithStats.sort((a, b) => {
                const aIdx = recentOrder.indexOf(a.id);
                const bIdx = recentOrder.indexOf(b.id);
                if (aIdx === -1 && bIdx === -1) return 0;
                if (aIdx === -1) return 1;
                if (bIdx === -1) return -1;
                return aIdx - bIdx;
            });
            
            // Limit to 6
            const limited = projectsWithStats.slice(0, 6);
            
            const sidebarList = document.getElementById('sidebarProjectList');
            sidebarList.innerHTML = '';
            
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            
            limited.forEach((p, index) => {
                const pItemsCount = items_data.filter(i => i.projectId === p.id).length;
                const color = colors[index % colors.length];
                const nameColor = p.stats.isExpired ? 'color: #ef4444;' : '';
                
                sidebarList.insertAdjacentHTML('beforeend', `
                    <li class="project-item" onclick="window.location.href='project.html?id=${p.id}'">
                        <div style="display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; ${nameColor}">
                            <div class="project-color" style="background-color: ${color}; flex-shrink: 0;"></div>
                            ${p.name}
                        </div>
                        <span style="font-size: 11px; display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                            <svg style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m0-16l-4 4m4-4l4 4"></path></svg>
                            ${pItemsCount}
                        </span>
                    </li>
                `);
            });
        }

        function renderCards() {
            const container = document.getElementById('cardsContainer');
            container.innerHTML = '';

            if (projects_data.length === 0) {
                container.innerHTML = `<div class="empty-state">No projects found. Click "New Project" to create one.</div>`;
                return;
            }

            const projectsWithStats = projects_data.map(p => ({ ...p, stats: getProjectStats(p.id) }));
            projectsWithStats.sort((a, b) => a.stats.closestDeadline - b.stats.closestDeadline);

            projectsWithStats.forEach(p => {
                const cardHTML = `
                    <div class="card-wrapper">
                        <!-- Botões Flutuantes Animados (Atrás do Card) -->
                        <div class="card-actions-hover">
                            <button class="action-btn-circle edit-btn" onclick="editProject(${p.id})" title="Editar Projeto">
                                <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button class="action-btn-circle delete-btn" onclick="deleteProject(${p.id})" title="Excluir Projeto">
                                <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <!-- Card Principal -->
                        <div class="card" onclick="window.location.href='project.html?id=${p.id}'">
                            <h3 class="card-title-text">${p.name}</h3>
                            <p class="card-desc-text">${p.description}</p>
                            
                            <div class="card-financials" style="background-color: transparent; padding: 0; margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px;">
                                <div style="font-size: 12px; color: #60a5fa; display: flex; align-items: center; gap: 4px;">
                                    <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l-8 8 8 8 8-8-8-8z"></path></svg>
                                    ${formatMoney(p.stats.totalValue)}
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <div class="money-balance" style="color: #ef4444; font-size: 20px;">${formatMoney(p.stats.devendo)}</div>
                                </div>
                            </div>
                            
                            <hr style="border: 0; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">
                            
                            <div class="card-deadline" style="color: ${p.stats.isExpired ? '#ef4444' : 'var(--text-secondary)'}; ${p.stats.isExpired ? 'font-weight: 600;' : ''}">
                                ${p.stats.isExpired 
                                    ? '<svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
                                    : '<svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
                                }
                                ${p.stats.isExpired ? 'Vencido:' : 'Próximo Vencimento:'} 
                                <span class="${p.stats.isUrgent && !p.stats.isExpired ? 'deadline-highlight' : ''}" style="margin-left:4px;">
                                    ${p.stats.unpaidItemName}
                                </span>
                            </div>

                            <div class="card-progress-section">
                                <div class="card-progress-header">
                                    <span>Progresso Financeiro</span>
                                    <span style="font-weight: 600;">${p.stats.progress}%</span>
                                </div>
                                <div class="card-progress-bar">
                                    <div class="card-progress-fill" style="width: ${p.stats.progress}%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        }

        // Modal Functions
        const modal = document.getElementById('newItemModal');
        const form = document.getElementById('projectForm');

        function openModal() {
            document.getElementById('modalTitle').innerText = "Create New Project";
            document.getElementById('p_id').value = "";
            modal.classList.add('active');
        }

        function closeModal() {
            modal.classList.remove('active');
            form.reset();
        }

        function editProject(id) {
            const p = projects_data.find(proj => proj.id === id);
            if (p) {
                document.getElementById('modalTitle').innerText = "Edit Project";
                document.getElementById('p_id').value = p.id;
                document.getElementById('p_name').value = p.name;
                document.getElementById('p_desc').value = p.description;
                modal.classList.add('active');
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pId = document.getElementById('p_id').value;
            
            if (pId) {
                // Edit existing
                const pIndex = projects_data.findIndex(p => p.id === parseInt(pId));
                if(pIndex > -1) {
                    projects_data[pIndex].name = document.getElementById('p_name').value;
                    projects_data[pIndex].description = document.getElementById('p_desc').value;
                }
                saveProjects();
                closeModal();
            } else {
                // Create new
                const newProject = {
                    id: Date.now(),
                    name: document.getElementById('p_name').value,
                    description: document.getElementById('p_desc').value
                };
                projects_data.push(newProject);
                saveProjects();

                // Register as most recent and redirect
                let recentOrder = JSON.parse(localStorage.getItem('recentProjectsOrder')) || [];
                recentOrder = recentOrder.filter(id => id !== newProject.id);
                recentOrder.unshift(newProject.id);
                recentOrder = recentOrder.slice(0, 6);
                localStorage.setItem('recentProjectsOrder', JSON.stringify(recentOrder));

                window.location.href = `project.html?id=${newProject.id}`;
            }
        });

        function deleteProject(id) {
            if(confirm("Deseja realmente excluir este projeto e todos os seus itens?")) {
                projects_data = projects_data.filter(p => p.id !== id);
                items_data = items_data.filter(i => i.projectId !== id);
                localStorage.setItem('items_data', JSON.stringify(items_data));
                saveProjects();
            }
        }

        // Initial Render
        renderSidebar();
        renderCards();

