import { FastifyInstance } from "fastify";
import { CrearTarea } from "../../aplicacion/casosUso/CrearTarea";
import { ListarTareasPorProyecto } from "../../aplicacion/casosUso/ListarTareasPorProyecto";
import { CambiarEstadoTarea } from "../../aplicacion/casosUso/ActualizarEstadoTarea";

export function tareaRutas(crear: CrearTarea, listarPorProyecto: ListarTareasPorProyecto, cambiarEstado: CambiarEstadoTarea) {
    return async function (app: FastifyInstance) {

        app.post("/", async (req, reply) => {
            try {
                const nueva = await crear.ejecutar(req.body as any);
                reply.send(nueva);
            } catch (err: any) {
                reply.status(400).send({ mensaje: err.message });
            }
        });

        app.get("/proyecto/:idProyecto", async (req, reply) => {
            reply.send(await listarPorProyecto.ejecutar((req.params as any).idProyecto));
        });

        app.put("/:idTarea/estado", async (req, reply) => {
            try {
                const { idTarea } = req.params as any;
                const { estado } = req.body as any;
                const tarea = await cambiarEstado.ejecutar(idTarea, estado);
                reply.send(tarea);
            } catch (err: any) {
                reply.status(400).send({ mensaje: err.message });
            }
        });
    };
}
