/**
 * Configuración de la URL de la API.
 * 
 * - En LOCALHOST: Usamos el puerto 3008 de json-server local.
 * - En PRODUCCIÓN (Vercel/Internet): Usamos la URL de backend en Render.
 */

const URL_BACKEND_RENDER = "/api";

export const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3008'
    : URL_BACKEND_RENDER;

