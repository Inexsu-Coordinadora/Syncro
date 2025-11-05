import fastify, { FastifyInstance } from 'fastify';
import { configurarConexionBD } from '../configuracion/conexionBD';

export const crearServidorBase = (): FastifyInstance => {
    const servidor = fastify({ logger: true });
    configurarConexionBD(servidor);
    return servidor;
}
