import { FastifyInstance } from 'fastify';
import pg from '@fastify/postgres';
import * as dotenv from 'dotenv';

// dotenv.config();

export const configurarConexionBD = (servidor: FastifyInstance) => {
  // Ahora usamos las variables individuales para construir la URL de conexión interna
  const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDBNAME}`;
  
  servidor.register(pg, {
    connectionString: connectionString
  });
  console.log("Conexión a base de datos configurada:", process.env.PGDBNAME);
};