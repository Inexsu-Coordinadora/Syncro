import fastify, { FastifyInstance } from 'fastify';
import { configurarConexionBD } from '../configuracion/conexionBD';

export const crearServidorBase = async (): Promise<FastifyInstance> => {
    const servidor = fastify({ 
        logger: true,
        ajv: {
            customOptions: {
                removeAdditional: 'all',
                coerceTypes: true
            }
        }
    });

    // Configurar la base de datos
    await configurarConexionBD(servidor);

    return servidor;
}
