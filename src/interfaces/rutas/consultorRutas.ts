import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { Pool } from 'pg';
import { ConsultorRepositorio } from '../../infraestructura/repositorios/repositorioConsultorPostgres';
import { CrearConsultor } from '../../aplicacion/casosUso/consultor/CrearConsultor';
import { ListarConsultor } from '../../aplicacion/casosUso/consultor/ListarConsultor';
import { ObtenerConsultorPorId } from '../../aplicacion/casosUso/consultor/ObtenerConsultorPorId';
import { ActualizarConsultor } from '../../aplicacion/casosUso/consultor/ActualizarConsultor';
import { EliminarConsultor } from '../../aplicacion/casosUso/consultor/EliminarConsultor';

interface ConsultorRoutesOptions extends FastifyPluginOptions {
  pool: Pool;
}

export default async function consultorRutas(
  fastify: FastifyInstance,
  options: ConsultorRoutesOptions
) {
  const { pool } = options;
  const repositorio = new ConsultorRepositorio(pool);

  fastify.post('/api/consultores', async (request, reply) => {
    try {
      const crearConsultor = new CrearConsultor(repositorio);
      const consultor = await crearConsultor.ejecutar(request.body as any);
      return reply.status(201).send(consultor);
    } catch (error: any) {
      if (error.message.includes('ya está registrado')) {
        return reply.status(409).send({ error: error.message });
      }
    
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.get('/api/consultores', async (_request, reply) => {
    try {
      const listarConsultores = new ListarConsultor(repositorio);
      const consultores = await listarConsultores.ejecutar();
      return reply.status(200).send(consultores);
    } catch (error: any) {
      console.error('Error al listar consultores:', error);
      return reply.status(500).send({ error: 'Error al listar consultores' });
    }
  });

  fastify.get('/api/consultores/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const obtenerConsultor = new ObtenerConsultorPorId(repositorio);
      const consultor = await obtenerConsultor.ejecutar(id);
      
      if (!consultor) {
        return reply.status(404).send({ error: 'Consultor no encontrado' });
      }
      
      return reply.status(200).send(consultor);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/api/consultores/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const actualizarConsultor = new ActualizarConsultor(repositorio);
      const consultor = await actualizarConsultor.ejecutar(id, request.body as any);
      
      if (!consultor) {
        return reply.status(404).send({ error: 'Consultor no encontrado' });
      }
      
      return reply.status(200).send(consultor);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  fastify.delete('/api/consultores/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const eliminarConsultor = new EliminarConsultor(repositorio);
      const eliminado = await eliminarConsultor.ejecutar(id);
      
      if (!eliminado) {
        return reply.status(404).send({ error: 'Consultor no encontrado' });
      }
      
      return reply.status(204).send();
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}