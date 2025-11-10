import { FastifyInstance } from "fastify";
import { ITarea } from "../../dominio/entidades/ITarea";
import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";

export class RepositorioTareaPostgres implements IRepositorioTarea {
    constructor(private servidor: FastifyInstance) { }

    async crear(tarea: ITarea): Promise<ITarea> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `INSERT INTO tareas (codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    tarea.codigo_tarea,
                    tarea.nombre_tarea,
                    tarea.estado,
                    tarea.fecha_limite,
                    tarea.id_proyecto,
                    tarea.id_consultor ?? null,
                ]
            );
            return resultado.rows[0];
        } finally {
            cliente.release();
        }
    }

    async listar(): Promise<ITarea[]> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query('SELECT * FROM tareas ORDER BY fecha_limite ASC');
            return resultado.rows;
        } finally {
            cliente.release();
        }
    }

    async obtenerPorId(id: number): Promise<ITarea | null> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                'SELECT * FROM tareas WHERE id_tarea = $1',
                [id]
            );
            return resultado.rows.length > 0 ? resultado.rows[0] : null;
        } finally {
            cliente.release();
        }
    }

    async actualizar(id: number, tarea: ITarea): Promise<ITarea | null> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `UPDATE tareas 
                SET codigo_tarea = $1, 
                    nombre_tarea = $2, 
                    estado = $3, 
                    fecha_limite = $4, 
                    id_proyecto = $5, 
                    id_consultor = $6
                WHERE id_tarea = $7 
                RETURNING *`,
                [
                    tarea.codigo_tarea,
                    tarea.nombre_tarea,
                    tarea.estado,
                    tarea.fecha_limite,
                    tarea.id_proyecto,
                    tarea.id_consultor ?? null,
                    id
                ]
            );
            return resultado.rows.length > 0 ? resultado.rows[0] : null;
        } finally {
            cliente.release();
        }
    }

    async eliminar(id: number): Promise<boolean> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                'DELETE FROM tareas WHERE id_tarea = $1',
                [id]
            );
            return (resultado.rowCount ?? 0) > 0;
        } finally {
            cliente.release();
        }
    }

    async listarPorProyecto(idProyecto: string): Promise<ITarea[]> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `SELECT * FROM tareas WHERE id_proyecto = $1 ORDER BY fecha_limite ASC`,
                [idProyecto]
            );
            return resultado.rows;
        } finally {
            cliente.release();
        }
    }

    async actualizarEstado(idTarea: string, nuevoEstado: string): Promise<ITarea | null> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `UPDATE tareas 
                SET estado = $1 
                WHERE id_tarea = $2 AND estado <> 'completada'
                RETURNING *`,
                [nuevoEstado, idTarea]
            );
            return resultado.rows.length > 0 ? resultado.rows[0] : null;
        } finally {
            cliente.release();
        }
    }
}
