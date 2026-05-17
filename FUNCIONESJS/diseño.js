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
                    <button class="btn-editar-tipo" data-codigo="${tipo.codigo}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn-eliminar-tipo" data-codigo="${tipo.codigo}"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            </div>
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
        <div class="tarjeta-vehiculo" data-id="${servicio.id}" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="tarjeta-header">
                <div class="icono-carro-tarjeta"><span style="font-size: 24px;">🚗</span></div>
                <div class="tarjeta-info-principal">
                    <h3>${servicio.placa.toUpperCase()}</h3>
                    <span class="codigo-tag">${servicio.tipoNombre} • Slot #${servicio.slot}</span>
                </div>
            </div>
            <hr class="divisor-tarjeta">
            <div class="tarjeta-body" style="padding: 4px 0;">
                <p class="label-tarifa" style="font-size: 13px;">Fecha: <strong>${servicio.fecha}</strong></p>
                <p class="label-tarifa" style="font-size: 13px; margin-top: 4px;">Entrada: <span style="color:#0f172a; font-weight:600;">${servicio.horaEntrada}</span></p>
                <p class="label-tarifa" style="font-size: 13px;">Salida: <span style="color:#64748b;">${servicio.horaSalida || 'En curso...'}</span></p>
            </div>
            <div class="tarjeta-acciones" style="margin-top: 12px; gap: 8px;">
                ${servicio.activo ? `
                    <button class="btn-salida-servicio" data-id="${servicio.id}" style="background-color: #0f172a; color: #fff; flex: 1; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">🚪 Salida</button>
                    <button class="btn-editar-servicio" data-id="${servicio.id}" style="background-color: #f1f5f9; color: #334155; border: none; padding: 8px 12px; border-radius: 8px; font-weight: 600; cursor: pointer;">✏️ Editar</button>
                ` : `
                    <div style="flex: 1; text-align: left;">
                        <span style="font-size: 11px; color: #64748b; display:block;">Cobro Total</span>
                        <strong style="font-size: 18px; color: #16a34a;">Q${servicio.costoTotal}</strong>
                    </div>
                `}
                <button class="btn-eliminar-servicio" data-id="${servicio.id}" style="background-color: #fee2e2; color: #ef4444; border: none; padding: 8px 12px; border-radius: 8px; cursor: pointer;">🗑️ Borrar</button>
            </div>
        </div>
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
