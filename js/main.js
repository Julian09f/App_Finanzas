/**
 * Main application controller for the modular architecture.
 * Handles view routing and component loading.
 */

const componentsPath = './components/';
const views = {
    dashboard: { html: 'dashboard.html', title: 'Dashboard' },
    movimientos: { html: 'movements.html', title: 'Movimientos' },
    billeteras: { html: 'wallets.html', title: 'Billeteras' },
    categorias: { html: 'categories.html', title: 'Categorías' },
    micuenta: { html: 'account.html', title: 'Mi cuenta' }
};

let currentView = 'dashboard';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Main.js: DOMContentLoaded detectado');
    initNavigation();
    loadView('dashboard');
});

console.log('Main.js: Módulo cargado');

// Check if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Main.js: DOM ya estaba listo, forzando inicialización');
    initNavigation();
    loadView('dashboard');
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[id^="nav-"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.id.replace('nav-', '');
            if (views[viewId]) {
                loadView(viewId);

                // Active class management
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Mobile sidebar close (delegado a clases CSS)
                if (window.innerWidth <= 768) {
                    const sidebar = document.querySelector('.sidebar');
                    const overlay = document.getElementById('sidebar-overlay');
                    if (sidebar) sidebar.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                }
            }
        });
    });
}

async function loadView(viewId) {
    console.log(`Main.js: Intentando cargar vista: ${viewId}`);
    const container = document.getElementById('view-container');
    const viewTitle = document.getElementById('view-title');

    if (!container) return;

    // Show spinner
    container.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 300px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 32px; color: var(--accent-blue);"></i>
        </div>
    `;

    try {
        const response = await fetch(`${componentsPath}${views[viewId].html}`);
        const html = await response.text();

        container.innerHTML = html;
        if (viewTitle) viewTitle.innerText = views[viewId].title;

        currentView = viewId;

        // Initialize the logic for the specific view
        initViewLogic(viewId);

    } catch (error) {
        console.error('Error loading view:', error);
        container.innerHTML = `<div class="card">Error al cargar la sección: ${error.message}</div>`;
    }
}

/**
 * Orchestrates rendering of the entire application.
 * Calls specific renderers based on the current view.
 */
window.renderAll = function () {
    console.log('Orquestando renderización global...');
    const data = window.getAppData();

    // 1. UI Base (Siempre sincronizar)
    if (typeof window.syncUserUI === 'function') window.syncUserUI();
    if (typeof window.syncGlobalBalance === 'function') window.syncGlobalBalance();
    if (typeof window.updateCategorySelectors === 'function') window.updateCategorySelectors();
    if (typeof window.updateWalletSelectors === 'function') window.updateWalletSelectors();

    // 2. Renderizado específico de la vista
    switch (currentView) {
        case 'dashboard':
            // El dashboard se actualiza principalmente con syncGlobalBalance
            break;
        case 'movimientos':
            if (typeof window.renderMovements === 'function') window.renderMovements(data);
            break;
        case 'billeteras':
            if (typeof window.renderWallets === 'function') window.renderWallets(data);
            break;
        case 'categorias':
            if (typeof window.renderCategories === 'function') window.renderCategories(data);
            break;
    }
};

function initViewLogic(viewId) {
    console.log(`Inicializando lógica para: ${viewId}`);

    // Attach event listeners for the newly injected HTML
    switch (viewId) {
        case 'dashboard':
            attachDashboardListeners();
            break;
        case 'movimientos':
            attachMovementsListeners();
            break;
        case 'billeteras':
            attachWalletsListeners();
            break;
        case 'categorias':
            attachCategoriesListeners();
            break;
        case 'micuenta':
            // Handled in account.js
            break;
    }

    // Perform initial render for the view
    window.renderAll();
}

function attachDashboardListeners() {
    const btnRegIncome = document.getElementById('btn-reg-income');
    const btnRegExpense = document.getElementById('btn-reg-expense');
    if (btnRegIncome) btnRegIncome.onclick = () => window.registerMovement('income');
    if (btnRegExpense) btnRegExpense.onclick = () => window.registerMovement('expense');
}

function attachMovementsListeners() {
    const fDate = document.getElementById('filter-date');
    const fDesc = document.getElementById('filter-desc');
    const fCat = document.getElementById('filter-category');
    const fWallet = document.getElementById('filter-wallet');
    const cBtn = document.getElementById('clear-filters');

    if (fDate) fDate.oninput = () => window.filterTable();
    if (fDesc) fDesc.oninput = () => window.filterTable();
    if (fCat) fCat.onchange = () => window.filterTable();
    if (fWallet) fWallet.onchange = () => window.filterTable();

    if (cBtn) {
        cBtn.onclick = () => {
            if (fDate) fDate.value = '';
            if (fDesc) fDesc.value = '';
            if (fCat) fCat.value = '';
            if (fWallet) fWallet.value = '';
            window.filterTable();
        };
    }
}

function attachWalletsListeners() {
    const fDate = document.getElementById('wallet-filter-date');
    const fDesc = document.getElementById('wallet-filter-desc');
    const fCat = document.getElementById('wallet-filter-category');
    const cBtn = document.getElementById('wallet-clear-filters');

    if (fDate) fDate.oninput = () => window.filterWalletTable();
    if (fDesc) fDesc.oninput = () => window.filterWalletTable();
    if (fCat) fCat.onchange = () => window.filterWalletTable();

    if (cBtn) {
        cBtn.onclick = () => {
            if (fDate) fDate.value = '';
            if (fDesc) fDesc.value = '';
            if (fCat) fCat.value = '';
            window.filterWalletTable();
        };
    }
}

function attachCategoriesListeners() {
    const fDate = document.getElementById('category-filter-date');
    const fDesc = document.getElementById('category-filter-desc');
    const fWallet = document.getElementById('category-filter-wallet');
    const cBtn = document.getElementById('category-clear-filters');

    if (fDate) fDate.oninput = () => window.filterCategoryTable();
    if (fDesc) fDesc.oninput = () => window.filterCategoryTable();
    if (fWallet) fWallet.onchange = () => window.filterCategoryTable();

    if (cBtn) {
        cBtn.onclick = () => {
            if (fDate) fDate.value = '';
            if (fDesc) fDesc.value = '';
            if (fWallet) fWallet.value = '';
            window.filterCategoryTable();
        };
    }
}

// Export for global access
window.loadView = loadView;
