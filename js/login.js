



const valida = async (objetoUsuario) => {

    const datosUsers = await fetch("http://localhost:3008/users").then(res => res.json());

    const usuarioEncontrado = datosUsers.find(usuario => usuario.email === objetoUsuario.email && usuario.password === objetoUsuario.password);

    if (usuarioEncontrado) {

        const objUsuario = {
            id: usuarioEncontrado.id,
            email: usuarioEncontrado.email,
            password: usuarioEncontrado.password
        }

        sessionStorage.setItem("user", JSON.stringify(objUsuario));
        window.location.href = "index.html";
        console.log(objUsuario);
        return objUsuario;
    } else {
        alert("Usuario no encontrado");
        return null;
    }

}



const main = () => {

    const formularioLogin = document.getElementById("form-login");
    const formularioRegistro = document.getElementById("form-register");
    const botonMostrarRegistro = document.getElementById("show-register");
    const botonMostrarLogin = document.getElementById("show-login");

    // Lógica para cambiar entre Formularios
    botonMostrarRegistro.addEventListener("click", () => {
        formularioLogin.classList.add("hidden");
        formularioRegistro.classList.remove("hidden");
    });

    botonMostrarLogin.addEventListener("click", () => {
        formularioRegistro.classList.add("hidden");
        formularioLogin.classList.remove("hidden");
    });

    // Lógica de LOGIN
    document.getElementById("btn-login").addEventListener("click", (event) => {
        event.preventDefault();

        // Cloudflare (Solo en login por ahora, o duplicar div en registro si se quiere)
        const respuestaTurnstile = document.querySelector('[name="cf-turnstile-response"]')?.value;
        if (!respuestaTurnstile) {
            alert("Por favor, completa la verificación de seguridad (Captcha).");
            return;
        }

        const email = document.getElementById("email").value;
        const pass = document.getElementById("pass").value;
        valida({ email: email, password: pass });
    });

    // Lógica de REGISTRO
    document.getElementById("btn-register").addEventListener("click", async (event) => {
        event.preventDefault();

        const email = document.getElementById("reg-email").value;
        const pass = document.getElementById("reg-pass").value;
        const confirmacionPass = document.getElementById("reg-pass-confirm").value;

        if (!email || !pass) {
            alert("Por favor rellena todos los campos");
            return;
        }

        if (pass !== confirmacionPass) {
            alert("Las contraseñas no coinciden");
            return;
        }

        try {
            // 1. Comprobar si existe el email
            const usuarioExistente = await fetch(`http://localhost:3008/users?email=${email}`).then(res => res.json());

            if (usuarioExistente.length > 0) {
                alert("Este email ya está registrado.");
                return;
            }

            // 2. Crear usuario
            const nuevoUsuario = {
                email: email,
                password: pass,
                role: "user",
                stats: {
                    games: 0,
                    wins: 0,
                    losses: 0,
                    goals: 0,
                    assists: 0,
                    rate: 0
                }
            };

            const respuesta = await fetch("http://localhost:3008/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                const usuarioCreado = await respuesta.json();
                alert("¡Cuenta creada con éxito!");

                // Auto-login
                sessionStorage.setItem("user", JSON.stringify({
                    id: usuarioCreado.id,
                    email: usuarioCreado.email,
                    role: usuarioCreado.role
                }));
                window.location.href = "index.html";
            } else {
                alert("Error al crear usuario");
            }

        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        }
    });

}

document.addEventListener("DOMContentLoaded", main);