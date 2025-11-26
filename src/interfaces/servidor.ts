import Fastify, { FastifyInstance } from "fastify";
import fastify from 'fastify';
import { configurarConexionBD } from "../configuracion/conexionBD"; // ruta que uses

export function crearServidorBase(): FastifyInstance {
    const app = Fastify({ logger: true });
    return app;
}
