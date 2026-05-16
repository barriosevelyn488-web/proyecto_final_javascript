

// ==========================================
// DISEÑO.JS - INTEGRACIÓN CON DIALOG
// ==========================================

export const alternarFormularioTipo = (mostrar) => {
    const modal = document.getElementById('modal-nuevo-tipo');

    if (!modal) return;

    if (mostrar) {
        modal.showModal(); // Método nativo de HTML para abrir centrado
    } else {
        modal.close(); // Método nativo de HTML para cerrar
        const formulario = document.getElementById('formulario-nuevo-tipo');
        if (formulario) formulario.reset(); // Limpia inputs
    }
};

// Dibujar las tarjetas basadas en tu diseño premium
export const renderizarTipos = (tiposList) => {
    const pantallaVacia = document.querySelector('.pantalla-vacia');
    let contenedorTarjetas = document.getElementById('contenedor-tarjetas-tipos');

    // Si no existe el contenedor de tarjetas en tu HTML, lo creamos dinámicamente debajo del header
    if (!contenedorTarjetas) {
        contenedorTarjetas = document.createElement('div');
        contenedorTarjetas.id = 'contenedor-tarjetas-tipos';
        contenedorTarjetas.className = 'grid-tipos'; // Clase para responsive CSS
        document.querySelector('.contenedor-vista').appendChild(contenedorTarjetas);
    }

    // Caso 1: No hay datos registrados
    if (tiposList.length === 0) {
        if (pantallaVacia) pantallaVacia.style.display = 'flex';
        contenedorTarjetas.innerHTML = '';
        contenedorTarjetas.style.display = 'none';
        return;
    }

    // Caso 2: Sí hay datos, ocultamos la pantalla vacía y mostramos tarjetas
    if (pantallaVacia) pantallaVacia.style.display = 'none';
    contenedorTarjetas.style.display = 'grid';

    // Construimos las tarjetas 
    contenedorTarjetas.innerHTML = tiposList.map(tipo => `
        <div class="tarjeta-vehiculo" data-codigo="${tipo.codigo}">
            <div class="tarjeta-header">
                <div class="icono-carro-tarjeta">
                    <img src="/IMG/1.carrito.jpg" alt="Carro" style="width: 30px; opacity: 0.7;">
                </div>
                <div class="tarjeta-info-principal">
                    <h3>${tipo.nombre}</h3>
                    <span class="codigo-tag">Código: ${tipo.codigo.toUpperCase()}</span>
                </div>
            </div>
            <hr class="divisor-tarjeta">
            <div class="tarjeta-body">
                <p class="label-tarifa">Tarifa por hora</p>
                <p class="precio-tarjeta">Q${tipo.tarifa}</p>
            </div>
            <div class="tarjeta-acciones">
                <button class="btn-editar-tipo" data-codigo="${tipo.codigo}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-eliminar-tipo" data-codigo="${tipo.codigo}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
};