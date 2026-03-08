/* ==================== */
/* FUNCIONALIDAD MÓVIL */
/* ==================== */

document.addEventListener('DOMContentLoaded', function () {
    const btnMenuToggle = document.getElementById('btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Abrir/Cerrar sidebar al hacer clic en el botón menú
    if (btnMenuToggle) {
        btnMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Cerrar sidebar al hacer clic en un enlace del menú
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            setTimeout(() => {
                closeSidebar();
            }, 100);
        });
    });

    // Cerrar sidebar al hacer clic en el overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Cerrar sidebar al redimensionar la ventana
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    function toggleSidebar() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    }

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'block';
            sidebarOverlay.style.background = 'rgba(0, 0, 0, 0.75)';
            sidebarOverlay.style.opacity = '1';
            sidebarOverlay.style.pointerEvents = 'auto';
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.opacity = '0';
            sidebarOverlay.style.pointerEvents = 'none';
            sidebarOverlay.style.background = 'transparent';
            setTimeout(() => { sidebarOverlay.style.display = 'none'; }, 300);
        }
    }
});
