import { FastifyInstance } from "fastify";
import { RepositorioConsultorPostgres } from "../../infraestructura/repositorios/repositorioConsultorPostgres.js";
import { CrearConsultor } from "../../aplicacion/casosUso/crearConsultor.js";

export default async function consultorRutas(app: FastifyInstance) {
    const repo = new RepositorioConsultorPostgres();

    app.post("/consultores", async (request, reply) => {
        const caso = new CrearConsultor(repo);
        const nuevo = await caso.ejecutar(request.body as any);
        return reply.code(201).send(nuevo);
    });
}