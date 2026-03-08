/**
 * Categories View logic.
 */

window.updateCategorySelectors = function () {
    const data = window.getAppData();
    const selects = ['inc-cat', 'exp-cat', 'filter-category', 'wallet-filter-category'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentVal = select.value;
        const firstOption = select.options[0];
        select.innerHTML = '';
        if (firstOption) select.appendChild(firstOption);

        data.categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.name;
            opt.innerText = cat.name;
            select.appendChild(opt);
        });

        select.value = currentVal;
    });
};

window.renderCategories = function (data) {
    const catContainer = document.getElementById('categories-container');
    if (!catContainer) return;

    const newBtn = catContainer.lastElementChild;
    catContainer.innerHTML = '';

    data.categories.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => window.showCategoryDetail(c.name, c.emoji);
        card.style.textAlign = 'center';
        card.style.cursor = 'pointer';
        card.style.transition = 'transform 0.2s';
        card.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 8px;">${c.emoji}</div>
            <div style="font-size: 14px; font-weight: 600;">${c.name}</div>
        `;
        catContainer.appendChild(card);
    });
    catContainer.appendChild(newBtn);
};

window.showCategoryDetail = function (name, emoji = "") {
    const mainView = document.getElementById('categories-main-view');
    const detailView = document.getElementById('category-detail-view');
    const detailName = document.getElementById('detail-category-name');
    const detailEmoji = document.getElementById('detail-category-emoji');
    const detailTotal = document.getElementById('detail-category-total');
    const detailTableBody = document.querySelector('#table-category-details tbody');

    if (!mainView || !detailView || !detailTableBody) return;

    detailName.innerText = name;
    if (emoji) detailEmoji.innerText = emoji;

    detailTableBody.innerHTML = '';
    let total = 0;

    const data = window.getAppData();
    const filteredMovements = data.movements.filter(m => m.cat === name);
    [...filteredMovements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
        total += m.type === 'income' ? m.amount : -m.amount;

        const dateObj = new Date(m.date + "T00:00:00");
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options);

        const wallet = data.wallets.find(w => w.id === m.walletId);
        const walletName = wallet ? wallet.name : 'N/A';

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-color)';
        row.setAttribute('data-date', m.date);
        row.setAttribute('data-desc', m.desc.toLowerCase());
        row.setAttribute('data-wallet', m.walletId);

        row.innerHTML = `
            <td style="padding: 12px;">${formattedDate}</td>
            <td>${m.desc}</td>
            <td><span class="badge" style="background: #eef2f7; color: #475569; font-size: 10px;">${walletName}</span></td>
            <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'}; font-weight: 600;">
                ${m.type === 'income' ? '+' : '-'}$${m.amount.toLocaleString('es-CO')}
            </td>
        `;
        detailTableBody.appendChild(row);
    });

    detailTotal.innerText = `Total: $${Math.abs(total).toLocaleString('es-CO')}`;
    detailTotal.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';

    mainView.style.display = 'none';
    detailView.style.display = 'block';

    // Reset filters
    const cfDate = document.getElementById('category-filter-date');
    const cfDesc = document.getElementById('category-filter-desc');
    const cfWallet = document.getElementById('category-filter-wallet');
    if (cfDate) cfDate.value = '';
    if (cfDesc) cfDesc.value = '';
    if (cfWallet) cfWallet.value = '';

    // Sincronizar selector de billetera
    if (typeof window.updateWalletSelectors === 'function') window.updateWalletSelectors();
};

window.filterCategoryTable = function () {
    const tableBody = document.querySelector('#table-category-details tbody');
    if (!tableBody) return;

    const filterDate = document.getElementById('category-filter-date');
    const filterDesc = document.getElementById('category-filter-desc');
    const filterWallet = document.getElementById('category-filter-wallet');

    const dateVal = filterDate ? filterDate.value : '';
    const descVal = filterDesc ? filterDesc.value.toLowerCase() : '';
    const walletVal = filterWallet ? filterWallet.value : '';

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowDate = row.getAttribute('data-date') || '';
        const rowDesc = row.getAttribute('data-desc') || '';
        const rowWallet = row.getAttribute('data-wallet') || '';

        const matchDate = !dateVal || rowDate === dateVal;
        const matchDesc = !descVal || rowDesc.includes(descVal);
        const matchWallet = !walletVal || rowWallet === walletVal;

        row.style.display = (matchDate && matchDesc && matchWallet) ? '' : 'none';
    });
};

window.hideCategoryDetail = function () {
    const mainView = document.getElementById('categories-main-view');
    const detailView = document.getElementById('category-detail-view');
    if (mainView && detailView) {
        mainView.style.display = 'block';
        detailView.style.display = 'none';
    }
};

window.promptNewCategory = function () {
    const name = prompt("Nombre de la nueva categoría:");
    if (!name) return;
    const emoji = prompt(`Emoji para "${name}":`, "📁");
    if (!emoji) return;

    const data = window.getAppData();
    data.categories.push({ name, emoji });
    window.saveAppData(data);
    if (typeof window.renderAll === 'function') window.renderAll();
};
