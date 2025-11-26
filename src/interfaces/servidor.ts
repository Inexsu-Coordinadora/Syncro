import Fastify, { FastifyInstance } from "fastify";
import consultorRutas from "../interfaces/rutas/consultorRutas";

<<<<<<< HEAD
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
=======
export function crearServidorBase(): FastifyInstance {
    const app = Fastify({ logger: true });

    app.register(consultorRutas, { prefix: "/api" });

    

    return app;
}
>>>>>>> b30b58e262039a921993cc4e13d2a9ce26e55470
