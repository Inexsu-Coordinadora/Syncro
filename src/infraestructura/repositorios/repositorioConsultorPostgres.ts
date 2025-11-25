import { FastifyInstance } from 'fastify';
import { IConsultor } from "../../dominio/entidades/IConsultor"; 
import { IRepositorioConsultor } from "../../dominio/repositorio/IRepositorioConsultor";  

export class RepositorioConsultorPostgres implements IRepositorioConsultor {
  constructor(private servidor: FastifyInstance) {}

  async crear(consultor: IConsultor): Promise<IConsultor> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        'INSERT INTO consultores ("idConsultor", "nombreConsultor", "especialidadConsultor", "emailConsultor", "telefonoConsultor") VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          consultor.idConsultor, 
          consultor.nombreConsultor, 
          consultor.especialidadConsultor, 
          consultor.emailConsultor, 
          consultor.telefonoConsultor
        ]
      );
      return resultado.rows[0]; // Retornar un solo objeto, no el array
    } catch (error) {
      throw new Error(`Error al crear consultor: ${error}`);
    } finally {
      cliente.release();
    }
  }

  async actualizar(idConsultor: string, consultor: IConsultor): Promise<IConsultor | null> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        'UPDATE consultores SET "nombreConsultor" = $1, "especialidadConsultor" = $2, "emailConsultor" = $3, "telefonoConsultor" = $4 WHERE "idConsultor" = $5 RETURNING *',
        [
          consultor.nombreConsultor, 
          consultor.especialidadConsultor, 
          consultor.emailConsultor, 
          consultor.telefonoConsultor, 
          idConsultor
        ]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al actualizar consultor: ${error}`);
    } finally {
      cliente.release();
    }
  }

  async eliminar(idConsultor: string): Promise<boolean> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        'DELETE FROM consultores WHERE "idConsultor" = $1',
        [idConsultor]
      );
      return (resultado.rowCount ?? 0) > 0;
    } catch (error) {
      throw new Error(`Error al eliminar consultor: ${error}`);
    } finally {
      cliente.release();
    }
  }

  async obtener(): Promise<IConsultor[]> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query('SELECT * FROM consultores');
      return resultado.rows;
    } catch (error) {
      throw new Error(`Error al obtener consultores: ${error}`);
    } finally {
      cliente.release();
    }
  }

  async obtenerPorId(idConsultor: string): Promise<IConsultor | null> {
    const cliente = await this.servidor.pg.connect();
    try {
      const resultado = await cliente.query(
        'SELECT * FROM consultores WHERE "idConsultor" = $1',
        [idConsultor]
      );
      return resultado.rows[0] || null;
    } catch (error) {
      throw new Error(`Error al obtener consultor por ID: ${error}`);
    } finally {
      cliente.release();
    }
  }
}