import fastify, { FastifyInstance } from 'fastify';
import { configurarConexionBD } from '../configuracion/conexionBD';

export const crearServidorBase = (): FastifyInstance => {
    const servidor = fastify({ logger: true });
    configurarConexionBD(servidor);
    return servidor;
<<<<<<< HEAD
}


export const configurarRutas = (servidor: FastifyInstance, repositorioProyectos: IRepositorioProyecto) => {
    const crearProyecto = new CrearProyecto(repositorioProyectos);
    const listarProyectos = new ListarProyectos(repositorioProyectos);
    const obtenerProyectoPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizarProyecto = new ActualizarProyecto(repositorioProyectos);
    const eliminarProyecto = new EliminarProyecto(repositorioProyectos);

    // Registro de rutas
    servidor.register(proyectoRutas(
        crearProyecto, 
        listarProyectos, 
        obtenerProyectoPorId,
        actualizarProyecto,
        eliminarProyecto
    ), { prefix: '/api/proyectos' });
}
import fastify from 'fastify';
import { configuration } from '..';
import { clienteRutas } from './rutas/clienteRutas';

const server = fastify({
    logger: true
});

// Registrar rutas
server.register(clienteRutas, { prefix: '/clientes' });

// Iniciar el servidor
const startServer = async () => {
    try {
        await server.listen({ 
            port: configuration.httpPuerto,
            host: '0.0.0.0'
        });
        console.log(`⚡🚀Servidor iniciado en puerto ${configuration.httpPuerto}⚡🚀`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

startServer();
=======
}
>>>>>>> d5736851b1ecd97eebada62980a771e97d2cd686
