import Fastify, { FastifyInstance } from "fastify";
import consultorRutas from "../interfaces/rutas/consultorRutas";

export function crearServidorBase(): FastifyInstance {
    const app = Fastify({ logger: true });

    app.register(consultorRutas, { prefix: "/api" });

    

    return app;
}