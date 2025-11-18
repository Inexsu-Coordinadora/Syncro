import { FastifyInstance } from 'fastify';
import pg from '@fastify/postgres';

export const configurarConexionBD = async (servidor: FastifyInstance) => {
  try {
    const connectionString = process.env.DATABASE_URL || 
      `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

    await servidor.register(pg, {
      connectionString: connectionString
    });
    
    const client = await servidor.pg.connect();
    try {
      await client.query('SELECT NOW()');
      console.log("Conexión a base de datos establecida correctamente");
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error al configurar la base de datos:", error);
    throw error;
  }
};