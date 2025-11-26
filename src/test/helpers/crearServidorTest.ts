import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";

export async function crearServidorTest() {
  const server = fastify({ logger: false });

  server.register(fastifyPostgres, {
    connectionString: "postgres://test:test@localhost:5432/testdb",
  });

  return server;
}
