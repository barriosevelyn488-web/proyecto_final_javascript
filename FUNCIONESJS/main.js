

// ==========================================
// MAIN.JS - CONTROLADOR GENERAL
// ==========================================
import { obtenerTipos, guardarTipoVehiculo, eliminarTipoVehiculo } from './gestion.js';
import { alternarFormularioTipo, renderizarTipos } from './diseño.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const menuNavegacion = document.querySelector('.tabs-nav');

    // Carga de páginas externas
    const cargarPagina = async (seccion, botonActivo) => {
        try {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            if (botonActivo) botonActivo.classList.add('active');

            const seccionesValidas = ['servicios', 'tipos'];
            if (!seccionesValidas.includes(seccion)) return;

            const respuesta = await fetch(`/PAGINAS/${seccion}.html`);
            if (!respuesta.ok) throw new Error("No se pudo encontrar la página");

            const html = await respuesta.text();
            appContent.innerHTML = html;

            // SI ENTRA A TIPOS: Inicializamos el listado guardado
            if (seccion === 'tipos') {
                const tiposActuales = obtenerTipos();
                renderizarTipos(tiposActuales);
            }

        } catch (error) {
            console.error("Error en la carga:", error);
            appContent.innerHTML = `<p style="padding: 20px;">Error al cargar el contenido.</p>`;
        }
    };

    // Delegación para el menú superior
    if (menuNavegacion) {
        menuNavegacion.addEventListener('click', (e) => {
            const boton = e.target.closest('.tab-btn');
            if (boton) {
                const seccion = boton.getAttribute('data-seccion');
                cargarPagina(seccion, boton);
            }
        });
    }

    // ESCUCHA DE ACCIONES DENTRO DE LAS VISTAS (Delegación de eventos global en appContent)
    if (appContent) {
        appContent.addEventListener('click', (e) => {
            
            // A. Botón "+ Nuevo Tipo"
            if (e.target.closest('.btn-principal')) {
                alternarFormularioTipo(true);
            }

            // B. Botón "Cancelar" del Formulario de Tipos
            if (e.target.closest('#btn-cancelar-tipo')) {
                alternarFormularioTipo(false);
                renderizarTipos(obtenerTipos()); // Regresa a la vista anterior
            }

            // C. Botón "Eliminar" en la tarjeta
            const btnEliminar = e.target.closest('.btn-eliminar-tipo');
            if (btnEliminar) {
                const codigo = btnEliminar.dataset.codigo;
                if (confirm(`¿Estás seguro de eliminar el tipo con código ${codigo}?`)) {
                    const listaActualizada = eliminarTipoVehiculo(codigo);
                    renderizarTipos(listaActualizada);
                }
            }

            // D. Botón "Editar" en la tarjeta
            const btnEditar = e.target.closest('.btn-editar-tipo');
            if (btnEditar) {
                const codigo = btnEditar.dataset.codigo;
                const tipos = obtenerTipos();
                const tipoAEditar = tipos.find(t => t.codigo === codigo);
                
                if (tipoAEditar) {
                    alternarFormularioTipo(true); // Abrimos formulario
                    // Rellenamos el formulario con los datos existentes
                    document.getElementById('input-codigo').value = tipoAEditar.codigo;
                    document.getElementById('input-codigo').disabled = true; // El código no se edita, es la llave
                    document.getElementById('input-nombre').value = tipoAEditar.nombre;
                    document.getElementById('input-tarifa').value = tipoAEditar.tarifa;
                }
            }
        });

        // E. Evento Submit para Guardar el Formulario
        appContent.addEventListener('submit', (e) => {
            if (e.target.id === 'formulario-nuevo-tipo') {
                e.preventDefault();

                // Captura analítica de inputs
                const codigo = document.getElementById('input-codigo').value.trim();
                const nombre = document.getElementById('input-nombre').value.trim();
                const tarifa = document.getElementById('input-tarifa').value.trim();

                if (!codigo || !nombre || !tarifa) {
                    alert("Por favor, llena todos los campos obligatorios.");
                    return;
                }

                const objetoTipo = { codigo, nombre, tarifa };
                
                // Procesamos en CRUD y redibujamos
                const listaActualizada = guardarTipoVehiculo(objetoTipo);
                alternarFormularioTipo(false);
                renderizarTipos(listaActualizada);
            }
        });
    }

    // Carga inicial por defecto
    const botonInicial = document.querySelector('.tab-btn.active');
    if (botonInicial) {
        const seccionInicial = botonInicial.getAttribute('data-seccion');
        cargarPagina(seccionInicial, botonInicial);
    }
});