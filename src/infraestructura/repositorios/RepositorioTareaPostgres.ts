import { FastifyInstance } from "fastify";
import { IRepositorioTarea } from "../../dominio/repositorio/IRepositorioTarea";
import { ITarea } from "../../dominio/entidades/ITarea";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";
import { PersistenceError } from "../../aplicacion/errors/PersistenceError";

export class RepositorioTareaPostgres implements IRepositorioTarea {
    constructor(private servidor: FastifyInstance) { }

    async listarTareas(): Promise<ITarea[]> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                "SELECT * FROM tareas ORDER BY fecha_limite ASC"
            );
            return resultado.rows;
        } catch (e: any) {
            throw new PersistenceError("Error al listar tareas");
        } finally {
            cliente.release();
        }
    }

    async obtenerTareaPorId(id: string): Promise<ITarea | null> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                "SELECT * FROM tareas WHERE id_tarea = $1",
                [id]
            );
            return resultado.rows[0] || null;
        } catch (e: any) {
            throw new PersistenceError("Error al consultar tarea por ID");
        } finally {
            cliente.release();
        }
    }

    async crearTarea(tarea: ITarea): Promise<ITarea> {
        const {
            codigo_tarea,
            nombre_tarea,
            estado,
            fecha_limite,
            id_proyecto,
            id_consultor,
        } = tarea;

        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `INSERT INTO tareas (codigo_tarea, nombre_tarea, estado, fecha_limite, id_proyecto, id_consultor)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [
                    codigo_tarea,
                    nombre_tarea,
                    estado,
                    fecha_limite,
                    id_proyecto,
                    id_consultor,
                ]
            );
            return resultado.rows[0];
        } catch (e: any) {
            throw new PersistenceError("Error al crear tarea");
        } finally {
            cliente.release();
        }
    }

    async actualizarTarea(id: string, tarea: ITarea): Promise<ITarea | null> {
        const {
            codigo_tarea,
            nombre_tarea,
            estado,
            fecha_limite,
            id_proyecto,
            id_consultor,
        } = tarea;

        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                `UPDATE tareas SET 
           codigo_tarea=$1, nombre_tarea=$2, estado=$3, fecha_limite=$4, 
           id_proyecto=$5, id_consultor=$6
         WHERE id_tarea = $7 RETURNING *`,
                [
                    codigo_tarea,
                    nombre_tarea,
                    estado,
                    fecha_limite,
                    id_proyecto,
                    id_consultor,
                    id,
                ]
            );
            return resultado.rows[0] || null;
        } catch (e: any) {
            throw new PersistenceError("Error al actualizar tarea");
        } finally {
            cliente.release();
        }
    }

    async eliminarTarea(id: string): Promise<string> {
        const cliente = await this.servidor.pg.connect();
        try {
            const resultado = await cliente.query(
                "DELETE FROM tareas WHERE id_tarea = $1 RETURNING *",
                [id]
            );
            if (resultado.rowCount === 0) {
                throw new NotFoundError(`Tarea con ID ${id} no encontrada`);
            }
            return `Tarea ${id} eliminada correctamente`;
        } catch (e: any) {
            if (e instanceof NotFoundError) throw e;
            throw new PersistenceError("Error al eliminar tarea");
        } finally {
            cliente.release();
        }
    }
}
