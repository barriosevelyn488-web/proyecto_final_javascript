// ==========================================================================
// USUARIO.JS - CONTROLADOR DE AUTENTICACIÓN Y CREDENCIALES DINÁMICAS
// ==========================================================================
const $submit = document.getElementById("submit"),
      $password = document.getElementById("password"),
      $username = document.getElementById("username"),
      $visible = document.getElementById("visible"),
      $error = document.getElementById("mensaje-error");

const verificarPerfilInicial = () => {
    if (!localStorage.getItem('perfil')) {
        // UNIFICADO: Mismo correo de fábrica que en gestion.js para evitar bloqueos
        const perfilPorDefecto = [{
            nombre: "Administrador",
            email: "admin@campusparking.com", 
            contrasena: "Admin123"
        }];
        localStorage.setItem('perfil', JSON.stringify(perfilPorDefecto));
        console.log("🔑 Credenciales de fábrica inicializadas correctamente.");
    }
};

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('logout') === '1') {
    sessionStorage.removeItem('sessionActive');
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

    const perfilActivo = basePerfil[0]; 

    if (perfilActivo && emailIngresado === perfilActivo.email && passwordIngresada === perfilActivo.contrasena) {
        $error.style.display = "none";
        sessionStorage.setItem('sessionActive', 'true');
        window.location.replace("../index.html");
    } else {
        $error.style.display = "block";
        $password.value = ""; 
    }
};

const loginForm = document.getElementById('formulario-login');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        procesarLogin();
    });
}

document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        e.preventDefault(); 
        procesarLogin();
    }
});


