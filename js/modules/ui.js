/**
 * UI Sync and Authentication management.
 */

window.syncUserUI = function () {
    const user = window.storageManager && window.storageManager.getCurrentUser ? window.storageManager.getCurrentUser() : null;
    if (!user) return;

    try {
        // Headers
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.innerText = user.name || 'Usuario';

        const hAvatar = document.getElementById('header-avatar');
        if (hAvatar && user.avatar) hAvatar.style.backgroundImage = `url(${user.avatar})`;

        // Account / Profile section
        const profileNameDisp = document.getElementById('profile-name-display');
        const profileEmailDisp = document.getElementById('profile-email-display');
        const pAvatar = document.getElementById('profile-avatar');

        if (profileNameDisp) profileNameDisp.innerText = user.name || 'Usuario';
        if (profileEmailDisp) profileEmailDisp.innerText = user.email || 'correo@ejemplo.com';
        if (pAvatar && user.avatar) pAvatar.style.backgroundImage = `url(${user.avatar})`;

        const editName = document.getElementById('edit-name');
        const editEmail = document.getElementById('edit-email');
        if (editName) editName.value = user.name || '';
        if (editEmail) editEmail.value = user.email || '';

    } catch (e) {
        console.error('Error sincronizando UI de usuario:', e);
    }
};

window.handleAvatarClick = function () {
    const input = document.getElementById('avatar-input');
    if (input) input.click();
};

window.handleLogout = function (e) {
    if (e) e.preventDefault();
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        if (window.storageManager && window.storageManager.clearSession) {
            window.storageManager.clearSession();
        }
        window.location.href = 'login.html';
    }
};
