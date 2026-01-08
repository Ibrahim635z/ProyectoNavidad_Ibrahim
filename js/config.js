/**
 * Configuración de la URL de la API.
 * 
 * - En LOCALHOST: Usamos el puerto 3008 de tu json-server local.
 * - En PRODUCCIÓN (Vercel/Internet): Usamos la URL de tu backend en Render.
 */

// ¡¡IMPORTANTE!!: Cuando despliegues el Backend en Render, copia la URL que te den y pégala aquí abajo:
const URL_BACKEND_RENDER = "https://backend-pachangapp.onrender.com"; // Ejemplo: "https://mi-api-navidad.onrender.com"

export const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3008'
    : URL_BACKEND_RENDER;

