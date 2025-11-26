import { FastifyInstance } from "fastify";
import { RepositorioConsultorPostgres } from "../../infraestructura/repositorios/repositorioConsultorPostgres";
import { ActualizarConsultor }from "../../aplicacion/casosUso/consultor/ActualizarConsultor"; 
import { CrearConsultor } from "../../aplicacion/casosUso/consultor/CrearConsultor";
import { EliminarConsultor } from "../../aplicacion/casosUso/consultor/EliminarConsultor";
import { ListarConsultor } from "../../aplicacion/casosUso/consultor/ListarConsultor";
import { ObtenerConsultorPorId } from "../../aplicacion/casosUso/consultor/ObtenerConsultorPorId";

export default async function consultorRutas(app: FastifyInstance) {
  const repo = new RepositorioConsultorPostgres();

  app.put<{ Params: { idConsultor: string } }>("/consultores/:idConsultor", async (request, reply) => {
        try {
            const { idConsultor } = request.params;
            const data = request.body as any; 
            const caso = new ActualizarConsultor(repo);
            const actualizado = await caso.ejecutar(idConsultor, data);
            
            if (!actualizado) {
                return reply.code(404).send({ message: "Consultor no encontrado para actualizar." });
            }
            return reply.code(200).send(actualizado);
        } catch (error) {
            return reply.code(500).send({ message: "Error al actualizar consultor." });
        }
    })

  app.post("/consultores", async (request, reply) => {
        try {
            const caso = new CrearConsultor(repo);
            const nuevo = await caso.ejecutar(request.body as any);
           
            return reply.code(201).send(nuevo);
        } catch (error) {
            if (error instanceof Error && error.message.includes('unicidad')) {
                return reply.code(409).send({ message: "Error: El correo electrónico ya está registrado." });
            }
            return reply.code(500).send({ message: "Error interno del servidor." });
        }
    });

app.delete<{ Params: { idConsultor: string } }>("/consultores/:idConsultor", async (request, reply) => {
        try {
            const { idConsultor } = request.params;

            const caso = new EliminarConsultor(repo);
            const eliminado = await caso.ejecutar(idConsultor);
            
            if (!eliminado) {
                return reply.code(404).send({ message: "Consultor no encontrado para eliminar." });
            }
            return reply.code(204).send(); 
        } catch (error) {
            return reply.code(500).send({ message: "Error al eliminar consultor." });
        }
    });

    app.get("/consultores", async (request, reply) => {
        try {
            const caso = new ListarConsultor(repo);
            const lista = await caso.ejecutar();
            return reply.code(200).send(lista);
        } catch (error) {
            return reply.code(500).send({ message: "Error al listar consultores." });
        }
    });

     app.get<{ Params: { idConsultor: string } }>("/consultores/:idConsultor", async (request, reply) => {
        try {
            const { idConsultor } = request.params; 

            const caso = new ObtenerConsultorPorId(repo);
            const consultor = await caso.ejecutar(idConsultor);

            if (!consultor) {
                return reply.code(404).send({ message: "Consultor no encontrado." });
            }
            return reply.code(200).send(consultor);
        } catch (error) {
            return reply.code(500).send({ message: "Error al obtener consultor por ID." });
        }
    }); 
}

