import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CrearProyecto } from '../../aplicacion/casosUso/CrearProyecto';
import { ListarProyectos } from '../../aplicacion/casosUso/ListarProyectos';
import { ObtenerProyectoPorId } from '../../aplicacion/casosUso/ObtenerProyectoPorId';
import { ActualizarProyecto } from '../../aplicacion/casosUso/ActualizarProyecto';
import { EliminarProyecto } from '../../aplicacion/casosUso/EliminarProyecto';
import { IProyecto } from '../../dominio/entidades/IProyecto';


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
        if (!proyecto) return respuesta.status(404).send({ mensaje: 'Proyecto no encontrado' });
        return proyecto;
    });

    servidor.post('/', async (peticion: FastifyRequest<{ Body: IProyecto }>, respuesta: FastifyReply) => {
        try {
            // Nota: El body de la petición debe ser el objeto IProyecto completo ahora
            const nuevoProyecto = await crear.ejecutar(peticion.body);
            return respuesta.status(201).send(nuevoProyecto);
        } catch (error: any) {
            respuesta.status(400).send({ mensaje: error.message });
        }
    });

    servidor.put('/:idProyecto', async (peticion: FastifyRequest<{ Params: { idProyecto: string }, Body: IProyecto }>, respuesta: FastifyReply) => {
        try {
            const proyectoActualizado = await actualizar.ejecutar(peticion.params.idProyecto, peticion.body);
            if (!proyectoActualizado) return respuesta.status(404).send({ mensaje: 'Proyecto no encontrado' });
            return proyectoActualizado;
        } catch (error: any) {
            respuesta.status(400).send({ mensaje: error.message });
        }
    });

    servidor.delete('/:idProyecto', async (peticion: FastifyRequest<{ Params: { idProyecto: string } }>, respuesta: FastifyReply) => {
        try {
            const mensaje = await eliminar.ejecutar(peticion.params.idProyecto);
            return { mensaje };
        } catch (error: any) {
             if (error.message.includes('no encontrado')) return respuesta.status(404).send({ mensaje: error.message });
             respuesta.status(500).send({ mensaje: error.message });
        }
    });

  };
}