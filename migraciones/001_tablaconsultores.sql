CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS consultores (
  idConsultor UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombreConsultor VARCHAR(100) NOT NULL,
  especialidadConsultor VARCHAR(100) NOT NULL,
  emailConsultor VARCHAR(150) UNIQUE NOT NULL,
  telefonoConsultor VARCHAR(20)
);