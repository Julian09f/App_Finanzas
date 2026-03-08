/**
 * Movements View logic.
 */

window.filterTable = function () {
    const tableBody = document.querySelector('#table-movimientos tbody');
    if (!tableBody) return;

    const filterDate = document.getElementById('filter-date');
    const filterDesc = document.getElementById('filter-desc');
    const filterCategory = document.getElementById('filter-category');
    const filterWallet = document.getElementById('filter-wallet');

    const dateVal = filterDate ? filterDate.value : '';
    const descVal = filterDesc ? filterDesc.value.toLowerCase() : '';
    const catVal = filterCategory ? filterCategory.value : '';
    const walletVal = filterWallet ? filterWallet.value : '';

    const rows = tableBody.querySelectorAll('tr');

    let totalFilteredIncomes = 0;
    let totalFilteredExpenses = 0;

    rows.forEach(row => {
        const rowDate = row.getAttribute('data-date') || '';
        const rowDesc = row.getAttribute('data-desc') || '';
        const rowWalletId = row.getAttribute('data-wallet-id') || '';
        const rowCat = row.getAttribute('data-category') || '';

        const amountText = row.cells[4] ? row.cells[4].innerText : '0';
        const amount = parseInt(amountText.replace(/[^\d]/g, '')) || 0;
        const isIncome = amountText.includes('+');

        const matchDate = !dateVal || rowDate === dateVal;
        const matchDesc = !descVal || rowDesc.includes(descVal);
        const matchCat = !catVal || rowCat === catVal;
        const matchWallet = !walletVal || rowWalletId === walletVal;

        if (matchDate && matchDesc && matchCat && matchWallet) {
            row.style.display = '';
            if (isIncome) totalFilteredIncomes += amount;
            else totalFilteredExpenses += amount;
        } else {
            row.style.display = 'none';
        }
    });

    // Actualizar tarjetas de resumen
    const movIncomes = document.getElementById('mov-total-incomes');
    const movExpenses = document.getElementById('mov-total-expenses');
    if (movIncomes) movIncomes.innerText = `+$${totalFilteredIncomes.toLocaleString('es-CO')}`;
    if (movExpenses) movExpenses.innerText = `-$${totalFilteredExpenses.toLocaleString('es-CO')}`;
};

window.renderMovements = function (data) {
    const tableBody = document.querySelector('#table-movimientos tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const sortedMovements = [...data.movements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedMovements.forEach(m => {
        const dateObj = new Date(m.date + "T00:00:00");
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options);

        const wallet = data.wallets.find(w => w.id === m.walletId);
        const walletName = wallet ? wallet.name : 'N/A';

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-color)';

        row.setAttribute('data-date', m.date);
        row.setAttribute('data-wallet-id', m.walletId);
        row.setAttribute('data-category', m.cat);
        row.setAttribute('data-desc', m.desc.toLowerCase());

        row.innerHTML = `
            <td style="padding: 12px;">${formattedDate}</td>
            <td>${m.desc}</td>
            <td><span class="badge" style="background: #eef2f7; color: #475569; font-size: 10px;">${walletName}</span></td>
            <td>${m.cat}</td>
            <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'}; font-weight: 600;">
                ${m.type === 'income' ? '+' : '-'}$${parseInt(m.amount).toLocaleString('es-CO')}
            </td>
        `;
        tableBody.appendChild(row);
    });

    window.filterTable();
};
