/**
 * Account / Profile View logic.
 */

window.savePersonalData = function () {
    const currentUser = window.storageManager.getCurrentUser();
    if (!user) return;
    const newName = document.getElementById('edit-name').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();

    if (!newName || !newEmail) {
        alert('Nombre y correo no pueden estar vacíos.');
        return;
    }

    currentUser.name = newName;
    currentUser.email = newEmail;

    const users = window.storageManager.getUsers();
    if (users && Array.isArray(users)) {
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index].name = newName;
            users[index].email = newEmail;
            window.storageManager.saveUsers(users);
        }
    }

    window.storageManager.setCurrentUser(currentUser);
    window.syncUserUI();
    alert('¡Información personal actualizada con éxito!');
};

window.updatePassword = function () {
    const pass = document.getElementById('edit-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (!pass) {
        alert('Por favor ingresa una nueva contraseña.');
        return;
    }

    if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    if (pass.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    const currentUser = window.storageManager.getCurrentUser();
    if (currentUser) {
        const users = window.storageManager.getUsers();
        if (users && Array.isArray(users)) {
            const index = users.findIndex(u => u.id === currentUser.id);
            if (index !== -1) {
                users[index].password = pass;
                window.storageManager.saveUsers(users);
                alert('¡Contraseña actualizada con éxito!');
                document.getElementById('edit-password').value = '';
                document.getElementById('confirm-password').value = '';
            }
        }
    }
};

window.deleteAccount = function () {
    const currentUser = window.storageManager.getCurrentUser();
    if (!currentUser) return;

    const confirmPass = prompt("Para eliminar tu cuenta, por favor ingresa tu contraseña actual:");
    if (!confirmPass) return;

    const users = window.storageManager.getUsers();
    if (users && Array.isArray(users)) {
        const userInDb = users.find(u => u.id === currentUser.id);

        if (!userInDb || userInDb.password !== confirmPass) {
            alert("Error: La contraseña ingresada es incorrecta.");
            return;
        }

        if (confirm(`¿Estás COMPLETAMENTE seguro, ${currentUser.name}? Todos tus datos, billeteras y movimientos se borrarán para siempre.`)) {
            window.storageManager.removeData(currentUser.id);
            const updatedUsers = users.filter(u => u.id !== currentUser.id);
            window.storageManager.saveUsers(updatedUsers);
            window.storageManager.clearSession();
            alert("Tu cuenta y todos tus datos han sido eliminados. Lamentamos verte partir.");
            window.location.href = 'login.html';
        }
    }
};
