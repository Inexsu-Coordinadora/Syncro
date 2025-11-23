import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ClientePostgres } from '../../infraestructura/repositorios/repositorioClientePostgres';
import { ConsultarProyectosPorCliente } from '../../aplicacion/consultarProyectoPorCliente/consultarProyectoPorCliente'; 


export default async function clienteRutas(fastify: FastifyInstance) {

    const repositorioCliente = new ClientePostgres(); 

    const obtenerProyectosSchema = {
        params: {
            type: 'object',
            properties: {
                id: { 
                    type: 'string', 
                    description: 'ID del cliente (UUID)', 
                     format: 'uuid' 
                }
            },
            required: ['id']
        }
    };


    fastify.get('/clientes/:id/proyectos', { schema: obtenerProyectosSchema }, async (request: FastifyRequest, reply: FastifyReply) => {
        const { id } = request.params as { id: string };
        
        const casoUso = new ConsultarProyectosPorCliente(repositorioCliente);

        try {
            const proyectos = await casoUso.ejecutar(id);
            
            reply.status(200).send({ 
                status: 'success', 
                data: proyectos 
            });

        } catch (error) {
            
            const errorMsg = (error as Error).message || 'Error interno del servidor';
            let statusCode = 500;
            let errorCode = 'INTERNAL_ERROR';
            
            
            if (errorMsg.includes('CLIENTE_INEXISTENTE')) {
                statusCode = 404; 
                errorCode = 'CLIENTE_INEXISTENTE';
            } else if (errorMsg.includes('VALIDACION_ID_REQUERIDO')) {
                
                statusCode = 400; 
                errorCode = 'ID_REQUERIDO';
            } else if (errorMsg.includes('ERR_FASTIFY_VALIDATION')) {
        
                statusCode = 400;
                errorCode = 'FORMATO_ID_INVALIDO';
            }
            
            reply.status(statusCode).send({ 
                status: 'error', 
                code: errorCode,
                message: errorMsg
            });
        }
    });

}