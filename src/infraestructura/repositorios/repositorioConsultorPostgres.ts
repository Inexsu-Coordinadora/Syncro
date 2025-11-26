import { IConsultor } from '../../dominio/entidades/IConsultor';
import { Pool } from 'pg';

export class ConsultorRepositorio {
  constructor(private pool: Pool) {}

  private mapearDesdeDB(row: any): IConsultor {
    return {
      idConsultor: row.id_consultor.toString(),
      nombre: row.nombre,
      emailConsultor: row.email_consultor,
      telefono: row.telefono,
      especialidad: row.especialidad
    };
  }

  async crear(datos: Omit<IConsultor, 'idConsultor'>): Promise<IConsultor> {
    const query = `
      INSERT INTO consultores (nombre, email_consultor, telefono, especialidad)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const valores = [
      datos.nombre,
      datos.emailConsultor,
      datos.telefono || null,
      datos.especialidad || null
    ];

    const resultado = await this.pool.query(query, valores);
    return this.mapearDesdeDB(resultado.rows[0]);
  }

  async listar(): Promise<IConsultor[]> {
    const query = 'SELECT * FROM consultores ORDER BY id_consultor'; //
    const resultado = await this.pool.query(query);
    return resultado.rows.map(row => this.mapearDesdeDB(row));
  }

  async obtenerPorId(id: string): Promise<IConsultor | null> {
    const query = 'SELECT * FROM consultores WHERE id_consultor = $1';
    const resultado = await this.pool.query(query, [id]);
    
    if (resultado.rows.length === 0) {
      return null;
    }
    
    return this.mapearDesdeDB(resultado.rows[0]);
  }

  async obtenerTodos(): Promise<IConsultor[]> {
    const query = 'SELECT * FROM consultores ORDER BY id_consultor'; 
    const resultado = await this.pool.query(query);
    return resultado.rows.map(row => this.mapearDesdeDB(row));
  }

  async actualizar(id: string, datos: Partial<Omit<IConsultor, 'idConsultor'>>): Promise<IConsultor | null> {
    const campos: string[] = [];
    const valores: any[] = [];
    let contador = 1;

    if (datos.nombre !== undefined) {
      campos.push(`nombre = $${contador++}`);
      valores.push(datos.nombre);
    }
    if (datos.emailConsultor !== undefined) {
      campos.push(`email_consultor = $${contador++}`);
      valores.push(datos.emailConsultor);
    }
    if (datos.telefono !== undefined) {
      campos.push(`telefono = $${contador++}`);
      valores.push(datos.telefono);
    }
    if (datos.especialidad !== undefined) {
      campos.push(`especialidad = $${contador++}`);
      valores.push(datos.especialidad);
    }

    if (campos.length === 0) {
      return this.obtenerPorId(id);
    }

    valores.push(id);
    const query = `
      UPDATE consultores 
      SET ${campos.join(', ')}
      WHERE id_consultor = $${contador}
      RETURNING *
    `;

    const resultado = await this.pool.query(query, valores);
    
    if (resultado.rows.length === 0) {
      return null;
    }
    
    return this.mapearDesdeDB(resultado.rows[0]);
  }

  async eliminar(id: string): Promise<boolean> {
    const query = 'DELETE FROM consultores WHERE id_consultor = $1';
    const resultado = await this.pool.query(query, [id]);
    return resultado.rowCount !== null && resultado.rowCount > 0;
  }

  async existeEmail(email: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM consultores WHERE email_consultor = $1)';
    const resultado = await this.pool.query(query, [email]);
    return resultado.rows[0].exists;
  }
}