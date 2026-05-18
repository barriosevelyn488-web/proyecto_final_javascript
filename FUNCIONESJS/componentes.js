// ==========================================================================
// COMPONENTES.JS - DEFINICIÓN DE WEB COMPONENTS (CUSTOM ELEMENTS)
// ==========================================================================

class ParkingCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const tipo = this.getAttribute('tipo') || 'servicio'; // 'tipo-vehiculo' o 'servicio'
        const titulo = this.getAttribute('titulo') || '';
        const subtitulo = this.getAttribute('subtitulo') || '';
        const categoria = (this.getAttribute('categoria') || titulo).toLowerCase();
        const detalle1 = this.getAttribute('detalle1') || '';
        const detalle2 = this.getAttribute('detalle2') || '';
        const id = this.getAttribute('data-id');
        const activo = this.getAttribute('activo') === 'true';
        const costo = this.getAttribute('costo') || '0';

        // Selección de iconos mediante la API de Iconify (Nombres de iconos estándar)
        let iconName = '';
        if (categoria.includes('moto')) {
            iconName = 'mdi:motorbike';
        } else if (categoria.includes('camion') || categoria.includes('pesado') || categoria.includes('carga')) {
            iconName = 'mdi:truck-cargo-container';
        } else if (categoria.includes('bus')) {
            iconName = 'mdi:bus-side';
        } else if (categoria.includes('bici')) {
            iconName = 'mdi:bicycle';
        } else if (categoria.includes('heli')) {
            iconName = 'mdi:helicopter';
        } else if (categoria.includes('avion')) {
            iconName = 'mdi:airplane';
        } else {
            iconName = 'mdi:car-side';
        }

        this.innerHTML = `
            <div class="tarjeta-vehiculo" data-id="${id}">
                <div class="tarjeta-header">
                    <div class="icono-carro-tarjeta">
                        <iconify-icon icon="${iconName}" width="32" height="32"></iconify-icon>
                    </div>
                    <div class="tarjeta-info-principal">
                        <h3>${titulo}</h3>
                        <span class="codigo-tag">${subtitulo}</span>
                    </div>
                </div>
                <hr class="divisor-tarjeta">
                <div class="tarjeta-body">
                    ${tipo === 'servicio' ? `
                        <p class="label-tarifa">Entrada: <strong>${detalle1}</strong></p>
                        <p class="label-tarifa">Salida: <span>${detalle2 || 'En curso...'}</span></p>
                    ` : `
                        <p class="label-tarifa">Tarifa por hora</p>
                        <p class="precio-tarjeta">Q${costo}</p>
                    `}
                </div>
                <div class="tarjeta-acciones">
                    ${tipo === 'servicio' && activo ? `
                        <button class="btn-salida-servicio btn-primario" data-id="${id}" style="padding: 8px 12px; flex: 1.5;">
                            <iconify-icon icon="mdi:logout-variant"></iconify-icon> Salida
                        </button>
                        <button class="btn-editar-servicio btn-secundario" data-id="${id}" style="padding: 8px 12px; flex: 1;">
                            <iconify-icon icon="mdi:pencil-outline"></iconify-icon>
                        </button>
                    ` : ''}
                    ${!activo && tipo === 'servicio' ? `<strong style="color: #16a34a;">Total: Q${costo}</strong>` : ''}
                    ${tipo === 'tipo-vehiculo' ? `
                        <button class="btn-editar-tipo btn-secundario" data-codigo="${id}" style="padding: 8px 12px; flex: 1;">
                            <iconify-icon icon="mdi:edit-note"></iconify-icon> Editar
                        </button>
                    ` : ''}
                    <button class="${tipo === 'servicio' ? 'btn-eliminar-servicio' : 'btn-eliminar-tipo'} btn-danger" data-id="${id}" data-codigo="${id}" style="padding: 8px 12px; flex: 1;">
                        <iconify-icon icon="mdi:trash-can-outline"></iconify-icon> Borrar
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('parking-card', ParkingCard);