import { FastifyInstance } from "fastify";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ICliente } from "../../dominio/entidades/ICliente";
import { NotFoundError } from "../../aplicacion/errors/NotFoundError";
import { PersistenceError } from "../../aplicacion/errors/PersistenceError";
import { ProyectoResumen } from "../../interfaces/rutas/proyectoResumen"; 

export class repositorioClientePostgres implements IRepositorioCliente {
    constructor(private servidor: FastifyInstance) {}

    async listarClientes(): Promise<ICliente[]> {
        const con = await this.servidor.pg.connect();
        try {
            const res = await con.query("SELECT * FROM clientes ORDER BY nombre_cliente ASC");
            return res.rows;
        } catch (e: any) {
            console.error("Error en listarClientes:", { message: e.message, code: e.code, detail: e.detail });
            throw new PersistenceError("Error al listar clientes");
        } finally {
            con.release();
        }
    }

    async obtenerClientePorId(id: string): Promise<ICliente | null> {
        const con = await this.servidor.pg.connect();
        try {
            const res = await con.query("SELECT * FROM clientes WHERE id_cliente = $1", [id]);
            return res.rows[0] || null;
        } catch (e: any) {
            console.error("Error en obtenerClientePorId:", { message: e.message, code: e.code, detail: e.detail });
            throw new PersistenceError("Error al consultar cliente por ID");
        } finally {
            con.release();
        }
    }

    async crearCliente(cliente: ICliente): Promise<ICliente> {
        const { nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente } = cliente;
        const con = await this.servidor.pg.connect();
        try {
            const res = await con.query(
                `INSERT INTO clientes (nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente)
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente]
            );
            return res.rows[0];
        } catch (e: any) {
            console.error("Error en crearCliente:", { message: e.message, code: e.code, detail: e.detail });
            if (e.code === "23505") {
                // 23505 = unique_violation
                throw new PersistenceError("El email ya está registrado");
            }
            throw new PersistenceError("Error al crear cliente");
        } finally {
            con.release();
        }
    }

    async actualizarCliente(id: string, cliente: ICliente): Promise<ICliente | null> {
        const { nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente } = cliente;
        const con = await this.servidor.pg.connect();
        try {
            const res = await con.query(
                `UPDATE clientes
                 SET nombre_cliente=$1, email_cliente=$2, telefono_cliente=$3, direccion_cliente=$4, empresa_cliente=$5
                 WHERE id_cliente=$6 RETURNING *`,
                [nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente, id]
            );
            return res.rows[0] || null;
        } catch (e: any) {
            console.error("Error en actualizarCliente:", { message: e.message, code: e.code, detail: e.detail });
            throw new PersistenceError("Error al actualizar cliente");
        } finally {
            con.release();
        }
    }

    async eliminarCliente(id: string): Promise<string> {
        const con = await this.servidor.pg.connect();
        try {
            const res = await con.query("DELETE FROM clientes WHERE id_cliente = $1 RETURNING *", [id]);
            if (res.rows.length === 0) {
                throw new NotFoundError(`Cliente con ID ${id} no encontrado`);
            }
            return `Cliente ${id} eliminado`;
        } catch (e: any) {
            console.error("Error en eliminarCliente:", { message: e.message, code: e.code, detail: e.detail });
            if (e instanceof NotFoundError) throw e;
            throw new PersistenceError("Error al eliminar cliente");
        } finally {
            con.release();
        }
    }

    // 🏆 MÉTODO FALTANTE IMPLEMENTADO
    async consultarProyectosPorCliente(clienteId: string): Promise<ProyectoResumen[]> {
        const con = await this.servidor.pg.connect();
        try {
            // Lógica placeholder: debes completarla con tu consulta real.
            const res = await con.query("SELECT id_proyecto, nombre_proyecto, estado_proyecto FROM proyectos WHERE id_cliente = $1", [clienteId]);
            return res.rows;
        } catch (e: any) {
            console.error("Error en consultarProyectosPorCliente:", { message: e.message, code: e.code, detail: e.detail });
            throw new PersistenceError("Error al consultar proyectos por cliente");
        } finally {
            con.release();
        }
    }
}
