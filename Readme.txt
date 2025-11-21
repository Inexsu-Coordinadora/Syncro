API de Gestión de Proyectos
Proyecto de API RESTful que implementa la entidad Proyecto utilizando Node.js, TypeScript, Fastify y PostgreSQL. La arquitectura utilizada es Hexagonal.

----------------------------------------------
                    Inicio 
----------------------------------------------
1. Instalación
-npm init -y
-npm install typescript --save-dev
-npx tsc --init

2. Configuración de Entorno
Crea un archivo .env en la raíz del proyecto y añade tus datos de conexión:

.env----------

# Cliente HTTP
PUERTO=3000

# Base de datos PostgreSQL
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres 
PGDBNAME=syncro_db
3. Base de Datos y Migración
Configura la base de datos syncro_db y la tabla proyectos para la entidad Proyecto.
A. Crear la Base de Datos
Crea la base de datos syncro_db en tu servidor PostgreSQL usando PgAdmin.
B. Ejecutar Script de Creación de Tabla
Ejecuta el siguiente script SQL en el Query Tool de PgAdmin (dentro de syncro_db) para crear la tabla proyectos con los atributos definidos en IProyecto.ts:
sql
-- Script de Migración para la entidad Proyecto

DROP TABLE IF EXISTS proyectos;

CREATE TABLE proyectos (
    "idProyecto" SERIAL PRIMARY KEY,
    "nombreProyecto" VARCHAR(100) NOT NULL,
    "descripcionProyecto" TEXT,
    "clienteId" VARCHAR(50) NOT NULL,
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "estadoProyecto" VARCHAR(50) NOT NULL,
    "consultor_asignado" VARCHAR(100),
    "roles_definidos" TEXT
);

4. Ejecución del Servidor
-npm run build
-npm start
-npm run dev



Endpoints de la API
La API escucha en http://localhost:3000. Todos los endpoints de la entidad Proyecto usan el prefijo /api/proyectos.
Método	Endpoint	Descripción
GET	/api/proyectos	Listar todos los proyectos.
GET	/api/proyectos/:idProyecto	Obtener un proyecto específico por ID.
POST	/api/proyectos	Crear un nuevo proyecto.
PUT	/api/proyectos/:idProyecto	Actualizar un proyecto existente.
DELETE	/api/proyectos/:idProyecto	Eliminar un proyecto.