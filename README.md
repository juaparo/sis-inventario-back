# Backend – sis‑inventario

## 📋 Descripción del proyecto
Este es el **backend** del sistema de inventario. Está construido con **Node.js**, **Express** y **MongoDB**. Provee una API REST para gestionar usuarios, roles, productos, categorías y movimientos.

---

## 🛠️ Tecnologías y requisitos
- **Node.js** v18 o superior
- **npm** (incluido con Node) o **yarn**
- **MongoDB** (local o en la nube – URI de conexión en `.env`)
- **Git** (para clonar el repositorio)

---

## ⚙️ Instalación y puesta en marcha
1. **Clonar el repositorio** (si aún no lo has hecho)
   ```bash
   git clone <repo‑url>
   cd backend-projects
   ```
2. **Instalar dependencias**
   ```bash
   npm install   # o `yarn install`
   ```
3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto (el mismo nivel que `package.json`). Ejemplo:
   ```dotenv
   # Puerto donde escuchará Express
   PORT=3000

   # URI de conexión a MongoDB (ej. MongoDB local)
   MONGODB_URI=mongodb://localhost:27017/sisinventario

   # Secreto para firmar los JWT
   JWT_SECRET=unaClaveSuperSecreta
   ```
   > **⚠️ Nota de seguridad** – No compartas este archivo y añádelo a `.gitignore` (ya está incluido).
4. **Ejecutar el servidor en modo desarrollo**
   ```bash
   npm run dev   # usa nodemon para recargar automáticamente
   ```
   El API quedará disponible en `http://localhost:<PORT>/api/...`.

---

## 🌱 Script de *seeding* de la base de datos
El proyecto incluye un script que pobla la base de datos con datos de ejemplo útiles para pruebas.

### 1️⃣ Qué hace el script (`src/scripts/seed.js`)
- **Conecta** a la base de datos usando la misma `MONGODB_URI` del `.env`.
- **Elimina** (purga) las colecciones `roles` y `usuarios` para evitar duplicados.
- **Inserta** tres roles básicos (`Administrador`, `Gerente`, `Auxiliar de Bodega`).
- **Crea** cinco usuarios de ejemplo, asignándoles los `ObjectId` de los roles recién creados.
- **Actualiza** los contadores de usuarios por cada rol (campo `userCount` en los documentos de rol).
- **Imprime** en la consola un resumen del proceso.

### 2️⃣ Cómo ejecutarlo
```bash
node src/scripts/seed.js
```
Asegúrate de que el servidor **no** esté corriendo en ese momento, ya que el script abre su propia conexión a MongoDB y finaliza al terminar.

### 3️⃣ Resultado esperado
```text
Conectando a la base de datos para sembrado...
Conexión establecida.
Limpiando colecciones de Roles y Usuarios...
Insertando roles...
3 roles creados.
Insertando usuarios (las contraseñas se encriptarán automáticamente)...
5 usuarios creados.
Actualizando contadores de usuarios por rol...
¡Semillero (Seeding) completado exitosamente!
```
Ahora la API tiene datos de prueba y puedes consumirlos desde el frontend.

---

## 📦 Scripts útiles (package.json)
| Script | Acción |
|--------|--------|
| `dev` | Inicia el servidor con **nodemon** (recarga automática). |
| `start` | Inicia el servidor en modo producción (sin recarga). |
| `seed` | Ejecuta `node src/scripts/seed.js` (puedes adicionarlo si lo prefieres). |

---

## 🔧 Consejos de desarrollo
- Usa **Postman** o **Insomnia** para probar los endpoints (`/api/users`, `/api/roles`, etc.).
- Los **JWT** se devuelven al iniciar sesión (`POST /api/auth/login`). Guárdalos en el frontend (por ejemplo, en `localStorage` con un `auth.interceptor`).
- Cada vez que modifiques los **modelos** o **controladores**, vuelve a ejecutar el script de *seed* para resetear datos de prueba.

---

## 📜 Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más información.

---

## 👥 Usuarios de Prueba (Seed)
Al ejecutar el script de *seeding* (`npm run seed` o `node src/scripts/seed.js`), el sistema genera automáticamente usuarios con perfiles predefinidos para facilitar las pruebas del frontend.

| Rol | Correo / Usuario | Contraseña |
| --- | --- | --- |
| **Administrador** | `admin@inventario.com` | `admin123` |
| **Gerente** | `gerente@inventario.com` | `gerente123` |
| **Auxiliar de Bodega** | `auxiliar@inventario.com` | `auxiliar123` |

Estos usuarios cuentan con los permisos estrictamente delimitados a su rol según el esquema de seguridad (Estrategia de Roles).
