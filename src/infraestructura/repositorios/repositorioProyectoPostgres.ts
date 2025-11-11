import { FastifyInstance } from 'fastify';
import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

export class RepositorioProyectoPostgres implements IRepositorioProyecto {
  constructor(private servidor: FastifyInstance) {}

  async listarProyectos(): Promise<IProyecto[]> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query('SELECT * FROM proyectos ORDER BY id_proyecto DESC');
    cliente.release();
    return resultado.rows;
  }

  async obtenerProyectoPorId(id: string): Promise<IProyecto | null> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query('SELECT * FROM proyectos WHERE id_proyecto = $1', [id]);
    cliente.release();
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
  }

  async crearProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const {
      nombre_proyecto,
      descripcion_proyecto,
      codigo_proyecto,
      id_cliente,
      fecha_inicio,
      fecha_fin,
      estado_proyecto
    } = proyecto;

    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      `INSERT INTO proyectos (
        nombre_proyecto,
        descripcion_proyecto,
        codigo_proyecto,
        id_cliente,
        fecha_inicio,
        fecha_fin,
        estado_proyecto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre_proyecto, descripcion_proyecto, codigo_proyecto, id_cliente, fecha_inicio, fecha_fin, estado_proyecto]
    );
    cliente.release();
    return resultado.rows[0];
  }

  async actualizarProyecto(id: string, proyecto: IProyecto): Promise<IProyecto | null> {
    const {
      nombre_proyecto,
      descripcion_proyecto,
      codigo_proyecto,
      id_cliente,
      fecha_inicio,
      fecha_fin,
      estado_proyecto
    } = proyecto;

    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      `UPDATE proyectos SET
        nombre_proyecto = $1,
        descripcion_proyecto = $2,
        codigo_proyecto = $3,
        id_cliente = $4,
        fecha_inicio = $5,
        fecha_fin = $6,
        estado_proyecto = $7
      WHERE id_proyecto = $8 RETURNING *`,
      [nombre_proyecto, descripcion_proyecto, codigo_proyecto, id_cliente, fecha_inicio, fecha_fin, estado_proyecto, id]
    );
    cliente.release();
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
  }

  async eliminarProyecto(id: string): Promise<string> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query('DELETE FROM proyectos WHERE id_proyecto = $1 RETURNING *', [id]);
    cliente.release();
    if (resultado.rows.length === 0) {
      throw new Error('Proyecto no encontrado para eliminar');
    }
    return `Proyecto ${id} eliminado con éxito.`;
  }
}
