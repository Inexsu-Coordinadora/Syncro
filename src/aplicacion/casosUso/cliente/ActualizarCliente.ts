import { ICliente } from "../../../dominio/entidades/ICliente";
import { IRepositorioCliente } from "../../../dominio/repositorio/IRepositorioCliente";
import { NotFoundError } from "../../errors/NotFoundError";

export class ActualizarCliente {
    private repositorioCliente: IRepositorioCliente;

    constructor(repositorioCliente: IRepositorioCliente) {
        this.repositorioCliente = repositorioCliente;
    }

    async ejecutar(idCliente: string, datosCliente: ICliente): Promise<ICliente> {
        if (!idCliente) {
            throw new Error("El ID del cliente es obligatorio para la actualización.");
        }

        if (!datosCliente.nombre_cliente || !datosCliente.direccion_cliente || !datosCliente.email_cliente) {
            throw new Error("Los campos nombreCliente, direccionCliente y emailCliente son obligatorios.");
        }

        const actualizado = await this.repositorioCliente.actualizarCliente(idCliente, datosCliente);

        if (!actualizado) {
            throw new NotFoundError(`Cliente con ID ${idCliente} no encontrado.`);
        }

        return actualizado;
    }
}