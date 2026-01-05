import { Carrito } from "./carrito.js";

// Variables Globales
let todosLosCampos = [];
let paginaActual = 1;
const elementosPorPagina = 8;
let cargando = false; // para evitar peticiones simultaneas
let acabado = false;
let ordenActual = { sort: "", order: "" };
let vistaActual = "inicio";
// Instanciamos el carrito
const miCarrito = new Carrito();




/**
 * Comprueba si el usuario está logueado
 * @returns 
 */
const compruebaUsuario = () => {

    const usuario = sessionStorage.getItem("user");

    if (window.location.pathname.includes("login.html")) {
        return;
    }

    if (!usuario) {
        window.location.href = "login.html";
    }
}



/**
 * Carga los campos desde el servidor
 * @param {number} pagina - Número de página a cargar
 */
const cargarCampos = async (pagina = 1) => {
    // Si ya hemos cargado todo, no hacemos nada
    if (acabado) return;

    try {
        // Construimos la URL con paginación y ordenamiento por defecto
        let url = `http://localhost:3008/campos?_page=${pagina}&_per_page=${elementosPorPagina}`;

        if (ordenActual.sort) {
            // json-server v1 usa _sort (con - para descender)
            url += `&_sort=${ordenActual.sort}`;
        }

        // CORRECCIÓN: Filtrado en el Servidor
        // Añadimos el parámetro de categoría a la URL si hay un filtro seleccionado.
        // Esto soluciona el problema de que carguen menos de 8 elementos.
        const categoriaActual = filtroCategoria();
        if (categoriaActual !== "todos") {
            url += `&categoria=${categoriaActual}`;
        }

        const respuesta = await fetch(url);
        const datos = await respuesta.json();

        // En json-server v1 beta, a veces la respuesta viene envuelta en .data, o a veces es directa.
        const campos = datos.data || datos;

        console.log(`Cargando página ${pagina} (Filtro: ${categoriaActual}):`, campos);

        // Si la respuesta está vacía, significa que no hay más datos
        if (campos.length === 0) {
            acabado = true;
            const loader = document.getElementById("loader");
            loader.textContent = "No hay más resultados.";
            loader.classList.add("mensaje-fin");
            return;
        }

        // Evitar bucle infinito
        // Comprobamos si el primer elemento de los nuevos datos ya existe en nuestro array global.
        // Solo si no estamos en la página 1 (porque si reseteamos todo, el array estará vacío)
        if (pagina > 1) {
            const yaExiste = todosLosCampos.some(existente => existente.id === campos[0].id);
            if (yaExiste) {
                acabado = true;
                const loader = document.getElementById("loader");
                loader.textContent = "No hay más resultados.";
                loader.classList.add("mensaje-fin");
                return;
            }
        }

        // Concatenamos los nuevos campos al array global
        todosLosCampos = [...todosLosCampos, ...campos];


        creaCards(campos);

    } catch (error) {
        console.error("Error al cargar los campos:", error);
        alert("Error al cargar los campos");
    }
}

/**
 * Maneja el scroll para cargar más campos
 */
const handleScroll = async () => {

    // Obtenemos las posiciones del scroll con destructuracion
    // scrollTop: posición vertical del scroll(distancia recorrida)
    // scrollHeight: altura total del documento(largo total de la web)
    // clientHeight: altura visible del documento(lo que ve el usuario)
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Solo activar scroll infinito en la vista de inicio
    if (vistaActual !== "inicio") return;

    // Comprobamos si hemos llegado casi al final de la página (200px de margen)
    // Y verificamos que no se esté cargando ya otra página ni hayamos terminado
    if (scrollTop + clientHeight >= scrollHeight - 200 && !cargando && !acabado) {
        cargando = true; // Bloqueamos nuevas peticiones
        document.getElementById("loader").style.display = "block"; // Mostramos el loader

        // Pequeño timeout para que se muestre el efecto de carga
        setTimeout(async () => {
            paginaActual++; // Incrementamos la página
            await cargarCampos(paginaActual); // Cargamos la siguiente página
            cargando = false; // permitimos cargar más campos

            // Ocultamos el loader si no hemos terminado
            if (!acabado) {
                document.getElementById("loader").style.display = "none";
            }
        }, 500);
    }
};

/**
 * Activa el scroll infinito
 */
const activarScrollInfinito = () => {
    window.addEventListener('scroll', handleScroll);
}


/**
 * Crea una card para un campo
 * @param {Object} campo - Objeto con los datos del campo
 */
const creaCard = (campo) => {
    // Creamos los elementos
    const divCampo = document.createElement("div");
    const nombre = document.createElement("h2");
    const imagen = document.createElement("img");
    const categoria = document.createElement("p");
    const precio = document.createElement("p");
    const descripcion = document.createElement("p");
    const ubicacion = document.createElement("p");
    const medidas = document.createElement("p");
    const alquilar = document.createElement("button");
    const detalles = document.createElement("button");

    //asignamos la clase
    divCampo.className = "cardCampo";

    //asignamos el contenido
    nombre.textContent = campo.nombre;
    imagen.src = campo.imagen;
    categoria.innerHTML = `<strong> Categoria: </strong> ${campo.categoria}`;
    precio.innerHTML = `<strong> Precio: </strong> ${campo.precio}€`;

    //asignamos el contenido
    alquilar.textContent = "Alquilar";
    alquilar.className = "btn__alquilar";

    //asignamos el evento del boton alquilar
    //asignamos el evento del boton alquilar
    alquilar.addEventListener("click", () => {
        miCarrito.add(campo);
        Toastify({
            text: "Producto añadido al carrito",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                borderRadius: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            },
            onClick: function () { } // Callback after click
        }).showToast();
    });

    //asignamos el contenido
    detalles.textContent = "Detalles";
    detalles.className = "btn__detalles";

    //asignamos el evento del boton detalles
    detalles.addEventListener("click", () => {
        descripcion.innerHTML = `<strong> Descripcion: </strong> ${campo.descripcion}`;
        ubicacion.innerHTML = `<strong> Ubicación: </strong> ${campo.ubicacion}`;
        medidas.innerHTML = `<strong> Medidas: </strong> Ancho: ${campo.medidas.ancho} Largo: ${campo.medidas.largo} (${campo.medidas.unidad})`;
    });

    //asignamos los hijos
    divCampo.appendChild(nombre);
    divCampo.appendChild(imagen);
    divCampo.appendChild(categoria);
    divCampo.appendChild(precio);
    divCampo.appendChild(descripcion);
    divCampo.appendChild(ubicacion);
    divCampo.appendChild(medidas);
    divCampo.appendChild(alquilar);
    divCampo.appendChild(detalles);

    return divCampo;


}

/**
 * Crea las cards de los campos
 * @param {Array} campos - Array de campos
 */
const creaCards = (campos) => {
    //obtenemos el contenedor
    const containerCampos = document.getElementById("container");
    //recorremos el array de campos
    campos.forEach(element => {
        containerCampos.appendChild(creaCard(element));
    });

    return containerCampos;
}


/**
 * Carga el perfil
 */
const cargarPerfil = () => {

    limpiarPantalla();
    vistaActual = "perfil";
    cardPerfil();

}

/**
 * Limpia la pantalla
 */
const limpiarPantalla = () => {
    //obtenemos los elementos
    const seccion1 = document.getElementById("seccion1");
    const container = document.getElementById("container");
    const containerPerfil = document.querySelector(".container__perfil");
    const containerCarrito = document.querySelector(".container__carrito");
    const galeria = document.querySelector(".galeria__imagenes");
    const containerSobreNosotros = document.querySelector(".container__sobre-nosotros");

    //borramos los elementos
    if (seccion1) seccion1.remove();
    if (container) container.remove();
    if (containerPerfil) containerPerfil.remove();
    if (containerCarrito) containerCarrito.remove();
    if (galeria) galeria.remove();
    if (containerSobreNosotros) containerSobreNosotros.remove();

    // Aseguramos que el loader/mensaje final se oculte al cambiar de vista
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

/**
 * Crea la card del perfil
 */
const cardPerfil = async () => {
    try {
        const usuarioActual = JSON.parse(sessionStorage.getItem("user")); // session storage es una cadena de texto debo usar JSON.parse para tratarla como un array de objetos

        //accedo a los datos del usuario actual para obtener sus stats
        const usuarios = await fetch("http://localhost:3008/users");
        const usuariosJson = await usuarios.json();
        const usuario = usuariosJson.find(user => user.id === usuarioActual.id);

        if (!usuario) {
            console.error("Usuario no encontrado");
            return;
        }

        const stats = usuario.stats;

        const container = document.createElement("div");
        container.className = "container__perfil";

        const divPerfil = document.createElement("div");
        divPerfil.className = "div__perfil";

        // Título
        const titulo = document.createElement("h2");
        titulo.textContent = "Perfil de Usuario";
        divPerfil.appendChild(titulo);

        // Contenedor del Cuerpo (Imagen Izq + Info Der)
        const perfilBody = document.createElement("div");
        perfilBody.className = "perfil__body";

        // Imagen
        const imgUser = document.createElement("img");
        imgUser.src = "./images/imagen.png";
        perfilBody.appendChild(imgUser);

        // Contenedor de Información
        const perfilInfo = document.createElement("div");
        perfilInfo.className = "perfil__info";

        /**
         * Funcion que facilita la creacion de un elemento p con el contenido HTML proporcionado
         * @param {string} htmlContent - Contenido HTML para el elemento p
         * @returns {HTMLElement} - Elemento p creado
         */
        const crearDato = (htmlContent) => {
            const p = document.createElement("p");
            p.innerHTML = htmlContent;
            return p;
        };

        perfilInfo.appendChild(crearDato(`<strong>ID de usuario: </strong> ${usuario.id}`));
        perfilInfo.appendChild(crearDato(`<strong>Email: </strong> ${usuario.email}`));
        perfilInfo.appendChild(crearDato(`<strong>Partidos: </strong> ${stats.games}`));
        perfilInfo.appendChild(crearDato(`<strong>Victorias: </strong> ${stats.wins}`));
        perfilInfo.appendChild(crearDato(`<strong>Derrotas: </strong> ${stats.losses}`));
        perfilInfo.appendChild(crearDato(`<strong>Goles: </strong> ${stats.goals}`));
        perfilInfo.appendChild(crearDato(`<strong>Asistencias: </strong> ${stats.assists}`));
        perfilInfo.appendChild(crearDato(`<strong>Tasa de victorias: </strong> ${stats.rate}`));

        perfilBody.appendChild(perfilInfo);
        divPerfil.appendChild(perfilBody);

        container.appendChild(divPerfil);
        document.body.appendChild(container);

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }
}

/**
 * Muestra el carrito
 */
const mostrarCarrito = () => {
    limpiarPantalla();
    vistaActual = "carrito";

    const container = document.createElement("div");
    container.className = "container__carrito";

    const titulo = document.createElement("h2");
    titulo.textContent = "Tu Carrito de Compras";
    container.appendChild(titulo);

    // Llamamos al método de la clase que nos devuelve el fragmento HTML
    const contenidoCarrito = miCarrito.dibujarCarrito();
    container.appendChild(contenidoCarrito);

    document.body.appendChild(container);
}


/**
 * Muestra la sección sobre nosotros
 */
const mostrarSobreNosotros = () => {
    limpiarPantalla();
    vistaActual = "sobre-nosotros";

    // Contenedor Principal Sobre Nosotros
    const containerPrincipal = document.createElement("div");
    containerPrincipal.className = "container__sobre-nosotros";

    // mision
    const divMision = document.createElement("div");
    divMision.className = "div__mision";

    // mision texto
    const divMisionTexto = document.createElement("div");
    divMisionTexto.className = "div__mision-texto";

    const tituloMision = document.createElement("h2");
    tituloMision.textContent = "Nuestra Misión";

    const parrafoMision = document.createElement("p");
    parrafoMision.textContent = `PachangApp es nuestra visión para unir a la comunidad de fútbol amateur. 
    Nuestra misión es facilitar la organización de partidos, permitir que los jugadores encuentren equipos y campos disponibles, 
    fomentar el deporte y la competencia sana. Queremos que jugar al fútbol sea tan fácil como hacer un clic, 
    conectando a apasionados del deporte en una experiencia única y profesional.`;

    divMisionTexto.appendChild(tituloMision);
    divMisionTexto.appendChild(parrafoMision);

    // mision imagen
    const divMisionImagen = document.createElement("div");
    divMisionImagen.className = "div__mision-imagen";

    const imgMision = document.createElement("img");
    imgMision.src = "./images/imagen.png";
    divMisionImagen.appendChild(imgMision);

    divMision.appendChild(divMisionTexto);
    divMision.appendChild(divMisionImagen);


    // galeria
    const galeria = document.createElement("div");
    galeria.className = "galeria__imagenes";

    // creo un Array de imágenes para la galería asi simplifico la creacion de las imagenes
    const imagenesGrid = [
        "./images/grid/imagen1.jpg", "./images/grid/imagen2.jpg", "./images/grid/imagen3.jpeg",
        "./images/grid/imagen4.jpg", "./images/grid/imagen5.jpeg", "./images/grid/imagen6.jpg",
        "./images/grid/imagen7.jfif", "./images/grid/imagen8.webp", "./images/grid/imagen9.jpg",
        "./images/grid/imagen10.avif"
    ];


    imagenesGrid.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = `img-area-${index + 1}`; // Clase única para grid-area del css
        galeria.appendChild(img);
    });

    containerPrincipal.appendChild(divMision);
    containerPrincipal.appendChild(galeria);

    document.body.appendChild(containerPrincipal);

}

/**
 * Obtiene el valor del filtro de categoría
 * @returns {string} - Valor del filtro de categoría
 */
const filtroCategoria = () => {
    const filtro = document.getElementById("filtro-categoria");
    const valor = filtro.value;
    return valor;
}

/**
 * Carga los campos filtrados por categoría
 */
const cargarCamposFiltrados = async () => {

    container.innerHTML = "";

    // CORRECCIÓN: Ahora reseteamos y recargamos SIEMPRE, sea "todos" o una categoría específica.
    // Al resetear y llamar a cargarCampos, la función se encargará de pedir al servidor
    // los datos filtrados correctamente, asegurando que vengan en bloques de 8.

    paginaActual = 1;
    todosLosCampos = [];
    acabado = false;
    document.getElementById("loader").textContent = "Cargando más campos...";
    cargarCampos();
}

/**
 * Función main
 */
const main = () => {

    compruebaUsuario();
    cargarCampos(); // Carga la primera página
    activarScrollInfinito(); // Activa el listener del scroll


    // evento perfil
    document.getElementById("perfil").addEventListener("click", () => {
        cargarPerfil();
    });

    // evento inicio
    document.getElementById("inicio").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // evento carrito
    document.getElementById("carrito").addEventListener("click", () => {
        mostrarCarrito();
    });

    // evento sobre nosotros
    document.getElementById("sobre__nosotros").addEventListener("click", () => {
        mostrarSobreNosotros();
    })

    // evento cerrar sesión
    document.getElementById("cerrar__sesion").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "login.html";
    })

    // evento filtro categoría
    document.getElementById("filtro-categoria").addEventListener("change", () => {
        cargarCamposFiltrados();
    });

    // evento orden alfabético
    document.getElementById("orden-alfabetico").addEventListener("change", (e) => {
        const valor = e.target.value;
        const container = document.getElementById("container");

        // Reseteamos el estado
        paginaActual = 1;
        todosLosCampos = [];
        acabado = false;
        container.innerHTML = "";
        document.getElementById("loader").textContent = "Cargando más campos...";


        // en json server v1 Ascendente: _sort=nombre y descendente: _sort=-nombre
        if (valor === "asc") {
            ordenActual = { sort: "nombre" };
        } else if (valor === "desc") {
            ordenActual = { sort: "-nombre" };
        } else {
            ordenActual = { sort: "" };
        }

        cargarCampos(1); // Recargamos con los nuevos parámetros
    });
}

document.addEventListener("DOMContentLoaded", main);