/**
 * PETICIONES.JS - Módulo encargado de la comunicación con APIs externas.
 */

/**
 * Verifica la disponibilidad del API de Iconify mediante una petición asíncrona.
 * @returns {Promise<boolean>} - Verdadero si el API responde correctamente.
 */
export async function verificarEstadoAPI() {
    const URL_PRUEBA = 'https://api.iconify.design/mdi.json?icons=car';
    
    try {
        // Realiza una petición GET al servidor de Iconify
        const respuesta = await fetch(URL_PRUEBA);
        
        // Si la respuesta es exitosa (status 200-299), retornamos true
        if (respuesta.ok) {
            console.log("API de Iconify: Conexión establecida exitosamente.");
            return true;
        }
    } catch (error) {
        console.error("Error al conectar con el API:", error);
        return false;
    }
}