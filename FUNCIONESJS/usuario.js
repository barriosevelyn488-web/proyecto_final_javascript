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

    document.addEventListener("click", (e)=>{
        if(e.target === $submit){
            e.preventDefault();
            if($password.value === "ABC123" && $username.value === "Admin@campus.com"){
                $error.style.display = "none";
                window.location.href = "index.html";
            }
        } else{
            $error.style.display = "block";
            $password.value = "";
        }
    })


