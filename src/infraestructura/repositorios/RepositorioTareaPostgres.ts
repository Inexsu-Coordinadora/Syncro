import { FastifyInstance } from "fastify";
import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";
import { ITarea } from "../../dominio/entidades/ITarea";

export class RepositorioTareaPostgres implements IRepositorioTarea {

    constructor(private servidor: FastifyInstance) { }

    async listarTareas(): Promise<ITarea[]> {
        const cliente = await this.servidor.pg.connect();
        const resultado = await cliente.query('SELECT * FROM tareas ORDER BY fecha_limite ASC');
        cliente.release();
        return resultado.rows;
    }

    async obtenerTareaPorId(id: string): Promise<ITarea | null> {
        const cliente = await this.servidor.pg.connect();
        const resultado = await cliente.query(
            'SELECT * FROM tareas WHERE id_tarea = $1',
            [id]
        );
        cliente.release();
        return resultado.rows[0] || null;
    }

    async crearTarea(tarea: ITarea): Promise<ITarea> {
        const { codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor } = tarea;
        const cliente = await this.servidor.pg.connect();

        const resultado = await cliente.query(
            `INSERT INTO tareas (codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor]
        );
        cliente.release();
        return resultado.rows[0];
    }

    async actualizarTarea(id: string, tarea: ITarea): Promise<ITarea | null> {
        const { codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor } = tarea;
        const cliente = await this.servidor.pg.connect();

        const resultado = await cliente.query(
            `UPDATE tareas SET 
        codigo_tarea=$1, nombre_tarea=$2, estado=$3, fecha_limite=$4, 
        id_proyecto=$5, id_consultor=$6
       WHERE id_tarea = $7 RETURNING *`,
            [codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor, id]
        );

        cliente.release();
        return resultado.rows[0] || null;
    }

    async eliminarTarea(id: string): Promise<string> {
        const cliente = await this.servidor.pg.connect();
        const resultado = await cliente.query(
            'DELETE FROM tareas WHERE id_tarea = $1 RETURNING *',
            [id]
        );
        cliente.release();

        if (resultado.rowCount === 0) {
            throw new Error("Tarea no encontrada para eliminar");
        }

        return `Tarea ${id} eliminada correctamente`;
    }
}
