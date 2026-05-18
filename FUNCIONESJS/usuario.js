// ==========================================================================
// USUARIO.JS - CONTROLADOR DE AUTENTICACIÓN Y CREDENCIALES DINÁMICAS
// ==========================================================================
const $submit = document.getElementById("submit"),
      $password = document.getElementById("password"),
      $username = document.getElementById("username"),
      $visible = document.getElementById("visible"),
      $error = document.getElementById("mensaje-error");

const verificarPerfilInicial = () => {
    const perfilExistente = localStorage.getItem('perfil');
    
    // Si no hay perfil, o si queremos forzar que el administrador por defecto esté presente
    if (!perfilExistente) {
        const perfilPorDefecto = [{
            nombre: "Administrador",
            email: "admin@campusparking.com",
            contrasena: "Admin123"
        }];
        localStorage.setItem('perfil', JSON.stringify(perfilPorDefecto));
        console.log(" Credenciales de fábrica inicializadas.");
    }
};

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout') === '1') {
    sessionStorage.removeItem('sessionActive');
}
// Truco para exposición: si agregas ?clear=1 a la URL, limpia todo.
if (urlParams.get('clear') === '1') {
    localStorage.clear();
    window.location.replace("login.html");
}

verificarPerfilInicial();

document.addEventListener("change", (e) => {
    if (e.target === $visible) {
        $password.type = $visible.checked ? "text" : "password";
    }
});

const procesarLogin = () => {
    const emailIngresado = $username.value.trim();
    const passwordIngresada = $password.value;

    let basePerfil = [];
    try {
        basePerfil = JSON.parse(localStorage.getItem('perfil')) || [];
    } catch (error) {
        console.error("Error al leer las credenciales, restaurando defecto...", error);
        basePerfil = [{ nombre: "Administrador", email: "admin@campusparking.com", contrasena: "Admin123" }];
    }

    const perfilActivo = basePerfil.length > 0 ? basePerfil[0] : null; 

    if (perfilActivo && emailIngresado === perfilActivo.email && passwordIngresada === perfilActivo.contrasena) {
        $error.style.display = "none";
        sessionStorage.setItem('sessionActive', 'true');
        window.location.replace("../index.html");
    } else {
        $error.style.display = "block";
        $password.value = ""; 
        // Opcional: animación de sacudida para UX
        $submit.parentElement.style.animation = "sacudir 0.3s";
        setTimeout(() => $submit.parentElement.style.animation = "", 300);
    }
};

const loginForm = document.getElementById('formulario-login');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        procesarLogin();
    });
}
