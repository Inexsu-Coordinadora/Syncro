import { FastifyInstance } from 'fastify';
import { ClientePostgres } from '../../infraestructura/repositorios/repositorioClientePostgres';
import { CrearCliente } from '../../aplicacion/casosUso/crearCliente';
import { ListarClientes } from '../../aplicacion/casosUso/ListarClientes';
import { ObtenerClientePorId } from '../../aplicacion/casosUso/ObtenerClientePorId';
import { ActualizarCliente } from '../../aplicacion/casosUso/ActualizarCliente';
import { EliminarCliente } from '../../aplicacion/casosUso/EliminarCliente';
import { NotFoundError } from '../../aplicacion/errors/NotFoundError';

export async function clienteRutas(fastify: FastifyInstance) {
    const repositorioCliente = new ClientePostgres();
    
    // Casos de uso
    const crearClienteUC = new CrearCliente(repositorioCliente);
    const listarClientesUC = new ListarClientes(repositorioCliente);
    const obtenerClientePorIdUC = new ObtenerClientePorId(repositorioCliente);
    const actualizarClienteUC = new ActualizarCliente(repositorioCliente);
    const eliminarClienteUC = new EliminarCliente(repositorioCliente);

    // Crear cliente
    fastify.post('/', async (request, reply) => {
        try {
            const cliente = await crearClienteUC.ejecutar(request.body as any);
            return reply.code(201).send(cliente);
        } catch (error: any) {
            request.log.error(error);
            return reply.code(400).send({ error: error.message });
        }
    });

    // Listar todos los clientes
    fastify.get('/', async (request, reply) => {
        try {
            const clientes = await listarClientesUC.ejecutar();
            return reply.send(clientes);
        } catch (error) {
            request.log.error(error);
            return reply.code(500).send({ error: 'Error interno del servidor' });
        }
    });

    // Obtener cliente por ID
    fastify.get('/:id', async (request, reply) => {
        try {
            const cliente = await obtenerClientePorIdUC.ejecutar((request.params as any).id);
            return reply.send(cliente);
        } catch (error) {
            request.log.error(error);
            if (error instanceof NotFoundError) {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(500).send({ error: 'Error interno del servidor' });
        }
    });

    // Actualizar cliente
    fastify.put('/:id', async (request, reply) => {
        try {
            const cliente = await actualizarClienteUC.ejecutar(
                (request.params as any).id,
                request.body as any
            );
            return reply.send(cliente);
        } catch (error: any) {
            request.log.error(error);
            if (error instanceof NotFoundError) {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(400).send({ error: error.message });
        }
    });

    // Eliminar cliente
    fastify.delete('/:id', async (request, reply) => {
        try {
            const mensaje = await eliminarClienteUC.ejecutar((request.params as any).id);
            return reply.send({ message: mensaje });
        } catch (error) {
            request.log.error(error);
            if (error instanceof NotFoundError) {
                return reply.code(404).send({ error: error.message });
            }
            return reply.code(500).send({ error: 'Error interno del servidor' });
        }
    });
}