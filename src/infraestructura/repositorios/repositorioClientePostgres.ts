import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ejecutarConsulta } from "../../infraestructura/cliente-db";
import { v4 as uuidv4 } from "uuid";

export class ClientePostgres implements IRepositorioCliente {

    async crearCliente(datosCliente: ICliente): Promise<ICliente> {
        const cliente = await ejecutarConsulta(
            `INSERT INTO clientes (idCliente, nombreCliente, emailCliente, telefonoCliente, direccionCliente)`
            + `VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                uuidv4(),
                datosCliente.nombreCliente,
                datosCliente.emailCliente,
                datosCliente.telefonoCliente || '',
                datosCliente.direccionCliente,
            ]
        );
        return cliente.rows[0];
    }

    async obtenerCliente(): Promise<ICliente[]> {
        const resultado = await ejecutarConsulta(`SELECT * FROM clientes`);
        return resultado.rows;
    }

    async actualizarCliente(
        idCliente: string,
        datosCliente: ICliente
    ): Promise<ICliente> {
        const clienteActualizado = await ejecutarConsulta(
            `UPDATE clientes
            SET nombreCliente = $1, emailCliente = $2, telefonoCliente = $3, direccionCliente = $4
            WHERE idCliente = $5
            RETURNING *`,
            [
                datosCliente.nombreCliente,
                datosCliente.emailCliente,
                datosCliente.telefonoCliente || '',
                datosCliente.direccionCliente,
                idCliente
            ]
        );
        return clienteActualizado.rows[0];
    }

    async eliminarCliente(idCliente: string): Promise<string> {
        await ejecutarConsulta(
            `DELETE FROM clientes WHERE idCliente = $1`,
            [idCliente]);
            return `Cliente con ID ${idCliente} eliminado exitosamente.`;
    }

    async obtenerClientePorId(id: string): Promise<ICliente | null> {
        const resultado = await ejecutarConsulta(
            `SELECT * FROM clientes WHERE idCliente = $1`,
            [id]
        );
        return resultado.rows[0] || null;
    }
}
