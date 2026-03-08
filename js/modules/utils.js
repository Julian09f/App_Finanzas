/**
 * Utility functions for data management.
 */

window.getAppData = function () {
    const user = window.storageManager.getCurrentUser();
    if (!user) return { wallets: [], movements: [], categories: [] };

    const data = window.storageManager.getData(user.id);
    return data ? data : { wallets: [], movements: [], categories: [] };
};

window.saveAppData = function (data) {
    const user = window.storageManager.getCurrentUser();
    if (!user) return;
    window.storageManager.saveData(user.id, data);
};
