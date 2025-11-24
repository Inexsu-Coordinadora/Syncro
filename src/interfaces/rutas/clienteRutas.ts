import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ICliente } from "../../dominio/entidades/ICliente";
import { CrearCliente } from "../../aplicacion/casosUso/cliente/crearCliente";
import { ListarClientes } from "../../aplicacion/casosUso/cliente/ListarClientes";
import { ObtenerClientePorId } from "../../aplicacion/casosUso/cliente/ObtenerClientePorId";
import { ActualizarCliente } from "../../aplicacion/casosUso/cliente/ActualizarCliente";
import { EliminarCliente } from "../../aplicacion/casosUso/cliente/EliminarCliente";
import { ClienteEsquema } from "../validaciones/clienteEsquema";
import { mapearError } from "../util/mapearErrores";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";

export function clienteRutas(
    crear: CrearCliente,
    listar: ListarClientes,
    obtener: ObtenerClientePorId,
    actualizar: ActualizarCliente,
    eliminar: EliminarCliente
) {
    return async function (servidor: FastifyInstance) {
        servidor.get("/", async () => listar.ejecutar());

        servidor.get("/:id", async (
            req: FastifyRequest<{ Params: { id: string } }>,
            res: FastifyReply
        ) => {
            try {
                const cliente = await obtener.ejecutar(req.params.id);
                if (!cliente) throw new NotFoundError("Cliente no encontrado");
                return cliente;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.post("/", async (
            req: FastifyRequest<{ Body: ICliente }>,
            res: FastifyReply
        ) => {
            const parse = ClienteEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                return await crear.ejecutar(parse.data);
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.put("/:id", async (
            req: FastifyRequest<{ Params: { id: string }; Body: ICliente }>,
            res: FastifyReply
        ) => {
            const parse = ClienteEsquema.safeParse(req.body);
            if (!parse.success) return res.status(400).send(parse.error);

            try {
                const actualizado = await actualizar.ejecutar(req.params.id, parse.data);
                if (!actualizado) throw new NotFoundError("Cliente no encontrado");
                return actualizado;
            } catch (e) {
                return mapearError(res, e);
            }
        });

        servidor.delete("/:id", async (
            req: FastifyRequest<{ Params: { id: string } }>,
            res: FastifyReply
        ) => {
            try {
                const ok = await eliminar.ejecutar(req.params.id);
                if (!ok) throw new NotFoundError("Cliente no encontrado");
                return { mensaje: "Eliminado" };
            } catch (e) {
                return mapearError(res, e);
            }
        });
    };
}
