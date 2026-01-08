# Guía de Despliegue GRATUITO (No VPS)

Esta configuración te permite publicar tu web **sin pagar servidor**.

### La Estrategia
1.  **Backend (API + Base de Datos)**: Lo subiremos a **Render (Free Tier)**.
2.  **Frontend (Web Visual)**: Lo subiremos a **Vercel** (El mejor hosting gratuito de frontend).
3.  **Dominio**: Conectaremos tu dominio de IONOS a Vercel.

> ⚠️ **Aviso sobre Datos**: En la versión gratuita de Render, la base de datos (`db.json`) se "reinicia" cada vez que subes código o el servidor se duerme por inactividad. Los usuarios nuevos que registres se borrarán tras un tiempo. Para un proyecto de clase ES PERFECTO, pero no para una empresa real.

---

## PASO 1: Subir tu Código a GitHub
Asegúrate de que este proyecto está subido a tu GitHub y que el repositorio es **Público** (o privado, pero público es más fácil para empezar).

---

## PASO 2: Desplegar el Backend (Render)

1.  Entra en [dashboard.render.com](https://dashboard.render.com/) y crea una cuenta (con tu GitHub).
2.  Pulsa el botón **"New +"** y elige **"Web Service"**.
3.  Selecciona la opción **"Build and deploy from a Git repository"** y dale a Next.
4.  Busca tu repositorio (conecta tu cuenta si no sale) y dale a **"Connect"**.
5.  **Configuración del Servicio:**
    *   **Name:** `backend-pachangapp` (o lo que quieras).
    *   **Branch:** Selecciona `feature/despliegue` (IMPORTANTE).
    *   **Region:** Frankfurt (Germany) - Es la más cercana.
    *   **Runtime:** **Docker** (Importante).
    *   **Instance Type:** **Free**.
6.  **Environment Variables (Variables de Entorno)**:
    *   Baja hasta la sección "Advanced" > "Environment Variables".
    *   Añade una clave:
        *   Key: `PORT`
        *   Value: `3008`
    *   *(Esto es vital para que json-server funcione en Render)*.
7.  **Docker Command**: Déjalo vacío, Render usará tu `Dockerfile` automáticamente (ya lo he renombrado por ti).
8.  Dale a **"Create Web Service"**.

Tardará unos minutos. Cuando termine verás un tick verde y arriba a la izquierda la URL de tu API:
👉 **Ejemplo:** `https://backend-pachangapp.onrender.com`

**¡Copia esa URL!**

---

## PASO 3: Conectar el Frontend con el Backend

Ahora que tienes URL del backend, dile a tu código dónde está.

1.  Abre en tu ordenador el archivo `js/config.js`.
2.  Busca la línea que dice:
    ```javascript
    const URL_BACKEND_RENDER = "PON_AQUI_TU_URL_DE_RENDER";
    ```
3.  Pega ahí tu URL real (sin barra final `/`, solo https://...).
    *   Ejemplo: `const URL_BACKEND_RENDER = "https://backend-pachangapp.onrender.com";`
4.  Guarda los cambios.
5.  Sube los cambios a tu rama feature:
    ```bash
    git add .
    git commit -m "Configurar URL de produccion"
    git push origin feature/despliegue
    ```

---

## PASO 4: Desplegar el Frontend (Vercel)

1.  Entra en [vercel.com](https://vercel.com/) y entra con GitHub.
2.  Dale a **"Add New..."** > **"Project"**.
3.  Importa tu repositorio de GitHub.
4.  **Configuración:**
    *   **Framework Preset:** Déjalo en "Other".
    *   **Root Directory:** `./` (déjalo como está).
    *   **Branch:** IMPORTANTE: En "Production Branch" o en el selector de ramas, asegúrate de elegir `feature/despliegue`.
    *   **Build Command:** Déjalo vacío.
    *   **Output Directory:** Déjalo vacío.
5.  Dale a **"Deploy"**.

En unos segundos, Vercel te dará una URL (ej. `proyecto-navidad.vercel.app`). ¡Tu web ya funciona!

---

## PASO 5: Poner tu Dominio de IONOS

Para que no sea `.vercel.app`, sino `tudominio.com`.

1.  En el panel de tu proyecto en **Vercel**:
    *   Ve a **Settings** > **Domains**.
    *   Escribe tu dominio de IONOS (ej. `miproyecto.com`) y dale a **Add**.
    *   Elige la opción recomendada (Añadir dominio).
    *   Vercel te dará unos valores **DNS** (normalmente un Registro A `76.76.21.21`).

2.  En tu panel de **IONOS**:
    *   Ve a **Dominios & SSL**.
    *   Dale al engranaje ⚙️ de tu dominio > **DNS**.
    *   Borra cualquier registro A antiguo.
    *   Añade un nuevo Registro **A**:
        *   Host: `@`
        *   Valor: `76.76.21.21` (El que te dio Vercel).
    *   Añade otro registro **CNAME** (si quieres `www`):
        *   Host: `www`
        *   Valor: `cname.vercel-dns.com`

Espera unos minutos/horas y tu dominio mostrará tu web segura y gratis.
