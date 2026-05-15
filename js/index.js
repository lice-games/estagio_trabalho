        // Data Migration / Initialization
        let projects_data = JSON.parse(localStorage.getItem('projects_data'));
        let items_data = JSON.parse(localStorage.getItem('items_data'));

        if (!projects_data || projects_data.length === 0) {
            projects_data = [
                { id: 1, name: "Projeto Maritmo", description: "Projeto de construção e arquitetura naval." },
                { id: 2, name: "Project Catalyst", description: "Plataforma de inovação e pesquisa." },
                { id: 3, name: "Project Zen", description: "Iniciativas de bem-estar corporativo." },
                { id: 4, name: "Quantum Spark", description: "Pesquisa em novas tecnologias quânticas." }
            ];
            localStorage.setItem('projects_data', JSON.stringify(projects_data));
        }

        // Migrate items_data to new format (valor, valorPago, paymentMethod, observacoes) if needed
        if (!items_data || items_data.length === 0 || items_data[0].budget !== undefined) {
            items_data = [
                { id: 1, projectId: 1, name: "Fundação", observacoes: "Compra de cimento e ferro", valor: 11500, valorPago: 5000, deadline: "2026-02-05", badge: "Material", paymentMethod: "Transferência" },
                { id: 2, projectId: 1, name: "Caminhão Pipa", observacoes: "Aluguel de caminhão pipa para obra", valor: 2000, valorPago: 0, deadline: "2026-02-10", badge: "Transporte", paymentMethod: "Boleto" },
                { id: 3, projectId: 1, name: "Pedreiros", observacoes: "Pagamento equipe base", valor: 8000, valorPago: 8000, deadline: "2026-02-01", badge: "Mão de Obra", paymentMethod: "PIX" }
            ];
            localStorage.setItem('items_data', JSON.stringify(items_data));
        }

        // Utilities
        const formatMoney = (val) => "R$ " + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            } else {
                // Create new
                const newProject = {
                    id: Date.now(),
                    name: document.getElementById('p_name').value,
                    description: document.getElementById('p_desc').value
                };
                projects_data.push(newProject);
            }

            saveProjects();
            closeModal();
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

