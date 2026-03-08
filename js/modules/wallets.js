/**
 * Wallets View logic.
 */

window.updateWalletSelectors = function () {
    const data = window.getAppData();
    const selects = ['inc-wallet', 'exp-wallet', 'filter-wallet', 'category-filter-wallet'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentVal = select.value;
        const firstOption = select.options[0];
        select.innerHTML = '';
        if (firstOption) select.appendChild(firstOption);

        if (data.wallets.length === 0) {
            if (!firstOption) {
                const opt = document.createElement('option');
                opt.value = "";
                opt.innerText = "No hay billeteras";
                opt.disabled = true;
                opt.selected = true;
                select.appendChild(opt);
            }
        } else {
            data.wallets.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.id;
                opt.innerText = w.name;
                select.appendChild(opt);
            });
        }

        if (currentVal && data.wallets.find(w => w.id === currentVal)) {
            select.value = currentVal;
        } else if (firstOption && firstOption.disabled) {
            select.value = "";
        }
    });
};

window.renderWallets = function (data) {
    const walletContainer = document.getElementById('wallets-container');
    if (!walletContainer) return;

    const newBtn = walletContainer.lastElementChild;
    walletContainer.innerHTML = '';

    [...data.wallets].reverse().forEach(w => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => window.showWalletDetail(w.id, w.name);
        card.style.borderLeft = '4px solid var(--accent-blue)';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">${w.name}</h4>
                    <h2 style="font-size: 24px; margin-top: 8px;" id="${w.id}" class="wallet-value">$${w.balance.toLocaleString('es-CO')}</h2>
                </div>
                <i class="fas fa-wallet" style="color: var(--accent-blue);"></i>
            </div>
            <div class="wallet-actions">
                <button class="btn-wallet-action add" onclick="event.stopPropagation(); window.updateWalletBalance('${w.id}', 'add')">
                    <i class="fas fa-plus"></i> Ingresar
                </button>
                <button class="btn-wallet-action withdraw" onclick="event.stopPropagation(); window.updateWalletBalance('${w.id}', 'withdraw')">
                    <i class="fas fa-minus"></i> Retirar
                </button>
            </div>
        `;
        walletContainer.appendChild(card);
    });
    walletContainer.appendChild(newBtn);
};

window.showWalletDetail = function (walletId, walletName) {
    const mainView = document.getElementById('wallets-main-view');
    const detailView = document.getElementById('wallet-detail-view');
    const detailName = document.getElementById('detail-wallet-name-label');
    const detailBalance = document.getElementById('detail-wallet-balance');
    const detailTableBody = document.querySelector('#table-wallet-details tbody');

    if (!mainView || !detailView || !detailTableBody) return;

    detailName.innerText = walletName;

    const data = window.getAppData();
    const wallet = data.wallets.find(w => w.id === walletId);
    detailBalance.innerText = `$${(wallet ? wallet.balance : 0).toLocaleString('es-CO')}`;

    detailTableBody.innerHTML = '';
    let incomes = 0;
    let expenses = 0;

    const filteredMovements = data.movements.filter(m => m.walletId === walletId);
    [...filteredMovements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
        if (m.type === 'income') incomes += m.amount;
        else expenses += m.amount;

        const dateObj = new Date(m.date + "T00:00:00");
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options);

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-color)';
        row.setAttribute('data-date', m.date);
        row.setAttribute('data-category', m.cat);
        row.setAttribute('data-desc', m.desc.toLowerCase());

        row.innerHTML = `
            <td style="padding: 12px;">${formattedDate}</td>
            <td>${m.desc}</td>
            <td>${m.cat}</td>
            <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'}; font-weight: 600;">
                ${m.type === 'income' ? '+' : '-'}$${m.amount.toLocaleString('es-CO')}
            </td>
        `;
        detailTableBody.appendChild(row);
    });

    document.getElementById('detail-wallet-incomes').innerText = `+$${incomes.toLocaleString('es-CO')}`;
    document.getElementById('detail-wallet-expenses').innerText = `-$${expenses.toLocaleString('es-CO')}`;

    mainView.style.display = 'none';
    detailView.style.display = 'block';

    // Reset filters
    const wfDate = document.getElementById('wallet-filter-date');
    const wfDesc = document.getElementById('wallet-filter-desc');
    const wfCat = document.getElementById('wallet-filter-category');
    if (wfDate) wfDate.value = '';
    if (wfDesc) wfDesc.value = '';
    if (wfCat) wfCat.value = '';
};

window.hideWalletDetail = function () {
    const mainView = document.getElementById('wallets-main-view');
    const detailView = document.getElementById('wallet-detail-view');
    if (mainView && detailView) {
        mainView.style.display = 'block';
        detailView.style.display = 'none';
    }
};

window.promptNewWallet = function () {
    const name = prompt("Nombre de la nueva billetera:");
    if (!name) return;
    const initialBalance = parseInt(prompt("Saldo inicial:", "0")) || 0;

    const data = window.getAppData();
    const id = 'wallet-' + Date.now();
    data.wallets.push({ id, name, balance: initialBalance });

    // Si hay saldo inicial, registrar como ingreso
    if (initialBalance > 0) {
        data.movements.push({
            id: 'mov-' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            walletId: id,
            desc: 'Saldo inicial',
            cat: 'Otros',
            amount: initialBalance,
            type: 'income'
        });
    }

    window.saveAppData(data);
    if (typeof window.renderAll === 'function') window.renderAll();
};

window.filterWalletTable = function () {
    const tableBody = document.querySelector('#table-wallet-details tbody');
    if (!tableBody) return;

    const filterDate = document.getElementById('wallet-filter-date');
    const filterDesc = document.getElementById('wallet-filter-desc');
    const filterCategory = document.getElementById('wallet-filter-category');

    const dateVal = filterDate ? filterDate.value : '';
    const descVal = filterDesc ? filterDesc.value.toLowerCase() : '';
    const catVal = filterCategory ? filterCategory.value : '';

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowDate = row.getAttribute('data-date') || '';
        const rowDesc = row.getAttribute('data-desc') || '';
        const rowCat = row.getAttribute('data-category') || '';

        const matchDate = !dateVal || rowDate === dateVal;
        const matchDesc = !descVal || rowDesc.includes(descVal);
        const matchCat = !catVal || rowCat === catVal;

        row.style.display = (matchDate && matchDesc && matchCat) ? '' : 'none';
    });
};

window.updateWalletBalance = function (walletId, action) {
    const amount = parseInt(prompt(`Monto a ${action === 'add' ? 'ingresar' : 'retirar'}:`));
    if (isNaN(amount) || amount <= 0) return;

    const data = window.getAppData();
    const wallet = data.wallets.find(w => w.id === walletId);
    if (!wallet) return;

    const type = action === 'add' ? 'income' : 'expense';

    data.movements.push({
        id: 'mov-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        walletId: walletId,
        desc: action === 'add' ? 'Ingreso directo' : 'Retiro directo',
        cat: 'Otros',
        amount: amount,
        type: type
    });

    if (type === 'income') wallet.balance += amount;
    else wallet.balance -= amount;

    window.saveAppData(data);
    if (typeof window.renderAll === 'function') window.renderAll();
};
