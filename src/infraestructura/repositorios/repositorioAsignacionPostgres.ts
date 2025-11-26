import { FastifyInstance } from 'fastify';
import { IAsignacion } from '../../dominio/entidades/IAsignacion';
import { IRepositorioAsignacion } from '../../dominio/repositorio/IRepositorioAsignacion';
import { any } from 'zod';  


export class RepositorioAsignacionPG implements IRepositorioAsignacion {
  constructor(private servidor: FastifyInstance) {}

  
  async crearAsignacion(asignacion: IAsignacion): Promise<IAsignacion> {
    const { consultorId, proyectoId, rolConsultor, porcentajeDedicacion, fechaInicio, fechaFin } = asignacion;
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      
      'INSERT INTO asignaciones (consultorId, proyectoId, rolConsultor, porcentajeDedicacion, fechaInicio, fechaFin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [consultorId, proyectoId, rolConsultor, porcentajeDedicacion, fechaInicio, fechaFin]
    );
    cliente.release();
    return resultado.rows[0];
  }

  async obtenerAsignacionesSuperpuestas(consultorId: string, fechaInicio: Date, fechaFin: Date): Promise<IAsignacion[]> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      `SELECT * FROM asignaciones 
       WHERE consultorId = $1 
       AND fechaInicio <= $3 
       AND fechaFin >= $2`,
      [consultorId, fechaInicio, fechaFin]
    );
    cliente.release();
    return resultado.rows;
  }

  async verificarAsignacionDuplicada(consultorId: string, proyectoId: string, rolConsultor: string | null): Promise<boolean> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      'SELECT 1 FROM asignaciones WHERE consultorId = $1 AND proyectoId = $2 AND rolConsultor = $3',
      [consultorId, proyectoId, rolConsultor]
    );
    cliente.release();
    return (resultado.rowCount ?? 0) > 0;
  }
}