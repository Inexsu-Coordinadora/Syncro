import { FastifyInstance } from 'fastify';
import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';



export class RepositorioProyectoPostgres implements IRepositorioProyecto {
  constructor(private servidor: FastifyInstance) {}

  async listarProyectos(): Promise<IProyecto[]> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query('SELECT * FROM proyectos ORDER BY "idProyecto" DESC');
    cliente.release();
    return resultado.rows;
  }

  async obtenerProyectoPorId(id: string): Promise<IProyecto | null> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query('SELECT * FROM proyectos WHERE "idProyecto" = $1', [id]);
    cliente.release();
    return resultado.rows.length > 0 ? resultado.rows[0] : null; 
  }

  async crearProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const { nombreProyecto, descripcionProyecto, clienteId, fecha_inicio, fecha_fin, estadoProyecto, consultor_asignado, roles_definidos } = proyecto;
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      'INSERT INTO proyectos ("nombreProyecto", "descripcionProyecto", "clienteId", fecha_inicio, fecha_fin, "estadoProyecto", consultor_asignado, roles_definidos) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [nombreProyecto, descripcionProyecto, clienteId, fecha_inicio, fecha_fin, estadoProyecto, consultor_asignado, roles_definidos]
    );
    cliente.release();
    return resultado.rows[0];
  }

  async actualizarProyecto(id: string, proyecto: IProyecto): Promise<IProyecto | null> {
      const { nombreProyecto, descripcionProyecto, clienteId, fecha_inicio, fecha_fin, estadoProyecto, consultor_asignado, roles_definidos } = proyecto;
      const cliente = await this.servidor.pg.connect();
      const resultado = await cliente.query(
        'UPDATE proyectos SET "nombreProyecto" = $1, "descripcionProyecto" = $2, "clienteId" = $3, fecha_inicio = $4, fecha_fin = $5, "estadoProyecto" = $6, consultor_asignado = $7, roles_definidos = $8 WHERE "idProyecto" = $9 RETURNING *',
        [nombreProyecto, descripcionProyecto, clienteId, fecha_inicio, fecha_fin, estadoProyecto, consultor_asignado, roles_definidos, id]
      );
      cliente.release();
      return resultado.rows.length > 0 ? resultado.rows[0] : null;
  }

  async eliminarProyecto(id: string): Promise<string> {
      const cliente = await this.servidor.pg.connect();
      const resultado = await cliente.query('DELETE FROM proyectos WHERE "idProyecto" = $1 RETURNING *', [id]);
      cliente.release();
      if (resultado.rows.length === 0) {
          throw new Error('Proyecto no encontrado para eliminar');
      }
      return `Proyecto ${id} eliminado con éxito.`;
  }
}
