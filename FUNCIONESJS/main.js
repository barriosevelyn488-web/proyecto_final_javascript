//este es el director de la orquesta

document.addEventListener('DOMContentLoaded', () => {
    const tabServicios = document.getElementById('tab-servicios');
    const tabTipos = document.getElementById('tab-tipos');
    const appContent = document.getElementById('app-content');

    // Función maestra para cambiar de "página"
    const cambiarVista = (botonActivo, tituloH1) => {
        // 1. Quitamos la clase 'active' de todos los botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 2. Se la ponemos al que clickeamos (esto activa la barra azul)
        botonActivo.classList.add('active');

        // 3. Cambiamos el contenido del contenedor principal
        appContent.innerHTML = `<h1>${tituloH1}</h1>`;
    };

    // Listeners de los clics
    tabServicios.addEventListener('click', () => {
        cambiarVista(tabServicios, "Interfaz de Servicios");
    });

    tabTipos.addEventListener('click', () => {
        cambiarVista(tabTipos, "Interfaz de Tipos");
    });

    // Carga inicial: Simula un clic en Servicios al abrir
    tabServicios.click();
});