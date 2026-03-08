/**
 * Dashboard View logic.
 */

window.syncGlobalBalance = function () {
    const data = window.getAppData();

    // Balance global: Total Ingresos - Total Gastos
    let totalIncomes = 0;
    let totalExpenses = 0;

    data.movements.forEach(m => {
        if (m.type === 'income') totalIncomes += m.amount;
        else totalExpenses += m.amount;
    });

    const calculatedTotal = totalIncomes - totalExpenses;

    // Actualizar UI
    const totalBalanceStat = document.getElementById('total-balance-stat');
    const totalIncomesStat = document.getElementById('stat-total-incomes');
    const totalExpensesStat = document.getElementById('stat-total-expenses');
    const dashTotalIncomes = document.getElementById('dash-total-incomes');
    const dashTotalExpenses = document.getElementById('dash-total-expenses');
    const totalBalanceChart = document.getElementById('total-balance-chart');

    if (totalBalanceStat) {
        totalBalanceStat.innerText = `$${calculatedTotal.toLocaleString('es-CO')}`;
        totalBalanceStat.style.color = calculatedTotal >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';
    }
    if (totalIncomesStat) totalIncomesStat.innerText = `+$${totalIncomes.toLocaleString('es-CO')}`;
    if (totalExpensesStat) totalExpensesStat.innerText = `-$${totalExpenses.toLocaleString('es-CO')}`;
    if (dashTotalIncomes) dashTotalIncomes.innerText = `$${totalIncomes.toLocaleString('es-CO')}`;
    if (dashTotalExpenses) dashTotalExpenses.innerText = `$${totalExpenses.toLocaleString('es-CO')}`;
    if (totalBalanceChart) totalBalanceChart.innerText = `$${calculatedTotal.toLocaleString('es-CO')}`;

    // Actualizar gráfico dinámico
    const mainChart = document.getElementById('main-dashboard-chart');
    if (mainChart) {
        const totalVolume = totalIncomes + totalExpenses;
        let incomePercentage = 50; // Default if no data

        if (totalVolume > 0) {
            incomePercentage = (totalIncomes / totalVolume) * 100;
        }

        // Aplicar gradiente (Verde para ingresos, Rojo para gastos)
        mainChart.style.background = `conic-gradient(
            var(--accent-green) 0% ${incomePercentage}%,
            var(--accent-red) ${incomePercentage}% 100%
        )`;
    }
};

window.registerMovement = function (type) {
    const dateInput = type === 'income' ? 'inc-date' : 'exp-date';
    const walletSelect = type === 'income' ? 'inc-wallet' : 'exp-wallet';
    const descInput = type === 'income' ? 'inc-desc' : 'exp-desc';
    const catSelect = type === 'income' ? 'inc-cat' : 'exp-cat';
    const amountInput = type === 'income' ? 'inc-amount' : 'exp-amount';

    const date = document.getElementById(dateInput).value;
    const walletId = document.getElementById(walletSelect).value;
    const desc = document.getElementById(descInput).value;
    const catElement = document.getElementById(catSelect);
    const cat = catElement ? catElement.value : (type === 'income' ? 'Ingreso' : '');
    const amount = parseInt(document.getElementById(amountInput).value);

    if (!date || !desc || !amount || !walletId || (type === 'expense' && !cat)) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const data = window.getAppData();
    const newMovement = {
        id: 'mov-' + Date.now(),
        date,
        walletId,
        desc,
        cat,
        amount,
        type
    };

    data.movements.push(newMovement);

    // Actualizar balance de la billetera
    const wallet = data.wallets.find(w => w.id === walletId);
    if (wallet) {
        if (type === 'income') wallet.balance += amount;
        else wallet.balance -= amount;
    }

    window.saveAppData(data);

    // Limpiar formulario
    document.getElementById(dateInput).value = '';
    document.getElementById(descInput).value = '';
    document.getElementById(amountInput).value = '';

    // Renderizado global
    if (typeof window.renderAll === 'function') window.renderAll();
    alert("Movimiento registrado con éxito.");
};
