import fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { configurarConexionBD } from '../configuracion/conexionBD';

export const crearServidorBase = async (): Promise<FastifyInstance> => {
    const servidor = fastify({ 
        logger: true 
    });

    try {
        // Configurar manejo global de errores
        servidor.setErrorHandler((error: Error & { statusCode?: number }, request: FastifyRequest, reply: FastifyReply) => {
            servidor.log.error(error);
            reply.status(error.statusCode || 500).send({
                error: {
                    message: error.message,
                    statusCode: error.statusCode || 500
                }
            });
        });

        // Configurar endpoint de salud
        servidor.get('/health', async () => {
            return { status: 'OK', timestamp: new Date().toISOString() };
        });

        // Configurar la base de datos
        await configurarConexionBD(servidor);

        return servidor;
    } catch (error) {
        console.error('Error al crear el servidor:', error);
        throw error;
    }
}
