//aqui van las validaciones y perfil


    const $submit = document.getElementById("submit"),
            $password = document.getElementById("password"),
            $username = document.getElementById("username"),
            $visible = document.getElementById("visible");
            $error = document.getElementById("mensaje-error");

    document.addEventListener("change", (e)=>{
        if(e.target === $visible){
            if($visible.checked === false) $password.type = "password";
            else $password.type = "text"
        }
    });

    document.addEventListener("click", (e) => {
    if (e.target === $submit) {
        // 1. PRIMERO QUE NADA: Detenemos la recarga de la página
        e.preventDefault(); 

        // 2. AHORA validamos
        if ($password.value === "Admin123" && $username.value === "admin@campusparking.com") {
            // Si es correcto, ocultamos error y entramos
            $error.style.display = "none";
            window.location.href = "index.html";
        } else {
            // SI ESTÁ MAL: El mensaje se quedará fijo porque el preventDefault evitó la recarga
            $error.style.display = "block";
            $password.value = ""; // Limpiamos solo la contraseña por seguridad
        }
    }
});


