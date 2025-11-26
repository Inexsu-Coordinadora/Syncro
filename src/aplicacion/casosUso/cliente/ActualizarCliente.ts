import { ICliente } from "../../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../../dominio/repositorio/IRepositorioCliente";
import { NotFoundError } from "../../errors/NotFoundError";
import { ValidationError } from "../../errors/ValidationError";

export class ActualizarCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    async ejecutar(idCliente: string, datosCliente: ICliente): Promise<ICliente> {
        if (!idCliente) {
            throw new ValidationError("El ID del cliente es obligatorio para la actualización.");
        }

        if (!datosCliente.nombre_cliente || !datosCliente.direccion_cliente || !datosCliente.email_cliente) {
            throw new ValidationError("Los campos nombre_cliente, direccion_cliente y email_cliente son obligatorios.");
        }

        const actualizado = await this.repositorioCliente.actualizarCliente(idCliente, datosCliente);

        if (!actualizado) {
            throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado.`);
        }

        return actualizado;
    }
}
