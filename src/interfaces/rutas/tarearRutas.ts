import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ITarea } from "../../dominio/entidades/ITarea";
import { CrearTarea } from "../../aplicacion/casosUso/tarea/CrearTarea";
import { ListarTareas } from "../../aplicacion/casosUso/tarea/ListarTareas";
import { ObtenerTareaPorId } from "../../aplicacion/casosUso/tarea/ObtenerTareaPorId";
import { ActualizarTarea } from "../../aplicacion/casosUso/tarea/ActualizarTarea";
import { EliminarTarea } from "../../aplicacion/casosUso/tarea/EliminarTarea";

export async function tareaRutas(
    servidor: FastifyInstance,
    crear: CrearTarea,
    listar: ListarTareas,
    obtenerPorId: ObtenerTareaPorId,
    actualizar: ActualizarTarea,
    eliminar: EliminarTarea
) {
    // LISTAR
    servidor.get("/", async () => listar.ejecutar());

    // OBTENER POR ID
    servidor.get("/:id", async (
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) => {
        const tarea = await obtenerPorId.ejecutar(req.params.id);
        if (!tarea) return rep.status(404).send({ mensaje: "Tarea no encontrada" });
        return tarea;
    });

    // CREAR
    servidor.post("/", async (
        req: FastifyRequest<{ Body: ITarea }>,
        rep: FastifyReply
    ) => {
        try {
            const nueva = await crear.ejecutar(req.body);
            return rep.status(201).send(nueva);
        } catch (e: any) {
            return rep.status(400).send({ mensaje: e.message });
        }
    });

    // ACTUALIZAR
    servidor.put("/:id", async (
        req: FastifyRequest<{ Params: { id: string }; Body: ITarea }>,
        rep: FastifyReply
    ) => {
        try {
            const editada = await actualizar.ejecutar(req.params.id, req.body);
            return editada || rep.status(404).send({ mensaje: "Tarea no encontrada" });
        } catch (e: any) {
            return rep.status(400).send({ mensaje: e.message });
        }
    });

    // ELIMINAR
    servidor.delete("/:id", async (
        req: FastifyRequest<{ Params: { id: string } }>,
        rep: FastifyReply
    ) => {
        try {
            return { mensaje: await eliminar.ejecutar(req.params.id) };
        } catch (e: any) {
            return rep.status(404).send({ mensaje: e.message });
        }
    });
}
