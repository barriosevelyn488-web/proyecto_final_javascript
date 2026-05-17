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
        const perfilPorDefecto = [{
            nombre: "Administrador",
            email: "admin@campusparking.com",
            contrasena: "Admin123"
        }];
        localStorage.setItem('perfil', JSON.stringify(perfilPorDefecto));
        console.log("🔑 Credenciales de fábrica inicializadas correctamente.");
    }
};

verificarPerfilInicial();

document.addEventListener("change", (e) => {
    if (e.target === $visible) {
        $password.type = $visible.checked ? "text" : "password";
    }
});

document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        e.preventDefault(); 

        const emailIngresado = $username.value.trim();
        const passwordIngresada = $password.value;

        const basePerfil = JSON.parse(localStorage.getItem('perfil')) || [];
        const perfilActivo = basePerfil[0]; 

        if (perfilActivo && emailIngresado === perfilActivo.email && passwordIngresada === perfilActivo.contrasena) {
            $error.style.display = "none";
            window.location.href = "index.html";
        } else {
            $error.style.display = "block";
            $password.value = ""; 
        }
    }
});


