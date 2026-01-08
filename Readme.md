# PachangApp - Gestión de Partidos de Fútbol Amateur

Bienvenido a **PachangApp**, una aplicación web diseñada para facilitar la organización y reserva de partidos de fútbol (sala, 7 y 11). Este proyecto conecta a jugadores con campos disponibles, ofreciendo una gestión sencilla de reservas y perfiles de usuario.

## 🏗️ Arquitectura del Proyecto

El proyecto está construido utilizando tecnologías web estándar, enfocándose en un diseño modular y limpio:

*   **HTML5 (`index.html`, `login.html`)**: Estructura semántica de la aplicación.
*   **CSS3 (`CSS/styleIndex.css`)**: Diseño responsivo, moderno y animado. Uso de Flexbox y Grid.
*   **JavaScript (ES6+)**: Lógica de cliente modularizada.
    *   `js/main.js`: Controlador principal de la aplicación (vistas, eventos, interacción con API).
    *   `js/carrito.js`: Clase dedicada a la lógica del carrito de compras (uso de `localStorage`).
*   **Backend Simulado**: `json-server` sirve los datos desde `db.json`, actuando como una API REST completa para usuarios y campos.
*   **Librerías Externas**:
    *   **Font Awesome**: Para iconos vectoriales.
    *   **Toastify JS**: Para notificaciones no intrusivas.
    *   **EmailJS**: Para simular envío de correos (confirmaciones).

## 🚀 Instalación y Ejecución

Para ejecutar este proyecto en local, sigue estos pasos:

1.  **Prerrequisitos**: Asegúrate de tener **Node.js** instalado.
2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```
3.  **Iniciar Servidor de Datos**:
    El proyecto requiere que `json-server` esté corriendo en el puerto 3008.
    ```bash
    npm run server
    ```
    *(Si no funciona el script, usa: `npx json-server db.json --port 3008`)*
4.  **Abrir Aplicación**:
    Simplemente abre el archivo `index.html` en tu navegador o usa una extensión como "Live Server".

## 📂 Estructura del Proyecto

```text
Proyecto Navidad/
├── .git/
├── CSS/
│   └── styleIndex.css       # Estilos principales y animaciones
├── images/                  # Activos gráficos (imágenes de campos, iconos)
├── js/
│   ├── carrito.js           # Clase Carrito (Lógica de negocio)
│   └── main.js              # Script principal (Controlador de UI)
├── node_modules/
├── db.json                  # Base de datos (Usuarios, Campos)
├── index.html               # Página principal (SPA simulada)
├── login.html               # Página de inicio de sesión
├── package.json             # Configuración de NPM y Scripts
└── Readme.md                # Documentación
```

## 🌐 URL de Despliegue

El proyecto estará disponible en la siguiente dirección:

> **[ INSERTA TU URL AQUÍ ]**

---

# 📖 Guía de Referencia Rápida (Código)

Esta sección está diseñada para desarrolladores. Aquí encontrarás la ubicación y propósito de las funciones y estilos principales para facilitar el mantenimiento sin tener que buscar por todo el archivo.

### 📜 `js/main.js` (Controlador Principal)

Ubicación de variables globales, lógica de vistas y llamadas a la API.

*   **(Líneas 1-15)**: **Imports y Variables Globales** (`todosLosCampos`, `paginaActual`, `miCarrito`, etc.).
*   `compruebaUsuario()`: Verifica si hay sesión iniciada (`sessionStorage`).
*   `cargarCampos(pagina)`: Fetch a la API (`/campos`) con paginación y ordenamiento.
*   `handleScroll()`: Detecta el final de página para el Scroll Infinito.
*   `activarScrollInfinito()`: Listener para el evento scroll.
*   `creaCard(campo)`: Genera el DOM de una tarjeta de producto individual + lógica de botones (Alquilar/Detalles).
*   `creaCards(campos)`: Itera y renderiza múltiples tarjetas en el contenedor.
*   `cargarPerfil()`: Renderiza la vista de Perfil de usuario (datos + estadísticas).
*   `limpiarPantalla()`: **Función Crítica**. Elimina todos los contenedores de vista para evitar solapamientos (`.remove()`).
*   `cardPerfil()`: Genera el DOM específico de la tarjeta de perfil.
*   `mostrarCarrito()`: Genera la vista de tabla/lista del carrito de compras.
*   `mostrarSobreNosotros()`: Genera la vista de Misión + Galería de imágenes.
*   `filtroCategoria() / cargarCamposFiltrados()`: Lógica para el filtrado por tipo de deporte.
*   `main()`: Función de inicialización (comprueba usuario, carga eventos, carga inicial).

### 🛒 `js/carrito.js` (Clase Carrito)

Lógica encapsulada para la gestión del estado del carrito.

*   `constructor()`: Inicializa el carrito recuperando datos de `localStorage`.
*   `add(elemento)`: Añade un producto o incrementa cantidad. Guarda en storage.
*   `guardarCarrito()`: Persistencia en `localStorage`.
*   `contarArticulos()`: Devuelve el número total de ítems.
*   `calcularTotal()`: Devuelve el coste total.
*   `eliminar(elemento)`: Borra completamente un ítem dado su ID.
*   `restar(elemento)`: Decrementa cantidad (borra si llega a 0).
*   `sumar(elemento)`: Incrementa cantidad.
*   `dibujarCarrito()`: **Renderizado**. Genera el HTML de la tabla del carrito, asigna eventos a botones (+, -, eliminar, vaciar, finalizar) y actualiza el DOM.

### 🎨 `CSS/styleIndex.css` (Estilos)

Mapa de las secciones de estilo para navegación rápida.

1.  **Variables Globales (:root)**: Colores corporativos (`--color-principal`) y fuentes.
2.  **Container General**: Layout flexbox/grid del contenedor principal.
3.  **CardCampo**: Estilos de las tarjetas de producto (sombras, bordes, hover).
4.  **NAV**: Estilos de la barra de navegación (sticky, blur, flexbox).
5.  **SECCION 1 (Hero)**: Logica del banner principal (Flexbox/Positioning para texto sobre imagen).
6.  **PERFIL DE USUARIO**: Estilos para la tarjeta de perfil (layout horizontal/vertical).
7.  **CARRITO**: Estilos de la tabla de compra y botones de acción.
8.  **SOBRE NOSOTROS**: Estilos para la sección de misión y grid de imágenes.
9.  **ANIMACIONES**: Keyframes (`fadeIn`, `slideInLeft`, `slideInRight`, `fadeInHero`, `pulse`).
10. **RESPONSIVE**:
    *   **Tablet (769px - 1024px)**: Ajustes de grid (2 columnas) y tamaño de fuentes.
    *   **Móvil (< 768px)**: Ajustes a columna única, menús apilados, y reset de paddings.




    por hacer:
    que sume cuando creas un usuario el id mas alto
    echar un ojo al captcha
    mirar que al clickar en registrarse se gire la tarjeta.
