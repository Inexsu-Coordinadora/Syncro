import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CrearProyecto } from "../../aplicacion/casosUso/proyecto/CrearProyecto";
import { ListarProyectos } from "../../aplicacion/casosUso/proyecto/ListarProyectos";
import { ObtenerProyectoPorId } from "../../aplicacion/casosUso/proyecto/ObtenerProyectoPorId";
import { ActualizarProyecto } from "../../aplicacion/casosUso/proyecto/ActualizarProyecto";
import { EliminarProyecto } from "../../aplicacion/casosUso/proyecto/EliminarProyecto";
import { ProyectoEsquema, ProyectoInput, ProyectoParsed } from "../validaciones/proyectoEsquema";
import { IProyecto } from "../../dominio/entidades/IProyecto";
import { mapearError } from "../util/mapearErrores";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";

export function proyectoRutas(
    crear: CrearProyecto,
    consultarTodos: ListarProyectos,
    consultarPorId: ObtenerProyectoPorId,
    actualizar: ActualizarProyecto,
    eliminar: EliminarProyecto
) {
    return async function (servidor: FastifyInstance) {
        servidor.get("/", async () => consultarTodos.ejecutar());

        servidor.get("/:idProyecto", async (
            req: FastifyRequest<{ Params: { idProyecto: string } }>,
            res: FastifyReply
        ) => {
            try {
                const proyecto = await consultarPorId.ejecutar(req.params.idProyecto);
                if (!proyecto) throw new NotFoundError("Proyecto no encontrado");
                return proyecto;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.post("/", async (
            req: FastifyRequest<{ Body: ProyectoInput }>,
            res: FastifyReply
        ) => {
            const parse = ProyectoEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                const nuevo = await crear.ejecutar(parse.data as IProyecto);
                return res.status(201).send(nuevo);
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.put("/:idProyecto", async (
            req: FastifyRequest<{ Params: { idProyecto: string }; Body: ProyectoInput }>,
            res: FastifyReply
        ) => {
            const parse = ProyectoEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                const actualizado = await actualizar.ejecutar(req.params.idProyecto, parse.data as IProyecto);
                if (!actualizado) throw new NotFoundError("Proyecto no encontrado");
                return actualizado;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.delete("/:idProyecto", async (
            req: FastifyRequest<{ Params: { idProyecto: string } }>,
            res: FastifyReply
        ) => {
            try {
                const ok = await eliminar.ejecutar(req.params.idProyecto);
                if (!ok) throw new NotFoundError("Proyecto no encontrado");
                return { mensaje: "Eliminado" };
            } catch (e) {
                return mapearError(res, e);
            }
        });
    };
}
