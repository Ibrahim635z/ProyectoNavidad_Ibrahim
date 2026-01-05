export class Carrito {
    constructor() {
        // 1. Recuperamos el usuario logueado para tener una clave única
        const usuarioLogueado = JSON.parse(sessionStorage.getItem("user"));

        // 2. Definimos la clave: si hay usuario 'carrito_123', si no 'carrito_invitado'
        if (usuarioLogueado && usuarioLogueado.id) {
            this.claveStorage = `carrito_${usuarioLogueado.id}`;
        } else {
            this.claveStorage = 'carrito_invitado';
        }

        // 3. Cargamos el carrito específico de ese usuario
        this.articulos = JSON.parse(localStorage.getItem(this.claveStorage)) || [];
    }

    add(elemento) {
        // Buscamos si el producto ya existe en el array (por nombre o id)
        const articuloExistente = this.articulos.find(art => art.producto.nombre === elemento.nombre);

        if (articuloExistente) {
            // Si existe, sumamos 1 a la cantidad
            articuloExistente.cantidad++;
        } else {
            // Si no existe, lo agregamos con cantidad base 1
            this.articulos.push({
                producto: elemento, // añado mi elemento con todos los datos del campo en producto
                cantidad: 1
            });
        }

        // Guardamos en localStorage 
        this.guardarCarrito();

    }

    // Método auxiliar para guardar en el localStorage
    guardarCarrito() {
        localStorage.setItem(this.claveStorage, JSON.stringify(this.articulos));
    }

    // Cuenta el total de items (ej: 2 pelotas + 1 camiseta = 3 items)
    contarArticulos() {
        return this.articulos.reduce((total, art) => total + art.cantidad, 0);
    }

    // Calcula el dinero total (ej: 2 pelotas * 10€ + 1 camiseta * 20€ = 50€)
    calcularTotal() {
        return this.articulos.reduce((total, item) => {
            // Limpiamos el precio si viene como texto ("100€" -> 100)
            const precioNum = typeof item.producto.precio === 'string' // Si el precio es un string
                ? parseFloat(item.producto.precio.replace(/[^\d.-]/g, '')) // Quitamos caracteres no numéricos
                : item.producto.precio; // Si el precio es un número, lo usamos directamente

            return total + (precioNum * item.cantidad); // Sumamos el precio total
        }, 0);
    }

    // Elimina un artículo del carrito
    eliminar(elemento) {
        this.articulos = this.articulos.filter(art => art.producto.nombre !== elemento.nombre);
        this.guardarCarrito();
        this.dibujarCarrito();
    }

    // Resta una unidad de un artículo
    restar(elemento) {
        const articuloExistente = this.articulos.find(art => art.producto.nombre === elemento.nombre);
        if (articuloExistente) {
            articuloExistente.cantidad--;
            if (articuloExistente.cantidad <= 0) {
                this.eliminar(elemento);
            } else {
                this.guardarCarrito();
                this.dibujarCarrito();

            }
        }
    }

    // Suma una unidad de un artículo
    sumar(elemento) {
        const articuloExistente = this.articulos.find(art => art.producto.nombre === elemento.nombre);
        if (articuloExistente) {
            articuloExistente.cantidad++;
            this.guardarCarrito();
            this.dibujarCarrito();
        }
    }

    // Dibuja el carrito en el DOM
    dibujarCarrito() {
        const fragment = document.createDocumentFragment(); // Fragmento para optimizar el DOM
        const contenedor = document.createElement("div"); // Contenedor del carrito
        contenedor.className = "vista-carrito";



        if (this.articulos.length === 0) {
            contenedor.innerHTML += "<p>El carrito está vacío.</p>";
        } else {
            // Crear Tabla
            const tabla = document.createElement("table");
            tabla.style.width = "100%";
            tabla.style.textAlign = "left";

            // Cabecera
            tabla.innerHTML = `
                <thead style="border-bottom: 1px solid #ccc;">
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unit.</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
            `;

            const tbody = document.createElement("tbody"); // Cuerpo de la tabla

            this.articulos.forEach(item => {
                const fila = document.createElement("tr");
                fila.className = "carrito__item";

                // Conversión de precio segura
                const precioNum = typeof item.producto.precio === 'string'
                    ? parseFloat(item.producto.precio.replace(/[^\d.-]/g, ''))
                    : item.producto.precio;

                const subtotal = precioNum * item.cantidad;

                //tofixed es para que el precio tenga 2 decimales
                fila.innerHTML = `
                    <td class="carrito__item-nombre">${item.producto.nombre}</td>
                    <td class="carrito__item-precio">${precioNum}</td>
                    <td>
                        <button class="btn__restar" data-nombre="${item.producto.nombre}">-</button>
                        ${item.cantidad}
                        <button class="btn__sumar" data-nombre="${item.producto.nombre}">+</button>
                    </td>
                    <td><strong>${subtotal.toFixed(2)}</strong></td> 
                    <td><button class="btn__eliminar" data-nombre="${item.producto.nombre}">Eliminar</button></td>
                `;
                tbody.appendChild(fila);
            });

            tabla.appendChild(tbody);
            contenedor.appendChild(tabla);

            // Mostrar el Total Final
            // Eventos para la tabla cuando se haga click se mira la clase del boton para saber cual esta clickando
            tabla.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn__sumar')) {
                    const nombre = e.target.dataset.nombre; // Obtenemos el nombre del producto
                    const item = this.articulos.find(art => art.producto.nombre === nombre); // Buscamos el artículo
                    if (item) this.sumar(item.producto); // Sumamos una unidad
                }
                if (e.target.classList.contains('btn__restar')) {
                    const nombre = e.target.dataset.nombre;
                    const item = this.articulos.find(art => art.producto.nombre === nombre);
                    if (item) this.restar(item.producto);
                }
                if (e.target.classList.contains('btn__eliminar')) {
                    const nombre = e.target.dataset.nombre;
                    const item = this.articulos.find(art => art.producto.nombre === nombre);
                    if (item) this.eliminar(item.producto);
                }

                // actualizamos el carrito
                const containerEnDOM = document.querySelector(".container__carrito"); // Obtenemos el contenedor del carrito
                if (containerEnDOM) {
                    containerEnDOM.innerHTML = "";
                    const nuevoContenido = this.dibujarCarrito();
                    containerEnDOM.appendChild(nuevoContenido);
                }
            });

            // Botón para vaciar carrito
            const btnVaciar = document.createElement("button");
            btnVaciar.textContent = "Vaciar Carrito";
            btnVaciar.className = "btn__vaciar";
            btnVaciar.onclick = () => {
                this.articulos = [];
                this.guardarCarrito();
                location.reload(); // Recargamos la página para mostrar el carrito vacío
            };
            contenedor.appendChild(btnVaciar);

            // Botón Finalizar Pedido (EmailJS)
            const btnFinalizar = document.createElement("button");
            btnFinalizar.textContent = "Finalizar Pedido";
            btnFinalizar.className = "btn__finalizar";

            btnFinalizar.onclick = () => {
                // 1. Obtenemos los datos del usuario actual desde sessionStorage
                const datosUsuario = JSON.parse(sessionStorage.getItem("user"));

                // Verificamos que existan los datos para evitar errores
                if (!datosUsuario || !datosUsuario.email) {
                    alert("Error: No se encontró el email del usuario. Por favor, inicia sesión de nuevo.");
                    return;
                }

                // 2. Preparamos los parámetros para EmailJS
                const params = {
                    email_cliente: datosUsuario.email,
                    message: this.articulos.map(a => `${a.producto.nombre} (x${a.cantidad})`).join(", "),
                    total: this.calcularTotal().toFixed(2)
                };

                if (typeof emailjs !== 'undefined') {
                    emailjs.send('service_vra1lwg', 'template_mope6va', params)
                        .then(() => {
                            alert(`¡Pedido enviado con éxito a ${datosUsuario.email}!`);
                            this.articulos = [];
                            this.guardarCarrito();
                            location.reload();
                        }, (error) => {
                            alert('Fallo al enviar el pedido: ' + JSON.stringify(error));
                        });
                } else {
                    alert("Error: La librería EmailJS no está cargada.");
                }
            };
            contenedor.appendChild(btnFinalizar);
        }

        fragment.appendChild(contenedor);
        return fragment;
    }
}