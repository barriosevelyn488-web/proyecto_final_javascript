//AMARRADO AL INDEX//


document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const menuNavegacion = document.querySelector('.tabs-nav'); // El padre de los botones

    // 1. FUNCIÓN MAESTRA PARA CARGAR PÁGINAS EXTERNAS
    const cargarPagina = async (seccion, botonActivo) => {
        try {
            // Limpieza de estados visuales
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            botonActivo.classList.add('active');

            // Seguridad: Validamos que la sección sea una de las permitidas para evitar cargas maliciosas
            const seccionesValidas = ['servicios', 'tipos'];
            if (!seccionesValidas.includes(seccion)) return;

            // Fetch de la página desde la carpeta PAGINAS
            const respuesta = await fetch(`/PAGINAS/${seccion}.html`);
            
            if (!respuesta.ok) throw new Error("No se pudo encontrar la página");

            const html = await respuesta.text();
            
            // Insertar el contenido de forma segura
            appContent.innerHTML = html;

        } catch (error) {
            console.error("Error en la carga:", error);
            appContent.innerHTML = `<p>Error al cargar el contenido. Intenta de nuevo.</p>`;
        }
    };

    // 2. DELEGACIÓN DE EVENTOS (Un solo listener para todos los botones)
    menuNavegacion.addEventListener('click', (e) => {
        // Verificamos que lo que se clickeó sea un botón de pestaña
        const boton = e.target.closest('.tab-btn');
        
        if (boton) {
            const seccion = boton.getAttribute('data-seccion'); // Usamos el atributo data
            cargarPagina(seccion, boton);
        }
    });

    // 3. CARGA INICIAL
    // Buscamos el botón que tenga la clase 'active' por defecto en el HTML
    const botonInicial = document.querySelector('.tab-btn.active');
    if (botonInicial) {
        cargarPagina(botonInicial.getAttribute('data-seccion'), botonInicial);
    }
});

import { mostrarSeccion } from './diseño.js';

// 1. Capturamos los elementos del DOM (Asegúrate de que las clases coincidan)
const secciones = document.querySelectorAll(".content_text");
const contenedor = document.getElementById("container");

// 2. Delegación de eventos para el menú de servicios
if (contenedor) {
    contenedor.addEventListener("click", (e) => {
        // Buscamos el botón más cercano al clic
        const boton = e.target.closest(".btn");
        
        if (boton) {
            const idSeleccionado = boton.dataset.number;
            // Llamamos a la función que importamos de diseño.js
            mostrarSeccion(idSeleccionado, secciones);
        }
    });
}

// 3. Inicialización: Esto se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Si tienes lógica previa de otros módulos, puedes llamarla aquí
    if (secciones.length > 0) {
        mostrarSeccion("1", secciones); // Muestra la primera sección por defecto
    }
    console.log("Sistema de servicios inicializado");
});

