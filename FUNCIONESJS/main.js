// ==========================================================================
// MAIN.JS - CONTROLADOR GENERAL INTEGRADO (TODOS LOS EVENTOS DE LA APP)
// ==========================================================================
import { 
    obtenerTipos, guardarTipoVehiculo, eliminarTipoVehiculo, 
    obtenerServicios, guardarService, eliminarServicio, finalizarServicio,
    obtenerPerfil, guardarPerfil 
} from './gestion.js';

import { 
    alternarFormularioTipo, renderizarTipos, 
    alternarFormularioIngreso, renderizarServicios,
    alternarFormularioPerfil 
} from './diseño.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const menuNavegacion = document.querySelector('.tabs-nav');
    
    let subFiltroServicioActual = 'todos';

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

            if (seccion === 'tipos') {
                renderizarTipos(obtenerTipos());
            }
            
            if (seccion === 'servicios') {
                subFiltroServicioActual = 'todos'; 
                renderizarServicios(obtenerServicios(), subFiltroServicioActual);
            }

        } catch (error) {
            console.error("Error en la carga:", error);
            appContent.innerHTML = `<p style="padding: 20px;">Error al cargar el contenido.</p>`;
        }
    };

    if (menuNavegacion) {
        menuNavegacion.addEventListener('click', (e) => {
            const boton = e.target.closest('.tab-btn');
            if (boton) {
                const seccion = boton.getAttribute('data-seccion');
                cargarPagina(seccion, boton);
            }
        });
    }

    // --- MANEJO EXCLUSIVO DEL DIALOG DE PERFIL ---
    document.addEventListener('click', async (e) => {
        
        // 1. Apertura asíncrona mediante showModal() nativo
        if (e.target.closest('.perfil-btn')) {
            try {
                // Limpieza de seguridad preexistente en el DOM
                const modalExistente = document.getElementById('modal-perfil');
                if (modalExistente) modalExistente.remove();

                const respuesta = await fetch('/PAGINAS/perfil.html');
                if (!respuesta.ok) throw new Error("No se pudo obtener el archivo perfil.html");
                
                const htmlModal = await respuesta.text();
                document.body.insertAdjacentHTML('beforeend', htmlModal);
                
                const modalPerfil = document.getElementById('modal-perfil');

                // Inyección segura de datos desde LocalStorage
                const perfilActual = obtenerPerfil()[0];
                if (perfilActual) {
                    document.getElementById('perfil-nombre').value = perfilActual.nombre;
                    document.getElementById('perfil-email').value = perfilActual.email;
                }
                
                document.getElementById('perfil-pass-actual').value = '';
                document.getElementById('perfil-pass-nueva').value = '';
                document.getElementById('perfil-pass-confirmar').value = '';
                
                if (modalPerfil && typeof modalPerfil.showModal === 'function') {
                    modalPerfil.showModal(); 
                } else {
                    alternarFormularioPerfil(true);
                }
            } catch (error) {
                console.error("Error al montar la interfaz de perfil:", error);
            }
        }

        // 2. Cierre Quirúrgico (X, Cancelar o click en el fondo exterior)
        const esBotonCerrarX = e.target.classList.contains('cerrar-modal-x');
        const esBotonCancelar = e.target.id === 'btn-cancelar-perfil';
        const esFondoGrisBackdrop = e.target.id === 'modal-perfil';

        if (esBotonCerrarX || esBotonCancelar || esFondoGrisBackdrop) {
            
            // Si el click fue en el fondo gris pero interactuando con el form interno, detener
            if (esFondoGrisBackdrop && e.target.querySelector('.modal-formulario')?.contains(e.target)) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil) {
                const formularioPerfil = document.getElementById('formulario-perfil');
                if (formularioPerfil) formularioPerfil.reset();

                if (typeof modalPerfil.close === 'function') {
                    modalPerfil.close();
                } else {
                    alternarFormularioPerfil(false);
                }
                modalPerfil.remove(); // Remueve copias para mantener limpio el árbol HTML
            }
        }
    });

    // Envío y control de cambios del Perfil (Cierre inmediato tras Aceptar la validación)
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'formulario-perfil') {
            e.preventDefault();

            const nombre = document.getElementById('perfil-nombre').value.trim();
            const email = document.getElementById('perfil-email').value.trim();
            const passActual = document.getElementById('perfil-pass-actual').value;
            const passNueva = document.getElementById('perfil-pass-nueva').value;
            const passConfirmar = document.getElementById('perfil-pass-confirmar').value;

            if (!nombre || !email) {
                alert("🚨 El nombre y el email son obligatorios.");
                return;
            }

            const perfilExistente = obtenerPerfil()[0];
            let nuevaContrasena = perfilExistente ? perfilExistente.contrasena : '';

            if (passActual || passNueva || passConfirmar) {
                if (perfilExistente && passActual !== perfilExistente.contrasena) {
                    alert("🚨 La contraseña actual introducida es incorrecta.");
                    return;
                }
                if (!passNueva || !passConfirmar) {
                    alert("🚨 Debe completar todos los campos de contraseña.");
                    return;
                }
                if (passNueva !== passConfirmar) {
                    alert("🚨 Las nuevas contraseñas no coinciden.");
                    return;
                }
                nuevaContrasena = passNueva;
            }

            guardarPerfil({ nombre, email, contrasena: nuevaContrasena });
            
            // Mensaje de alerta nativo
            alert("✅ Perfil actualizado correctamente.");
            
            // CIERRE INMEDIATO POST VALIDACIÓN:
            const modalPerfil = document.getElementById('modal-perfil');
            if (modalPerfil) {
                if (typeof modalPerfil.close === 'function') {
                    modalPerfil.close();
                } else {
                    alternarFormularioPerfil(false);
                }
                modalPerfil.remove(); // Limpia el DOM completamente para que vuelva a funcionar en el próximo click
            }
        }
    });

    if (appContent) {
        appContent.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-item-serv')) {
                document.querySelectorAll('.filter-item-serv').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                const textoBoton = e.target.textContent.toLowerCase();
                if (textoBoton.includes('activos')) subFiltroServicioActual = 'activos';
                else if (textoBoton.includes('finalizados')) subFiltroServicioActual = 'finalizados';
                else subFiltroServicioActual = 'todos';

                renderizarServicios(obtenerServicios(), subFiltroServicioActual);
            }

            // --- ACCIONES MÓDULO TIPOS ---
            if (e.target.closest('#btn-abrir-tipo')) {
                const inputCodigo = document.getElementById('input-codigo');
                if (inputCodigo) inputCodigo.disabled = false;
                alternarFormularioTipo(true);
            }

            if (e.target.closest('#btn-cancelar-tipo')) {
                alternarFormularioTipo(false);
                renderizarTipos(obtenerTipos());
            }

            const btnEliminarTipo = e.target.closest('.btn-eliminar-tipo');
            if (btnEliminarTipo) {
                const codigo = btnEliminarTipo.dataset.codigo;
                if (confirm(`¿Estás seguro de eliminar el tipo con código ${codigo}?`)) {
                    renderizarTipos(eliminarTipoVehiculo(codigo));
                }
            }

            const btnEditarTipo = e.target.closest('.btn-editar-tipo');
            if (btnEditarTipo) {
                const codigo = btnEditarTipo.dataset.codigo;
                const tipoAEditar = obtenerTipos().find(t => t.codigo === codigo);
                if (tipoAEditar) {
                    alternarFormularioTipo(true);
                    document.getElementById('input-codigo').value = tipoAEditar.codigo;
                    document.getElementById('input-codigo').disabled = true;
                    document.getElementById('input-nombre').value = tipoAEditar.nombre;
                    document.getElementById('input-tarifa').value = tipoAEditar.tarifa;
                }
            }
            
            // --- ACCIONES MÓDULO SERVICIOS ---
            if (e.target.closest('#btn-nuevo-ingreso')) {
                alternarFormularioIngreso(true);
                const inputHora = document.getElementById('ingreso-hora-entrada');
                if (inputHora) {
                    const ahora = new Date();
                    inputHora.value = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
                }
            }

            if (e.target.id === 'btn-cancelar-ingreso') {
                e.preventDefault();
                alternarFormularioIngreso(false);
            }

            if (e.target.closest('.btn-salida-servicio')) {
                if (e.target.id === 'btn-guardar-ingreso') {
                    const ahora = new Date();
                    const horaSalida = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
                    if (!confirm(`¿Confirmar SALIDA a las ${horaSalida}?`)) {
                        e.preventDefault();    
                        e.stopPropagation();    
                        return;                
                    }
                    return; 
                }

                const id = e.target.closest('.btn-salida-servicio').dataset.id;
                const ahora = new Date();
                const horaSalida = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
                
                if (confirm(`¿Confirmar SALIDA a las ${horaSalida}?`)) {
                    const listaActualizada = finalizarServicio(id, horaSalida);
                    renderizarServicios(listaActualizada, subFiltroServicioActual);
                }
            }

            if (e.target.closest('.btn-eliminar-servicio')) {
                const id = e.target.closest('.btn-eliminar-servicio').dataset.id;
                if (confirm('¿Estás seguro de borrar este registro?')) {
                    const listaActualizada = eliminarServicio(id);
                    renderizarServicios(listaActualizada, subFiltroServicioActual);
                }
            }

            if (e.target.closest('.btn-editar-servicio')) {
                const id = e.target.closest('.btn-editar-servicio').dataset.id;
                const servicioAEditar = obtenerServicios().find(s => s.id === id);
                
                if (servicioAEditar) {
                    alternarFormularioIngreso(true);
                    document.getElementById('ingreso-placa').value = servicioAEditar.placa;
                    document.getElementById('ingreso-tipo').value = servicioAEditar.tipoCodigo;
                    document.getElementById('ingreso-slot').value = servicioAEditar.slot;
                    document.getElementById('ingreso-hora-entrada').value = servicioAEditar.horaEntrada;
                    document.getElementById('formulario-nuevo-ingreso').setAttribute('data-edit-id', id);
                }
            }
        });

        appContent.addEventListener('submit', (e) => {
            if (e.target.id === 'formulario-nuevo-tipo') {
                e.preventDefault();
                const codigo = document.getElementById('input-codigo').value.trim();
                const nombre = document.getElementById('input-nombre').value.trim();
                const tarifa = document.getElementById('input-tarifa').value.trim();

                if (!codigo || !nombre || !tarifa) return alert("Llena todos los campos.");
                renderizarTipos(guardarTipoVehiculo({ codigo, nombre, tarifa }));
                alternarFormularioTipo(false);
            }

            if (e.target.id === 'formulario-nuevo-ingreso') {
                e.preventDefault();

                const placaInput = document.getElementById('ingreso-placa').value.trim().toUpperCase();
                const tipoCodigo = document.getElementById('ingreso-tipo').value; 
                const slot = document.getElementById('ingreso-slot').value.trim();
                const horaEntrada = document.getElementById('ingreso-hora-entrada').value;

                if (!placaInput || !tipoCodigo || !slot || !horaEntrada) return alert("Complete los campos.");

                const regexPlacaGUATE = /^[A-Z]-?[0-9]{3,4}[A-Z]{3}$/;
                if (!regexPlacaGUATE.test(placaInput)) {
                    alert("🚨 Formato de placa incorrecto SAT.");
                    return; 
                }

                const letraPrefijo = placaInput.charAt(0); 
                const selectEl = document.getElementById('ingreso-tipo');
                const textoVisibleSelect = selectEl.options[selectEl.selectedIndex].text.toLowerCase();

                if (textoVisibleSelect.includes('moto') && letraPrefijo !== 'M') return alert("🚨 Prefijo M requerido."); 
                if ((textoVisibleSelect.includes('auto') || textoVisibleSelect.includes('carro')) && letraPrefijo !== 'P') return alert("🚨 Prefijo P requerido.");
                if (textoVisibleSelect.includes('camion') && letraPrefijo !== 'C') return alert("🚨 Prefijo C requerido.");

                const placaNormalizada = placaInput.replace(/-/g, ''); 
                const editId = e.target.getAttribute('data-edit-id');
                const serviciosExistentes = obtenerServicios();

                const placaYaActiva = serviciosExistentes.some(srv => srv.placa.replace(/-/g, '') === placaNormalizada && srv.activo === true && srv.id !== editId);
                if (placaYaActiva) return alert("🚨 Vehículo ya activo.");

                const slotOcupado = serviciosExistentes.some(srv => srv.slot === slot && srv.activo === true && srv.id !== editId);
                if (slotOcupado) return alert("⚠️ Slot ocupado.");

                const tipoNombre = selectEl.options[selectEl.selectedIndex].text.split(' (')[0];
                let objetoServicio;

                if (editId) {
                    objetoServicio = { id: editId, placa: placaInput, tipoCodigo, tipoNombre, slot, horaEntrada };
                } else {
                    const ahora = new Date();
                    const fecha = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`;
                    objetoServicio = { id: 'SRV-' + Date.now(), placa: placaInput, tipoCodigo, tipoNombre, slot, fecha, horaEntrada, horaSalida: '', activo: true, costoTotal: 0 };
                }

                const listaActualizada = guardarService(objetoServicio);
                alternarFormularioIngreso(false);
                renderizarServicios(listaActualizada, subFiltroServicioActual);
            }
        });
    }

    const botonInicial = document.querySelector('.tab-btn.active');
    if (botonInicial) cargarPagina(botonInicial.getAttribute('data-seccion'), botonInicial);
});
