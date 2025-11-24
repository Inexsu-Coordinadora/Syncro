import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ClienteEsquema } from "../validaciones/clienteEsquema";
import { CrearCliente } from "../../aplicacion/casosUso/cliente/crearCliente";
import { ListarClientes } from "../../aplicacion/casosUso/cliente/ListarClientes";
import { ObtenerClientePorId } from "../../aplicacion/casosUso/cliente/ObtenerClientePorId";
import { ActualizarCliente } from "../../aplicacion/casosUso/cliente/ActualizarCliente";
import { EliminarCliente } from "../../aplicacion/casosUso/cliente/EliminarCliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ICliente } from "../../dominio/entidades/ICliente";

export async function clienteRutas(
    servidor: FastifyInstance,
    repositorio: IRepositorioCliente
) {
    const listarClientes = new ListarClientes(repositorio);
    const obtenerClientePorId = new ObtenerClientePorId(repositorio);
    const crearCliente = new CrearCliente(repositorio);
    const actualizarCliente = new ActualizarCliente(repositorio);
    const eliminarCliente = new EliminarCliente(repositorio);

    // LISTAR TODOS
    servidor.get("/", async () => {
        return await listarClientes.ejecutar();
    });

    // OBTENER POR ID
    servidor.get("/:id", async (
        req: FastifyRequest<{ Params: { id: string } }>,
        res: FastifyReply
    ) => {
        const cliente = await obtenerClientePorId.ejecutar(req.params.id);
        if (!cliente) return res.status(404).send({ mensaje: "No encontrado" });
        return cliente;
    });

    // CREAR
    servidor.post("/", async (
        req: FastifyRequest<{ Body: ICliente }>,
        res: FastifyReply
    ) => {
        const parse = ClienteEsquema.safeParse(req.body);
        if (!parse.success) return res.status(400).send(parse.error);

        return await crearCliente.ejecutar(parse.data);
    });

    // ACTUALIZAR
    servidor.put("/:id", async (
        req: FastifyRequest<{ Params: { id: string }; Body: ICliente }>,
        res: FastifyReply
    ) => {
        const parse = ClienteEsquema.safeParse(req.body);
        if (!parse.success) return res.status(400).send(parse.error);

        const actualizado = await actualizarCliente.ejecutar(req.params.id, parse.data);
        if (!actualizado) return res.status(404).send({ mensaje: "No encontrado" });
        return actualizado;
    });

    // ELIMINAR
    servidor.delete("/:id", async (
        req: FastifyRequest<{ Params: { id: string } }>,
        res: FastifyReply
    ) => {
        try {
            return await eliminarCliente.ejecutar(req.params.id);
        } catch {
            return res.status(404).send({ mensaje: "No encontrado" });
        }
    });
}
