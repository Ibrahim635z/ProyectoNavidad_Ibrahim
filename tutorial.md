# Guía de Despliegue Automatizado en AWS EC2 (Simplificado)

**¡Buenas noticias!** He optimizado el proceso para que **NO necesites generar tokens complejos**. El sistema ahora usa los permisos automáticos de GitHub para todo.

---

## 📋 Prerrequisitos

1.  **Cuenta de AWS Academy / Learner Lab**.
2.  **Dominio en IONOS** (`pachangapp.es`).
3.  **Repositorio en GitHub**.

---

## 🛠️ Paso 1: Lanzar Instancia en AWS

1.  Entra en **AWS Console** -> **EC2** -> **Lanzar instancia**.
2.  **Nombre**: `PachangApp-Server`.
3.  **Imagen**: `Ubuntu Server 24.04 LTS` (o 22.04).
4.  **Par de claves (Login)** - **MUY IMPORTANTE**:
    *   Haz clic en "Crear nuevo par de claves".
    *   Nombre: `pachangapp-key`.
    *   Tipo: `RSA`.
    *   Formato: `.pem` (para OpenSSH).
    *   Al hacer clic en "Crear par de claves", **se descargará automáticamente un archivo `pachangapp-key.pem` a tu ordenador** (generalmente en la carpeta `Descargas`).
    *   **⚠️ GUARDA ESTE ARCHIVO**: Es necesario para el siguiente paso.
5.  **Configuración de red**:
    *   Marca las casillas: "Permitir tráfico SSH", "Permitir tráfico HTTP", "Permitir tráfico HTTPS".
6.  **Lanzar**.

### Asignar IP Fija (Elastic IP)
1.  Menú lateral AWS -> **Red y seguridad -> Direcciones IP elásticas**.
2.  "Asignar dirección IP elástica" -> "Asignar".
3.  Selecciona la nueva IP -> Acción -> "Asociar dirección IP elástica".
4.  Elige tu instancia y asocia.
5.  **Copia esta IP Elástica** (ej. `34.220.x.x`).

---

## 🌐 Paso 2: Dominio (IONOS)

1.  En IONOS, ve a **DNS** de `pachangapp.es`.
2.  Edita el registro **A** (host `@`) para que apunte a tu **IP Elástica** de AWS.
3.  Borra cualquier registro AAAA (IPv6) si existe.

---

## 🔐 Paso 3: Configuración de GitHub (Secreto Mágico)

Solo necesitas configurar 3 secretos en tu repositorio GitHub.

1.  Abre el archivo `.pem` que descargaste en el Paso 1 con el **Bloc de Notas**.
2.  Copia **TODO** el contenido (desde `-----BEGIN...` hasta `...END-----`).
3.  Ve a tu repositorio en GitHub -> **Settings** -> **Secrets and variables** -> **Actions**.
4.  Añade estos 3 secretos ("New repository secret"):

| Nombre Secreto | Valor a pegar |
| :--- | :--- |
| `EC2_HOST` | La **IP Elástica** de AWS (Paso 1). |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_KEY` | El contenido completo de tu archivo `.pem`. |

**¡YA ESTÁ!** No necesitas ningún token personal. El código se encargará de todo.

---

## 🚀 Paso 4: Desplegar

Simplemente sube tus cambios:

```bash
git add .
git commit -m "Listo para despliegue automático"
git push origin main
```

Ve a la pestaña **Actions** en GitHub y observa cómo se despliega solo.

*   El sistema instalará Docker automáticamente en tu servidor.
*   Configurará la web y la base de datos.
*   En unos minutos, tu web estará en `http://pachangapp.es` y la documentación en `http://pachangapp.es/documentacion`.
