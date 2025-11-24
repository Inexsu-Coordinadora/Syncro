import { FastifyInstance } from "fastify";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ICliente } from "../../dominio/entidades/ICliente";

export class RepositorioClientePostgres implements IRepositorioCliente {
    constructor(private servidor: FastifyInstance) { }

    async listarClientes(): Promise<ICliente[]> {
        const con = await this.servidor.pg.connect();
        const res = await con.query("SELECT * FROM clientes ORDER BY fecha_creacion DESC");
        con.release();
        return res.rows;
    }

    async obtenerClientePorId(id: string): Promise<ICliente | null> {
        const con = await this.servidor.pg.connect();
        const res = await con.query("SELECT * FROM clientes WHERE id_cliente = $1", [id]);
        con.release();
        return res.rows[0] || null;
    }

    async crearCliente(cliente: ICliente): Promise<ICliente> {
        const { nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente } = cliente;

        const con = await this.servidor.pg.connect();
        const res = await con.query(
            `INSERT INTO clientes (nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente]
        );
        con.release();
        return res.rows[0];
    }

    async actualizarCliente(id: string, cliente: ICliente): Promise<ICliente | null> {
        const { nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente } = cliente;

        const con = await this.servidor.pg.connect();
        const res = await con.query(
            `UPDATE clientes
       SET nombre_cliente=$1, email_cliente=$2, telefono_cliente=$3, direccion_cliente=$4, empresa_cliente=$5
       WHERE id_cliente=$6 RETURNING *`,
            [nombre_cliente, email_cliente, telefono_cliente, direccion_cliente, empresa_cliente, id]
        );
        con.release();

        return res.rows[0] || null;
    }

    async eliminarCliente(id: string): Promise<string> {
        const con = await this.servidor.pg.connect();
        const res = await con.query("DELETE FROM clientes WHERE id_cliente = $1 RETURNING *", [id]);
        con.release();

        if (res.rows.length === 0) throw new Error("Cliente no encontrado");

        return `Cliente ${id} eliminado`;
    }
}
