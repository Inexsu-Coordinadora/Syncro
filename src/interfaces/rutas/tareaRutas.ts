import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CrearTarea } from "../../aplicacion/casosUso/tarea/CrearTarea";
import { ListarTareas } from "../../aplicacion/casosUso/tarea/ListarTareas";
import { ObtenerTareaPorId } from "../../aplicacion/casosUso/tarea/ObtenerTareaPorId";
import { ActualizarTarea } from "../../aplicacion/casosUso/tarea/ActualizarTarea";
import { EliminarTarea } from "../../aplicacion/casosUso/tarea/EliminarTarea";
import { TareaEsquema, TareaInput, TareaParsed } from "../validaciones/tareaEsquema";
import { ITarea } from "../../dominio/entidades/ITarea";
import { mapearError } from "../util/mapearErrores";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";

export function tareaRutas(
    crear: CrearTarea,
    listar: ListarTareas,
    obtenerPorId: ObtenerTareaPorId,
    actualizar: ActualizarTarea,
    eliminar: EliminarTarea
) {
    return async function (servidor: FastifyInstance) {
        // LISTAR
        servidor.get("/", async () => listar.ejecutar());

        // OBTENER POR ID
        servidor.get("/:id", async (
            req: FastifyRequest<{ Params: { id: string } }>,
            res: FastifyReply
        ) => {
            try {
                const tarea = await obtenerPorId.ejecutar(req.params.id);
                if (!tarea) throw new NotFoundError("Tarea no encontrada");
                return tarea;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        // CREAR
        servidor.post("/", async (
            req: FastifyRequest<{ Body: TareaInput }>,
            res: FastifyReply
        ) => {
            const parse = TareaEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                const nueva = await crear.ejecutar(parse.data as ITarea);
                return res.status(201).send(nueva);
            } catch (e) {
                return mapearError(res, e);
            }
        });

        // ACTUALIZAR
        servidor.put("/:id", async (
            req: FastifyRequest<{ Params: { id: string }; Body: TareaInput }>,
            res: FastifyReply
        ) => {
            const parse = TareaEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                const editada = await actualizar.ejecutar(req.params.id, parse.data as ITarea);
                if (!editada) throw new NotFoundError("Tarea no encontrada");
                return editada;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        // ELIMINAR
        servidor.delete("/:id", async (
            req: FastifyRequest<{ Params: { id: string } }>,
            res: FastifyReply
        ) => {
            try {
                const ok = await eliminar.ejecutar(req.params.id);
                if (!ok) throw new NotFoundError("Tarea no encontrada");
                return { mensaje: "Eliminado" };
            } catch (e) {
                return mapearError(res, e);
            }
        });
    };
}
