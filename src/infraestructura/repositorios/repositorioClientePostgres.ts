import { ICliente } from "../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../dominio/repositorio/IRepositorioCliente";
import { ejecutarConsulta } from "../../infraestructura/cliente-db";
import { ProyectoResumen } from "../../interfaces/rutas/proyectoResumen"; 
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

    async consultarProyectosPorCliente(clienteId: string): Promise<ProyectoResumen[]> {
        const resultado = await ejecutarConsulta(
            `SELECT p.codigo AS codigo, p.nombre AS nombre, p.estado AS estado, p.fecha_inicio AS "fechaInicio", p.fecha_fin AS "fechaFin",
            json_agg(json_build_object('nombre', c.nombre_consultor, 'rol', pc.rol)) AS "consultoresAsignados"
            FROM proyectos p
            LEFT JOIN proyecto_consultores pc ON p.codigo = pc.codigo_proyecto
            LEFT JOIN consultores c ON pc.id_consultor = c.id_consultor
            WHERE p.id_cliente = $1
            GROUP BY p.codigo`,
            [clienteId]
        );
        return resultado.rows;
    }
}
