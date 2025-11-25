import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CrearProyecto } from '../../aplicacion/casosUso/proyecto/CrearProyecto';
import { ListarProyectos } from '../../aplicacion/casosUso/proyecto/ListarProyectos';
import { ObtenerProyectoPorId } from '../../aplicacion/casosUso/proyecto/ObtenerProyectoPorId';
import { ActualizarProyecto } from '../../aplicacion/casosUso/proyecto/ActualizarProyecto';
import { EliminarProyecto } from '../../aplicacion/casosUso/proyecto/EliminarProyecto';
import { IProyecto } from '../../dominio/entidades/IProyecto';
import { NotFoundError } from '../../aplicacion/errors/NotFoundError';
import { HttpStatus } from '../../common/statusCode';

// Definición de las rutas para la entidad Proyecto
export function proyectoRutas(
  crear: CrearProyecto,
  consultarTodos: ListarProyectos,
  consultarPorId: ObtenerProyectoPorId,
  actualizar: ActualizarProyecto,
  eliminar: EliminarProyecto
) {
  return async function (servidor: FastifyInstance) {
    
    servidor.get('/', async () => {
      return consultarTodos.ejecutar();
    });

    servidor.get('/:idProyecto', async (peticion: FastifyRequest<{ Params: { idProyecto: string } }>, respuesta: FastifyReply) => {
        const proyecto = await consultarPorId.ejecutar(peticion.params.idProyecto);
        if (!proyecto) return respuesta.status(HttpStatus.NO_ENCONTRADO).send({ mensaje: 'Proyecto no encontrado' });
        return proyecto;
    });

    servidor.post('/', async (peticion: FastifyRequest<{ Body: IProyecto }>, respuesta: FastifyReply) => {
        if (peticion.body.fecha_inicio) peticion.body.fecha_inicio = new Date(peticion.body.fecha_inicio);
        if (peticion.body.fecha_fin) peticion.body.fecha_fin = new Date(peticion.body.fecha_fin);
        try {
            const nuevoProyecto = await crear.ejecutar(peticion.body);
            return respuesta.status(HttpStatus.CREADO).send(nuevoProyecto);
        } catch (error: any) {
            respuesta.status(HttpStatus.SOLICITUD_INCORRECTA).send({ mensaje: error.message });
        }
    });

    servidor.put('/:idProyecto', async (peticion: FastifyRequest<{ Params: { idProyecto: string }, Body: IProyecto }>, respuesta: FastifyReply) => {
    if (peticion.body.fecha_inicio) peticion.body.fecha_inicio = new Date(peticion.body.fecha_inicio);
    if (peticion.body.fecha_fin) peticion.body.fecha_fin = new Date(peticion.body.fecha_fin);
        try {
            const proyectoActualizado = await actualizar.ejecutar(peticion.params.idProyecto, peticion.body);
            if (!proyectoActualizado) return respuesta.status(HttpStatus.NO_ENCONTRADO).send({ mensaje: 'Proyecto no encontrado' });
            return proyectoActualizado;
        } catch (error: any) {
            respuesta.status(HttpStatus.SOLICITUD_INCORRECTA).send({ mensaje: error.message });
        }
    });

servidor.delete('/:idProyecto', async (peticion: FastifyRequest<{ Params: { idProyecto: string } }>, respuesta: FastifyReply) => {
    try {
        const mensaje = await eliminar.ejecutar(peticion.params.idProyecto);
        return respuesta.status(HttpStatus.EXITO).send ({ mensaje });
    } catch (error: any) {
         if (error instanceof NotFoundError) {
            return respuesta.status(HttpStatus.NO_ENCONTRADO).send({ message: error.message, statusCode: HttpStatus.NO_ENCONTRADO });
         }
         respuesta.status(HttpStatus.ERROR_SERVIDOR).send({ mensaje: 'Error interno del servidor', detalle: error.message });
    }
});

  };
}