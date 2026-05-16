// ==========================================
// GESTION.JS - LÓGICA DEL CRUD DE DATOS
// ==========================================

// Obtener el array actual del LocalStorage
export const obtenerTipos = () => {
    return JSON.parse(localStorage.getItem('tiposVehiculos')) || [];
};

// Guardar o Actualizar un tipo en el array
export const guardarTipoVehiculo = (nuevoTipo) => {
    let tipos = obtenerTipos();
    
    // ya existe por el código para saber si es edición?
    const index = tipos.findIndex(t => t.codigo.toUpperCase() === nuevoTipo.codigo.toUpperCase());
    
    if (index !== -1) {
        tipos[index] = nuevoTipo; // Actualizar
    } else {
        tipos.push(nuevoTipo); // Crear 
    }
    
    localStorage.setItem('tiposVehiculos', JSON.stringify(tipos));
    return tipos;
};

// Eliminar un tipo por su código
export const eliminarTipoVehiculo = (codigo) => {
    let tipos = obtenerTipos();
    tipos = tipos.filter(t => t.codigo.toUpperCase() !== codigo.toUpperCase());
    localStorage.setItem('tiposVehiculos', JSON.stringify(tipos));
    return tipos;
};