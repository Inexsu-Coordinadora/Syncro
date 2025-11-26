import Fastify, { FastifyInstance } from 'fastify';
import { Pool } from 'pg';

export function crearServidorBase(opts = {}): FastifyInstance {
  const app = Fastify(opts);

  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  });

  app.decorate('pool', pool);

  app.register(require('./rutas/consultorRutas'), { pool });

  app.addHook('onClose', async (instance) => {
    await pool.end();
  });

  return app;
}

declare module 'fastify' {
  interface FastifyInstance {
    pool: Pool;
  }
}