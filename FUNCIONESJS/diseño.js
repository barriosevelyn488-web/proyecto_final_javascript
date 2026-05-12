//diseño abrir , cerrar, eventos, funciones, limpiar cuadros de texto
/* ==========================================================================
LÓGICA CENTRAL DE NAVEGACIÓN - CAMPUS PARKING
   ========================================================================== */

// 1. Diccionario de contenidos (Aquí guardamos el HTML de cada sección)
const vistas = {
    servicios: `
        <section class="vista-servicios">
            <h2>Panel de Servicios</h2>
            <p>Aquí verás el mapa de las celdas del parqueo...</p>
            </section>
    `,
    tipos: `
        <section class="vista-tipos">
            <h2>Gestión de Tipos de Vehículos</h2>
            <div class="header-seccion">
                <button class="btn-primario">+ Agregar Nuevo Tipo</button>
            </div>
            <div class="grid-tarifas">
                <p>Aquí irán tus tarjetas de precios (Motocicleta, Sedán, etc.)</p>
            </div>
        </section>
    `
};

// 2. Selección de elementos del DOM
const tabServicios = document.getElementById('tab-servicios');
const tabTipos = document.getElementById('tab-tipos');
const appContent = document.getElementById('app-content');

/**
 * Función para renderizar el contenido y mover la "barrita" activa
 * @param {string} nombreVista - El nombre de la vista en el objeto 'vistas'
 * @param {HTMLElement} botonPresionado - El botón que recibió el click
 */
function renderizarVista(nombreVista, botonPresionado) {
    // A. Manejo de la barrita azul (Clase .active)
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    botonPresionado.classList.add('active');

    // B. Inyección de HTML en el contenedor principal
    appContent.innerHTML = vistas[nombreVista];
}

// 3. Listeners (Escuchadores de eventos)
tabServicios.addEventListener('click', () => {
    renderizarVista('servicios', tabServicios);
});

tabTipos.addEventListener('click', () => {
    renderizarVista('tipos', tabTipos);
});

// 4. Carga inicial (Para que al abrir la página no esté vacía)
document.addEventListener('DOMContentLoaded', () => {
    renderizarVista('servicios', tabServicios);
});