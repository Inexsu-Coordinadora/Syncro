import { FastifyInstance } from 'fastify';
import { IProyecto } from '../../dominio/entidades/IProyecto';
import { IRepositorioProyecto } from '../../dominio/repositorio/IRepositorioProyecto';

export class RepositorioProyectoPostgres implements IRepositorioProyecto {
  constructor(private servidor: FastifyInstance) {}

  // LISTAR
  async listarProyectos(): Promise<IProyecto[]> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      'SELECT * FROM "proyectos" ORDER BY "idProyecto" DESC'
    );
    cliente.release();
    return resultado.rows;
  }

  // OBTENER POR ID
  async obtenerProyectoPorId(id: string): Promise<IProyecto | null> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      'SELECT * FROM "proyectos" WHERE "idProyecto" = $1',
      [id]
    );
    cliente.release();
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
  }

  // CREAR
  async crearProyecto(proyecto: IProyecto): Promise<IProyecto> {
    const {
      nombreProyecto,
      descripcionProyecto,
      clienteId,
      fechaInicio,
      fechaFin,
      estadoProyecto,
      consultorAsignado,
      rolesDefinidos
    } = proyecto;

    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      `INSERT INTO "proyectos" 
        ("nombreProyecto", "descripcionProyecto", "clienteId", "fechaInicio", "fechaFin", "estadoProyecto", "consultorAsignado", "rolesDefinidos")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        nombreProyecto,
        descripcionProyecto,
        clienteId,
        fechaInicio,
        fechaFin,
        estadoProyecto,
        consultorAsignado,
        rolesDefinidos
      ]
    );

    cliente.release();
    return resultado.rows[0];
  }

  // ACTUALIZAR
  async actualizarProyecto(id: string, proyecto: IProyecto): Promise<IProyecto | null> {
    const {
      nombreProyecto,
      descripcionProyecto,
      clienteId,
      fechaInicio,
      fechaFin,
      estadoProyecto,
      consultorAsignado,
      rolesDefinidos
    } = proyecto;

    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      `UPDATE "proyectos"
       SET "nombreProyecto" = $1,
           "descripcionProyecto" = $2,
           "clienteId" = $3,
           "fechaInicio" = $4,
           "fechaFin" = $5,
           "estadoProyecto" = $6,
           "consultorAsignado" = $7,
           "rolesDefinidos" = $8
       WHERE "idProyecto" = $9
       RETURNING *`,
      [
        nombreProyecto,
        descripcionProyecto,
        clienteId,
        fechaInicio,
        fechaFin,
        estadoProyecto,
        consultorAsignado,
        rolesDefinidos,
        id
      ]
    );

    cliente.release();
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
  }

  // ELIMINAR
  async eliminarProyecto(id: string): Promise<string> {
    const cliente = await this.servidor.pg.connect();
    const resultado = await cliente.query(
      'DELETE FROM "proyectos" WHERE "idProyecto" = $1 RETURNING *',
      [id]
    );
    cliente.release();

    if (resultado.rows.length === 0) {
      throw new Error('Proyecto no encontrado para eliminar');
    }

    return `Proyecto ${id} eliminado con éxito.`;
  }
}

