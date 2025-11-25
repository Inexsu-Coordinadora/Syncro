CREATE TABLE proyectos (
    idProyecto SERIAL PRIMARY KEY,
    nombreProyecto VARCHAR(100) NOT NULL,
    descripcionProyecto TEXT,
    clienteId VARCHAR(50) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estadoProyecto VARCHAR(50) NOT NULL,
    consultor_asignado VARCHAR(100),
    roles_definidos TEXT
);