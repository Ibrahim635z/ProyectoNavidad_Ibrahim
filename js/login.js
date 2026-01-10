






import { API_URL } from "./config.js";

// Variables globales para almacenar los resultados correctos de los captchas
let sumaLoginCorrecta = 0;
let sumaRegistroCorrecta = 0;

// Función auxiliar para generar un captcha matemático aleatorio
const generarCaptcha = (elementoLabel) => {
    const num1 = Math.floor(Math.random() * 10) + 1; // Número entre 1 y 10
    const num2 = Math.floor(Math.random() * 10) + 1;
    elementoLabel.textContent = `¿Cuánto es ${num1} + ${num2}?`;
    return num1 + num2;
};

// Función de validación de Login
const valida = async (objetoUsuario) => {
    const datosUsers = await fetch(`${API_URL}/users`).then(res => res.json());
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
        alert("Usuario no encontrado o contraseña incorrecta");
        return null;
    }
}

const main = () => {

    const formularioLogin = document.getElementById("form-login");
    const formularioRegistro = document.getElementById("form-register");
    const botonMostrarRegistro = document.getElementById("show-register");
    const botonMostrarLogin = document.getElementById("show-login");

    // Inicializar Captchas al cargar la página
    sumaLoginCorrecta = generarCaptcha(document.getElementById("login-captcha-label"));


    // Lógica para cambiar entre Formularios
    botonMostrarRegistro.addEventListener("click", () => {
        formularioLogin.classList.add("hidden");
        formularioRegistro.classList.remove("hidden");
    });

    botonMostrarLogin.addEventListener("click", () => {
        formularioRegistro.classList.add("hidden");
        formularioLogin.classList.remove("hidden");
        // Regenerar captcha de login al mostrarlo
        sumaLoginCorrecta = generarCaptcha(document.getElementById("login-captcha-label"));
    });

    // Lógica de LOGIN
    document.getElementById("btn-login").addEventListener("click", (event) => {
        event.preventDefault();

        // 1. Verificar Captcha de Login
        const inputCaptcha = parseInt(document.getElementById("login-captcha-input").value);
        if (inputCaptcha !== sumaLoginCorrecta) {
            alert("Captcha incorrecto. Por favor, resuelve la suma correctamente.");
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
            // *** OBTENER TODOS LOS USUARIOS ***
            // Hacemos fetch a /users para obtener la lista completa.
            // 1. Comprobar si el email ya existe.
            // 2. Calcular cuál es el último ID para sumar 1.
            const usuariosExistentes = await fetch(`${API_URL}/users`).then(res => res.json());

            // Comprobar si existe el email
            const emailYaExiste = usuariosExistentes.some(user => user.email === email);
            if (emailYaExiste) {
                alert("Este email ya está registrado.");
                return;
            }

            // *** CÁLCULO DEL NUEVO ID  ***
            // Buscamos el ID numérico más alto que exista actualmente.
            // 'reduce' recorre todos los usuarios quedándose con el valor más alto.
            // parseInt(user.id) convierte el string "24" a número 24 para poder comparar matemáticamente.
            const maxId = usuariosExistentes.reduce((max, user) => {
                const idNumerico = parseInt(user.id);
                // Si user.id no es un número (ej: "ee0e"), devuelve max actual. Si es mayor, devuelve el nuevo.
                return !isNaN(idNumerico) && idNumerico > max ? idNumerico : max;
            }, 0);

            // El nuevo ID será el máximo encontrado + 1
            const nuevoId = (maxId + 1).toString();

            // 2. Crear objeto del nuevo usuario
            const nuevoUsuario = {
                id: nuevoId, // Asignamos el ID calculado automáticamente
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

            /* 
                *** EXPLICACIÓN DEL FETCH (POST) ***
                
                fetch("URL", opciones) es la función para comunicarse con el servidor (JSON Server).
                
                - method: "POST": Indica que queremos "ENVIAR" o "CREAR" un dato nuevo en el servidor.
                  (A diferencia de GET que es para pedir datos).
                
                - headers: {"Content-Type": "application/json"}: 
                  Le dice al servidor "Oye, lo que te voy a enviar en el 'body' es texto en formato JSON".
                  Es como etiquetar el paquete para que el servidor sepa cómo abrirlo.
                
                - body: JSON.stringify(nuevoUsuario):
                  Es el contenido del paquete. 'nuevoUsuario' es un objeto de JavaScript en la memoria del navegador.
                  JSON.stringify() lo convierte en una CADENA DE TEXTO (String) para que pueda viajar por internet.
            */
            const respuesta = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                alert(`¡Cuenta creada con éxito!`);

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