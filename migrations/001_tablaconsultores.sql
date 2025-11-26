CREATE TABLE IF NOT EXISTS consultores (
  id_consultor SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  emailConsultor VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(50),
  especialidad VARCHAR(100),
 
);