<<<<<<< HEAD
CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS consultores (
  idConsultor UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombreConsultor VARCHAR(100) NOT NULL,
  especialidadConsultor VARCHAR(100) NOT NULL,
  emailConsultor VARCHAR(150) UNIQUE NOT NULL,
  telefonoConsultor VARCHAR(20)
=======
CREATE TABLE IF NOT EXISTS consultores (
  id_consultor SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  emailConsultor VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(50),
  especialidad VARCHAR(100),
 
>>>>>>> 2daaffac817909a6452fe638ef40e4c35e01f4a4
);