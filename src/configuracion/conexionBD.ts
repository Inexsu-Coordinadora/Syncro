import { FastifyInstance } from 'fastify';
import pg from '@fastify/postgres';

export const configurarConexionBD = (servidor: FastifyInstance) => {
  const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDBNAME}`;
  servidor.register(pg, {
    connectionString: connectionString
  });
  console.log("Conexión a base de datos configurada:", process.env.PGDBNAME);
};