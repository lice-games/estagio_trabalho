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

// Filter state
let activeFilters = [];
let searchQuery = '';

document.getElementById('mainProjectTitle').innerText = currentProject.name;

// Utilities
const formatMoney = (val) => "R$ " + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatDateBR = (dateString) => {
    if (!dateString) return "N/A";
    const parts = dateString.split('-');
    if (parts.length === 3) {
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
    if (status === 'Parcial') return `background-color: #161825; color: #60a5fa; border: 1px solid #60a5fa;`;
    if (status === 'Pendente') return `background-color: #161825; color: #f87171; border: 1px solid #f87171;`;
    if (status === 'Pago') return `background-color: #161825; color: #22c55e; border: 1px solid #22c55e;`;
    return `background-color: #161825; color: #fff; border: 1px solid #fff;`;
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
    if (badge === 'Material') return 'linear-gradient(90deg, #f97316 0%, #eab308 100%)';
    if (badge === 'Transporte') return 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)';
    if (badge === 'Mão de Obra') return 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)';
    if (badge === 'Alimentação') return 'linear-gradient(90deg, #a855f7 0%, #6366f1 100%)';
    if (badge === 'Equipamento') return 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)';
    return 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';
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
    let closestDeadline = Infinity;
    let closestDeadlineStr = '';

    pItems.forEach(item => {
        const val = parseFloat(item.valor) || 0;
        const paid = parseFloat(item.valorPago) || 0;
        totalValue += val;
        paidValue += paid;

        if (paid < val) {
            const d = new Date(item.deadline);
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
            const t = d.getTime();
            if (t < closestDeadline) {
                closestDeadline = t;
                closestDeadlineStr = item.deadline;
            }
        }
    });

    const progress = totalValue === 0 ? 0 : Math.round((paidValue / totalValue) * 100);
    document.getElementById('globalProgressBar').style.width = progress + '%';
    document.getElementById('globalProgressText').innerText = progress + '%';

    // Header stats panel
    const isExpired = closestDeadline !== Infinity && closestDeadline < new Date().setHours(0, 0, 0, 0);
    const deadlineDisplay = closestDeadline === Infinity ? 'N/A' : formatDateBR(closestDeadlineStr);
    const deadlineLabel = isExpired ? 'Vencido' : 'Próximo Vencimento';
    const deadlineColor = isExpired ? '#ef4444' : 'var(--text-primary)';
    const deadlineIcon = isExpired
        ? '<svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
        : '<svg style="width:14px;height:14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    document.getElementById('headerStatsPanel').innerHTML = `
        <div class="header-stat">
            <span class="header-stat-label">
                <svg style="width:14px;height:14px;" fill="none" stroke="#60a5fa" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l-8 8 8 8 8-8-8-8z"></path></svg>
                Custo Total
            </span>
            <span class="header-stat-value" style="color: #60a5fa;">${formatMoney(totalValue)}</span>
        </div>
        <div class="header-stat-divider"></div>
        <div class="header-stat">
            <span class="header-stat-label">
                <svg style="width:14px;height:14px;" fill="none" stroke="#22c55e" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Arrecadado
            </span>
            <span class="header-stat-value" style="color: #22c55e;">${formatMoney(paidValue)}</span>
        </div>
        <div class="header-stat-divider"></div>
        <div class="header-stat">
            <span class="header-stat-label" style="color: ${isExpired ? '#ef4444' : 'var(--text-muted)'};">
                ${deadlineIcon}
                ${deadlineLabel}
            </span>
            <span class="header-stat-value" style="color: ${deadlineColor}; ${isExpired ? 'font-weight:700;' : ''}">${deadlineDisplay}</span>
        </div>
    `;
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

// --- Filter Functions ---
function isItemOverdue(item) {
    const valor = parseFloat(item.valor) || 0;
    const valorPago = parseFloat(item.valorPago) || 0;
    const status = calculateStatus(valor, valorPago);
    if (status === 'Pago') return false;
    const d = new Date(item.deadline);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return d.getTime() < new Date().setHours(0, 0, 0, 0);
}

function getFilteredItems() {
    // Group filters by type: OR within same type, AND between types
    const filtersByType = {};
    activeFilters.forEach(f => {
        if (!filtersByType[f.type]) filtersByType[f.type] = [];
        filtersByType[f.type].push(f.value);
    });

    return currentItems.filter(item => {
        // Text search
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // For each filter type, item must match at least ONE value (OR)
        // Across types, ALL must pass (AND)
        for (const type in filtersByType) {
            const values = filtersByType[type];

            if (type === 'badge') {
                if (!values.includes(item.badge)) return false;
            }
            if (type === 'paymentMethod') {
                if (!values.includes(item.paymentMethod)) return false;
            }
            if (type === 'status') {
                const s = calculateStatus(parseFloat(item.valor) || 0, parseFloat(item.valorPago) || 0);
                if (!values.includes(s)) return false;
            }
            if (type === 'atrasado') {
                const overdue = isItemOverdue(item);
                const matches = values.some(v =>
                    (v === 'true' && overdue) || (v === 'false' && !overdue)
                );
                if (!matches) return false;
            }
        }

        return true;
    });
}

function addFilter(type, value) {
    const exists = activeFilters.some(f => f.type === type && f.value === value);
    if (exists) {
        removeFilter(type, value);
        return;
    }
    activeFilters.push({ type, value });
    renderFilterChips();
    updateDropdownState();
    renderCards();
}

function removeFilter(type, value) {
    activeFilters = activeFilters.filter(f => !(f.type === type && f.value === value));
    renderFilterChips();
    updateDropdownState();
    renderCards();
}

function renderFilterChips() {
    const area = document.getElementById('searchChipsArea');
    const input = document.getElementById('searchInput');
    // Remove existing chips
    area.querySelectorAll('.filter-chip').forEach(c => c.remove());
    // Create chips
    activeFilters.forEach(f => {
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.setAttribute('data-type', f.type);
        const label = f.type === 'atrasado' ? (f.value === 'true' ? 'Atrasado' : 'Em dia') : f.value;
        chip.innerHTML = `${label} <svg class="chip-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        chip.addEventListener('click', () => removeFilter(f.type, f.value));
        area.insertBefore(chip, input);
    });
    // Update placeholder
    input.placeholder = activeFilters.length > 0 ? 'Pesquisar...' : 'Pesquisar itens...';
}

function updateDropdownState() {
    document.querySelectorAll('.filter-option').forEach(btn => {
        const type = btn.getAttribute('data-type');
        const value = btn.getAttribute('data-value');
        const isActive = activeFilters.some(f => f.type === type && f.value === value);
        btn.classList.toggle('selected', isActive);
    });
    // Toggle funnel icon color
    const btn = document.getElementById('filterToggleBtn');
    btn.classList.toggle('active', activeFilters.length > 0);
}

function renderCards() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) {
        const msg = currentItems.length === 0
            ? 'Nenhum item encontrado neste projeto.'
            : 'Nenhum item encontrado com os filtros aplicados.';
        container.innerHTML = `<div class="empty-state">${msg}</div>`;
        return;
    }

    const sortedItems = [...filteredItems].sort((a, b) => {
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
        const isPastDeadline = itemDeadlineDate.getTime() < new Date().setHours(0, 0, 0, 0);
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
                            <div class="card-header" style="align-items: flex-start; margin-bottom: 8px;">
                                <div style="display:flex; flex-direction:column; gap: 4px; padding-right: 12px; overflow: hidden;">
                                    <h3 class="card-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h3>
                                    <p class="card-desc-text" style="margin: 0; color: var(--text-secondary); font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        ${item.observacoes || 'Nenhuma observação'}
                                    </p>
                                </div>
                                <span class="tag" style="${getStatusStyles(status)} flex-shrink: 0; font-size: 10px; padding: 2px 8px;">${status}</span>
                            </div>
                            
                            <div class="card-financials" style="background-color: transparent; padding: 0; margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px;">
                                <div style="font-size: 12px; color: #60a5fa; display: flex; align-items: center; gap: 4px;">
                                    <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l-8 8 8 8 8-8-8-8z"></path></svg>
                                    ${formatMoney(valor)}
                                </div>
                                <div style="display: flex; justify-content: flex-end;">
                                    <div class="money-balance" style="color: ${statusColor}; font-size: 20px;">${formatMoney(valorPago)}</div>
                                </div>
                            </div>
                            
                            <hr style="border: 0; border-bottom: 1px solid var(--border-color); margin-bottom: 16px;">

                            <div class="card-deadline" style="color: ${deadlineColor}; ${isPastDeadline && !isFullyPaid ? 'font-weight: 600;' : ''}">
                                <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Deadline: ${formatDateBR(item.deadline)}
                            </div>

                            <div style="display: flex; justify-content: flex-end; font-size: 12px; font-weight: 600; margin-bottom: 6px; margin-top: -14px;">
                                ${progressPercent}%
                            </div>
                            <div class="card-progress-bar" style="margin-bottom: 16px;">
                                <div class="card-progress-fill" style="width: ${progressPercent}%;"></div>
                            </div>

                            <div class="card-footer" style="margin-top: 4px;">
                                <div class="badge" style="background: ${getBadgeStyles(item.badge)}; color: #fff; border-radius: 12px; padding: 4px 12px; font-weight: 600; border: none;">
                                    <svg style="width: 12px; height: 12px; display: inline-block; vertical-align: middle; margin-top: -2px; margin-right: 4px;" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                    ${item.badge}
                                </div>

                                <div class="payment-method" style="color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
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
    if (item) {
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
    if (item) {
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
        if (index > -1) {
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
    if (confirm("Tem certeza que deseja excluir este item?")) {
        items_data = items_data.filter(i => i.id !== id);
        saveItems();
        renderCards();
    }
}

// --- Autocomplete Suggestions Data ---
const allSuggestions = [
    // Categoria
    { type: 'badge', value: 'Material', label: 'Categoria' },
    { type: 'badge', value: 'Transporte', label: 'Categoria' },
    { type: 'badge', value: 'Mão de Obra', label: 'Categoria' },
    { type: 'badge', value: 'Alimentação', label: 'Categoria' },
    { type: 'badge', value: 'Equipamento', label: 'Categoria' },
    // Status
    { type: 'status', value: 'Pendente', label: 'Status' },
    { type: 'status', value: 'Parcial', label: 'Status' },
    { type: 'status', value: 'Pago', label: 'Status' },
    // Pagamento
    { type: 'paymentMethod', value: 'PIX', label: 'Pagamento' },
    { type: 'paymentMethod', value: 'Dinheiro', label: 'Pagamento' },
    { type: 'paymentMethod', value: 'Cartão', label: 'Pagamento' },
    { type: 'paymentMethod', value: 'Boleto', label: 'Pagamento' },
    { type: 'paymentMethod', value: 'Transferência', label: 'Pagamento' },
    // Prazo
    { type: 'atrasado', value: 'true', label: 'Prazo', displayValue: 'Atrasado' },
    { type: 'atrasado', value: 'false', label: 'Prazo', displayValue: 'Em dia' },
];

let highlightedIndex = -1;

function getMatchingSuggestions(query) {
    const q = query.toLowerCase().trim();
    // Filter out suggestions already active
    const available = allSuggestions.filter(s =>
        !activeFilters.some(f => f.type === s.type && f.value === s.value)
    );
    if (!q) return available;
    return available.filter(s => {
        const display = s.displayValue || s.value;
        return display.toLowerCase().includes(q) || s.label.toLowerCase().includes(q);
    });
}

function renderAutocomplete(query) {
    const dropdown = document.getElementById('autocompleteDropdown');
    dropdown.innerHTML = '';
    highlightedIndex = -1;

    const matches = getMatchingSuggestions(query);
    if (matches.length === 0) {
        dropdown.classList.remove('active');
        return;
    }

    // Group by label
    const groups = {};
    matches.forEach(s => {
        if (!groups[s.label]) groups[s.label] = [];
        groups[s.label].push(s);
    });

    Object.keys(groups).forEach(label => {
        const catLabel = document.createElement('div');
        catLabel.className = 'autocomplete-category-label';
        catLabel.textContent = label;
        dropdown.appendChild(catLabel);

        groups[label].forEach(s => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.setAttribute('data-type', s.type);
            item.setAttribute('data-value', s.value);
            const display = s.displayValue || s.value;
            item.innerHTML = `
                <span class="ac-chip-preview" data-type="${s.type}">${display}</span>
                <span class="ac-label">${s.label}</span>
            `;
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent input blur
                addFilter(s.type, s.value);
                const input = document.getElementById('searchInput');
                input.value = '';
                searchQuery = '';
                renderCards();
                renderAutocomplete(''); // Re-render with remaining suggestions
            });
            dropdown.appendChild(item);
        });
    });

    dropdown.classList.add('active');
}

function hideAutocomplete() {
    const dropdown = document.getElementById('autocompleteDropdown');
    dropdown.classList.remove('active');
    highlightedIndex = -1;
}

function navigateAutocomplete(direction) {
    const dropdown = document.getElementById('autocompleteDropdown');
    const items = dropdown.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;

    // Remove current highlight
    items.forEach(i => i.classList.remove('highlighted'));

    highlightedIndex += direction;
    if (highlightedIndex < 0) highlightedIndex = items.length - 1;
    if (highlightedIndex >= items.length) highlightedIndex = 0;

    items[highlightedIndex].classList.add('highlighted');
    items[highlightedIndex].scrollIntoView({ block: 'nearest' });
}

function selectHighlighted() {
    const dropdown = document.getElementById('autocompleteDropdown');
    const items = dropdown.querySelectorAll('.autocomplete-item');
    if (highlightedIndex >= 0 && highlightedIndex < items.length) {
        const item = items[highlightedIndex];
        const type = item.getAttribute('data-type');
        const value = item.getAttribute('data-value');
        addFilter(type, value);
        const input = document.getElementById('searchInput');
        input.value = '';
        searchQuery = '';
        renderCards();
        renderAutocomplete(''); // Re-render with remaining suggestions
        return true;
    }
    return false;
}

// --- Search & Filter Event Listeners ---
(function initSearchFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterDropdown = document.getElementById('filterDropdown');

    // Text search + autocomplete
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        searchQuery = val.trim();
        renderAutocomplete(val);
        renderCards();
    });

    // Show autocomplete on focus
    searchInput.addEventListener('focus', () => {
        renderAutocomplete(searchInput.value);
    });

    // Hide autocomplete on blur (with delay for click)
    searchInput.addEventListener('blur', () => {
        setTimeout(() => hideAutocomplete(), 150);
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (!dropdown.classList.contains('active')) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateAutocomplete(1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateAutocomplete(-1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (!selectHighlighted()) {
                // If nothing was highlighted, check if input matches exactly one suggestion
                const matches = getMatchingSuggestions(searchInput.value);
                if (matches.length === 1) {
                    addFilter(matches[0].type, matches[0].value);
                    searchInput.value = '';
                    searchQuery = '';
                    renderCards();
                    hideAutocomplete();
                }
            }
        } else if (e.key === 'Escape') {
            hideAutocomplete();
        }
    });

    // Backspace on empty input removes last chip
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && searchInput.value === '' && activeFilters.length > 0) {
            const last = activeFilters[activeFilters.length - 1];
            removeFilter(last.type, last.value);
        }
    });

    // Toggle filter dropdown
    filterToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('active');
        hideAutocomplete();
    });

    // Filter option clicks (delegated)
    filterDropdown.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-option');
        if (!btn) return;
        const type = btn.getAttribute('data-type');
        const value = btn.getAttribute('data-value');
        addFilter(type, value);
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-filter-wrapper')) {
            filterDropdown.classList.remove('active');
            hideAutocomplete();
        }
    });
})();

// Initial Render
updateGlobalProgress();
renderSidebar();
renderCards();
