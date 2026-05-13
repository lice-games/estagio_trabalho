        // Data Migration / Initialization
        let projects_data = JSON.parse(localStorage.getItem('projects_data'));
        let items_data = JSON.parse(localStorage.getItem('items_data'));

        if (!projects_data || projects_data.length === 0) {
            projects_data = [
                { id: 1, name: "Projeto Maritmo", description: "Projeto de construção e arquitetura naval." }
            ];
            localStorage.setItem('projects_data', JSON.stringify(projects_data));
        }

        // Apply new schema to items
        if (!items_data || items_data.length === 0 || items_data[0].budget !== undefined) {
            items_data = [
                { id: 1, projectId: 1, name: "Fundação", observacoes: "Compra de cimento e ferro para a primeira fase.", valor: 11500, valorPago: 5000, deadline: "2026-02-05", badge: "Material", paymentMethod: "Transferência" },
                { id: 2, projectId: 1, name: "Caminhão Pipa", observacoes: "Aluguel de caminhão pipa para obra", valor: 2000, valorPago: 0, deadline: "2026-02-10", badge: "Transporte", paymentMethod: "Boleto" },
                { id: 3, projectId: 1, name: "Pedreiros", observacoes: "Pagamento equipe base", valor: 8000, valorPago: 8000, deadline: "2026-02-01", badge: "Mão de Obra", paymentMethod: "PIX" }
            ];
            localStorage.setItem('items_data', JSON.stringify(items_data));
        }

        // Routing
        const urlParams = new URLSearchParams(window.location.search);
        let currentProjectId = parseInt(urlParams.get('id'));

        if (!currentProjectId || !projects_data.find(p => p.id === currentProjectId)) {
            currentProjectId = projects_data[0].id;
        }

        const currentProject = projects_data.find(p => p.id === currentProjectId);
        let currentItems = items_data.filter(i => i.projectId === currentProjectId);

        document.getElementById('mainProjectTitle').innerText = currentProject.name;

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

        const calculateStatus = (valor, pago) => {
            if (pago === 0) return 'Pendente';
            if (pago > 0 && pago < valor) return 'Parcial';
            return 'Pago';
        };

        const getStatusStyles = (status) => {
            if (status === 'Parcial') return `background-color: var(--tag-parcial-bg); color: var(--tag-parcial-text);`;
            if (status === 'Pendente') return `background-color: var(--tag-pendente-bg); color: var(--tag-pendente-text);`;
            if (status === 'Pago') return `background-color: var(--tag-pago-bg); color: var(--tag-pago-text);`;
            return `background-color: #333; color: #fff;`;
        };

        const getPaymentMethodIcon = (method) => {
            if (method === 'PIX') return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
            if (method === 'Dinheiro') return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
            if (method === 'Cartão') return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>';
            if (method === 'Boleto') return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
            if (method === 'Transferência') return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>';
            return '<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        };

        const getPaymentBadgeStyles = (method) => {
            if (method === 'PIX') return { dot: '#10b981', color: '#10b981' };
            if (method === 'Dinheiro') return { dot: '#f59e0b', color: '#f59e0b' };
            if (method === 'Cartão') return { dot: '#3b82f6', color: '#3b82f6' };
            if (method === 'Boleto') return { dot: '#8b5cf6', color: '#8b5cf6' };
            if (method === 'Transferência') return { dot: '#ec4899', color: '#ec4899' };
            return { dot: '#fff', color: '#fff' };
        };

        const getBadgeStyles = (badge) => {
            if (badge === 'Material') return { dot: '#f59e0b', color: '#f59e0b' };
            if (badge === 'Transporte') return { dot: '#ec4899', color: '#ec4899' };
            if (badge === 'Mão de Obra') return { dot: '#22c55e', color: '#22c55e' };
            if (badge === 'Alimentação') return { dot: '#a855f7', color: '#a855f7' }; // purple
            if (badge === 'Equipamento') return { dot: '#06b6d4', color: '#06b6d4' }; // cyan
            return { dot: '#fff', color: '#fff' };
        };

        function saveItems() {
            localStorage.setItem('items_data', JSON.stringify(items_data));
            currentItems = items_data.filter(i => i.projectId === currentProjectId);
            updateGlobalProgress();
            renderSidebar();
        }

        function updateGlobalProgress() {
            const pItems = items_data.filter(i => i.projectId === currentProjectId);
            let totalValue = 0;
            let paidValue = 0;
            
            pItems.forEach(item => {
                totalValue += parseFloat(item.valor) || 0;
                paidValue += parseFloat(item.valorPago) || 0;
            });
            
            const progress = totalValue === 0 ? 0 : Math.round((paidValue / totalValue) * 100);
            document.getElementById('globalProgressBar').style.width = progress + '%';
            document.getElementById('globalProgressText').innerText = progress + '%';
        }

        function renderSidebar() {
            const projectsWithStats = projects_data.map(p => {
                const pItems = items_data.filter(i => i.projectId === p.id);
                let closestDeadline = Infinity;
                pItems.forEach(item => {
                    const status = calculateStatus(parseFloat(item.valor), parseFloat(item.valorPago));
                    if (status !== 'Pago') {
                        const dl = new Date(item.deadline).getTime();
                        if (dl < closestDeadline) closestDeadline = dl;
                    }
                });
                return { ...p, closestDeadline };
            });
            
            projectsWithStats.sort((a, b) => a.closestDeadline - b.closestDeadline);
            
            const sidebarList = document.getElementById('sidebarProjectList');
            sidebarList.innerHTML = '';
            
            const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
            
            projectsWithStats.forEach((p, index) => {
                const pItemsCount = items_data.filter(i => i.projectId === p.id).length;
                const color = colors[index % colors.length];
                const isActive = p.id === currentProjectId ? 'background-color: var(--bg-hover); color: var(--text-primary);' : '';
                
                sidebarList.insertAdjacentHTML('beforeend', `
                    <li class="project-item" style="${isActive}" onclick="window.location.href='project.html?id=${p.id}'">
                        <div style="display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px;">
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

            if (currentItems.length === 0) {
                container.innerHTML = `<div class="empty-state">Nenhum item encontrado neste projeto.</div>`;
                return;
            }

            const sortedItems = [...currentItems].sort((a, b) => {
                const aValor = parseFloat(a.valor) || 0;
                const aPago = parseFloat(a.valorPago) || 0;
                // It's considered paid if it's explicitly paid according to the calculateStatus logic
                const aStatus = calculateStatus(aValor, aPago);
                const aIsPaid = aStatus === 'Pago';

                const bValor = parseFloat(b.valor) || 0;
                const bPago = parseFloat(b.valorPago) || 0;
                const bStatus = calculateStatus(bValor, bPago);
                const bIsPaid = bStatus === 'Pago';

                // Paid items to the bottom
                if (aIsPaid && !bIsPaid) return 1;
                if (!aIsPaid && bIsPaid) return -1;

                // For the rest (or if both have same status), sort by deadline ascending (oldest first)
                const aTime = new Date(a.deadline).getTime() || 0;
                const bTime = new Date(b.deadline).getTime() || 0;
                return aTime - bTime;
            });

            sortedItems.forEach(item => {
                const badgeStyles = getBadgeStyles(item.badge);
                const valor = parseFloat(item.valor) || 0;
                const valorPago = parseFloat(item.valorPago) || 0;
                
                const status = calculateStatus(valor, valorPago);
                const progressPercent = valor === 0 ? 0 : Math.min(100, Math.round((valorPago / valor) * 100));

                const isFullyPaid = status === 'Pago';
                const statusColor = isFullyPaid ? '#22c55e' : (status === 'Parcial' ? '#60a5fa' : '#f87171');

                // Deadline check
                const itemDeadlineDate = new Date(item.deadline);
                // Adjust for local time comparison correctly without timezone shift issues
                itemDeadlineDate.setMinutes(itemDeadlineDate.getMinutes() + itemDeadlineDate.getTimezoneOffset());
                const isPastDeadline = itemDeadlineDate.getTime() < new Date().setHours(0,0,0,0);
                const deadlineColor = isPastDeadline && !isFullyPaid ? '#ef4444' : 'var(--text-secondary)';
                
                const pmStyles = getPaymentBadgeStyles(item.paymentMethod);

                const cardHTML = `
                    <div class="card-wrapper">
                        <!-- Floating Actions (Hover) -->
                        <div class="card-actions-hover">
                            <button class="action-btn-circle edit-btn" onclick="editItem(${item.id})" title="Editar Item">
                                <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button class="action-btn-circle delete-btn" onclick="deleteItem(${item.id})" title="Excluir Item">
                                <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <!-- Card View -->
                        <div class="card" onclick="viewItem(${item.id})">
                            <div class="card-header">
                                <h3 class="card-title">${item.name}</h3>
                                <span class="tag" style="${getStatusStyles(status)}">${status}</span>
                            </div>
                            
                            <div class="card-financials">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                    <div class="money-total">Custo: ${formatMoney(valor)}</div>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div class="money-total">Pago:</div>
                                    <div class="money-balance" style="color: ${statusColor}">${formatMoney(valorPago)}</div>
                                </div>
                            </div>

                            <div class="card-deadline" style="color: ${deadlineColor}; ${isPastDeadline && !isFullyPaid ? 'font-weight: 600;' : ''}">
                                <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Prazo: ${formatDateBR(item.deadline)}
                            </div>

                            <div class="card-progress-row">
                                <div class="card-progress-bar">
                                    <div class="card-progress-fill" style="width: ${progressPercent}%;"></div>
                                </div>
                                <span style="font-size: 12px; font-weight: 600;">${progressPercent}%</span>
                            </div>

                            <div class="card-footer">
                                <div class="payment-method">
                                    <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                    ${item.badge}
                                </div>

                                <div class="badge" style="color: ${pmStyles.color}">
                                    ${getPaymentMethodIcon(item.paymentMethod)}
                                    ${item.paymentMethod || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        }

        // View Modal Function
        const viewModal = document.getElementById('viewItemModal');
        
        function viewItem(id) {
            const item = currentItems.find(i => i.id === id);
            if(item) {
                document.getElementById('viewItemTitle').innerText = item.name;
                document.getElementById('viewItemObs').innerText = item.observacoes || 'Nenhuma observação informada.';
                viewModal.classList.add('active');
            }
        }

        function closeViewModal() {
            viewModal.classList.remove('active');
        }

        // Form Modal Functions
        const modal = document.getElementById('newItemModal');
        const form = document.getElementById('itemForm');

        function openModal() {
            document.getElementById('formModalTitle').innerText = "Adicionar Item";
            document.getElementById('p_id').value = "";
            document.getElementById('p_deadline').valueAsDate = new Date();
            modal.classList.add('active');
        }

        function editItem(id) {
            const item = currentItems.find(i => i.id === id);
            if(item) {
                document.getElementById('formModalTitle').innerText = "Editar Item";
                document.getElementById('p_id').value = item.id;
                document.getElementById('p_name').value = item.name;
                document.getElementById('p_valor').value = item.valor;
                document.getElementById('p_valorPago').value = item.valorPago;
                document.getElementById('p_deadline').value = item.deadline;
                document.getElementById('p_paymentMethod').value = item.paymentMethod || 'Dinheiro';
                document.getElementById('p_badge').value = item.badge;
                document.getElementById('p_observacoes').value = item.observacoes || '';
                modal.classList.add('active');
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            form.reset();
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const pId = document.getElementById('p_id').value;
            let val = parseFloat(document.getElementById('p_valor').value) || 0;
            let pago = parseFloat(document.getElementById('p_valorPago').value) || 0;

            // Cap pago at valor
            if (pago > val) pago = val;
            
            const newItemData = {
                projectId: currentProjectId,
                name: document.getElementById('p_name').value,
                valor: val,
                valorPago: pago,
                deadline: document.getElementById('p_deadline').value,
                paymentMethod: document.getElementById('p_paymentMethod').value,
                badge: document.getElementById('p_badge').value,
                observacoes: document.getElementById('p_observacoes').value
            };

            if (pId) {
                // Edit
                const index = items_data.findIndex(i => i.id === parseInt(pId));
                if(index > -1) {
                    items_data[index] = { ...items_data[index], ...newItemData };
                }
            } else {
                // Create
                newItemData.id = Date.now();
                items_data.push(newItemData);
            }

            saveItems();
            renderCards();
            closeModal();
        });

        function deleteItem(id) {
            if(confirm("Tem certeza que deseja excluir este item?")) {
                items_data = items_data.filter(i => i.id !== id);
                saveItems();
                renderCards();
            }
        }

        // Initial Render
        updateGlobalProgress();
        renderSidebar();
        renderCards();

