CREATE TABLE "proyectos" (
  "idProyecto" SERIAL PRIMARY KEY,
  "nombreProyecto" VARCHAR(255) NOT NULL,
  "descripcionProyecto" TEXT,
  "clienteId" VARCHAR(50),
  "fechaInicio" DATE NOT NULL,
  "fechaFin" DATE,
  "estadoProyecto" VARCHAR(50) NOT NULL,
  "consultorAsignado" VARCHAR(255),
  "rolesDefinidos" TEXT[]
);
