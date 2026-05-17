// ==========================================================================
// GESTION.JS - LÓGICA DEL CRUD DE DATOS (TIPOS, SERVICIOS Y PERFIL)
// ==========================================================================
import { calcularCobroParqueo } from './calculos.js';

// --------------------------------------------------------------------------
// MÓDULO 1: CRUD DE TIPOS DE VEHÍCULOS
// --------------------------------------------------------------------------

export const obtenerTipos = () => {
    return JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
};

export const guardarTipoVehiculo = (nuevoTipo) => {
    let tipos = obtenerTipos();
    const index = tipos.findIndex(t => t.codigo.toUpperCase() === nuevoTipo.codigo.toUpperCase());
    
    if (index !== -1) {
        tipos[index] = nuevoTipo; 
    } else {
        tipos.push(nuevoTipo); 
    }
    
    localStorage.setItem('tiposVehiculos', JSON.stringify(tipos));
    return tipos;
};

export const eliminarTipoVehiculo = (codigo) => {
    let tipos = obtenerTipos();
    tipos = tipos.filter(t => t.codigo.toUpperCase() !== codigo.toUpperCase());
    localStorage.setItem('tiposVehiculos', JSON.stringify(tipos));
    return tipos;
};


// --------------------------------------------------------------------------
// MÓDULO 2: CRUD DE SERVICIOS / OPERACIONES DEL PARQUEADERO
// --------------------------------------------------------------------------

export const obtenerServicios = () => {
    return JSON.parse(localStorage.getItem('serviciosParqueo')) || [];
};

export const guardarService = (objetoServicio) => {
    let servicios = obtenerServicios();
    const index = servicios.findIndex(s => s.id === objetoServicio.id);

    if (index !== -1) {
        servicios[index] = { ...servicios[index], ...objetoServicio }; 
    } else {
        servicios.push(objetoServicio); 
    }

    localStorage.setItem('serviciosParqueo', JSON.stringify(servicios));
    return servicios;
};

export const eliminarServicio = (id) => {
    let servicios = obtenerServicios();
    servicios = servicios.filter(s => s.id !== id);
    localStorage.setItem('serviciosParqueo', JSON.stringify(servicios));
    return servicios;
};

export const finalizarServicio = (id, horaSalida) => {
    let servicios = obtenerServicios();
    const servicio = servicios.find(s => s.id === id);

    if (servicio) {
        servicio.activo = false; 
        servicio.horaSalida = horaSalida; 

        const tipos = obtenerTipos();
        const tipoAsignado = tipos.find(t => t.codigo.toUpperCase() === servicio.tipoCodigo.toUpperCase());
        const tarifaPorHora = tipoAsignado ? Number(tipoAsignado.tarifa) : 0;

        servicio.costoTotal = calcularCobroParqueo(servicio.horaEntrada, horaSalida, tarifaPorHora);
    }

    localStorage.setItem('serviciosParqueo', JSON.stringify(servicios));
    return servicios;
};


// --------------------------------------------------------------------------
// MÓDULO 3: GESTIÓN DE PERFIL CON PERSISTENCIA EN ARRAY
// --------------------------------------------------------------------------

export const obtenerPerfil = () => {
    const datos = localStorage.getItem('perfil');
    if (!datos) {
        return [{
            nombre: "Administrador",
            email: "admin@campusparking.com",
            contrasena: "Admin123" 
        }];
    }
    return JSON.parse(datos);
};

export const guardarPerfil = (datosActualizados) => {
    const perfilExistente = obtenerPerfil()[0];
    
    const perfilFinal = {
        nombre: datosActualizados.nombre,
        email: datosActualizados.email,
        contrasena: datosActualizados.nuevaContrasena ? datosActualizados.nuevaContrasena : perfilExistente.contrasena
    };

    localStorage.setItem('perfil', JSON.stringify([perfilFinal]));
    return [perfilFinal];
};