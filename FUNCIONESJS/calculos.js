// ==========================================================================
// CALCULOS.JS - LÓGICA MATEMÁTICA PURA DE TARIFAS Y TIEMPOS
// ==========================================================================

/**
 * Calcula el total a cobrar basado en la hora de entrada, salida y tarifa por hora.
 * @param {string} horaEntrada - Formato "HH:MM"
 * @param {string} horaSalida - Formato "HH:MM"
 * @param {number} tarifaPorHora - Precio por hora del tipo de vehículo
 * @returns {number} Costo total calculado
 */
export const calcularCobroParqueo = (horaEntrada, horaSalida, tarifaPorHora) => {
    const [hEntrada, mEntrada] = horaEntrada.split(':').map(Number);
    const [hSalida, mSalida] = horaSalida.split(':').map(Number);
    
    // Convertir todo a minutos transcurridos en el día para calcular la diferencia exacta
    let totalMinutos = (hSalida * 60 + mSalida) - (hEntrada * 60 + mEntrada);

    // Si el resultado es negativo, asumimos que la salida fue el día siguiente
    if (totalMinutos < 0) totalMinutos += 24 * 60;
    
    // Convertir a horas cobrables (redondeando hacia arriba, mínimo se cobra 1 hora)
    const horasACobrar = Math.max(1, Math.ceil(totalMinutos / 60));
    
    // Retornar el costo total de la operación
    return horasACobrar * (tarifaPorHora || 0);
};