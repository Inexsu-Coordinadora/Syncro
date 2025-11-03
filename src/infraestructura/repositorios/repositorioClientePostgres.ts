import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ejecutarConsulta } from "../cliente-db";
import { v4 as uuidv4 } from "uuid";

export class ClientePostgres implements IRepositorioCliente {

    async crearCliente(datosCliente: ICliente): Promise<ICliente> {
        const cliente = await ejecutarConsulta(
            `INSERT INTO clientes (id_cliente, nombre_cliente, email_cliente, telefono_cliente, direccion_cliente)`
            + `VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                uuidv4(),
                datosCliente.nombreCliente,
                datosCliente.emailCliente,
                datosCliente.telefonoCliente || '',
                datosCliente.direccionCliente,
            ]
        );
        
        if (!cliente.rows[0]) {
            throw new Error('Error al crear el cliente: no se pudo insertar en la base de datos');
        }
        
        return cliente.rows[0];
    }

    async obtenerCliente(): Promise<ICliente[]> {
        const resultado = await ejecutarConsulta(`SELECT * FROM clientes`);
        return resultado.rows;
    }

    async actualizarCliente(
        idCliente: string,
        datosCliente: ICliente
    ): Promise<ICliente | null> {
        const clienteActualizado = await ejecutarConsulta(
            `UPDATE clientes
            SET nombre_cliente = $1, email_cliente = $2, telefono_cliente = $3, direccion_cliente = $4
            WHERE id_cliente = $5
            RETURNING *`,
            [
                datosCliente.nombreCliente,
                datosCliente.emailCliente,
                datosCliente.telefonoCliente || '',
                datosCliente.direccionCliente,
                idCliente
            ]
        );
        return clienteActualizado.rows[0] || null;
    }

    async eliminarCliente(idCliente: string): Promise<string> {
        await ejecutarConsulta(
            `DELETE FROM clientes WHERE id_cliente = $1`,
            [idCliente]);
            return `Cliente con ID ${idCliente} eliminado exitosamente.`;
    }

    async obtenerClientePorId(id: string): Promise<ICliente | null> {
        const resultado = await ejecutarConsulta(
            `SELECT * FROM clientes WHERE id_cliente = $1`,
            [id]
        );
        return resultado.rows[0] || null;
    }
}
