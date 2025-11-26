import Fastify, { FastifyInstance } from "fastify";

export function crearServidorBase(): FastifyInstance {
    const app = Fastify({ logger: true });
    return app;
}