import { FastifyInstance } from "fastify";
import { IProyecto } from "../../dominio/entidades/IProyecto";
import { IRepositorioProyecto } from "../../dominio/repositorio/IRepositorioProyecto";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";
import { PersistenceError } from "../../aplicacion/errors/PersistenceError";



export class RepositorioProyectoPostgres implements IRepositorioProyecto {
  constructor(private servidor: FastifyInstance) { }

  async listarProyectos(): Promise<IProyecto[]> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        "SELECT * FROM proyectos ORDER BY id_proyecto DESC"
      );
      return resultado.rows;
    } catch (e: any) {
      throw new PersistenceError("Error al listar proyectos");
    } finally {
      cliente.release();
    }
  }

  async obtenerProyectoPorId(id: string): Promise<IProyecto | null> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        "SELECT * FROM proyectos WHERE id_proyecto = $1",
        [id]
      );
      return resultado.rows.length > 0 ? resultado.rows[0] : null;
    } catch (e: any) {
      throw new PersistenceError("Error al consultar proyecto por ID");
    } finally {
      cliente.release();
    }
  }

  async crearProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        `INSERT INTO proyectos (
          codigo_proyecto, nombre_proyecto, descripcion_proyecto,
          fecha_inicio, fecha_fin, estado_proyecto, id_cliente,
          consultor_asignado, roles_definidos
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [
          proyecto.codigo_proyecto,
          proyecto.nombre_proyecto,
          proyecto.descripcion_proyecto,
          proyecto.fecha_inicio,
          proyecto.fecha_fin,
          proyecto.estado_proyecto,
          proyecto.id_cliente,
          proyecto.consultor_asignado || null,
          proyecto.roles_definidos || null,
        ]
      );
      return resultado.rows[0];
    } catch (e: any) {
      throw new PersistenceError("Error al crear proyecto");
    } finally {
      cliente.release();
    }
  }

  async actualizarProyecto(id: string, proyecto: IProyecto): Promise<IProyecto | null> {
    const {
      codigo_proyecto,
      nombre_proyecto,
      descripcion_proyecto,
      fecha_inicio,
      fecha_fin,
      estado_proyecto,
      id_cliente,
      consultor_asignado,
      roles_definidos,
    } = proyecto;

    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        `UPDATE proyectos
         SET codigo_proyecto = $1, nombre_proyecto = $2, descripcion_proyecto = $3,
             fecha_inicio = $4, fecha_fin = $5, estado_proyecto = $6,
             id_cliente = $7, consultor_asignado = $8, roles_definidos = $9
         WHERE id_proyecto = $10 RETURNING *`,
        [
          codigo_proyecto,
          nombre_proyecto,
          descripcion_proyecto,
          fecha_inicio,
          fecha_fin,
          estado_proyecto,
          id_cliente,
          consultor_asignado || null,
          roles_definidos || null,
          id,
        ]
      );
      return resultado.rows.length > 0 ? resultado.rows[0] : null;
    } catch (e: any) {
      throw new PersistenceError("Error al actualizar proyecto");
    } finally {
      cliente.release();
    }
  }

  async eliminarProyecto(id: string): Promise<boolean> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        "DELETE FROM proyectos WHERE id_proyecto = $1 RETURNING *",
        [id]
      );
      if (resultado.rows.length === 0) {
        throw new NotFoundError(`Proyecto con ID ${id} no encontrado`);
      }
      return true;
    } catch (e: any) {
      if (e instanceof NotFoundError) throw e;
      throw new PersistenceError("Error al eliminar proyecto");
    } finally {
      cliente.release();
    }
  }
}
