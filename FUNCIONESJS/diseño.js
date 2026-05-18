// ==========================================================================
// DISEÑO.JS - RENDERIZADO VISUAL Y MÓDULOS DE INTERFAZ (<dialog>)
// ==========================================================================

export const alternarFormularioTipo = (mostrar) => {
    const modal = document.getElementById('modal-nuevo-tipo');
    if (!modal) return;

    if (mostrar) {
        modal.showModal(); 
    } else {
        modal.close(); 
        const formulario = document.getElementById('formulario-nuevo-tipo');
        if (formulario) formulario.reset(); 
    }
};

export const renderizarTipos = (tiposList) => {
    const pantallaVacia = document.querySelector('.pantalla-vacia');
    let contenedorTarjetas = document.getElementById('contenedor-tarjetas-tipos');

    if (!contenedorTarjetas) {
        contenedorTarjetas = document.createElement('div');
        contenedorTarjetas.id = 'contenedor-tarjetas-tipos';
        contenedorTarjetas.className = 'grid-tipos'; 
        const contenedorVista = document.querySelector('.contenedor-vista');
        if (contenedorVista) contenedorVista.appendChild(contenedorTarjetas);
    }

    if (tiposList.length === 0) {
        if (pantallaVacia) pantallaVacia.style.display = 'flex';
        if (contenedorTarjetas) {
            contenedorTarjetas.innerHTML = '';
            contenedorTarjetas.style.display = 'none';
        }
        return;
    }

    if (pantallaVacia) pantallaVacia.style.display = 'none';
    if (contenedorTarjetas) {
        contenedorTarjetas.style.display = 'grid';
        contenedorTarjetas.innerHTML = tiposList.map(tipo => `
            <parking-card 
                tipo="tipo-vehiculo" 
                titulo="${tipo.nombre}" 
                categoria="${tipo.nombre}"
                subtitulo="Código: ${tipo.codigo.toUpperCase()}" 
                costo="${tipo.tarifa}" 
                data-id="${tipo.codigo}">
            </parking-card>
        `).join('');
    }
};

export const alternarFormularioIngreso = (mostrar) => {
    const modal = document.getElementById('modal-nuevo-ingreso');
    if (!modal) return;

    if (mostrar) {
        const selectTipo = document.getElementById('ingreso-tipo');
        if (selectTipo) {
            const tipos = JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
            selectTipo.innerHTML = '<option value="" disabled selected>Seleccione un tipo...</option>';
            tipos.forEach(tipo => {
                selectTipo.innerHTML += `<option value="${tipo.codigo}">${tipo.nombre} (Q${tipo.tarifa}/h)</option>`;
            });
        }
        modal.showModal(); 
    } else {
        modal.close(); 
        const formulario = document.getElementById('formulario-nuevo-ingreso');
        if (formulario) {
            formulario.reset(); 
            formulario.removeAttribute('data-edit-id'); 
        }
    }
};

export const renderizarServicios = (listaServicios, filtroActivo = 'todos') => {
    const contenedorArea = document.querySelector('.display-area-serv');
    const pantallaVacia = document.querySelector('.empty-state-serv');
    if (!contenedorArea) return;
    
    const activosTotales = listaServicios.filter(s => s.activo).length;
    const statusTxt = document.querySelector('.status-serv');
    if (statusTxt) statusTxt.textContent = `Slots activos: ${activosTotales}/100 • Disponibles: ${100 - activosTotales}`;

    const itemsFiltro = document.querySelectorAll('.filter-item-serv');
    if (itemsFiltro.length === 3) {
        itemsFiltro[0].textContent = `Todos (${listaServicios.length})`;
        itemsFiltro[1].textContent = `Activos (${activosTotales})`;
        itemsFiltro[2].textContent = `Finalizados (${listaServicios.filter(s => !s.activo).length})`;
    }

    let listaFiltrada = listaServicios;
    if (filtroActivo === 'activos') listaFiltrada = listaServicios.filter(s => s.activo);
    if (filtroActivo === 'finalizados') listaFiltrada = listaServicios.filter(s => !s.activo);

    let gridEstacionados = document.getElementById('grid-servicios-operativos');
    if (gridEstacionados) gridEstacionados.remove();

    if (listaFiltrada.length === 0) {
        if (pantallaVacia) pantallaVacia.style.display = 'flex';
        return;
    }

    if (pantallaVacia) pantallaVacia.style.display = 'none';

    gridEstacionados = document.createElement('div');
    gridEstacionados.id = 'grid-servicios-operativos';
    gridEstacionados.className = 'grid-tipos'; 
    contenedorArea.appendChild(gridEstacionados);

    gridEstacionados.innerHTML = listaFiltrada.map(servicio => `
        <parking-card 
            tipo="servicio" 
            titulo="${servicio.placa.toUpperCase()}" 
            subtitulo="${servicio.tipoNombre} • Slot #${servicio.slot}" 
            categoria="${servicio.tipoNombre}"
            detalle1="${servicio.horaEntrada}" 
            detalle2="${servicio.horaSalida}" 
            costo="${servicio.costoTotal}" 
            activo="${servicio.activo}" 
            data-id="${servicio.id}">
        </parking-card>
    `).join('');
};

export const alternarFormularioPerfil = (mostrar) => {
    const modal = document.getElementById('modal-perfil');
    if (!modal) return;

    if (mostrar) {
        modal.showModal(); 
    } else {
        modal.close(); 
        const formulario = document.getElementById('formulario-perfil');
        if (formulario) formulario.reset(); 
    }
};
