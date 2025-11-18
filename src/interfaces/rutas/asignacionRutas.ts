import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AsignarConsultorProyecto } from '../../aplicacion/casosUso/proyecto/AsignarConsultorProyecto';
import { IAsignacion } from '../../dominio/entidades/IAsignacion';

export function asignacionRutas(asignar: AsignarConsultorProyecto) {
  
  return async function (servidor: FastifyInstance) {
    
    servidor.post('/', async (peticion: FastifyRequest<{ Body: IAsignacion }>, respuesta: FastifyReply) => {
        try {
            const nuevaAsignacion = await asignar.ejecutar(peticion.body);
            return respuesta.status(201).send(nuevaAsignacion);
        } catch (error: any) {
            // Manejo de errores uniforme basado en los mensajes de error del caso de uso
            if (error.message.includes('inexistente')) return respuesta.status(404).send({ codigo: "ASIG_404", mensaje: error.message });
            if (error.message.includes('duplicada')) return respuesta.status(409).send({ codigo: "ASIG_409_DUP", mensaje: error.message });
            if (error.message.includes('inválidas') || error.message.includes('Exceso')) return respuesta.status(400).send({ codigo: "ASIG_400_VAL", mensaje: error.message });
            respuesta.status(500).send({ codigo: "GEN_500", mensaje: "Error interno del servidor", detalle: error.message });
        }
    });
  };
}