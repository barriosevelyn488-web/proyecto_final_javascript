// Exportamos la función para que otros archivos la usen
export function mostrarSeccion(id, todasLasSecciones) {
    todasLasSecciones.forEach(seccion => {
        // Si el data-seccion coincide con el ID del botón, se muestra
        const coincidencia = seccion.dataset.seccion === id;
        seccion.classList.toggle("block", coincidencia);
    });
}