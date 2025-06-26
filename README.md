🔄 Proyecto de Integración React/Express/PostgreSQL
<img alt="React" src="https://img.shields.io/badge/React-19.1.0-blue.svg">
<img alt="Express" src="https://img.shields.io/badge/Express-5.1.0-green.svg">
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-8.16.0-orange.svg">

Este proyecto es una aplicación web fullstack que integra React en el frontend y Express con PostgreSQL en el backend.

📋 Descripción del Proyecto
Aplicación fullstack que demuestra la integración entre diferentes tecnologías:

Frontend: React con Create-React-App
Backend: API REST con Express y PostgreSQL
Documentación: Swagger UI para APIs

🔑 Características Principales
** agregar cosas **

🛠️ Tecnologías Utilizadas
 Frontend 
 - React 19
 - React Router 7
 - Axios

 Backend
 - Express 5
 - PostgreSQL (node-postgres, pg)
 - Swagger UI/JSDoc
 - dotenv para variables de entorno
 - bcrypt para encriptación de contraseñas
 - jsonwebtoken para autenticación JWT
 - swagger-ui-express para documentación de la API
 - cors para manejo de CORS


⚙️ Requisitos Previos
- Node.js (v14.0 o superior)
- npm (v6.0 o superior)
- PostgreSQL instalado y ejecutándose
- Base de datos "integracion" creada en PostgreSQL
- Usuario "integracion" con permisos adecuados

📦 Instalación
# Clonar el repositorio
git clone <repositorio>

# Entrar al directorio
cd Integracion

# Instalar dependencias principales
npm install

# Instalar dependencias del cliente
cd client && npm install

# Instalar dependencias del servidor
cd ../server && npm install

🗄️ Configuración de la Base de Datos
Crear una base de datos llamada "integracion" en PostgreSQL
Configurar el usuario "integracion" con contraseña "123"
Ejecutar la migración:

cd server
npm run migrate

🚀 Ejecución del Proyecto
# Desde la raíz del proyecto
npm start

Este comando ejecutará concurrentemente:

- El servidor en http://localhost:5000
- El cliente React en http://localhost:3000


📚 Endpoints API
- GET /api/productos: Obtiene todos los productos
- GET /api/productos/:id: Obtiene un producto por ID
La documentación completa de la API está disponible en: http://localhost:5000/api-docs

📁 Estructura del Proyecto
Integracion/
├── client/              # Frontend React
│   ├── public/          # Archivos públicos
│   └── src/             # Código fuente React
├── server/              # Backend Express
│   ├── migrations/      # Migraciones de base de datos
│   ├── routes/          # Rutas de la API
│   ├── .env             # Variables de entorno
│   ├── db.js            # Configuración de base de datos
│   └── index.js         # Punto de entrada del servidor
└── package.json         # Dependencias principales

📝 Licencia
MIT