import fastify, { FastifyInstance } from 'fastify';
import { configurarConexionBD } from '../configuracion/conexionBD';
import { proyectoRutas } from './rutas/proyectoRutas';
import { IRepositorioProyecto } from '../dominio/repositorio/IRepositorioProyecto'; 
import { CrearProyecto } from '../aplicacion/casosUso/CrearProyecto';
import { ListarProyectos } from '../aplicacion/casosUso/ListarProyectos';
import { ObtenerProyectoPorId } from '../aplicacion/casosUso/ObtenerProyectoPorId';
import { ActualizarProyecto } from '../aplicacion/casosUso/ActualizarProyecto';
import { EliminarProyecto } from '../aplicacion/casosUso/EliminarProyecto';


// La función ahora solo crea el servidor base y la conexión BD.
export const crearServidorBase = (): FastifyInstance => {
    const servidor = fastify({ logger: true });
    configurarConexionBD(servidor);
    return servidor;
}

// Creamos una nueva función para configurar todas las rutas e inyectar dependencias.
export const configurarRutas = (servidor: FastifyInstance, repositorioProyectos: IRepositorioProyecto) => {
    // Inicialización de Casos de Uso con el repositorio inyectado
    const crearProyecto = new CrearProyecto(repositorioProyectos);
    const listarProyectos = new ListarProyectos(repositorioProyectos);
    const obtenerProyectoPorId = new ObtenerProyectoPorId(repositorioProyectos);
    const actualizarProyecto = new ActualizarProyecto(repositorioProyectos);
    const eliminarProyecto = new EliminarProyecto(repositorioProyectos);

    // Registro de rutas, inyectando los casos de uso
    servidor.register(proyectoRutas(
        crearProyecto, 
        listarProyectos, 
        obtenerProyectoPorId,
        actualizarProyecto,
        eliminarProyecto
    ), { prefix: '/api/proyectos' });
}