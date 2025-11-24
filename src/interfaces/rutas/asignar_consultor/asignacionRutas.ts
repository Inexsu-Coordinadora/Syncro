import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AsignarConsultorProyecto } from '../../../aplicacion/casosUso/asignar_consultor/AsignarConsultorProyecto';
import { IAsignacion } from '../../../dominio/entidades/asignar_consultor/IAsignacion';
import { HttpStatus } from '../../../common/statusCode';

export function asignacionRutas(asignar: AsignarConsultorProyecto) {
  
  return async function (servidor: FastifyInstance) {
    
    servidor.post('/', async (peticion: FastifyRequest<{ Body: IAsignacion }>, respuesta: FastifyReply) => {
        try {
            const nuevaAsignacion = await asignar.ejecutar(peticion.body);
            return respuesta.status(201).send(nuevaAsignacion);
        } catch (error: any) {
            // Manejo de errores uniforme basado en los mensajes de error del caso de uso
            if (error.message.includes('inexistente')) return respuesta.status(HttpStatus.NO_ENCONTRADO).send({ codigo: "ASIG_404", mensaje: error.message });
            if (error.message.includes('duplicada')) return respuesta.status(HttpStatus.SOLICITUD_INCORRECTA).send({ codigo: "ASIG_409_DUP", mensaje: error.message });
            if (error.message.includes('inválidas') || error.message.includes('Exceso')) return respuesta.status(HttpStatus.SOLICITUD_INCORRECTA).send({ codigo: "ASIG_400_VAL", mensaje: error.message });
            respuesta.status(HttpStatus.ERROR_SERVIDOR).send({ codigo: "GEN_500", mensaje: "Error interno del servidor", detalle: error.message });
        }
    });
  };
}