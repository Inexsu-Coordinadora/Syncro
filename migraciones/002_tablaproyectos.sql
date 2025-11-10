CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS proyectos (
    id_proyecto UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_proyecto VARCHAR(50) UNIQUE NOT NULL,
    nombre_proyecto VARCHAR(150) NOT NULL,
    descripcion_proyecto TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado_proyecto VARCHAR(50) NOT NULL,
    id_cliente UUID NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
