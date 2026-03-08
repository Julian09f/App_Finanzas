# 💰 App Finanzas — Personal Finance Manager

> Aplicación web de gestión de finanzas personales construida con JavaScript ES6+ modular, diseño responsivo y arquitectura orientada a patrones de diseño profesionales.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Tech](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript%20ES6%2B-blue)
![Storage](https://img.shields.io/badge/storage-LocalStorage-orange)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

---

## 📋 Descripción

**App Finanzas** es una aplicación web de página única (SPA-like) que permite a los usuarios gestionar sus finanzas personales de forma intuitiva. Los usuarios pueden registrarse, iniciar sesión y administrar su dinero a través de categorías, carteras, movimientos y un dashboard de resumen visual.

Desarrollada con un enfoque en **arquitectura modular** y **separación de responsabilidades**, cada capa del sistema tiene un propósito claro, facilitando el mantenimiento, la escalabilidad y la extensión del proyecto.

---

## ✨ Características Principales

| Función | Descripción |
|---|---|
| 🔐 **Autenticación** | Registro e inicio de sesión con validación de datos |
| 📊 **Dashboard** | Vista general del estado financiero con gráficos |
| 📂 **Categorías** | CRUD completo de categorías de ingresos y gastos |
| 👛 **Carteras** | Gestión de múltiples billeteras o cuentas |
| 🔄 **Movimientos** | Registro y seguimiento de transacciones |
| 👤 **Cuenta** | Perfil del usuario y configuración personal |
| 📱 **Responsive** | Diseño adaptado a móviles, tablets y escritorio |

---

## 🏗️ Arquitectura del Sistema

El proyecto aplica principios SOLID y patrones de diseño clásicos para lograr una base de código profesional y extensible.

### Patrones de Diseño Aplicados

```
┌────────────────────────────────────────────┐
│              CAPAS DE LA APLICACIÓN        │
├────────────────┬───────────────────────────┤
│  Presentación  │  HTML Components + CSS     │
├────────────────┼───────────────────────────┤
│  Controladores │  UIController + Modules    │
├────────────────┼───────────────────────────┤
│  Lógica        │  Managers (Auth, Category) │
├────────────────┼───────────────────────────┤
│  Persistencia  │  StorageManager + Adapters │
└────────────────┴───────────────────────────┘
```

| Patrón | Implementación |
|---|---|
| **Strategy** | `IAuthStrategy` → `EmailPasswordAuth` permite intercambiar estrategias de autenticación |
| **Adapter** | `IStorage` → `LocalStorageAdapter` abstrae el motor de persistencia |
| **Facade** | `AuthManager` y `StorageManager` exponen APIs simplificadas |
| **SRP (Single Responsibility)** | Cada módulo/clase tiene una única razón para cambiar |
| **Dependency Injection** | Managers reciben sus dependencias por constructor |

### Flujo de Autenticación

```
Usuario → login.html → AuthManager → EmailPasswordAuth
                                           ↓
                                    StorageManager
                                           ↓
                                   LocalStorageAdapter
                                           ↓
                              ✅ Sesión iniciada → Dashboard
```

### Flujo de Datos (Categorías / Movimientos)

```
UI (components/*.html) → Module JS → Manager → StorageManager → LocalStorage
                              ↑
                         UIController (renderiza cambios)
```

---

## 📂 Estructura del Proyecto

```
App_Finanzas/
│
├── index.html                    # Punto de entrada principal (login/register)
├── login.html                    # Página de inicio de sesión alternativa
│
├── components/                   # Vistas HTML por módulo
│   ├── dashboard.html            # Panel de resumen financiero
│   ├── categories.html           # Gestión de categorías
│   ├── wallets.html              # Gestión de carteras/cuentas
│   ├── movements.html            # Registro de movimientos
│   └── account.html              # Perfil y configuración de cuenta
│
├── css/                          # Estilos organizados por responsabilidad
│   ├── variables.css             # Tokens de diseño: colores, tipografía, espaciado
│   ├── typography.css            # Estilos tipográficos globales
│   ├── components.css            # Estilos de componentes reutilizables
│   ├── dashboard.css             # Estilos específicos del dashboard
│   ├── login.css                 # Estilos de la pantalla de login
│   ├── responsive.css            # Media queries y diseño adaptativo
│   └── styles.css                # Hoja raíz que importa todo el sistema CSS
│
└── js/                           # Lógica de la aplicación
    │
    ├── app.js                    # Bootstrap: inicializa managers y la app
    ├── main.js                   # Punto de entrada principal de JS
    ├── mobile.js                 # Lógica específica para dispositivos móviles
    │
    ├── interfaces/               # Contratos / Interfaces base
    │   ├── IAuthStrategy.js      # Define el contrato de autenticación
    │   └── IStorage.js           # Define el contrato de almacenamiento
    │
    ├── auth/                     # Estrategias de autenticación
    │   └── EmailPasswordAuth.js  # Implementación email + contraseña
    │
    ├── storage/                  # Adaptadores de persistencia
    │   └── LocalStorageAdapter.js# Implementación sobre localStorage
    │
    ├── managers/                 # Capa de lógica de negocio (Facades)
    │   ├── AuthManager.js        # Orquesta autenticación y sesión activa
    │   ├── StorageManager.js     # Abstracción centralizada de almacenamiento
    │   └── CategoryManager.js    # CRUD y lógica de categorías
    │
    ├── controllers/              # Controladores de UI
    │   └── UIController.js       # Renderizado y manipulación del DOM
    │
    └── modules/                  # Módulos por vista/funcionalidad
        ├── dashboard.js          # Lógica del panel principal
        ├── categories.js         # Lógica de categorías (listado, filtros, CRUD)
        ├── wallets.js            # Lógica de carteras
        ├── movements.js          # Lógica de movimientos/transacciones
        ├── account.js            # Lógica del perfil de usuario
        ├── ui.js                 # Helpers de UI compartidos
        └── utils.js              # Utilidades generales (formateo, validación)
```

---

## 🎨 Diseño y Sistema Visual

El diseño sigue un enfoque **dark mode premium** con tokens CSS centralizados para consistencia.

### Sistema de Diseño

| Token | Descripción |
|---|---|
| `--color-primary` | Color de acento principal (paleta violeta/índigo) |
| `--color-bg` | Fondo oscuro principal del panel |
| `--color-surface` | Superficies de tarjetas y modales |
| `--color-text` | Jerarquía tipográfica de 3 niveles |
| `--border-radius` | Sistema de redondeo unificado |
| `--shadow-*` | Niveles de sombra para profundidad |

### Responsividad

El sistema usa **breakpoints móviles primero**:

```
Mobile   → < 768px   → Sidebar oculto, menú hamburguesa
Tablet   → 768–1024px → Sidebar colapsable
Desktop  → > 1024px  → Sidebar fijo, layout de dos columnas
```

- Menú móvil con overlay y animación de entrada
- Tablas y tarjetas apilables en pantallas pequeñas
- Touch-friendly: tamaños de tap target ≥ 44px

---

## 🚀 Cómo Ejecutar

Este es un proyecto de **frontend puro** sin necesidad de servidor ni dependencias npm.

### Opción 1 — Abrir directamente

```bash
# Simplemente abre index.html en tu navegador
start index.html   # Windows
open index.html    # macOS
```

### Opción 2 — Servidor local (recomendado para módulos ES6)

```bash
# Con Python
python -m http.server 8080

# Con Node.js (npx)
npx serve .

# Con VS Code: instala la extensión "Live Server" y haz clic en "Go Live"
```

Luego visita: `http://localhost:8080`

---

## 📖 Guía de Uso

### 1. Registro de Usuario

Al abrir la aplicación por primera vez, crea una cuenta con:
- Nombre completo
- Email único
- Contraseña (mínimo 6 caracteres)

### 2. Dashboard

Visualiza un resumen de tu situación financiera: balance total, ingresos, gastos y evolución reciente.

### 3. Categorías

Agrupa tus finanzas por categoría (ej: Alimentación, Transporte, Entretenimiento). Soporta tipo **Ingreso** y **Gasto**.

### 4. Carteras

Gestiona distintas cuentas o bolsillos de dinero (ej: Efectivo, Cuenta Bancaria, Ahorros).

### 5. Movimientos

Registra cada transacción indicando monto, tipo, categoría y fecha.

---

## 🔐 Seguridad

- Validación de email con expresión regular
- Contraseña mínima de 6 caracteres
- Verificación de duplicados al registrar
- Datos aislados por usuario (`userId` como clave en storage)

> ⚠️ **Nota**: Esta versión usa `localStorage` para persistencia. Para producción se recomienda integrar un backend con hashing de contraseñas (bcrypt), JWT y HTTPS.

---

## 🔄 Extensibilidad

### Agregar nueva estrategia de autenticación

```javascript
import { IAuthStrategy } from './interfaces/IAuthStrategy.js';

export class GoogleAuth extends IAuthStrategy {
    async authenticate(credentials) { /* OAuth flow */ }
    async register(userData)        { /* ... */ }
    validateCredentials(credentials){ /* ... */ }
    getStrategyName()               { return 'google-auth'; }
}

// Activar la nueva estrategia sin cambiar el resto del código:
authManager.setStrategy(new GoogleAuth(storageManager));
```

### Cambiar motor de persistencia

```javascript
import { IndexedDBAdapter } from './storage/IndexedDBAdapter.js';

const storageManager = new StorageManager(new IndexedDBAdapter('finanzas'));
// ✅ Todo el sistema sigue funcionando sin cambios adicionales
```

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica y componentes de vista |
| **CSS3 Custom Properties** | Sistema de diseño con tokens y variables |
| **JavaScript ES6+** | Módulos, clases, async/await, destructuring |
| **LocalStorage API** | Persistencia de datos del lado del cliente |
| **DOM API** | Manipulación dinámica de la interfaz |

---

## 👨‍💻 Autor

Proyecto académico/personal de gestión financiera con arquitectura profesional.

---

> _"La mejor arquitectura es la que hace que el código sea fácil de entender, cambiar y extender."_
